package com.elearning.chat_service.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.Instant;
import java.util.List;

@Data
@Builder
public class ConversationResponse {
    private String id;
    private String courseId;
    private String learnerId;
    private String instructorId;
    private List<String> participantIds;
    private Instant createdAt;
}
