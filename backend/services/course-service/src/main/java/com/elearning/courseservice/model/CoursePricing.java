package com.elearning.courseservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "course_pricing")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class CoursePricing extends BaseEntity {
    
    @Id
    @Column(name = "course_id")
    private Long courseId;
    
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "course_id")
    private Course course;
    
    @DecimalMin(value = "0.00", message = "Price must be positive")
    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal basePrice = BigDecimal.ZERO;
    
    @Size(max = 3, message = "Currency must not exceed 3 characters")
    @Builder.Default
    private String currency = "USD";
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PricingType pricingType = PricingType.PAID;
    
    @Builder.Default
    private Boolean isTaxIncluded = false;
    
    @DecimalMin(value = "0.00", message = "Tax rate must be positive")
    @Column(precision = 5, scale = 4)
    @Builder.Default
    private BigDecimal taxRate = BigDecimal.ZERO;
    
    public enum PricingType {
        FREE, PAID, SUBSCRIPTION
    }
}