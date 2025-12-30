package com.elearning.quizservice.service.impl;

import com.elearning.quizservice.dto.request.CreateQuestionRequest;
import com.elearning.quizservice.dto.response.QuestionResponse;
import com.elearning.quizservice.entity.Question;
import com.elearning.quizservice.entity.QuestionOption;
import com.elearning.quizservice.entity.Quiz;
import com.elearning.quizservice.exception.ResourceNotFoundException;
import com.elearning.quizservice.exception.ValidationException;
import com.elearning.quizservice.mapper.QuestionMapper;
import com.elearning.quizservice.repository.QuestionOptionRepository;
import com.elearning.quizservice.repository.QuestionRepository;
import com.elearning.quizservice.service.QuestionService;
import com.elearning.quizservice.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * Implementation of QuestionService
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {
    
    private final QuestionRepository questionRepository;
    private final QuestionOptionRepository optionRepository;
    private final QuizRepository quizRepository;
    private final QuestionMapper questionMapper;
    
    @Override
    @Transactional
    public QuestionResponse createQuestion(UUID quizId, CreateQuestionRequest request) {
        log.info("Creating question for quiz: {}", quizId);
        
        // Get quiz
        Quiz quiz = quizRepository.findByIdAndIsActiveTrue(quizId)
                .orElseThrow(() -> ResourceNotFoundException.quiz(quizId.toString()));
        
        // Get next order index
        Integer maxOrderIndex = questionRepository.findMaxOrderIndexByQuizId(quiz.getId());
        
        // Create question
        Question question = Question.builder()
                .quiz(quiz)
                .questionText(request.getQuestionText())
                .type(request.getType())
                .orderIndex(maxOrderIndex + 1)
                .explanation(request.getExplanation())
                .isActive(true)
                .build();
        
        question = questionRepository.save(question);
        
        // Create options
        List<QuestionOption> options = createOptions(question, request.getOptions());
        
        // Validate
        validateQuestion(question, options);
        
        log.info("Created question: {}", question.getId());
        return questionMapper.toResponse(question, options);
    }
    
    @Override
    public Question getQuestionById(UUID questionId) {
        return questionRepository.findByIdAndIsActiveTrue(questionId)
                .orElseThrow(() -> ResourceNotFoundException.question(questionId.toString()));
    }
    
    @Override
    public QuestionResponse getQuestionResponse(UUID questionId) {
        Question question = getQuestionById(questionId);
        List<QuestionOption> options = getQuestionOptions(questionId);
        return questionMapper.toResponse(question, options);
    }
    
    @Override
    public QuestionResponse getQuestionResponseForStudent(UUID questionId) {
        Question question = getQuestionById(questionId);
        List<QuestionOption> options = getQuestionOptions(questionId);
        return questionMapper.toStudentResponse(question, options);
    }
    
    @Override
    public List<Question> getQuestionsByQuizId(UUID quizId) {
        return questionRepository.findByQuiz_IdAndIsActiveTrueOrderByOrderIndexAsc(quizId);
    }
    
    @Override
    public List<QuestionResponse> getQuestionResponsesByQuizId(UUID quizId, boolean includeAnswers) {
        List<Question> questions = getQuestionsByQuizId(quizId);
        return questions.stream()
                .map(question -> {
                    List<QuestionOption> options = getQuestionOptions(question.getId());
                    return includeAnswers 
                            ? questionMapper.toResponse(question, options)
                            : questionMapper.toStudentResponse(question, options);
                })
                .toList();
    }
    
    @Override
    @Transactional
    public QuestionResponse updateQuestion(UUID questionId, CreateQuestionRequest request) {
        log.info("Updating question: {}", questionId);
        
        Question question = getQuestionById(questionId);
        
        // Update question fields
        question.setQuestionText(request.getQuestionText());
        question.setType(request.getType());
        question.setExplanation(request.getExplanation());
        
        question = questionRepository.save(question);
        
        // Delete old options and create new ones
        List<QuestionOption> oldOptions = getQuestionOptions(questionId);
        oldOptions.forEach(option -> option.setIsActive(false));
        optionRepository.saveAll(oldOptions);
        
        // Create new options
        List<QuestionOption> options = createOptions(question, request.getOptions());
        
        // Validate
        validateQuestion(question, options);
        
        log.info("Updated question: {}", questionId);
        return questionMapper.toResponse(question, options);
    }
    
    @Override
    @Transactional
    public void deleteQuestion(UUID questionId) {
        log.info("Deleting question: {}", questionId);
        
        Question question = getQuestionById(questionId);
        question.setIsActive(false);
        questionRepository.save(question);
        
        // Soft delete options
        List<QuestionOption> options = getQuestionOptions(questionId);
        options.forEach(option -> option.setIsActive(false));
        optionRepository.saveAll(options);
        
        log.info("Deleted question: {}", questionId);
    }
    
    @Override
    public List<QuestionOption> getQuestionOptions(UUID questionId) {
        return optionRepository.findByQuestion_IdAndIsActiveTrueOrderByOrderIndexAsc(questionId);
    }
    
    @Override
    public List<QuestionOption> getCorrectOptions(UUID questionId) {
        return optionRepository.findByQuestion_IdAndIsCorrectTrueAndIsActiveTrue(questionId);
    }
    
    @Override
    public void validateQuestion(Question question, List<QuestionOption> options) {
        // Validate minimum options
        if (options.size() < 2) {
            throw ValidationException.noOptions();
        }
        
        // Count correct answers
        long correctCount = options.stream().filter(QuestionOption::getIsCorrect).count();
        
        // Validate correct answers exist
        if (correctCount == 0) {
            throw ValidationException.noCorrectAnswer();
        }
        
        // Validate single choice has only one correct answer
        if (question.getType() == Question.QuestionType.SINGLE_CHOICE && correctCount > 1) {
            throw ValidationException.multipleCorrectAnswersForSingleChoice();
        }
    }
    
    /**
     * Create question options from request
     */
    private List<QuestionOption> createOptions(Question question, 
                                                List<CreateQuestionRequest.QuestionOptionRequest> optionRequests) {
        return IntStream.range(0, optionRequests.size())
                .mapToObj(index -> {
                    CreateQuestionRequest.QuestionOptionRequest optionRequest = optionRequests.get(index);
                    return QuestionOption.builder()
                            .question(question)
                            .optionText(optionRequest.getOptionText())
                            .orderIndex(index)
                            .isCorrect(optionRequest.getIsCorrect())
                            .isActive(true)
                            .build();
                })
                .collect(Collectors.toList());
    }
}
