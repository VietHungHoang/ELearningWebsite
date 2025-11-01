package com.elearning.notificationservice.util;

import java.util.Map;

public class EmailTemplateUtil {

    public static String buildTemplate(String type, Map<String, Object> metadata) {
        return switch (type) {
            case "ORDER_SUCCESS" -> orderSuccess(
                    (String) metadata.getOrDefault("title", "Thông báo"),
                    (String) metadata.getOrDefault("message", ""),
                    (String) metadata.getOrDefault("courseName", null));
            case "COURSE_UPDATE" -> courseUpdate(
                    (String) metadata.getOrDefault("title", "Cập nhật khoá học"),
                    (String) metadata.getOrDefault("message", ""),
                    (String) metadata.getOrDefault("courseName", null));
            case "QUIZ_RESULT" -> quizResult(
                    (String) metadata.getOrDefault("title", "Kết quả Quiz"),
                    (String) metadata.getOrDefault("learnerName", "Học viên"),
                    (String) metadata.getOrDefault("courseName", "Khoá học"),
                    (int) metadata.getOrDefault("score", 0));
            default -> baseWrapper(
                    "<h2>Thông báo</h2><p>" +
                            (String) metadata.getOrDefault("message", "Bạn có thông báo mới.") +
                            "</p>");
        };
    }

    /**
     * Template cho email ORDER_SUCCESS
     */
    public static String orderSuccess(String title, String message, String courseName) {
        return baseWrapper(
                "<h2>" + title + "</h2>" +
                        "<p>" + message + "</p>" +
                        (courseName != null ? "<p>Khoá học: <strong>" + courseName + "</strong></p>" : "") +
                        "<a href='http://localhost:5173/my-courses' class='btn'>Bắt đầu học ngay</a>");
    }
    public static String courseUpdate(String title, String message, String courseName) {
        return baseWrapper(
                "<h2>" + title + "</h2>" +
                        "<p>Khoá học <strong>" + courseName + "</strong> đã được cập nhật:</p>" +
                        "<p>" + message + "</p>" +
                        "<a href='http://localhost:5173/my-courses' class='btn'>Xem chi tiết</a>");
    }
    public static String quizResult(String title, String learnerName, String courseName, int score) {
        return baseWrapper(
                "<h2>" + title + "</h2>" +
                        "<p>Xin chào <strong>" + learnerName + "</strong>,</p>" +
                        "<p>Bạn vừa hoàn thành bài quiz trong khoá học <strong>" + courseName + "</strong>.</p>" +
                        "<p>Điểm của bạn: <strong style='color:blue;'>" + score + " / 100</strong></p>" +
                        "<a href='http://localhost:5173/my-quizzes' class='btn'>Xem kết quả chi tiết</a>");
    }
    private static String baseWrapper(String content) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "  <meta charset='UTF-8'>" +
                "  <style>" +
                "    body { font-family: Arial, sans-serif; line-height: 1.6; }" +
                "    .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }"
                +
                "    h2 { color: #4CAF50; }" +
                "    .footer { font-size: 12px; color: gray; margin-top: 20px; }" +
                "    .btn { display: inline-block; background-color: #4CAF50; color: white; padding: 10px 18px; border-radius: 5px; text-decoration: none; }"
                +
                "  </style>" +
                "</head>" +
                "<body>" +
                "  <div class='container'>" +
                content +
                "    <hr>" +
                "    <p class='footer'>Cảm ơn bạn đã tin tưởng và sử dụng LMS của chúng tôi.</p>" +
                "  </div>" +
                "</body>" +
                "</html>";
    }
}
