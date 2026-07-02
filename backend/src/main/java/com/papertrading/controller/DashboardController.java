package com.papertrading.controller;

import com.papertrading.dto.ApiResponse;
import com.papertrading.dto.DashboardDto;
import com.papertrading.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardDto>> getDashboard(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        DashboardDto dashboard = dashboardService.getDashboard(userId);
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null || !(authentication.getPrincipal() instanceof com.papertrading.model.User)) {
            return 1L;
        }
        com.papertrading.model.User user = (com.papertrading.model.User) authentication.getPrincipal();
        return user.getId() != null ? user.getId() : 1L;
    }
}