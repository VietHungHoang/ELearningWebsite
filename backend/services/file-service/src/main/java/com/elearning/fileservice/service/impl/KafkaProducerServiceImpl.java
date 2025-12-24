package com.elearning.fileservice.service.impl;

import com.elearning.fileservice.events.VideoTranscodingMessage;
import com.elearning.fileservice.service.KafkaProducerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;

/**
 * Kafka producer service implementation for sending video transcoding messages
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class KafkaProducerServiceImpl implements KafkaProducerService {
    
    private final KafkaTemplate<String, VideoTranscodingMessage> kafkaTemplate;
    
    @Value("${kafka.topics.video-transcoding}")
    private String videoTranscodingTopic;
    
    @Override
    public void sendVideoTranscodingMessage(VideoTranscodingMessage message) {
        log.info("Sending video transcoding message to Kafka topic '{}' for video: {}", 
                videoTranscodingTopic, message.getVideoId());
        
        try {
            // Use video ID as the key for partitioning
            String key = message.getVideoId() != null ? message.getVideoId().toString() : UUID.randomUUID().toString();
            CompletableFuture<SendResult<String, VideoTranscodingMessage>> future = 
                kafkaTemplate.send(videoTranscodingTopic, key, message);
            
            future.whenComplete((result, throwable) -> {
                if (throwable == null) {
                    log.info("Successfully sent video transcoding message for video: {} to topic: {} with offset: {}", 
                            message.getVideoId(), 
                            videoTranscodingTopic, 
                            result.getRecordMetadata().offset());
                } else {
                    log.error("Failed to send video transcoding message for video: {} to topic: {}", 
                            message.getVideoId(), 
                            videoTranscodingTopic, 
                            throwable);
                }
            });
            
        } catch (Exception e) {
            log.error("Error occurred while sending video transcoding message for video: {}", 
                    message.getVideoId(), e);
            throw new RuntimeException("Failed to send video transcoding message", e);
        }
    }
}