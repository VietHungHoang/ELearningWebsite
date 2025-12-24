package com.elearning.tutorservice.service.impl;

import com.elearning.tutorservice.dto.review.response.ModerationResult;
import com.elearning.tutorservice.enums.ReviewViolationType;
import com.elearning.tutorservice.service.GeminiModerationService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiModerationServiceImpl implements GeminiModerationService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.api-url:https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent}")
    private String apiUrl;

    @Override
    public ModerationResult moderateReview(String comment, Integer rating) {
        log.info("Moderating review with Gemini API");

        try {
            String prompt = buildModerationPrompt(comment, rating);
            String geminiResponse = callGeminiAPI(prompt);
            return parseGeminiResponse(geminiResponse);

        } catch (Exception e) {
            log.error("Error during review moderation: {}", e.getMessage(), e);
            // Default to approved if moderation fails (fail-open strategy)
            return ModerationResult.builder()
                    .approved(true)
                    .errorCode(ReviewViolationType.NONE.getCode())
                    .reason("Moderation service unavailable, auto-approved")
                    .confidence(0.0)
                    .build();
        }
    }

    private String buildModerationPrompt(String comment, Integer rating) {
        return String.format("""
                You are a content moderation AI for an online tutoring platform. 
                Analyze the following review and determine if it violates any policies.
                
                Review Rating: %d/5
                Review Comment: "%s"
                
                Check for the following violations:
                1. Profanity or offensive language (code: 1001)
                2. Spam or repetitive content (code: 1002)
                3. Personal information disclosure (code: 1003)
                4. Harassment or threats (code: 1004)
                5. Inappropriate/sexual content (code: 1005)
                6. Off-topic content (code: 1006)
                7. Fake or fraudulent review (code: 1007)
                8. Promotional/advertising content (code: 1008)
                
                Respond ONLY in JSON format:
                {
                  "approved": true/false,
                  "violationCode": 0 (if approved) or violation code (1001-1008),
                  "reason": "Brief explanation",
                  "confidence": 0.0-1.0
                }
                """, rating, comment);
    }

    private String callGeminiAPI(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(
                    Map.of("parts", List.of(
                            Map.of("text", prompt)
                    ))
            ));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            String url = apiUrl + "?key=" + apiKey;
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return extractTextFromResponse(response.getBody());
            }

            throw new RuntimeException("Gemini API returned non-success status: " + response.getStatusCode());

        } catch (Exception e) {
            log.error("Error calling Gemini API: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to call Gemini API", e);
        }
    }

    private String extractTextFromResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            return root.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        } catch (Exception e) {
            log.error("Error extracting text from Gemini response: {}", e.getMessage());
            throw new RuntimeException("Failed to parse Gemini response", e);
        }
    }

    private ModerationResult parseGeminiResponse(String responseText) {
        try {
            // Extract JSON from response (Gemini might wrap it in markdown code blocks)
            String jsonText = responseText.trim();
            if (jsonText.startsWith("```json")) {
                jsonText = jsonText.substring(7);
            }
            if (jsonText.startsWith("```")) {
                jsonText = jsonText.substring(3);
            }
            if (jsonText.endsWith("```")) {
                jsonText = jsonText.substring(0, jsonText.length() - 3);
            }
            jsonText = jsonText.trim();

            JsonNode result = objectMapper.readTree(jsonText);

            boolean approved = result.path("approved").asBoolean(true);
            int violationCode = result.path("violationCode").asInt(0);
            String reason = result.path("reason").asText("No violation detected");
            double confidence = result.path("confidence").asDouble(0.5);

            return ModerationResult.builder()
                    .approved(approved)
                    .errorCode(violationCode)
                    .reason(reason)
                    .confidence(confidence)
                    .build();

        } catch (Exception e) {
            log.error("Error parsing Gemini moderation response: {}", e.getMessage(), e);
            // Default to approved on parsing error
            return ModerationResult.builder()
                    .approved(true)
                    .errorCode(ReviewViolationType.NONE.getCode())
                    .reason("Failed to parse moderation result, auto-approved")
                    .confidence(0.0)
                    .build();
        }
    }
}
