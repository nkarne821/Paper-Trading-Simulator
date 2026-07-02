package com.papertrading.dto;

import java.util.List;

public class WatchlistDto {
    private Long id;
    private Long userId;
    private String name;
    private List<WatchlistItemDto> items;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<WatchlistItemDto> getItems() { return items; }
    public void setItems(List<WatchlistItemDto> items) { this.items = items; }
}