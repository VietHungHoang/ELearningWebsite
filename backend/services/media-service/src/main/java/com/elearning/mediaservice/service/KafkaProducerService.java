package com.elearning.mediaservice.service;

import com.elearning.mediaservice.dto.VideoTranscodingMessage;

/**
 * Kafka producer service for sending video transcoding messages
 */
public interface KafkaProducerService {
    
    /**
     * Send video transcoding message to Kafka topic
     * 
     * @param message The video transcoding message
     */
    void sendVideoTranscodingMessage(VideoTranscodingMessage message);
}