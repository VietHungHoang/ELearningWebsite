// package com.elearning.notificationservice.repository;

// import org.springframework.data.domain.Pageable;
// import org.springframework.data.mongodb.repository.MongoRepository;

// import com.elearning.notificationservice.model.Notification;

// import java.util.List;
// import java.util.UUID;

// public interface NotificationRepository extends MongoRepository<Notification, UUID> {
    
//     List<Notification> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

//     List<Notification> findByUserId(UUID userId, Pageable pageable);

//     Long countByUserIdAndIsReadFalse(UUID userId);
// }
