package com.papertrading.repository;

import com.papertrading.model.Portfolio;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface PortfolioRepository extends CrudRepository<Portfolio, Long> {

    Optional<Portfolio> findByUserId(Long userId);

    @Modifying
    @Query("UPDATE portfolios SET cash_balance = :cashBalance, total_invested = :totalInvested, total_value = :totalValue, total_profit_loss = :totalProfitLoss, daily_profit_loss = :dailyProfitLoss, updated_at = NOW() WHERE id = :id")
    void updatePortfolio(@Param("id") Long id, @Param("cashBalance") BigDecimal cashBalance, @Param("totalInvested") BigDecimal totalInvested, @Param("totalValue") BigDecimal totalValue, @Param("totalProfitLoss") BigDecimal totalProfitLoss, @Param("dailyProfitLoss") BigDecimal dailyProfitLoss);

    @Modifying
    @Query("UPDATE portfolios SET cash_balance = cash_balance - :amount, total_invested = total_invested + :amount, updated_at = NOW() WHERE id = :id")
    void updateAfterBuy(@Param("id") Long id, @Param("amount") BigDecimal amount);

    @Modifying
    @Query("UPDATE portfolios SET cash_balance = cash_balance + :amount, updated_at = NOW() WHERE id = :id")
    void updateAfterSell(@Param("id") Long id, @Param("amount") BigDecimal amount);
}