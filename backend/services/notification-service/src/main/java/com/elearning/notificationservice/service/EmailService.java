package com.elearning.notificationservice.service;

public interface EmailService {
    void sendSimpleEmail(String to, String subject, String text);

    void sendHtmlEmail(String to, String subject, String htmlContent);

    void sendOTPEmail(String to, String otp);

    void sendTutorApprovalEmail(String to, String fullName);

    /**
     * Send notification to tutor when class is full
     */
    void sendClassFullNotificationToTutor(String to, String tutorName, String classTitle, int studentCount);

    /**
     * Send payment request to student when class is full
     */
    void sendPaymentRequestToStudent(String to, String studentName, String classTitle, Double pricePerHour,
            String tutorName);

    /**
     * Send payment success notification to student
     */
    void sendPaymentSuccessNotification(String to, String studentName, String tutorName, String classTitle, 
            java.math.BigDecimal amount, String currency);

    /**
     * Send new student enrollment notification to tutor
     */
    void sendNewStudentEnrollmentNotification(String to, String tutorName, String studentName, String classTitle);
}
