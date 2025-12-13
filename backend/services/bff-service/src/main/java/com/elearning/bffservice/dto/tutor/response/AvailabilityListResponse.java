package com.elearning.bffservice.dto.tutor.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityListResponse {
    private LocalDate from;
    private LocalDate to;
    private List<AvailabilityResponse> availabilities;
}