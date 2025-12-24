package com.elearning.studentservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingResponse {

    private UUID bookingId;
    private UUID paymentId;
    private String paymentUrl;
}