package com.elearning.quiz.service;

import com.elearning.quiz.dto.GenerateQuestionsRequest;
import com.elearning.quiz.dto.QuizQuestionDto;
import com.elearning.quiz.dto.QuizQuestionOptionDto;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.IntStream;

@Service
public class AIQuestionGeneratorService {
    
    // Mock AI service - trong thực tế sẽ gọi OpenAI API hoặc AI service khác
    public List<QuizQuestionDto> generateQuestions(GenerateQuestionsRequest request) {
        System.out.println("🤖 AI Question Generator: Generating questions...");
        System.out.println("📝 Topic: " + request.getTopic());
        System.out.println("📄 Content: " + request.getContent());
        System.out.println("🔢 Number of questions: " + request.getNumberOfQuestions());
        System.out.println("📋 Question types: " + request.getQuestionTypes());
        System.out.println("⭐ Difficulty: " + request.getDifficultyLevel());
        
        List<QuizQuestionDto> questions = new ArrayList<>();
        
        // Generate questions based on request
        for (int i = 0; i < request.getNumberOfQuestions(); i++) {
            QuizQuestionDto question = generateSingleQuestion(request, i + 1);
            questions.add(question);
        }
        
        System.out.println("✅ Generated " + questions.size() + " questions successfully");
        return questions;
    }
    
    private QuizQuestionDto generateSingleQuestion(GenerateQuestionsRequest request, int questionNumber) {
        QuizQuestionDto question = new QuizQuestionDto();
        
        // Generate question based on topic and content
        String questionText = generateQuestionText(request, questionNumber);
        question.setQuestionText(questionText);
        
        // Generate options based on question type
        List<QuizQuestionOptionDto> options = generateOptions(request, questionNumber);
        question.setOptions(options);
        
        // Set correct answer
        String correctAnswer = determineCorrectAnswer(options);
        question.setCorrectAnswer(correctAnswer);
        
        question.setOrder(questionNumber);
        
        return question;
    }
    
    private String generateQuestionText(GenerateQuestionsRequest request, int questionNumber) {
        String topic = request.getTopic();
        String content = request.getContent();
        int difficulty = request.getDifficultyLevel();
        
        // Sample question templates based on topic and difficulty
        List<String> questionTemplates = getQuestionTemplates(topic, difficulty);
        String template = questionTemplates.get((questionNumber - 1) % questionTemplates.size());
        
        // Replace placeholders with actual content
        return template.replace("{topic}", topic)
                      .replace("{content}", content)
                      .replace("{number}", String.valueOf(questionNumber));
    }
    
    private List<String> getQuestionTemplates(String topic, int difficulty) {
        List<String> templates = new ArrayList<>();
        
        if (topic.toLowerCase().contains("goal") || topic.toLowerCase().contains("mục tiêu")) {
            templates.addAll(Arrays.asList(
                "Mục tiêu SMART có nghĩa là gì?",
                "Bước đầu tiên trong việc thiết lập mục tiêu hiệu quả là gì?",
                "Tại sao việc viết mục tiêu ra giấy lại quan trọng?",
                "Mục tiêu dài hạn nên được chia thành bao nhiêu mục tiêu ngắn hạn?",
                "Yếu tố nào quan trọng nhất trong việc đạt được mục tiêu?"
            ));
        } else if (topic.toLowerCase().contains("focus") || topic.toLowerCase().contains("tập trung")) {
            templates.addAll(Arrays.asList(
                "Kỹ thuật Pomodoro hoạt động như thế nào?",
                "Môi trường làm việc lý tưởng để tập trung cần có những yếu tố gì?",
                "Tại sao việc nghỉ ngơi định kỳ lại giúp tăng khả năng tập trung?",
                "Phương pháp nào hiệu quả nhất để loại bỏ phiền nhiễu?",
                "Thời gian tập trung tối ưu của não bộ là bao lâu?"
            ));
        } else if (topic.toLowerCase().contains("time") || topic.toLowerCase().contains("thời gian")) {
            templates.addAll(Arrays.asList(
                "Ma trận Eisenhower phân loại công việc như thế nào?",
                "Nguyên tắc 80/20 áp dụng trong quản lý thời gian như thế nào?",
                "Tại sao việc lập kế hoạch hàng ngày lại quan trọng?",
                "Phương pháp nào giúp ước lượng thời gian thực hiện công việc chính xác nhất?",
                "Làm thế nào để cân bằng giữa công việc và cuộc sống cá nhân?"
            ));
        } else {
            // Generic templates
            templates.addAll(Arrays.asList(
                "Câu hỏi cơ bản về {topic}?",
                "Yếu tố quan trọng nhất của {topic} là gì?",
                "Làm thế nào để áp dụng {topic} hiệu quả?",
                "Thách thức chính khi thực hiện {topic} là gì?",
                "Lợi ích của việc sử dụng {topic} là gì?"
            ));
        }
        
        return templates;
    }
    
    private List<QuizQuestionOptionDto> generateOptions(GenerateQuestionsRequest request, int questionNumber) {
        List<QuizQuestionOptionDto> options = new ArrayList<>();
        
        // Generate 4 options (A, B, C, D)
        String[] optionLabels = {"A", "B", "C", "D"};
        String[] optionTexts = generateOptionTexts(request, questionNumber);
        
        for (int i = 0; i < 4; i++) {
            QuizQuestionOptionDto option = new QuizQuestionOptionDto();
            option.setText(optionTexts[i]);
            option.setIsCorrect(i == 0); // First option is correct by default
            option.setOrder(i + 1);
            options.add(option);
        }
        
        return options;
    }
    
    private String[] generateOptionTexts(GenerateQuestionsRequest request, int questionNumber) {
        String topic = request.getTopic();
        
        // Sample option texts based on topic
        if (topic.toLowerCase().contains("goal") || topic.toLowerCase().contains("mục tiêu")) {
            return new String[]{
                "Specific, Measurable, Achievable, Relevant, Time-bound",
                "Simple, Manageable, Attainable, Realistic, Timely",
                "Strategic, Meaningful, Actionable, Realistic, Trackable",
                "Systematic, Measurable, Achievable, Relevant, Time-sensitive"
            };
        } else if (topic.toLowerCase().contains("focus") || topic.toLowerCase().contains("tập trung")) {
            return new String[]{
                "25 phút làm việc, 5 phút nghỉ",
                "45 phút làm việc, 15 phút nghỉ",
                "60 phút làm việc, 10 phút nghỉ",
                "90 phút làm việc, 30 phút nghỉ"
            };
        } else if (topic.toLowerCase().contains("time") || topic.toLowerCase().contains("thời gian")) {
            return new String[]{
                "Quan trọng và khẩn cấp",
                "Quan trọng nhưng không khẩn cấp",
                "Không quan trọng nhưng khẩn cấp",
                "Không quan trọng và không khẩn cấp"
            };
        } else {
            return new String[]{
                "Phương án A - Đúng",
                "Phương án B - Sai",
                "Phương án C - Sai",
                "Phương án D - Sai"
            };
        }
    }
    
    private String determineCorrectAnswer(List<QuizQuestionOptionDto> options) {
        for (int i = 0; i < options.size(); i++) {
            if (options.get(i).getIsCorrect()) {
                return String.valueOf((char) ('A' + i));
            }
        }
        return "A"; // Default to first option
    }
}
