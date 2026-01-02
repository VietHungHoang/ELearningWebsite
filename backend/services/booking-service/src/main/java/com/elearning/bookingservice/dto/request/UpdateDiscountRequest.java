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
public class UpdateDiscountRequest {

    @Size(max = 50, message = "Code must be at most 50 characters")
    private String code;

    private DiscountType type;

    @DecimalMin(value = "0.01", message = "Discount value must be positive")
    private BigDecimal discountValue;

    private BigDecimal maxDiscount;

    @Min(value = 1, message = "Max uses must be at least 1")
    private Integer maxUses;

    @Min(value = 1, message = "Max uses per user must be at least 1")
    private Integer maxUsesPerUser;

    @DecimalMin(value = "0", message = "Min order value cannot be negative")
    private BigDecimal minOrderValue;

    private DiscountApplyTo applyTo;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private String description;

    private Boolean isActive;

    private List<String> applicableClasses;
}
