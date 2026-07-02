package com.papertrading.service;

import com.papertrading.dto.StockQuoteDto;
import com.papertrading.dto.WatchlistDto;
import com.papertrading.dto.WatchlistItemDto;
import com.papertrading.exception.BadRequestException;
import com.papertrading.exception.ResourceNotFoundException;
import com.papertrading.model.Watchlist;
import com.papertrading.model.WatchlistItem;
import com.papertrading.repository.WatchlistItemRepository;
import com.papertrading.repository.WatchlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final WatchlistItemRepository watchlistItemRepository;
    private final StockService stockService;

    public WatchlistService(WatchlistRepository watchlistRepository, WatchlistItemRepository watchlistItemRepository,
                            StockService stockService) {
        this.watchlistRepository = watchlistRepository;
        this.watchlistItemRepository = watchlistItemRepository;
        this.stockService = stockService;
    }

    @Transactional
    public void createWatchlistForUser(Long userId) {
        Watchlist watchlist = new Watchlist();
        watchlist.setUserId(userId);
        watchlist.setName("My Watchlist");
        watchlistRepository.save(watchlist);
    }

    public WatchlistDto getWatchlist(Long userId) {
        Watchlist watchlist = watchlistRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Watchlist", "userId", userId));

        List<WatchlistItem> items = watchlistItemRepository.findByWatchlistId(watchlist.getId());
        List<WatchlistItemDto> itemDtos = items.stream()
                .map(this::mapToWatchlistItemDto)
                .collect(Collectors.toList());

        WatchlistDto dto = new WatchlistDto();
        dto.setId(watchlist.getId());
        dto.setUserId(watchlist.getUserId());
        dto.setName(watchlist.getName());
        dto.setItems(itemDtos);
        return dto;
    }

    @Transactional
    public WatchlistItemDto addToWatchlist(Long userId, String symbol, String companyName, String notes) {
        Watchlist watchlist = watchlistRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Watchlist", "userId", userId));

        if (watchlistItemRepository.existsByWatchlistIdAndSymbol(watchlist.getId(), symbol)) {
            throw new BadRequestException(symbol + " is already in your watchlist");
        }

        WatchlistItem item = new WatchlistItem();
        item.setWatchlistId(watchlist.getId());
        item.setSymbol(symbol.toUpperCase());
        item.setCompanyName(companyName);
        item.setNotes(notes);
        WatchlistItem savedItem = watchlistItemRepository.save(item);
        return mapToWatchlistItemDto(savedItem);
    }

    @Transactional
    public void removeFromWatchlist(Long userId, String symbol) {
        Watchlist watchlist = watchlistRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Watchlist", "userId", userId));
        watchlistItemRepository.deleteByWatchlistIdAndSymbol(watchlist.getId(), symbol.toUpperCase());
    }

    private WatchlistItemDto mapToWatchlistItemDto(WatchlistItem item) {
        WatchlistItemDto dto = new WatchlistItemDto();
        dto.setId(item.getId());
        dto.setSymbol(item.getSymbol());
        dto.setCompanyName(item.getCompanyName());
        dto.setNotes(item.getNotes());

        StockQuoteDto quote = stockService.getStockQuote(item.getSymbol());
        if (quote != null) {
            dto.setCurrentPrice(quote.getCurrentPrice());
            dto.setDayChange(quote.getChange());
            dto.setDayChangePercent(quote.getChangePercent());
        }
        return dto;
    }
}