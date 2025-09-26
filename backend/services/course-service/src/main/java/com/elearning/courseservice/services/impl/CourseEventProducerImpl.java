package com.elearning.courseservice.services.impl;

import com.elearning.courseservice.constants.KafkaTopicNames;
import com.elearning.courseservice.services.CourseEventProducer;

import com.elearning.courseservice.events.CourseCreatedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class CourseEventProducerImpl implements CourseEventProducer {
    private static final Logger LOGGER = LoggerFactory.getLogger(CourseEventProducer.class);

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public CourseEventProducerImpl(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public void sendCourseCreatedEvent(CourseCreatedEvent event) {
        LOGGER.info(String.format("Producing message -> %s", event.toString()));

        // Gửi message tới topic COURSE_EVENTS.
        // Key của message là event.getCourseId().
        // Tất cả các event của cùng một courseId sẽ đi vào cùng một partition.
        this.kafkaTemplate.send(KafkaTopicNames.COURSE_EVENTS, event.getCourseId().toString(), event);
    }
}