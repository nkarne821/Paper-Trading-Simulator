package com.papertrading.service;

import com.papertrading.dto.DashboardDto;
import com.papertrading.dto.HoldingDto;
import com.papertrading.dto.StockQuoteDto;
import com.papertrading.dto.TransactionDto;
import com.papertrading.model.Holding;
import com.papertrading.model.Portfolio;
import com.papertrading.repository.HoldingRepository;
import com.papertrading.repository.PortfolioRepository;
import com.papertrading.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final PortfolioRepository portfolioRepository;
    private final HoldingRepository holdingRepository;
    private final TransactionRepository transactionRepository;
    private final StockService stockService;
    private final NotificationService notificationService;

    public DashboardService(PortfolioRepository portfolioRepository, HoldingRepository holdingRepository,
                            TransactionRepository transactionRepository, StockService stockService,
                            NotificationService notificationService) {
        this.portfolioRepository = portfolioRepository;
        this.holdingRepository = holdingRepository;
        this.transactionRepository = transactionRepository;
        this.stockService = stockService;
        this.notificationService = notificationService;
    }

    public DashboardDto getDashboard(Long userId) {
        Portfolio portfolio = portfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new com.papertrading.exception.ResourceNotFoundException("Portfolio", "userId", userId));

        List<Holding> holdings = holdingRepository.findByPortfolioId(portfolio.getId());

        // Calculate actual portfolio value from holdings at current market prices
        BigDecimal portfolioValue = BigDecimal.ZERO;
        BigDecimal dailyChange = BigDecimal.ZERO;

        for (Holding holding : holdings) {
            StockQuoteDto quote = stockService.getStockQuote(holding.getSymbol());
            if (quote != null) {
                BigDecimal currentValue = quote.getCurrentPrice().multiply(new BigDecimal(holding.getQuantity()));
                portfolioValue = portfolioValue.add(currentValue);

                BigDecimal prevValue = quote.getPreviousClose().multiply(new BigDecimal(holding.getQuantity()));
                dailyChange = dailyChange.add(currentValue.subtract(prevValue));
            }
        }

        // Total value = cash + current portfolio value (not the stored total_value which may be stale)
        BigDecimal totalValue = portfolio.getCashBalance().add(portfolioValue);

        // Total P&L = total value - initial 10,00,000
        BigDecimal totalProfitLoss = totalValue.subtract(new BigDecimal("1000000.00"));
        BigDecimal totalProfitLossPercent = calculatePercent(totalProfitLoss, new BigDecimal("1000000.00"));

        // Daily P&L percent
        BigDecimal dailyProfitLossPercent = calculatePercent(dailyChange, portfolioValue);

        List<HoldingDto> topHoldings = holdings.stream()
                .limit(5)
                .map(h -> {
                    HoldingDto dto = new HoldingDto();
                    dto.setId(h.getId());
                    dto.setSymbol(h.getSymbol());
                    dto.setCompanyName(h.getCompanyName());
                    dto.setQuantity(h.getQuantity());
                    dto.setAvgBuyPrice(h.getAvgBuyPrice());

                    StockQuoteDto quote = stockService.getStockQuote(h.getSymbol());
                    if (quote != null) {
                        dto.setCurrentPrice(quote.getCurrentPrice());
                        BigDecimal currentValue = quote.getCurrentPrice().multiply(new BigDecimal(h.getQuantity()));
                        dto.setCurrentValue(currentValue);
                        dto.setTotalInvested(h.getAvgBuyPrice().multiply(new BigDecimal(h.getQuantity())));
                        dto.setProfitLoss(currentValue.subtract(dto.getTotalInvested()));
                        dto.setProfitLossPercent(calculatePercent(dto.getProfitLoss(), dto.getTotalInvested()));
                        dto.setDayChange(quote.getChange());
                        dto.setDayChangePercent(quote.getChangePercent());
                    }
                    return dto;
                })
                .collect(Collectors.toList());

        List<TransactionDto> recentTransactions = transactionRepository.findRecentByUserId(userId, 5).stream()
                .map(t -> {
                    TransactionDto dto = new TransactionDto();
                    dto.setId(t.getId());
                    dto.setSymbol(t.getSymbol());
                    dto.setCompanyName(t.getCompanyName());
                    dto.setTransactionType(t.getTransactionType());
                    dto.setQuantity(t.getQuantity());
                    dto.setPrice(t.getPrice());
                    dto.setTotalAmount(t.getTotalAmount());
                    dto.setProfitLoss(t.getProfitLoss());
                    dto.setStatus(t.getStatus());
                    dto.setCreatedAt(t.getCreatedAt());
                    return dto;
                })
                .collect(Collectors.toList());

        DashboardDto dto = new DashboardDto();
        dto.setCashBalance(portfolio.getCashBalance());
        dto.setPortfolioValue(portfolioValue);  // Now correctly calculated from live prices
        dto.setTotalValue(totalValue);          // Cash + live portfolio value
        dto.setTotalProfitLoss(totalProfitLoss);
        dto.setTotalProfitLossPercent(totalProfitLossPercent);
        dto.setDailyProfitLoss(dailyChange);
        dto.setDailyProfitLossPercent(dailyProfitLossPercent);
        dto.setTotalHoldings(holdings.size());
        dto.setTotalTransactions(transactionRepository.countByUserId(userId));
        dto.setUnreadNotifications(notificationService.getUnreadCount(userId));
        dto.setTopHoldings(topHoldings);
        dto.setRecentTransactions(recentTransactions);
        dto.setMarketOverview(stockService.getMarketOverview());
        return dto;
    }

    private BigDecimal calculatePercent(BigDecimal value, BigDecimal base) {
        if (base == null || base.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return value.divide(base, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"));
    }
}