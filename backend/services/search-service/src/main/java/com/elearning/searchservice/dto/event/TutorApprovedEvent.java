package com.elearning.searchservice.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorApprovedEvent {
    private UUID tutorId;
    private String email;
    private String fullName;
    private String avatarUrl;
}
