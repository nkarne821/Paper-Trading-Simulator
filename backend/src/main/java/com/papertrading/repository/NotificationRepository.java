package com.papertrading.repository;

import com.papertrading.model.Notification;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends CrudRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);

    @Query("SELECT COUNT(*) FROM notifications WHERE user_id = :userId AND is_read = FALSE")
    int countUnreadByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE notifications SET is_read = TRUE WHERE user_id = :userId")
    void markAllAsRead(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE notifications SET is_read = TRUE WHERE id = :id")
    void markAsRead(@Param("id") Long id);
}