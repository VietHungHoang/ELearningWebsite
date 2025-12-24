package com.elearning.classservice.dto.sessions;

import java.util.List;

import com.elearning.classservice.dto.response.ClassBasicInfoResponse;
import com.elearning.classservice.dto.response.UserInfoResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionResponse {
    private String id;
    private List<UserInfoResponse> students;
    private UserInfoResponse tutor;
    private String sessionDatetime;
    private ClassBasicInfoResponse classInfo;

    /**
     * Type of the session.
     * <p>
     * Possible values:
     * - "TRIAL": Trial session
     * - "ONE_ON_ONE": One-on-one class session
     * - "GROUP": Group class session
     */
    private String sessionType;

    private String createdAt;
    private String updatedAt;
    private String meetingUrl;
    private String notes;
}