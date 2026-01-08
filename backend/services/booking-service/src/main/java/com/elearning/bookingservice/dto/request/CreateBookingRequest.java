package com.elearning.bookingservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * Request DTO for creating a booking
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingRequest {

    private UUID studentId;
    private Integer sessions;
    private Integer discount;
    private UUID tutorId;
    private String tutorName; // For class title generation
    private String locale; // For class title localization (vi/en)
    private List<ScheduleItem> schedule;
    private Long amount;
    private String paymentProvider;
    private String redirectUrl;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScheduleItem {
        private String time;
    }
}