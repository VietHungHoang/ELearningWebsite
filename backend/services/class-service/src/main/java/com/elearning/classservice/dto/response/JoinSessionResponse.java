package com.elearning.classservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JoinSessionResponse {
    private String sessionId;
    private String status; // PRESENT for student, BOOKED for tutor
    private String message;
    private String zoomJoinUrl;
    private String zoomPassword;
    private String meetingLink;
    private String attendanceStatus; // PRESENT, ABSENT, etc.
}
