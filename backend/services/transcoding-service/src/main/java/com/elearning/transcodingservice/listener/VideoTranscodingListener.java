package com.elearning.transcodingservice.listener;

import com.elearning.transcodingservice.dto.VideoTranscodingMessage;
import com.elearning.transcodingservice.service.VideoTranscodingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class VideoTranscodingListener {

    private final VideoTranscodingService videoTranscodingService;

    @KafkaListener(topics = "${kafka.topics.video-transcoding}", containerFactory = "kafkaListenerContainerFactory")
    public void handle(VideoTranscodingMessage message) {
        log.info("Received transcoding message from Kafka: {}", message);

        // For now, just log and acknowledge. Future: download from message.getVideoUrl(), then call service
        try {
            // TODO: download the file from message.getVideoUrl() to local workspace and call videoTranscodingService
            log.info("Received job for videoId={} lessonId={} url={}", message.getVideoId(), message.getLessonId(), message.getVideoUrl());

            // Placeholder: in future we'll implement download + transcode steps
            // videoTranscodingService.transcodeVideo(...)

        } catch (Exception e) {
            log.error("Failed to handle transcoding message for videoId={}", message.getVideoId(), e);
            // Depending on configuration, exceptions may cause retries
            throw e;
        }
    }
}
