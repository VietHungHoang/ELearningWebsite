package com.elearning.chatservice.service.impl;

import com.elearning.chatservice.dto.request.EditMessageRequest;
import com.elearning.chatservice.dto.request.SendMessageRequest;
import com.elearning.chatservice.dto.response.MessageResponse;
import com.elearning.chatservice.entity.*;
import com.elearning.chatservice.repository.MessageRepository;
import com.elearning.chatservice.repository.ParticipantRepository;
import com.elearning.chatservice.service.ConversationService;
import com.elearning.chatservice.service.FileStorageService;
import com.elearning.chatservice.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final ParticipantRepository participantRepository;
    private final ConversationService conversationService;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public MessageResponse sendMessage(SendMessageRequest request, UUID senderId) {
        log.info("Sending message: conversationId={}, senderId={}", request.getConversationId(), senderId);

        // Verify user is participant
        if (!participantRepository.existsByConversationIdAndUserId(request.getConversationId(), senderId)) {
            throw new RuntimeException("User is not a participant in this conversation");
        }

        // Create message
        Message message = Message.builder()
                .conversationId(request.getConversationId())
                .senderId(senderId)
                .type(request.getType())
                .content(request.getContent())
                .status(MessageStatus.SENT)
                .readBy(new ArrayList<>(List.of(senderId)))  // Sender has read it
                .reactions(new HashMap<>())
                .attachments(new ArrayList<>())
                .replyToMessageId(request.getReplyToMessageId())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .isEdited(false)
                .isDeleted(false)
                .build();

        message = messageRepository.save(message);

        // Update conversation's last message
        conversationService.updateLastMessage(request.getConversationId(), message.getId());

        log.info("Message sent: id={}", message.getId());
        return mapToResponse(message);
    }

    @Override
    @Transactional
    public MessageResponse sendMessageWithFiles(SendMessageRequest request, List<MultipartFile> files, UUID senderId) {
        log.info("Sending message with files: conversationId={}, senderId={}, fileCount={}", 
                request.getConversationId(), senderId, files.size());

        // Verify user is participant
        if (!participantRepository.existsByConversationIdAndUserId(request.getConversationId(), senderId)) {
            throw new RuntimeException("User is not a participant in this conversation");
        }

        // Store files and create attachments
        List<MessageAttachment> attachments = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                String fileUrl = fileStorageService.storeFile(file, request.getConversationId());
                String thumbnailUrl = null;
                
                // Generate thumbnail for images/videos
                if (file.getContentType() != null && 
                    (file.getContentType().startsWith("image/") || file.getContentType().startsWith("video/"))) {
                    try {
                        thumbnailUrl = fileStorageService.generateThumbnail(fileUrl);
                    } catch (Exception e) {
                        log.warn("Failed to generate thumbnail for file: {}", fileUrl, e);
                    }
                }

                MessageAttachment attachment = MessageAttachment.builder()
                        .fileName(file.getOriginalFilename())
                        .fileUrl(fileUrl)
                        .fileType(file.getContentType())
                        .fileSize(file.getSize())
                        .thumbnailUrl(thumbnailUrl)
                        .build();
                
                attachments.add(attachment);
            } catch (IOException e) {
                log.error("Failed to store file: {}", file.getOriginalFilename(), e);
                throw new RuntimeException("Failed to store file: " + file.getOriginalFilename(), e);
            }
        }

        // Create message
        Message message = Message.builder()
                .id(UUID.randomUUID())
                .conversationId(request.getConversationId())
                .senderId(senderId)
                .type(request.getType())
                .content(request.getContent())
                .attachments(attachments)
                .status(MessageStatus.SENT)
                .readBy(new ArrayList<>(List.of(senderId)))
                .reactions(new HashMap<>())
                .replyToMessageId(request.getReplyToMessageId())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .isEdited(false)
                .isDeleted(false)
                .build();

        message = messageRepository.save(message);

        // Update conversation's last message
        conversationService.updateLastMessage(request.getConversationId(), message.getId());

        log.info("Message with files sent: id={}", message.getId());
        return mapToResponse(message);
    }

    @Override
    public MessageResponse getMessageById(UUID messageId, UUID userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        // Verify user is participant
        if (!participantRepository.existsByConversationIdAndUserId(message.getConversationId(), userId)) {
            throw new RuntimeException("User is not a participant in this conversation");
        }

        return mapToResponse(message);
    }

    @Override
    public Page<MessageResponse> getConversationMessages(UUID conversationId, UUID userId, Pageable pageable) {
        // Verify user is participant
        if (!participantRepository.existsByConversationIdAndUserId(conversationId, userId)) {
            throw new RuntimeException("User is not a participant in this conversation");
        }

        return messageRepository.findByConversationIdAndIsDeletedFalseOrderByCreatedAtDesc(conversationId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public MessageResponse editMessage(EditMessageRequest request, UUID userId) {
        Message message = messageRepository.findById(request.getMessageId())
                .orElseThrow(() -> new RuntimeException("Message not found"));

        // Only sender can edit
        if (!message.getSenderId().equals(userId)) {
            throw new RuntimeException("Only the sender can edit this message");
        }

        // Cannot edit deleted messages
        if (message.isDeleted()) {
            throw new RuntimeException("Cannot edit deleted message");
        }

        message.setContent(request.getNewContent());
        message.setEdited(true);
        message.setEditedAt(LocalDateTime.now());
        message.setUpdatedAt(LocalDateTime.now());

        message = messageRepository.save(message);

        log.info("Message edited: id={}", message.getId());
        return mapToResponse(message);
    }

    @Override
    @Transactional
    public void deleteMessage(UUID messageId, UUID userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        // Only sender can delete
        if (!message.getSenderId().equals(userId)) {
            throw new RuntimeException("Only the sender can delete this message");
        }

        message.setDeleted(true);
        message.setContent("[Message deleted]");
        message.setUpdatedAt(LocalDateTime.now());
        messageRepository.save(message);

        log.info("Message deleted: id={}", messageId);
    }

    @Override
    @Transactional
    public void markAsRead(UUID conversationId, UUID messageId, UUID userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!message.getReadBy().contains(userId)) {
            message.getReadBy().add(userId);
            message.setStatus(MessageStatus.READ);
            messageRepository.save(message);
        }
    }

    @Override
    @Transactional
    public void markAllAsRead(UUID conversationId, UUID userId) {
        List<Message> unreadMessages = messageRepository.findUnreadMessagesInConversation(conversationId, userId);
        
        for (Message message : unreadMessages) {
            if (!message.getReadBy().contains(userId)) {
                message.getReadBy().add(userId);
                message.setStatus(MessageStatus.READ);
            }
        }

        messageRepository.saveAll(unreadMessages);
        log.info("Marked all messages as read: conversationId={}, userId={}", conversationId, userId);
    }

    @Override
    public UUID getConversationIdByMessageId(UUID messageId) {
        Message message = messageRepository.findById(messageId).orElse(null);
        return message != null ? message.getConversationId() : null;
    }

    @Override
    public boolean isUserParticipant(UUID conversationId, UUID userId) {
        return participantRepository.existsByConversationIdAndUserId(conversationId, userId);
    }

    @Override
    @Transactional
    public MessageResponse addReaction(UUID messageId, String emoji, UUID userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (message.getReactions() == null) {
            message.setReactions(new HashMap<>());
        }

        message.getReactions().put(userId, emoji);
        message.setUpdatedAt(LocalDateTime.now());
        message = messageRepository.save(message);

        log.info("Reaction added: messageId={}, userId={}, emoji={}", messageId, userId, emoji);
        return mapToResponse(message);
    }

    @Override
    @Transactional
    public MessageResponse removeReaction(UUID messageId, UUID userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (message.getReactions() != null) {
            message.getReactions().remove(userId);
            message.setUpdatedAt(LocalDateTime.now());
            message = messageRepository.save(message);
        }

        log.info("Reaction removed: messageId={}, userId={}", messageId, userId);
        return mapToResponse(message);
    }

    @Override
    public long getUnreadCount(UUID conversationId, UUID userId) {
        return messageRepository.countUnreadMessages(conversationId, userId);
    }

    @Override
    public Page<MessageResponse> searchMessages(UUID conversationId, String searchText, UUID userId, Pageable pageable) {
        // Verify user is participant
        if (!participantRepository.existsByConversationIdAndUserId(conversationId, userId)) {
            throw new RuntimeException("User is not a participant in this conversation");
        }

        return messageRepository.searchInConversation(conversationId, searchText, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<MessageResponse> getMessagesByType(UUID conversationId, MessageType type, UUID userId, Pageable pageable) {
        // Verify user is participant
        if (!participantRepository.existsByConversationIdAndUserId(conversationId, userId)) {
            throw new RuntimeException("User is not a participant in this conversation");
        }

        return messageRepository.findByConversationIdAndTypeAndIsDeletedFalse(conversationId, type, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public MessageResponse mapToResponse(Message message) {
        MessageResponse response = MessageResponse.builder()
                .id(message.getId())
                .conversationId(message.getConversationId())
                .senderId(message.getSenderId())
                .type(message.getType())
                .content(message.getContent())
                .attachments(message.getAttachments())
                .status(message.getStatus())
                .readBy(message.getReadBy())
                .reactions(message.getReactions())
                .createdAt(message.getCreatedAt())
                .updatedAt(message.getUpdatedAt())
                .editedAt(message.getEditedAt())
                .isEdited(message.isEdited())
                .replyToMessageId(message.getReplyToMessageId())
                .build();

        // Load reply message if exists
        if (message.getReplyToMessageId() != null) {
            messageRepository.findById(message.getReplyToMessageId())
                    .ifPresent(replyMsg -> response.setReplyToMessage(mapToResponse(replyMsg)));
        }

        return response;
    }
}
