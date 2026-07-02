package com.papertrading.controller;

import com.papertrading.dto.ApiResponse;
import com.papertrading.dto.TradeRequest;
import com.papertrading.dto.TransactionDto;
import com.papertrading.service.TradingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trading")
@CrossOrigin(origins = "*")
public class TradingController {

    private final TradingService tradingService;

    public TradingController(TradingService tradingService) {
        this.tradingService = tradingService;
    }

    @PostMapping("/buy")
    public ResponseEntity<ApiResponse<TransactionDto>> buyStock(@Valid @RequestBody TradeRequest request, Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        TransactionDto transaction = tradingService.buyStock(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Buy order executed successfully", transaction));
    }

    @PostMapping("/sell")
    public ResponseEntity<ApiResponse<TransactionDto>> sellStock(@Valid @RequestBody TradeRequest request, Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        TransactionDto transaction = tradingService.sellStock(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Sell order executed successfully", transaction));
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<TransactionDto>>> getTransactions(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        List<TransactionDto> transactions = tradingService.getUserTransactions(userId);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @GetMapping("/transactions/recent")
    public ResponseEntity<ApiResponse<List<TransactionDto>>> getRecentTransactions(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        List<TransactionDto> transactions = tradingService.getRecentTransactions(userId, 10);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null || !(authentication.getPrincipal() instanceof com.papertrading.model.User)) {
            return 1L;
        }
        com.papertrading.model.User user = (com.papertrading.model.User) authentication.getPrincipal();
        return user.getId() != null ? user.getId() : 1L;
    }
}