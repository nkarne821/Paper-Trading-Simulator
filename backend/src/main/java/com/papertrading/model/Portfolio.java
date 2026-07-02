package com.papertrading.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Table("portfolios")
public class Portfolio {
    @Id
    private Long id;
    private Long userId;
    private BigDecimal cashBalance;
    private BigDecimal totalInvested;
    private BigDecimal totalValue;
    private BigDecimal totalProfitLoss;
    private BigDecimal dailyProfitLoss;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Portfolio() {}

    public Portfolio(Long id, Long userId, BigDecimal cashBalance, BigDecimal totalInvested, BigDecimal totalValue, BigDecimal totalProfitLoss, BigDecimal dailyProfitLoss) {
        this.id = id;
        this.userId = userId;
        this.cashBalance = cashBalance;
        this.totalInvested = totalInvested;
        this.totalValue = totalValue;
        this.totalProfitLoss = totalProfitLoss;
        this.dailyProfitLoss = dailyProfitLoss;
    }

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
    public BigDecimal getDailyProfitLoss() { return dailyProfitLoss; }
    public void setDailyProfitLoss(BigDecimal dailyProfitLoss) { this.dailyProfitLoss = dailyProfitLoss; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}