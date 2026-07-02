package com.papertrading.service;

import com.papertrading.dto.LearningArticleDto;
import com.papertrading.exception.ResourceNotFoundException;
import com.papertrading.model.LearningArticle;
import com.papertrading.repository.LearningArticleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LearningService {

    private final LearningArticleRepository learningArticleRepository;

    public LearningService(LearningArticleRepository learningArticleRepository) {
        this.learningArticleRepository = learningArticleRepository;
    }

    public List<LearningArticleDto> getAllArticles() {
        List<LearningArticle> articles = new java.util.ArrayList<>();
        learningArticleRepository.findAll().forEach(articles::add);
        return articles.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<LearningArticleDto> getArticlesByCategory(String category) {
        return learningArticleRepository.findByCategoryOrderByCreatedAtDesc(category).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<LearningArticleDto> getFeaturedArticles() {
        return learningArticleRepository.findByIsFeaturedTrueOrderByCreatedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<LearningArticleDto> getRecentArticles(int limit) {
        return learningArticleRepository.findRecentArticles(limit).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public LearningArticleDto getArticleBySlug(String slug) {
        LearningArticle article = learningArticleRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Article", "slug", slug));
        learningArticleRepository.incrementViewCount(article.getId());
        article.setViewCount(article.getViewCount() + 1);
        return mapToDto(article);
    }

    private LearningArticleDto mapToDto(LearningArticle article) {
        LearningArticleDto dto = new LearningArticleDto();
        dto.setId(article.getId());
        dto.setTitle(article.getTitle());
        dto.setSlug(article.getSlug());
        dto.setCategory(article.getCategory());
        dto.setSummary(article.getSummary());
        dto.setContent(article.getContent());
        dto.setAuthor(article.getAuthor());
        dto.setReadTime(article.getReadTime());
        dto.setImageUrl(article.getImageUrl());
        dto.setIsFeatured(article.getIsFeatured());
        dto.setViewCount(article.getViewCount());
        dto.setCreatedAt(article.getCreatedAt());
        return dto;
    }
}