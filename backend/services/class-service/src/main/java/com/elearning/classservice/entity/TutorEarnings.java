// package com.elearning.classservice.entity;

// import jakarta.persistence.*;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Data;
// import lombok.EqualsAndHashCode;
// import lombok.NoArgsConstructor;

// import java.math.BigDecimal;
// import java.time.LocalDateTime;
// import java.util.UUID;

// /**
//  * Entity để lưu thông tin thu nhập của tutor sau mỗi buổi dạy
//  */
// @Entity
// @Table(name = "tutor_earnings")
// @Data
// @EqualsAndHashCode(callSuper = true)
// @Builder
// @NoArgsConstructor
// @AllArgsConstructor
// public class TutorEarnings extends BaseEntity {

//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "tutor_id", nullable = false)
//     private Tutor tutor;

//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "session_id", nullable = false)
//     private Session session;

//     @Column(name = "student_id", nullable = false)
//     private UUID studentId;

//     @Column(name = "amount", nullable = false, precision = 10, scale = 2)
//     private BigDecimal amount;

//     @Enumerated(EnumType.STRING)
//     @Column(name = "status", nullable = false)
//     @Builder.Default
//     private EarningsStatus status = EarningsStatus.PENDING;

//     @Column(name = "paid_at")
//     private LocalDateTime paidAt;

//     @Column(name = "payment_reference")
//     private String paymentReference;

//     @Column(name = "notes")
//     private String notes;

//     public enum EarningsStatus {
//         PENDING,    // Chờ thanh toán
//         PAID,       // Đã thanh toán
//         CANCELLED   // Đã hủy
//     }
// }