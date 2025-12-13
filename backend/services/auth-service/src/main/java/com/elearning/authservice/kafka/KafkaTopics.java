package com.elearning.authservice.kafka;

public final class KafkaTopics {

    // Notification topics
    public static final String NOTIFICATION_OTP_EMAIL = "notifications_otp_email";

    // User account topics
    public static final String ACCOUNT_CREATED = "user_account_created";
    public static final String TUTOR_ACCOUNT_CREATED = "tutor_account_created";
    public static final String STUDENT_ACCOUNT_CREATED = "student_account_created";

    // Role management topics
    public static final String TUTOR_ROLE_ASSIGNED = "tutor_role_assigned";

    private KafkaTopics() {
        // Private constructor to prevent instantiation
    }
}