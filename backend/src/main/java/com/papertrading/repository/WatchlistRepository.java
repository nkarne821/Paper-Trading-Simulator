package com.papertrading.repository;

import com.papertrading.model.Watchlist;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WatchlistRepository extends CrudRepository<Watchlist, Long> {

    Optional<Watchlist> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}