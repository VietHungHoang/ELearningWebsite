package com.elearning.contentservice.service.impl;

import com.elearning.contentservice.events.CourseCreatedEvent;
import com.elearning.contentservice.service.ContentService;

import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CourseEventListenerImpl {

    private static final Logger LOGGER = LoggerFactory.getLogger(CourseEventListenerImpl.class);

    private final ContentService contentService;
    // Annotation này biến method thành một Kafka consumer.
    @KafkaListener(
            topics = "course-events", // Lắng nghe topic "course-events"
            groupId = "content-service-group" // Thuộc consumer group đã định nghĩa trong application.yml
    )
    public void handleCourseCreatedEvent(CourseCreatedEvent event) {
        LOGGER.info(String.format("==> Received message: %s", event.toString()));

        // TODO: Xử lý logic nghiệp vụ
        // Ví dụ: gọi một service để tạo ra một cấu trúc nội dung (curriculum) rỗng
        // cho khóa học mới này.
        try {
            contentService.createBaseSectionForNewCourse(event.getCourseId());
            LOGGER.info(String.format("Successfully created empty curriculum for courseId: %s", event.getCourseId()));
        } catch (Exception e) {
            // Xử lý lỗi quan trọng ở đây!
            // Ví dụ: log lỗi nghiêm trọng để theo dõi
            LOGGER.error(String.format("Error processing course created event for courseId %s: %s", event.getCourseId(), e.getMessage()));
            // Chúng ta sẽ bàn về các chiến lược retry và dead-letter-queue sau.
        }
    }
}