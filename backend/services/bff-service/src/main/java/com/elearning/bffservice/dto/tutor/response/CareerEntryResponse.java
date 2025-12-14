package com.elearning.bffservice.dto.tutor.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CareerEntryResponse {
    private UUID id;
    private String title;
    private String institution;
    private LocalDate startDate;
    private LocalDate endDate;
    private String location;
    private String description;
}