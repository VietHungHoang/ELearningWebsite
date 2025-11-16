package com.elearning.notificationservice.service;

public interface EmailService {
    void sendSimpleEmail(String to, String subject, String text);
    void sendHtmlEmail(String to, String subject, String htmlContent);
    void sendOTPEmail(String to, String otp);
}
