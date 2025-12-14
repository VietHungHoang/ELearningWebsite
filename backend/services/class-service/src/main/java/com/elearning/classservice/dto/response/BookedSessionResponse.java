package com.elearning.classservice.dto.response;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookedSessionResponse {
    private String id;
    private List<UUID> studentIds;
    private String sessionDatetime;
    private String className;
    private String sessionType;
    private String createdAt;
    private String updatedAt;
    private String meetingUrl;
    private String notes;
}