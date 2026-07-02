package com.papertrading.controller;

import com.papertrading.dto.ApiResponse;
import com.papertrading.dto.WatchlistDto;
import com.papertrading.dto.WatchlistItemDto;
import com.papertrading.service.WatchlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/watchlist")
@CrossOrigin(origins = "*")
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<WatchlistDto>> getWatchlist(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        WatchlistDto watchlist = watchlistService.getWatchlist(userId);
        return ResponseEntity.ok(ApiResponse.success(watchlist));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<WatchlistItemDto>> addToWatchlist(@RequestBody Map<String, String> request, Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        String symbol = request.get("symbol");
        String companyName = request.getOrDefault("companyName", symbol);
        String notes = request.getOrDefault("notes", "");
        WatchlistItemDto item = watchlistService.addToWatchlist(userId, symbol, companyName, notes);
        return ResponseEntity.ok(ApiResponse.success("Added to watchlist", item));
    }

    @DeleteMapping("/remove/{symbol}")
    public ResponseEntity<ApiResponse<Void>> removeFromWatchlist(@PathVariable String symbol, Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        watchlistService.removeFromWatchlist(userId, symbol);
        return ResponseEntity.ok(ApiResponse.success("Removed from watchlist", null));
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null || !(authentication.getPrincipal() instanceof com.papertrading.model.User)) {
            return 1L;
        }
        com.papertrading.model.User user = (com.papertrading.model.User) authentication.getPrincipal();
        return user.getId() != null ? user.getId() : 1L;
    }
}