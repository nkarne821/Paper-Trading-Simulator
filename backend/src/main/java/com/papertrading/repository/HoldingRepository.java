package com.papertrading.repository;

import com.papertrading.model.Holding;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface HoldingRepository extends CrudRepository<Holding, Long> {

    List<Holding> findByPortfolioId(Long portfolioId);

    Optional<Holding> findByPortfolioIdAndSymbol(Long portfolioId, String symbol);

    @Modifying
    @Query("UPDATE holdings SET quantity = :quantity, avg_buy_price = :avgBuyPrice, current_price = :currentPrice, total_invested = :totalInvested, current_value = :currentValue, profit_loss = :profitLoss, profit_loss_percent = :profitLossPercent, updated_at = NOW() WHERE id = :id")
    void updateHolding(@Param("id") Long id, @Param("quantity") Integer quantity, @Param("avgBuyPrice") BigDecimal avgBuyPrice, @Param("currentPrice") BigDecimal currentPrice, @Param("totalInvested") BigDecimal totalInvested, @Param("currentValue") BigDecimal currentValue, @Param("profitLoss") BigDecimal profitLoss, @Param("profitLossPercent") BigDecimal profitLossPercent);

    @Modifying
    @Query("DELETE FROM holdings WHERE id = :id")
    void deleteHoldingById(@Param("id") Long id);

    @Query("SELECT COUNT(*) FROM holdings WHERE portfolio_id = :portfolioId")
    int countByPortfolioId(@Param("portfolioId") Long portfolioId);
}