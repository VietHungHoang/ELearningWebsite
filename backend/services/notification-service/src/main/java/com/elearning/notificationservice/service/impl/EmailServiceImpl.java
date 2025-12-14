package com.elearning.notificationservice.service.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.elearning.notificationservice.service.EmailService;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
    }

    @Override
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = HTML

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    @Override
    public void sendOTPEmail(String to, String otp) {
        String subject = "Your OTP Code";
        String htmlContent = "<html><body>" +
                "<h2>Your OTP Code</h2>" +
                "<p>Your one-time password (OTP) is: <strong>" + otp + "</strong></p>" +
                "<p>This code will expire in 5 minutes.</p>" +
                "<p>If you did not request this code, please ignore this email.</p>" +
                "</body></html>";

        sendHtmlEmail(to, subject, htmlContent);
    }

    @Override
    public void sendTutorApprovalEmail(String to, String fullName) {
        String subject = "Congratulations! Your Tutor Application Has Been Approved";
        String htmlContent = "<html><body>" +
                "<h2>Congratulations, " + fullName + "!</h2>" +
                "<p>Your tutor application has been approved. You can now start teaching on our platform.</p>" +
                "<p>Welcome to our tutor community!</p>" +
                "<p>Best regards,<br>The E-Learning Team</p>" +
                "</body></html>";

        sendHtmlEmail(to, subject, htmlContent);
    }
}
