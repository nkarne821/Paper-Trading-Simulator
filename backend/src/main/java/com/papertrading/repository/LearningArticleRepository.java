package com.papertrading.repository;

import com.papertrading.model.LearningArticle;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningArticleRepository extends CrudRepository<LearningArticle, Long> {

    List<LearningArticle> findByCategoryOrderByCreatedAtDesc(String category);

    List<LearningArticle> findByIsFeaturedTrueOrderByCreatedAtDesc();

    Optional<LearningArticle> findBySlug(String slug);

    @Modifying
    @Query("UPDATE learning_articles SET view_count = view_count + 1 WHERE id = :id")
    void incrementViewCount(@Param("id") Long id);

    @Query("SELECT * FROM learning_articles ORDER BY created_at DESC LIMIT :limit")
    List<LearningArticle> findRecentArticles(@Param("limit") int limit);
}