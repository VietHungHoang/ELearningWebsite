package com.elearning.notificationservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.elearning.notificationservice.dto.request.NotificationRequest;
import com.elearning.notificationservice.dto.response.NotificationResponse;
import com.elearning.notificationservice.exception.EmailSendException;
import com.elearning.notificationservice.exception.NotificationAccessDeniedException;
import com.elearning.notificationservice.exception.NotificationNotFoundException;
import com.elearning.notificationservice.mapper.NotificationMapper;
import com.elearning.notificationservice.model.Notification;
import com.elearning.notificationservice.repository.NotificationRepository;
import com.elearning.notificationservice.service.NotificationService;
import com.elearning.notificationservice.util.EmailTemplateUtil;

import jakarta.mail.internet.MimeMessage;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final JavaMailSender mailSender;
    private final NotificationMapper notificationMapper;

    @Override
    public NotificationResponse createNotification(NotificationRequest request) {
        Notification notification = notificationMapper.mapToEntity(request);

        Notification saved = notificationRepository.save(notification);

        NotificationResponse response = notificationMapper.mapToResponse(saved);

        String userTopic = "/topic/notifications/" + saved.getUserId().toString();
        messagingTemplate.convertAndSend(userTopic, response);

        try {
            String to = (String) (request.getMetadata() != null
                    ? request.getMetadata().get("email")
                    : null);
            if (to != null && !to.isBlank()) {
                sendEmail(to, request.getTitle(), request.getType(), request.getMetadata());
            }
        } catch (Exception e) {
            throw new EmailSendException("Failed to send notification email to " + request.getUserId(), e);
        }

        return response;
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

        List<NotificationResponse> responses = notifications.stream()
                .map(notificationMapper::mapToResponse)
                .collect(Collectors.toList());

        responses.forEach(resp -> {
            String userTopic = "/topic/notifications/" + resp.getUserId().toString();
            messagingTemplate.convertAndSend(userTopic, resp);
            messagingTemplate.convertAndSend("/topic/notifications", resp);
        });

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

        String userTopic = "/topic/notifications/" + userId.toString();
        messagingTemplate.convertAndSend(userTopic, response);
        messagingTemplate.convertAndSend("/topic/notifications", response);

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
