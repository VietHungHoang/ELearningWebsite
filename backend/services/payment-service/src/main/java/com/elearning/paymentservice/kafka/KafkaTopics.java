package com.elearning.paymentservice.kafka;

public final class KafkaTopics {

    // Payment events
    public static final String PAYMENT_COMPLETED = "payment_completed";
    public static final String PAYMENT_FAILED = "payment_failed";
    public static final String PAYMENT_REFUNDED = "payment_refunded";
    
    // Payment -> Booking events (Payment bắn cho Booking)
    public static final String PAYMENT_BOOKING_SUCCESS = "payment_booking_success";
    public static final String PAYMENT_BOOKING_FAILED = "payment_booking_failed";

    private KafkaTopics() {
        // Private constructor to prevent instantiation
    }
}