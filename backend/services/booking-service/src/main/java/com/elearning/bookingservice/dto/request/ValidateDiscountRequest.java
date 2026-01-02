package com.elearning.bookingservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidateDiscountRequest {

    @NotBlank(message = "Code is required")
    private String code;

    private UUID classId;

    private String bookingType; // ENROLLMENT or SESSION

    @NotNull(message = "Amount is required")
    private BigDecimal amount;
}
