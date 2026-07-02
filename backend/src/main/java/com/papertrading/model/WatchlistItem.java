package com.papertrading.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Table("watchlist_items")
public class WatchlistItem {
    @Id
    private Long id;
    private Long watchlistId;
    private String symbol;
    private String companyName;
    private String notes;
    private LocalDateTime createdAt;

    public WatchlistItem() {}

    public WatchlistItem(Long id, Long watchlistId, String symbol, String companyName, String notes) {
        this.id = id;
        this.watchlistId = watchlistId;
        this.symbol = symbol;
        this.companyName = companyName;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getWatchlistId() { return watchlistId; }
    public void setWatchlistId(Long watchlistId) { this.watchlistId = watchlistId; }
    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}