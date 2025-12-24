package com.elearning.bookingservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * Request DTO for creating a class booking (class, enrollment, sessions)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateClassBookingRequest {

    private UUID tutorId;
    private UUID studentId;
    private Integer sessions;
    private Long pricePerHour;
    private List<ScheduleItem> schedule;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScheduleItem {
        private String time;
    }
}