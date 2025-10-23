package com.elearning.chat_service.service;

public interface EnrollmentEventService {
    void createConversationIfNotExists(String learnerId, String instructorId, String courseId);
}