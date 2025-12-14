package com.elearning.classservice.mapper;

import com.elearning.classservice.dto.TrialSessionRequestResponse;
import com.elearning.classservice.entity.TrialSessionRequestEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper for TrialSessionRequest entities
 */
@Component
public class TrialSessionRequestMapper {

    /**
     * Convert TrialSessionRequestEntity to TrialSessionRequestResponse
     * @param entity the entity to convert
     * @return the response DTO
     */
    public TrialSessionRequestResponse toResponse(TrialSessionRequestEntity entity) {
        if (entity == null) {
            return null;
        }

        return TrialSessionRequestResponse.builder()
                .id(entity.getId())
                .sessionDateTime(entity.getSessionDateTime())
                .message(entity.getMessage())
                .status(entity.getStatus())
                .studentId(entity.getStudentId())
                .tutorId(entity.getTutorId())
                .sessionId(entity.getSessionId())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}