package com.elearning.mediaservice.service;

import com.elearning.mediaservice.enums.VideoStatus;
import com.elearning.mediaservice.events.VideoProcessedEvent;
import com.elearning.mediaservice.model.Video;
import com.elearning.mediaservice.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service to handle video processing events from Kafka
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class VideoProcessingService {

    private final VideoRepository videoRepository;

    @KafkaListener(topics = "${kafka.topics.video-processed}", groupId = "${spring.kafka.consumer.group-id}")
    @Transactional
    public void handleVideoProcessedEvent(VideoProcessedEvent event) {
        log.info("Received VideoProcessedEvent: videoId={}, status={}, lessonId={}",
                event.getVideoId(), event.getStatus(), event.getLessonId());

        try {
            Optional<Video> videoOpt = videoRepository.findById(event.getVideoId());
            if (videoOpt.isEmpty()) {
                log.warn("Video with id {} not found", event.getVideoId());
                return;
            }

            Video video = videoOpt.get();

            // Update video status
            video.setStatus(event.getStatus());

            // Update processing completed timestamp
            video.setProcessingCompletedAt(event.getProcessedAt());

            // If processing failed, set error message
            if (event.getStatus() == VideoStatus.FAILED) {
                video.setProcessingMessage(event.getErrorMessage());
            } else if (event.getStatus() == VideoStatus.READY) {
                // If processing succeeded, set video URL
                if (event.getMasterPlaylistUrl() != null && !event.getMasterPlaylistUrl().isEmpty()) {
                    video.setVideoUrl(event.getMasterPlaylistUrl());
                }
                video.setProcessingMessage(null); // Clear any previous error message
            }

            videoRepository.save(video);

            log.info("Successfully updated video {} with status {}", event.getVideoId(), event.getStatus());

        } catch (Exception e) {
            log.error("Error processing VideoProcessedEvent for video {}", event.getVideoId(), e);
            // In a real application, you might want to send this to a dead letter queue
        }
    }
}