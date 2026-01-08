package com.elearning.classservice.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingPaymentSuccessEvent {
    
    private UUID bookingId;
    private UUID classId;
    private UUID transactionId;
    private String providerTransactionId;
    
    // New fields for class creation
    private UUID tutorId;
    private UUID studentId;
    private String tutorName; // For class title generation
    private String locale; // For class title localization (vi/en)
    private String schedule; // cron expression or JSON
    private Integer sessionsPurchased;
    private String notes;
}
