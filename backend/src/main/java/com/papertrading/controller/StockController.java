package com.papertrading.controller;

import com.papertrading.dto.ApiResponse;
import com.papertrading.dto.StockQuoteDto;
import com.papertrading.service.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin(origins = "*")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping("/quote/{symbol}")
    public ResponseEntity<ApiResponse<StockQuoteDto>> getQuote(@PathVariable String symbol) {
        StockQuoteDto quote = stockService.getStockQuote(symbol);
        return ResponseEntity.ok(ApiResponse.success(quote));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<StockQuoteDto>>> searchStocks(@RequestParam String query) {
        List<StockQuoteDto> results = stockService.searchStocks(query);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @GetMapping("/market-overview")
    public ResponseEntity<ApiResponse<List<StockQuoteDto>>> getMarketOverview() {
        List<StockQuoteDto> overview = stockService.getMarketOverview();
        return ResponseEntity.ok(ApiResponse.success(overview));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<StockQuoteDto>>> getAllStocks() {
        List<StockQuoteDto> stocks = stockService.getAllStocks();
        return ResponseEntity.ok(ApiResponse.success(stocks));
    }
}