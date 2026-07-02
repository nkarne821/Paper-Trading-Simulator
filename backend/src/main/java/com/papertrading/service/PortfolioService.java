package com.papertrading.service;

import com.papertrading.dto.HoldingDto;
import com.papertrading.dto.PortfolioDto;
import com.papertrading.dto.StockQuoteDto;
import com.papertrading.exception.ResourceNotFoundException;
import com.papertrading.model.Holding;
import com.papertrading.model.Portfolio;
import com.papertrading.repository.HoldingRepository;
import com.papertrading.repository.PortfolioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final HoldingRepository holdingRepository;
    private final StockService stockService;

    public PortfolioService(PortfolioRepository portfolioRepository, HoldingRepository holdingRepository, StockService stockService) {
        this.portfolioRepository = portfolioRepository;
        this.holdingRepository = holdingRepository;
        this.stockService = stockService;
    }

    @Transactional
    public void createPortfolioForUser(Long userId) {
        Portfolio portfolio = new Portfolio();
        portfolio.setUserId(userId);
        portfolio.setCashBalance(new BigDecimal("1000000.00"));
        portfolio.setTotalInvested(BigDecimal.ZERO);
        portfolio.setTotalValue(new BigDecimal("1000000.00"));
        portfolio.setTotalProfitLoss(BigDecimal.ZERO);
        portfolio.setDailyProfitLoss(BigDecimal.ZERO);
        portfolioRepository.save(portfolio);
    }

    public PortfolioDto getPortfolio(Long userId) {
        Portfolio portfolio = portfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio", "userId", userId));

        List<Holding> holdings = holdingRepository.findByPortfolioId(portfolio.getId());
        List<HoldingDto> holdingDtos = holdings.stream()
                .map(this::mapToHoldingDto)
                .collect(Collectors.toList());

        PortfolioDto dto = new PortfolioDto();
        dto.setId(portfolio.getId());
        dto.setUserId(portfolio.getUserId());
        dto.setCashBalance(portfolio.getCashBalance());
        dto.setTotalInvested(portfolio.getTotalInvested());
        dto.setTotalValue(portfolio.getTotalValue());
        dto.setTotalProfitLoss(portfolio.getTotalProfitLoss());
        dto.setTotalProfitLossPercent(calculatePercent(portfolio.getTotalProfitLoss(), portfolio.getTotalInvested()));
        dto.setDailyProfitLoss(portfolio.getDailyProfitLoss());
        dto.setTotalHoldings(holdings.size());
        dto.setHoldings(holdingDtos);
        return dto;
    }

    @Transactional
    public void updatePortfolioAfterBuy(Long portfolioId, BigDecimal amount) {
        portfolioRepository.updateAfterBuy(portfolioId, amount);
    }

    @Transactional
    public void updatePortfolioAfterSell(Long portfolioId, BigDecimal amount) {
        portfolioRepository.updateAfterSell(portfolioId, amount);
    }

    @Transactional
    public void recalculatePortfolio(Long portfolioId) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio", "id", portfolioId));

        List<Holding> holdings = holdingRepository.findByPortfolioId(portfolioId);
        BigDecimal totalInvested = BigDecimal.ZERO;
        BigDecimal totalCurrentValue = BigDecimal.ZERO;
        BigDecimal totalProfitLoss = BigDecimal.ZERO;

        for (Holding holding : holdings) {
            StockQuoteDto quote = stockService.getStockQuote(holding.getSymbol());
            if (quote != null) {
                BigDecimal currentPrice = quote.getCurrentPrice();
                BigDecimal currentValue = currentPrice.multiply(new BigDecimal(holding.getQuantity()));
                BigDecimal invested = holding.getAvgBuyPrice().multiply(new BigDecimal(holding.getQuantity()));
                BigDecimal pl = currentValue.subtract(invested);
                BigDecimal plPercent = calculatePercent(pl, invested);

                holding.setCurrentPrice(currentPrice);
                holding.setCurrentValue(currentValue);
                holding.setProfitLoss(pl);
                holding.setProfitLossPercent(plPercent);
                holdingRepository.save(holding);

                totalInvested = totalInvested.add(invested);
                totalCurrentValue = totalCurrentValue.add(currentValue);
                totalProfitLoss = totalProfitLoss.add(pl);
            }
        }

        BigDecimal totalValue = portfolio.getCashBalance().add(totalCurrentValue);
        portfolio.setTotalInvested(totalInvested);
        portfolio.setTotalValue(totalValue);
        portfolio.setTotalProfitLoss(totalProfitLoss);
        portfolioRepository.save(portfolio);
    }

    private HoldingDto mapToHoldingDto(Holding holding) {
        HoldingDto dto = new HoldingDto();
        dto.setId(holding.getId());
        dto.setSymbol(holding.getSymbol());
        dto.setCompanyName(holding.getCompanyName());
        dto.setQuantity(holding.getQuantity());
        dto.setAvgBuyPrice(holding.getAvgBuyPrice());
        dto.setCurrentPrice(holding.getCurrentPrice());
        dto.setTotalInvested(holding.getTotalInvested());
        dto.setCurrentValue(holding.getCurrentValue());
        dto.setProfitLoss(holding.getProfitLoss());
        dto.setProfitLossPercent(holding.getProfitLossPercent());
        return dto;
    }

    private BigDecimal calculatePercent(BigDecimal value, BigDecimal base) {
        if (base == null || base.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return value.divide(base, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"));
    }
}