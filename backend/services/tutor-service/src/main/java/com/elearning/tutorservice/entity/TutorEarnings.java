package com.elearning.tutorservice.entity;

 import com.elearning.tutorservice.entity.enums.ClassType;
 import jakarta.persistence.*;
 import lombok.AllArgsConstructor;
 import lombok.Builder;
 import lombok.Data;
 import lombok.EqualsAndHashCode;
 import lombok.NoArgsConstructor;

 import java.math.BigDecimal;
 import java.time.LocalDateTime;
 import java.util.UUID;

 @Entity
 @Table(name = "tutor_earnings")
 @Data
 @EqualsAndHashCode(callSuper = true)
 @Builder
 @NoArgsConstructor
 @AllArgsConstructor
 public class TutorEarnings extends BaseEntity {

     @Column(name = "tutor_id", nullable = false)
     private UUID tutorId;

     @Column(name = "session_id", nullable = false)
     private UUID sessionId;

     @Column(name = "amount", nullable = false, precision = 10, scale = 2)
     private BigDecimal amount;

     @Enumerated(EnumType.STRING)
     private ClassType classType;
    @Column(name = "class_name")
    private String className;
     @Enumerated(EnumType.STRING)
     @Column(name = "status", nullable = false)
     @Builder.Default
     private EarningsStatus status = EarningsStatus.PENDING;

     @Column(name = "paid_at")
     private LocalDateTime paidAt;

     @Column(name = "payment_id")
     private UUID paymentId;

     @Column(name = "notes")
     private String notes;

     public enum EarningsStatus {
         PENDING,
         PROCESSING,
         PAID,
         CANCELLED
     }
 }