package com.elearning.classservice.mapper;

import com.elearning.classservice.dto.TrialSessionRequestResponse;
import com.elearning.classservice.dto.response.UserInfoResponse;
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

        UserInfoResponse student = UserInfoResponse.builder()
                .id(entity.getStudent().getId().toString())
                .fullName(entity.getStudent().getFullName())
                .avatarUrl(entity.getStudent().getAvatarUrl())
                .build();

        UserInfoResponse tutor = UserInfoResponse.builder()
                .id(entity.getTutor().getId().toString())
                .fullName(entity.getTutor().getFullName())
                .avatarUrl(entity.getTutor().getAvatarUrl())
                .build();

        return TrialSessionRequestResponse.builder()
                .id(entity.getId())
                .sessionDateTime(entity.getSessionDateTime())
                .message(entity.getMessage())
                .status(entity.getStatus())
                .student(student)
                .tutor(tutor)
                .sessionId(entity.getSessionId())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}