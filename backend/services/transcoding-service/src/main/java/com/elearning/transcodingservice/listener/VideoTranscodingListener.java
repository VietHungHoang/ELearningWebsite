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
    log.info("Received transcoding message from Kafka: videoId={} lessonId={} bucket={} object={}",
        message.getVideoId(), message.getLessonId(), message.getBucketName(), message.getObjectName());

        videoTranscodingService.processMessage(message);
    }
}
