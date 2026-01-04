package com.elearning.tutorservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CareerEntryRequest {
    
    private String type; // 'EDUCATION' or 'EXPERIENCE'
    private String title; // Degree name or Position
    private String institution; // School or Company name
    private LocalDate startDate;
    private LocalDate endDate; // Null if ongoing
    private String location;
    private String description;
}
