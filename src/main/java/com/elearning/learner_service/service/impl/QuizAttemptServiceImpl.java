package com.elearning.learner_service.service.impl;

import com.elearning.learner_service.client.QuizServiceClient;
import com.elearning.learner_service.dto.request.QuizAttemptRequest;
import com.elearning.learner_service.dto.response.QuizAttemptResponse;
import com.elearning.learner_service.model.QuizAttempt;
import com.elearning.learner_service.repository.QuizAttemptRepository;
import com.elearning.learner_service.service.QuizAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizAttemptServiceImpl implements QuizAttemptService {

    private final QuizAttemptRepository quizAttemptRepository;
    private final QuizServiceClient quizServiceClient;

    @Override
    public QuizAttemptResponse createAttempt(QuizAttemptRequest request) {
        QuizAttempt attempt = QuizAttempt.builder()
                .accountId(request.getAccountId())
                .quizId(request.getQuizId())
                .score(request.getScore())
                .timeSpent(request.getTimeSpent())
                .attemptedAt(Instant.now().toEpochMilli())
                .build();

        QuizAttempt saved = quizAttemptRepository.save(attempt);
        return mapToResponse(saved);
    }

    @Override
    public List<QuizAttemptResponse> getMyAttempts(Long accountId) {
        return quizAttemptRepository.findByAccountId(accountId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private QuizAttemptResponse mapToResponse(QuizAttempt attempt) {
        Map<String, Object> quizInfo = quizServiceClient.getQuizInfo(attempt.getQuizId());

        Integer totalQuestions = (Integer) quizInfo.getOrDefault("totalQuestions", 0);
        Integer maxScore = (Integer) quizInfo.getOrDefault("maxScore", totalQuestions); // giả định mỗi câu 1 điểm
        Integer score = attempt.getScore() != null ? attempt.getScore().intValue() : 0;

        String result = score >= maxScore * 0.5 ? "Pass" : "Fail"; // ví dụ >=50% là Pass

        return QuizAttemptResponse.builder()
                .id(attempt.getId())
                .accountId(attempt.getAccountId())
                .quizId(attempt.getQuizId())
                .quizTitle((String) quizInfo.get("title"))
                .attemptedAt(attempt.getAttemptedAt())
                .totalQuestions(totalQuestions)
                .maxScore(maxScore)
                .score(score)
                .result(result)
                .build();
    }

}
