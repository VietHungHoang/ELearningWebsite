package com.elearning.classservice.mapper;

import com.elearning.classservice.dto.response.ClassBasicInfoResponse;
import com.elearning.classservice.dto.response.UserInfoResponse;
import com.elearning.classservice.dto.sessions.SessionResponse;
import com.elearning.classservice.entity.Session;
import com.elearning.classservice.entity.SessionParticipant;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SessionMapper {

    public SessionResponse toSessionResponse(Session session) {
        // Determine session type
        String sessionType;
        if (session.getIsTrial()) {
            sessionType = "TRIAL";
        } else if (session.getClassEntity() != null) {
            sessionType = session.getClassEntity().getClassType().name();
        } else {
            sessionType = "ONE_ON_ONE"; // Default
        }

        // Get class info
        ClassBasicInfoResponse classInfo = null;
        if (session.getClassEntity() != null) {
            classInfo = ClassBasicInfoResponse.builder()
                    .id(session.getClassEntity().getId().toString())
                    .title(session.getClassEntity().getTitle())
                    .build();
        }

        // Get tutor info
        UserInfoResponse tutorInfo = UserInfoResponse.builder()
                    .id(session.getTutor().getId().toString())
                    .fullName(session.getTutor().getFullName())
                    .avatarUrl(session.getTutor().getAvatarUrl())
                    .build();

        // Get student info
        List<UserInfoResponse> studentInfo = session.getParticipants().stream()
                .map(this::toUserInfoResponse)
                .toList();

        return SessionResponse.builder()
                .id(session.getId().toString())
                .sessionDatetime(session.getStartTime().toString())
                .classInfo(classInfo)
                .tutor(tutorInfo)
                .students(studentInfo)
                .sessionType(sessionType)
                .createdAt(session.getCreatedAt().toString())
                .updatedAt(session.getUpdatedAt().toString())
                .meetingUrl(session.getZoomJoinUrl())
                .notes(session.getNotes())
                .build();
    }

    public UserInfoResponse toUserInfoResponse(SessionParticipant sessionParticipant) {
        return UserInfoResponse.builder()
                .id(sessionParticipant.getStudent().getId().toString())
                .fullName(sessionParticipant.getStudent().getFullName())
                .avatarUrl(sessionParticipant.getStudent().getAvatarUrl())
                .build();
    }
}
