package com.elearning.paymentservice.kafka;

public final class KafkaTopics {

    // Payment events
    public static final String PAYMENT_COMPLETED = "payment_completed";
    public static final String PAYMENT_FAILED = "payment_failed";
    public static final String PAYMENT_REFUNDED = "payment_refunded";

    private KafkaTopics() {
        // Private constructor to prevent instantiation
    }
}