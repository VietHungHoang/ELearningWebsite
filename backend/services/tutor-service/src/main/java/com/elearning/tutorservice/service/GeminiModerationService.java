package com.elearning.tutorservice.service;

import com.elearning.tutorservice.dto.review.response.ModerationResult;

public interface GeminiModerationService {
    
    /**
     * Moderate review content using Gemini API
     * @param comment Review comment to moderate
     * @param rating Review rating
     * @return Moderation result with approval status and violation details
     */
    ModerationResult moderateReview(String comment, Integer rating);
}
