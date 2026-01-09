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

    @Override
    public void sendClassFullNotificationToTutor(String to, String tutorName, String classTitle, int studentCount) {
        String subject = "🎉 Lớp học \"" + classTitle + "\" đã đủ học sinh!";
        String htmlContent = "<html><body style='font-family: Arial, sans-serif;'>" +
                "<h2 style='color: #2e7d32;'>Xin chào " + tutorName + "!</h2>" +
                "<p>Lớp học <strong>\"" + classTitle + "\"</strong> của bạn đã có đủ <strong>" + studentCount
                + " học sinh</strong> đăng ký.</p>" +
                "<div style='background-color: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;'>" +
                "<p style='margin: 0;'><strong>Trạng thái:</strong> Đang chờ thanh toán từ học sinh</p>" +
                "</div>" +
                "<p>Chúng tôi sẽ thông báo cho bạn khi tất cả học sinh đã hoàn tất thanh toán và lớp học sẵn sàng bắt đầu.</p>"
                +
                "<p>Trân trọng,<br><strong>Đội ngũ E-Learning</strong></p>" +
                "</body></html>";

        sendHtmlEmail(to, subject, htmlContent);
    }

    @Override
    public void sendPaymentRequestToStudent(String to, String studentName, String classTitle, Double pricePerHour,
            String tutorName) {
        String formattedPrice = pricePerHour != null ? String.format("%,.0f VNĐ/giờ", pricePerHour) : "N/A";
        String subject = "💳 Yêu cầu thanh toán cho lớp \"" + classTitle + "\"";
        String htmlContent = "<html><body style='font-family: Arial, sans-serif;'>" +
                "<h2 style='color: #1565c0;'>Xin chào " + studentName + "!</h2>" +
                "<p>Lớp học <strong>\"" + classTitle + "\"</strong> do gia sư <strong>" + tutorName
                + "</strong> giảng dạy đã có đủ học sinh đăng ký.</p>" +
                "<div style='background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;'>" +
                "<p style='margin: 0 0 10px 0;'><strong>Thông tin thanh toán:</strong></p>" +
                "<p style='margin: 0;'>Học phí: <strong>" + formattedPrice + "</strong></p>" +
                "</div>" +
                "<p style='color: #d32f2f;'><strong>⚠️ Vui lòng hoàn tất thanh toán sớm để lớp học có thể bắt đầu.</strong></p>"
                +
                "<p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>" +
                "<p>Trân trọng,<br><strong>Đội ngũ E-Learning</strong></p>" +
                "</body></html>";

        sendHtmlEmail(to, subject, htmlContent);
    }

    @Override
    public void sendPaymentSuccessNotification(String to, String studentName, String tutorName, String classTitle,
            java.math.BigDecimal amount, String currency) {
        String formattedAmount = amount != null ? String.format("%,.0f %s", amount, currency != null ? currency : "VNĐ") : "N/A";
        String subject = "✅ Thanh toán thành công - " + classTitle;
        String htmlContent = "<html><body style='font-family: Arial, sans-serif;'>" +
                "<h2 style='color: #2e7d32;'>Xin chào " + studentName + "!</h2>" +
                "<p>Thanh toán của bạn đã được xử lý thành công.</p>" +
                "<div style='background-color: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;'>" +
                "<p style='margin: 0 0 10px 0;'><strong>Thông tin giao dịch:</strong></p>" +
                "<p style='margin: 0 0 5px 0;'>Lớp học: <strong>" + classTitle + "</strong></p>" +
                "<p style='margin: 0 0 5px 0;'>Giáo viên: <strong>" + tutorName + "</strong></p>" +
                "<p style='margin: 0;'>Số tiền: <strong>" + formattedAmount + "</strong></p>" +
                "</div>" +
                "<p>Lớp học của bạn sẽ sớm được bắt đầu. Chúng tôi sẽ thông báo cho bạn khi có thông tin chi tiết.</p>" +
                "<p>Trân trọng,<br><strong>Đội ngũ E-Learning</strong></p>" +
                "</body></html>";

        sendHtmlEmail(to, subject, htmlContent);
    }

    @Override
    public void sendNewStudentEnrollmentNotification(String to, String tutorName, String studentName, String classTitle) {
        String subject = "🎓 Học sinh mới đăng ký lớp \"" + classTitle + "\"";
        String htmlContent = "<html><body style='font-family: Arial, sans-serif;'>" +
                "<h2 style='color: #1565c0;'>Xin chào " + tutorName + "!</h2>" +
                "<p>Bạn có một học sinh mới đã đăng ký vào lớp học của bạn.</p>" +
                "<div style='background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;'>" +
                "<p style='margin: 0 0 10px 0;'><strong>Thông tin học sinh:</strong></p>" +
                "<p style='margin: 0 0 5px 0;'>Tên học sinh: <strong>" + studentName + "</strong></p>" +
                "<p style='margin: 0;'>Lớp học: <strong>" + classTitle + "</strong></p>" +
                "</div>" +
                "<p>Hãy chuẩn bị sẵn sàng cho buổi học đầu tiên với học sinh mới của bạn!</p>" +
                "<p>Trân trọng,<br><strong>Đội ngũ E-Learning</strong></p>" +
                "</body></html>";

        sendHtmlEmail(to, subject, htmlContent);
    }
}
