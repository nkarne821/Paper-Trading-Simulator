package com.papertrading.service;

import com.papertrading.dto.TradeRequest;
import com.papertrading.dto.TransactionDto;
import com.papertrading.exception.BadRequestException;
import com.papertrading.exception.InsufficientFundsException;
import com.papertrading.exception.ResourceNotFoundException;
import com.papertrading.model.Holding;
import com.papertrading.model.Notification;
import com.papertrading.model.Portfolio;
import com.papertrading.model.Transaction;
import com.papertrading.repository.HoldingRepository;
import com.papertrading.repository.PortfolioRepository;
import com.papertrading.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TradingService {

    private final PortfolioRepository portfolioRepository;
    private final HoldingRepository holdingRepository;
    private final TransactionRepository transactionRepository;
    private final NotificationService notificationService;
    private final StockService stockService;

    public TradingService(PortfolioRepository portfolioRepository, HoldingRepository holdingRepository,
                          TransactionRepository transactionRepository, NotificationService notificationService,
                          StockService stockService) {
        this.portfolioRepository = portfolioRepository;
        this.holdingRepository = holdingRepository;
        this.transactionRepository = transactionRepository;
        this.notificationService = notificationService;
        this.stockService = stockService;
    }

    @Transactional
    public TransactionDto buyStock(Long userId, TradeRequest request) {
        Portfolio portfolio = portfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio", "userId", userId));

        BigDecimal totalAmount = request.getPrice().multiply(new BigDecimal(request.getQuantity()));

        if (portfolio.getCashBalance().compareTo(totalAmount) < 0) {
            throw new InsufficientFundsException("Insufficient funds. Available: ₹" + portfolio.getCashBalance() + ", Required: ₹" + totalAmount);
        }

        Holding existingHolding = holdingRepository.findByPortfolioIdAndSymbol(portfolio.getId(), request.getSymbol()).orElse(null);

        if (existingHolding != null) {
            BigDecimal oldTotalInvested = existingHolding.getAvgBuyPrice().multiply(new BigDecimal(existingHolding.getQuantity()));
            BigDecimal newTotalInvested = oldTotalInvested.add(totalAmount);
            int newQuantity = existingHolding.getQuantity() + request.getQuantity();
            BigDecimal newAvgPrice = newTotalInvested.divide(new BigDecimal(newQuantity), 4, RoundingMode.HALF_UP);

            existingHolding.setQuantity(newQuantity);
            existingHolding.setAvgBuyPrice(newAvgPrice);
            existingHolding.setTotalInvested(newTotalInvested);
            existingHolding.setCurrentPrice(request.getPrice());
            BigDecimal currentValue = request.getPrice().multiply(new BigDecimal(newQuantity));
            existingHolding.setCurrentValue(currentValue);
            existingHolding.setProfitLoss(currentValue.subtract(newTotalInvested));
            existingHolding.setProfitLossPercent(calculatePercent(existingHolding.getProfitLoss(), newTotalInvested));
            holdingRepository.save(existingHolding);
        } else {
            Holding newHolding = new Holding();
            newHolding.setPortfolioId(portfolio.getId());
            newHolding.setSymbol(request.getSymbol());
            newHolding.setCompanyName(request.getCompanyName());
            newHolding.setQuantity(request.getQuantity());
            newHolding.setAvgBuyPrice(request.getPrice());
            newHolding.setCurrentPrice(request.getPrice());
            newHolding.setTotalInvested(totalAmount);
            newHolding.setCurrentValue(totalAmount);
            newHolding.setProfitLoss(BigDecimal.ZERO);
            newHolding.setProfitLossPercent(BigDecimal.ZERO);
            holdingRepository.save(newHolding);
        }

        portfolio.setCashBalance(portfolio.getCashBalance().subtract(totalAmount));
        portfolio.setTotalInvested(portfolio.getTotalInvested().add(totalAmount));
        portfolioRepository.save(portfolio);

        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setPortfolioId(portfolio.getId());
        transaction.setSymbol(request.getSymbol());
        transaction.setCompanyName(request.getCompanyName());
        transaction.setTransactionType("BUY");
        transaction.setQuantity(request.getQuantity());
        transaction.setPrice(request.getPrice());
        transaction.setTotalAmount(totalAmount);
        transaction.setProfitLoss(BigDecimal.ZERO);
        transaction.setProfitLossPercent(BigDecimal.ZERO);
        transaction.setStatus("COMPLETED");
        transaction.setCreatedAt(LocalDateTime.now()); // SET REAL DATE
        Transaction savedTransaction = transactionRepository.save(transaction);

        notificationService.createNotification(userId, "Buy Order Executed",
                "Successfully purchased " + request.getQuantity() + " shares of " + request.getSymbol() + " at ₹" + request.getPrice(), "BUY");

        return mapToTransactionDto(savedTransaction);
    }

    @Transactional
    public TransactionDto sellStock(Long userId, TradeRequest request) {
        Portfolio portfolio = portfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio", "userId", userId));

        Holding holding = holdingRepository.findByPortfolioIdAndSymbol(portfolio.getId(), request.getSymbol())
                .orElseThrow(() -> new BadRequestException("You do not own any shares of " + request.getSymbol()));

        if (holding.getQuantity() < request.getQuantity()) {
            throw new BadRequestException("Insufficient shares. You own " + holding.getQuantity() + " shares of " + request.getSymbol());
        }

        BigDecimal totalAmount = request.getPrice().multiply(new BigDecimal(request.getQuantity()));
        BigDecimal costBasis = holding.getAvgBuyPrice().multiply(new BigDecimal(request.getQuantity()));
        BigDecimal profitLoss = totalAmount.subtract(costBasis);
        BigDecimal profitLossPercent = calculatePercent(profitLoss, costBasis);

        int remainingQuantity = holding.getQuantity() - request.getQuantity();
        if (remainingQuantity > 0) {
            BigDecimal remainingInvested = holding.getAvgBuyPrice().multiply(new BigDecimal(remainingQuantity));
            holding.setQuantity(remainingQuantity);
            holding.setTotalInvested(remainingInvested);
            holding.setCurrentPrice(request.getPrice());
            BigDecimal currentValue = request.getPrice().multiply(new BigDecimal(remainingQuantity));
            holding.setCurrentValue(currentValue);
            holding.setProfitLoss(currentValue.subtract(remainingInvested));
            holding.setProfitLossPercent(calculatePercent(holding.getProfitLoss(), remainingInvested));
            holdingRepository.save(holding);
        } else {
            holdingRepository.delete(holding);
        }

        portfolio.setCashBalance(portfolio.getCashBalance().add(totalAmount));
        portfolio.setTotalInvested(portfolio.getTotalInvested().subtract(costBasis));
        portfolioRepository.save(portfolio);

        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setPortfolioId(portfolio.getId());
        transaction.setSymbol(request.getSymbol());
        transaction.setCompanyName(request.getCompanyName());
        transaction.setTransactionType("SELL");
        transaction.setQuantity(request.getQuantity());
        transaction.setPrice(request.getPrice());
        transaction.setTotalAmount(totalAmount);
        transaction.setProfitLoss(profitLoss);
        transaction.setProfitLossPercent(profitLossPercent);
        transaction.setStatus("COMPLETED");
        transaction.setCreatedAt(LocalDateTime.now()); // SET REAL DATE
        Transaction savedTransaction = transactionRepository.save(transaction);

        String plMessage = profitLoss.compareTo(BigDecimal.ZERO) >= 0 ? "Profit" : "Loss";
        notificationService.createNotification(userId, "Sell Order Executed",
                "Successfully sold " + request.getQuantity() + " shares of " + request.getSymbol() + " at ₹" + request.getPrice() +
                        ". " + plMessage + ": ₹" + profitLoss.abs(), "SELL");

        return mapToTransactionDto(savedTransaction);
    }

    public List<TransactionDto> getUserTransactions(Long userId) {
        return transactionRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToTransactionDto)
                .collect(Collectors.toList());
    }

    public List<TransactionDto> getRecentTransactions(Long userId, int limit) {
        return transactionRepository.findRecentByUserId(userId, limit).stream()
                .map(this::mapToTransactionDto)
                .collect(Collectors.toList());
    }

    private TransactionDto mapToTransactionDto(Transaction transaction) {
        TransactionDto dto = new TransactionDto();
        dto.setId(transaction.getId());
        dto.setSymbol(transaction.getSymbol());
        dto.setCompanyName(transaction.getCompanyName());
        dto.setTransactionType(transaction.getTransactionType());
        dto.setQuantity(transaction.getQuantity());
        dto.setPrice(transaction.getPrice());
        dto.setTotalAmount(transaction.getTotalAmount());
        dto.setProfitLoss(transaction.getProfitLoss());
        dto.setProfitLossPercent(transaction.getProfitLossPercent());
        dto.setStatus(transaction.getStatus());
        dto.setCreatedAt(transaction.getCreatedAt());
        return dto;
    }

    private BigDecimal calculatePercent(BigDecimal value, BigDecimal base) {
        if (base == null || base.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return value.divide(base, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"));
    }
}