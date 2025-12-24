package com.elearning.classservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Response DTO for creating a class booking
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateClassBookingResponse {

    private UUID classId;
}