package com.papertrading.repository;

import com.papertrading.model.Transaction;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends CrudRepository<Transaction, Long> {

    List<Transaction> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Transaction> findByPortfolioIdOrderByCreatedAtDesc(Long portfolioId);

    @Query("SELECT * FROM transactions WHERE user_id = :userId ORDER BY created_at DESC LIMIT :limit")
    List<Transaction> findRecentByUserId(@Param("userId") Long userId, @Param("limit") int limit);

    @Query("SELECT COUNT(*) FROM transactions WHERE user_id = :userId")
    int countByUserId(@Param("userId") Long userId);
}