package com.elearning.bffservice.dto.classes.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookedSessionResponse {
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
