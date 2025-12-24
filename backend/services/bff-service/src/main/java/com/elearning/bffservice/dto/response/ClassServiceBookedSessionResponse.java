package com.elearning.bffservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * Response from class-service for booked sessions (without student details)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassServiceBookedSessionResponse {
    private String id;
    private List<UUID> studentIds;
    private UUID tutorId;
    private String sessionDatetime;
    private String className;
    private String sessionType;
    private String createdAt;
    private String updatedAt;
    private String meetingUrl;
    private String notes;
}
