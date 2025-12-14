package com.elearning.tutorservice.dto.embedded;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassInfo {
    private UUID id;
    private String titleVi;
    private String titleEn;
    private String titleJa;
    private BigDecimal price;
    private String currency;
    private LocalDateTime scheduledAt;
}