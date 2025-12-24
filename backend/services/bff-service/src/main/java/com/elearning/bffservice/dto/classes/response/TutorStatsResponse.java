package com.elearning.bffservice.dto.classes.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TutorStatsResponse {
    private UUID tutorId;
    private int bookedSessionsCount;
    private int studentCount;
    private boolean hasTrialSession;
}