package com.elearning.bffservice.dto.response;

import com.elearning.bffservice.dto.response.enums.ScheduleStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookedSessionResponse {
    private UUID id;
    private UUID studentId;
    private String studentName;
    private String studentAvatarUrl;
    private LocalDateTime sessionDatetime;
    private Integer durationMinutes;
    private String className;
    private String sessionType;
    private ScheduleStatus status;
    private String meetingUrl;
    private String notes;
    private LocalDateTime bookedAt;
    private LocalDateTime updatedAt;
}
