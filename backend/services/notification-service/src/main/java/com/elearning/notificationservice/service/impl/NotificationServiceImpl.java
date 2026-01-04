package com.elearning.notificationservice.service.impl;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Pageable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.elearning.notificationservice.dto.event.NotificationEvent;
import com.elearning.notificationservice.dto.response.NotificationResponse;
import com.elearning.notificationservice.exception.EmailSendException;
import com.elearning.notificationservice.exception.NotificationAccessDeniedException;
import com.elearning.notificationservice.exception.NotificationNotFoundException;
import com.elearning.notificationservice.mapper.NotificationMapper;
import com.elearning.notificationservice.model.Notification;
import com.elearning.notificationservice.repository.NotificationRepository;
import com.elearning.notificationservice.service.NotificationService;
import com.elearning.notificationservice.sse.SseEmitterManager;
import com.elearning.notificationservice.util.EmailTemplateUtil;

import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final SseEmitterManager sseEmitterManager;
    private final JavaMailSender mailSender;
    private final NotificationMapper notificationMapper;

    @Override
    public void createNotification(NotificationEvent event) {
        // 1. Save to MongoDB
        Notification notification = notificationMapper.toEntity(event);
        notification = notificationRepository.save(notification);
        log.info("Saved notification to MongoDB: id={}, userId={}, type={}", 
                notification.getId(), notification.getUserId(), notification.getType());

        // 2. Push via SSE to connected client
        NotificationResponse response = notificationMapper.mapToResponse(notification);
        boolean sent = sseEmitterManager.sendToUser(event.getUserId(), response);
        
        if (sent) {
            log.info("Pushed notification via SSE to user: {}", event.getUserId());
        } else {
            log.debug("User {} not connected via SSE, notification saved for later retrieval", event.getUserId());
        }
    }

    @Override
    public List<NotificationResponse> getUserNotifications(UUID userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .stream()
                .map(notificationMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public long getUnreadCount(UUID userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Override
    public long markAllAsRead(UUID userId) {
        List<Notification> notifications = notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId, Pageable.unpaged());

        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);

        log.info("Marked {} notifications as read for user: {}", notifications.size(), userId);
        return notifications.size();
    }

    @Override
    public NotificationResponse markAsRead(UUID notificationId, UUID userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new NotificationAccessDeniedException("Not authorized to modify this notification");
        }

        notification.setRead(true);
        Notification saved = notificationRepository.save(notification);

        NotificationResponse response = notificationMapper.mapToResponse(saved);
        log.info("Marked notification {} as read for user: {}", notificationId, userId);

        return response;
    }

    @Override
    public void sendOtpEmail(String email, String otp) {
        try {
            java.util.Map<String, Object> metadata = java.util.Map.of("otp", otp);
            sendEmail(email, "Your OTP Code", "OTP", metadata);
        } catch (Exception e) {
            throw new EmailSendException("Failed to send OTP email to " + email, e);
        }
    }

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
