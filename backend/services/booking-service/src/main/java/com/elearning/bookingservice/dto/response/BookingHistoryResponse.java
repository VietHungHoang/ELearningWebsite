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
public class BookingHistoryResponse {
    private UUID id;
    private UUID studentId;
    private UUID tutorId;
    private UUID classId;
    private Integer sessionsPurchased;
    private Integer discount;
    private Integer pricePerSession;
    private Long amount;
    private PaymentProvider paymentProvider;
    private UUID transactionId;
    private String providerTransactionId;
    private String schedule;
    private BookingStatus status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Additional info to be populated
    private String tutorName;
    private String className;
    private String classType;
}
