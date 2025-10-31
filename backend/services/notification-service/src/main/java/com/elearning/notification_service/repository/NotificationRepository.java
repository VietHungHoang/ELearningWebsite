package com.elearning.notification_service.repository;

import com.elearning.notification_service.model.Notification;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends MongoRepository<Notification, UUID> {
    
    List<Notification> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    List<Notification> findByUserId(UUID userId, Pageable pageable);

    Long countByUserIdAndIsReadFalse(UUID userId);
}
