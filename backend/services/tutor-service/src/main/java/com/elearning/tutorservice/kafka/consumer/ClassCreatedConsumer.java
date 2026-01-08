package com.elearning.tutorservice.kafka.consumer;

import com.elearning.tutorservice.dto.event.ClassCreatedForStudentEvent;
import com.elearning.tutorservice.service.TutorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

/**
 * Consumer for class creation events from class-service
 * Updates tutor's totalStudents count when a NEW class is created
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ClassCreatedConsumer {

    private static final String CLASS_CREATED_STUDENT_TOPIC = "class_created_student";
    
    private final TutorService tutorService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = CLASS_CREATED_STUDENT_TOPIC, groupId = "tutor-service-group")
    public void handleClassCreatedForStudent(String message) {
        try {
            log.info("Received class created for student event: {}", message);
            ClassCreatedForStudentEvent event = objectMapper.readValue(message, ClassCreatedForStudentEvent.class);
            
            // Handle new student enrollment: create StudentOfTutor record and increment totalStudents
            tutorService.handleNewStudentEnrollment(event.getTutorId(), event.getStudentId());
            
            log.info("Successfully handled student enrollment for tutorId: {}, studentId: {}, classId: {}", 
                    event.getTutorId(), event.getStudentId(), event.getClassId());
        } catch (Exception e) {
            log.error("Error processing class created for student event: {}", e.getMessage(), e);
        }
    }
}
