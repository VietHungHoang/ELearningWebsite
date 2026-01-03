package com.elearning.bookingservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "discount_conditions")
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiscountCondition extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "discount_id", nullable = false)
    private Discount discount;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition_type", nullable = false, length = 50)
    private ConditionType conditionType;

    @Column(name = "condition_value", nullable = false)
    private String conditionValue;
}
