package com.papertrading.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardDto {
    private BigDecimal cashBalance;
    private BigDecimal portfolioValue;
    private BigDecimal totalValue;
    private BigDecimal totalProfitLoss;
    private BigDecimal totalProfitLossPercent;
    private BigDecimal dailyProfitLoss;
    private BigDecimal dailyProfitLossPercent;
    private Integer totalHoldings;
    private Integer totalTransactions;
    private Integer unreadNotifications;
    private List<HoldingDto> topHoldings;
    private List<TransactionDto> recentTransactions;
    private List<StockQuoteDto> marketOverview;

    public BigDecimal getCashBalance() { return cashBalance; }
    public void setCashBalance(BigDecimal cashBalance) { this.cashBalance = cashBalance; }
    public BigDecimal getPortfolioValue() { return portfolioValue; }
    public void setPortfolioValue(BigDecimal portfolioValue) { this.portfolioValue = portfolioValue; }
    public BigDecimal getTotalValue() { return totalValue; }
    public void setTotalValue(BigDecimal totalValue) { this.totalValue = totalValue; }
    public BigDecimal getTotalProfitLoss() { return totalProfitLoss; }
    public void setTotalProfitLoss(BigDecimal totalProfitLoss) { this.totalProfitLoss = totalProfitLoss; }
    public BigDecimal getTotalProfitLossPercent() { return totalProfitLossPercent; }
    public void setTotalProfitLossPercent(BigDecimal totalProfitLossPercent) { this.totalProfitLossPercent = totalProfitLossPercent; }
    public BigDecimal getDailyProfitLoss() { return dailyProfitLoss; }
    public void setDailyProfitLoss(BigDecimal dailyProfitLoss) { this.dailyProfitLoss = dailyProfitLoss; }
    public BigDecimal getDailyProfitLossPercent() { return dailyProfitLossPercent; }
    public void setDailyProfitLossPercent(BigDecimal dailyProfitLossPercent) { this.dailyProfitLossPercent = dailyProfitLossPercent; }
    public Integer getTotalHoldings() { return totalHoldings; }
    public void setTotalHoldings(Integer totalHoldings) { this.totalHoldings = totalHoldings; }
    public Integer getTotalTransactions() { return totalTransactions; }
    public void setTotalTransactions(Integer totalTransactions) { this.totalTransactions = totalTransactions; }
    public Integer getUnreadNotifications() { return unreadNotifications; }
    public void setUnreadNotifications(Integer unreadNotifications) { this.unreadNotifications = unreadNotifications; }
    public List<HoldingDto> getTopHoldings() { return topHoldings; }
    public void setTopHoldings(List<HoldingDto> topHoldings) { this.topHoldings = topHoldings; }
    public List<TransactionDto> getRecentTransactions() { return recentTransactions; }
    public void setRecentTransactions(List<TransactionDto> recentTransactions) { this.recentTransactions = recentTransactions; }
    public List<StockQuoteDto> getMarketOverview() { return marketOverview; }
    public void setMarketOverview(List<StockQuoteDto> marketOverview) { this.marketOverview = marketOverview; }
}