package com.papertrading.dto;

import java.math.BigDecimal;
import java.util.List;

public class PortfolioDto {
    private Long id;
    private Long userId;
    private BigDecimal cashBalance;
    private BigDecimal totalInvested;
    private BigDecimal totalValue;
    private BigDecimal totalProfitLoss;
    private BigDecimal totalProfitLossPercent;
    private BigDecimal dailyProfitLoss;
    private Integer totalHoldings;
    private List<HoldingDto> holdings;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public BigDecimal getCashBalance() { return cashBalance; }
    public void setCashBalance(BigDecimal cashBalance) { this.cashBalance = cashBalance; }
    public BigDecimal getTotalInvested() { return totalInvested; }
    public void setTotalInvested(BigDecimal totalInvested) { this.totalInvested = totalInvested; }
    public BigDecimal getTotalValue() { return totalValue; }
    public void setTotalValue(BigDecimal totalValue) { this.totalValue = totalValue; }
    public BigDecimal getTotalProfitLoss() { return totalProfitLoss; }
    public void setTotalProfitLoss(BigDecimal totalProfitLoss) { this.totalProfitLoss = totalProfitLoss; }
    public BigDecimal getTotalProfitLossPercent() { return totalProfitLossPercent; }
    public void setTotalProfitLossPercent(BigDecimal totalProfitLossPercent) { this.totalProfitLossPercent = totalProfitLossPercent; }
    public BigDecimal getDailyProfitLoss() { return dailyProfitLoss; }
    public void setDailyProfitLoss(BigDecimal dailyProfitLoss) { this.dailyProfitLoss = dailyProfitLoss; }
    public Integer getTotalHoldings() { return totalHoldings; }
    public void setTotalHoldings(Integer totalHoldings) { this.totalHoldings = totalHoldings; }
    public List<HoldingDto> getHoldings() { return holdings; }
    public void setHoldings(List<HoldingDto> holdings) { this.holdings = holdings; }
}