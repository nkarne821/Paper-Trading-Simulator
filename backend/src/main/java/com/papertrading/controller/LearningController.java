package com.papertrading.controller;

import com.papertrading.dto.ApiResponse;
import com.papertrading.dto.LearningArticleDto;
import com.papertrading.service.LearningService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning")
@CrossOrigin(origins = "*")
public class LearningController {

    private final LearningService learningService;

    public LearningController(LearningService learningService) {
        this.learningService = learningService;
    }

    @GetMapping("/articles")
    public ResponseEntity<ApiResponse<List<LearningArticleDto>>> getAllArticles() {
        List<LearningArticleDto> articles = learningService.getAllArticles();
        return ResponseEntity.ok(ApiResponse.success(articles));
    }

    @GetMapping("/articles/category/{category}")
    public ResponseEntity<ApiResponse<List<LearningArticleDto>>> getArticlesByCategory(@PathVariable String category) {
        List<LearningArticleDto> articles = learningService.getArticlesByCategory(category);
        return ResponseEntity.ok(ApiResponse.success(articles));
    }

    @GetMapping("/articles/featured")
    public ResponseEntity<ApiResponse<List<LearningArticleDto>>> getFeaturedArticles() {
        List<LearningArticleDto> articles = learningService.getFeaturedArticles();
        return ResponseEntity.ok(ApiResponse.success(articles));
    }

    @GetMapping("/articles/recent")
    public ResponseEntity<ApiResponse<List<LearningArticleDto>>> getRecentArticles() {
        List<LearningArticleDto> articles = learningService.getRecentArticles(6);
        return ResponseEntity.ok(ApiResponse.success(articles));
    }

    @GetMapping("/articles/{slug}")
    public ResponseEntity<ApiResponse<LearningArticleDto>> getArticleBySlug(@PathVariable String slug) {
        LearningArticleDto article = learningService.getArticleBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(article));
    }
}