package com.elearning.studentservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "booking_history")
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking extends BaseEntity {

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "tutor_id", nullable = false)
    private UUID tutorId;

    @Column(name = "class_id", nullable = false)
    private UUID classId;

    // Package information
    @Column(name = "sessions_purchased")
    private Integer sessionsPurchased;

    @Column(name = "discount")
    private Integer discount;

    @Column(name = "price_per_session")
    private Integer pricePerSession;

    @Column(name = "amount")
    private Long amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_provider")
    private PaymentProvider paymentProvider;

    @Column(name = "schedule", columnDefinition = "TEXT")
    private String schedule;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "notes")
    private String notes;
}