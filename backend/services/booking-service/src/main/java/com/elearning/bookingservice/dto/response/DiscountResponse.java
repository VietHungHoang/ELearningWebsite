package com.elearning.bookingservice.dto.response;

import com.elearning.bookingservice.entity.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiscountResponse {

    private UUID id;
    private String code;
    private DiscountType type;
    private BigDecimal discountValue;
    private BigDecimal maxDiscount;
    private Integer maxUses;
    private Integer maxUsesPerUser;
    private Integer currentUses;
    private BigDecimal minOrderValue;
    private DiscountApplyTo applyTo;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private DiscountScope scope;
    private UUID createdBy;
    private CreatorRole createdByRole;
    private String description;
    private Boolean isActive;
    private List<String> applicableClasses;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static DiscountResponse from(Discount discount) {
        return DiscountResponse.builder()
                .id(discount.getId())
                .code(discount.getCode())
                .type(discount.getType())
                .discountValue(discount.getDiscountValue())
                .maxDiscount(discount.getMaxDiscount())
                .maxUses(discount.getMaxUses())
                .maxUsesPerUser(discount.getMaxUsesPerUser())
                .currentUses(discount.getCurrentUses())
                .minOrderValue(discount.getMinOrderValue())
                .applyTo(discount.getApplyTo())
                .startDate(discount.getStartDate())
                .endDate(discount.getEndDate())
                .scope(discount.getScope())
                .createdBy(discount.getCreatedBy())
                .createdByRole(discount.getCreatedByRole())
                .description(discount.getDescription())
                .isActive(discount.getIsActive())
                .createdAt(discount.getCreatedAt())
                .updatedAt(discount.getUpdatedAt())
                .build();
    }
}
