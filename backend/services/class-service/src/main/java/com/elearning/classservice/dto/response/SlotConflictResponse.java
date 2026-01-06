package com.elearning.classservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response for slot conflict check
 * Contains two types of conflicts:
 * - tutorBusySlots: Slots where tutor is already teaching (should be hidden)
 * - studentBusySlots: Slots where student has classes with OTHER tutors (show
 * with warning)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SlotConflictResponse {
    /**
     * Slots where the tutor is already busy (has scheduled sessions)
     * Frontend should HIDE these slots completely
     */
    private List<String> tutorBusySlots;

    /**
     * Slots where the student has sessions with OTHER tutors
     * Frontend should SHOW these slots with warning style
     */
    private List<String> studentBusySlots;
}
