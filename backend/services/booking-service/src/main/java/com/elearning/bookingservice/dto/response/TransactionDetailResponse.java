package com.elearning.bookingservice.dto.response;

import com.elearning.bookingservice.entity.BookingStatus;
import com.elearning.bookingservice.entity.PaymentProvider;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDetailResponse {
    // Booking info
    private UUID id;
    private UUID transactionId;
    private String providerTransactionId;
    private Long amount;
    private Integer discount;
    private Integer pricePerSession;
    private Integer sessionsPurchased;
    private PaymentProvider paymentProvider;
    private BookingStatus status;
    private String schedule;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Student info
    private UUID studentId;

    // Tutor info
    private UUID tutorId;
    private String tutorName;

    // Class info
    private UUID classId;
    private String className;
    private String classType;
}
