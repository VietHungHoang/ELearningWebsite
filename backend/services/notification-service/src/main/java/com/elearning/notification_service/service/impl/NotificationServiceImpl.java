package com.elearning.notification_service.service.impl;

import com.elearning.notification_service.dto.request.NotificationRequest;
import com.elearning.notification_service.dto.response.NotificationResponse;
import com.elearning.notification_service.model.Notification;
import com.elearning.notification_service.repository.NotificationRepository;
import com.elearning.notification_service.service.NotificationService;
import com.elearning.notification_service.util.EmailTemplateUtil; // <-- util cho template
import org.springframework.data.domain.Pageable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private static final Logger log = LoggerFactory.getLogger(NotificationServiceImpl.class);

    // === Thêm phần gửi email ===
    private final JavaMailSender mailSender;

    public NotificationServiceImpl(NotificationRepository notificationRepository,
            SimpMessagingTemplate messagingTemplate,
            JavaMailSender mailSender) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
        this.mailSender = mailSender;
    }

    @Override
    public NotificationResponse createNotification(NotificationRequest request) {
        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .title(request.getTitle())
                .message(request.getMessage())
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .metadata(request.getMetadata())
                .build();

        // Lưu DB
        Notification saved = notificationRepository.save(notification);

        // Convert sang response DTO
        NotificationResponse response = mapToResponse(saved);

        // 🔥 Gửi realtime tới đúng user (WebSocket)
        String userTopic = "/topic/notifications/" + saved.getUserId();
        messagingTemplate.convertAndSend(userTopic, response);
        log.debug("Sent new notification to {}: {}", userTopic, response);

        // === 🔥 Gửi email ===
        try {
            String to = (String) (request.getMetadata() != null
                    ? request.getMetadata().get("email")
                    : null);
            if (to != null && !to.isBlank()) {
                sendEmail(to, request.getTitle(), request.getType(), request.getMetadata());
                log.info("📧 Email notification sent to {}", to);
            } else {
                log.warn("No recipient email provided in metadata, skipping email send.");
            }
        } catch (Exception e) {
            log.error("❌ Failed to send email notification: {}", e.getMessage(), e);
        }

        return response;
    }

    @Override
    public List<NotificationResponse> getUserNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Override
    public long markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId, Pageable.unpaged());

        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);

        List<NotificationResponse> responses = notifications.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        responses.forEach(resp -> {
            String userTopic = "/topic/notifications/" + userId;
            messagingTemplate.convertAndSend(userTopic, resp);
            messagingTemplate.convertAndSend("/topic/notifications", resp);
            log.debug("Sent markAllAsRead update to {} and /topic/notifications: {}", userTopic, resp);
        });

        return notifications.size();
    }

    @Override
    public NotificationResponse markAsRead(String notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to modify this notification");
        }

        notification.setRead(true);
        Notification saved = notificationRepository.save(notification);

        NotificationResponse response = mapToResponse(saved);

        String userTopic = "/topic/notifications/" + userId;
        messagingTemplate.convertAndSend(userTopic, response);
        messagingTemplate.convertAndSend("/topic/notifications", response);
        log.debug("Sent markAsRead update to {} and /topic/notifications: {}", userTopic, response);

        return response;
    }

    // Helper
    private NotificationResponse mapToResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .userId(n.getUserId())
                .type(n.getType())
                .title(n.getTitle())
                .message(n.getMessage())
                .read(n.isRead())
                .createdAt(n.getCreatedAt())
                .metadata(n.getMetadata())
                .build();
    }

    // === Helper gửi email ===
    private void sendEmail(String to, String subject, String type, java.util.Map<String, Object> metadata)
            throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);

        String htmlContent = EmailTemplateUtil.buildTemplate(type, metadata);
        helper.setText(htmlContent, true); // true = gửi dạng HTML

        mailSender.send(message);
    }
}
