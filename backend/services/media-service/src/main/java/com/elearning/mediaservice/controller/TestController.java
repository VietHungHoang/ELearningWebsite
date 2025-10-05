package com.elearning.mediaservice.controller;

import com.elearning.mediaservice.events.VideoTranscodingMessage;
import com.elearning.mediaservice.service.KafkaProducerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class TestController {

    private final KafkaProducerService kafkaProducerService;

    @GetMapping("/kafka")
    public ResponseEntity<String> sendMockKafkaMessage() {
        // Create mock data
    VideoTranscodingMessage msg = VideoTranscodingMessage.builder()
        .videoId(12345L)
        .lessonId(6789L)
        .bucketName("my-elearning-course-videos")
        .objectName("videos/7084276710183.mp4")
        .build();

        kafkaProducerService.sendVideoTranscodingMessage(msg);

        return ResponseEntity.ok("Mock transcoding message sent to Kafka for videoId=" + msg.getVideoId());
    }
}
