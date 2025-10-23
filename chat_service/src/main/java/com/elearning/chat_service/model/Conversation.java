package com.elearning.chat_service.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;

@Document(collection = "conversations")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Conversation {
    @Id
    private String id;
    private String courseId;
    private String learnerId;
    private String instructorId;
    private List<String> participantIds;
    private Instant createdAt;
}