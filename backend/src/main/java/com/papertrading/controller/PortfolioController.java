package com.papertrading.controller;

import com.papertrading.dto.ApiResponse;
import com.papertrading.dto.PortfolioDto;
import com.papertrading.service.PortfolioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin(origins = "*")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PortfolioDto>> getPortfolio(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        PortfolioDto portfolio = portfolioService.getPortfolio(userId);
        return ResponseEntity.ok(ApiResponse.success(portfolio));
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null || !(authentication.getPrincipal() instanceof com.papertrading.model.User)) {
            return 1L;
        }
        com.papertrading.model.User user = (com.papertrading.model.User) authentication.getPrincipal();
        return user.getId() != null ? user.getId() : 1L;
    }
}