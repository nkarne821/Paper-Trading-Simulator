package com.papertrading.repository;

import com.papertrading.model.WatchlistItem;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchlistItemRepository extends CrudRepository<WatchlistItem, Long> {

    List<WatchlistItem> findByWatchlistId(Long watchlistId);

    Optional<WatchlistItem> findByWatchlistIdAndSymbol(Long watchlistId, String symbol);

    @Modifying
    @Query("DELETE FROM watchlist_items WHERE watchlist_id = :watchlistId AND symbol = :symbol")
    void deleteByWatchlistIdAndSymbol(@Param("watchlistId") Long watchlistId, @Param("symbol") String symbol);

    boolean existsByWatchlistIdAndSymbol(Long watchlistId, String symbol);
}