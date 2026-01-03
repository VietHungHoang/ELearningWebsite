package com.elearning.bookingservice.dto.request;

import com.elearning.bookingservice.entity.DiscountApplyTo;
import com.elearning.bookingservice.entity.DiscountType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateDiscountRequest {

    @NotBlank(message = "Code is required")
    @Size(max = 50, message = "Code must be at most 50 characters")
    private String code;

    @NotNull(message = "Type is required")
    private DiscountType type;

    @NotNull(message = "Discount value is required")
    @DecimalMin(value = "0.01", message = "Discount value must be positive")
    private BigDecimal discountValue;

    private BigDecimal maxDiscount;

    @Min(value = 1, message = "Max uses must be at least 1")
    private Integer maxUses;

    @Min(value = 1, message = "Max uses per user must be at least 1")
    private Integer maxUsesPerUser = 1;

    @DecimalMin(value = "0", message = "Min order value cannot be negative")
    private BigDecimal minOrderValue = BigDecimal.ZERO;

    @NotNull(message = "Apply to is required")
    private DiscountApplyTo applyTo;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;

    private String description;

    private List<String> applicableClasses; // Class IDs or "ALL"
}
