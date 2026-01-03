package com.elearning.quizservice.service;

import com.elearning.quizservice.config.GeminiConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiQuizService {
    
    private final GeminiConfig geminiConfig;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    /**
     * Generate quiz from user prompt using Gemini API
     * 
     * @param prompt User's quiz generation request
     * @return Quiz JSON string
     */
    public String generateQuiz(String prompt) {
        log.info("Generating quiz from prompt using Gemini API. Prompt length: {}", prompt.length());
        
        try {
            // Build quiz generation prompt
            String fullPrompt = buildQuizPrompt(prompt);
            
            // Call Gemini API
            String response = callGeminiApi(fullPrompt);
            
            // Extract quiz JSON from response
            String quizJson = extractJsonFromResponse(response);
            
            log.info("Successfully generated quiz");
            return quizJson;
            
        } catch (Exception e) {
            log.error("Failed to generate quiz with Gemini", e);
            throw new RuntimeException("Failed to generate quiz: " + e.getMessage(), e);
        }
    }
    
    private String buildQuizPrompt(String userPrompt) {
        return """
            You are an AI assistant that generates educational quizzes in JSON format.
            
            Based on the following user request, generate a quiz with this exact JSON structure:
            {
                "title": "Quiz title",
                "description": "Brief quiz description",
                "questions": [
                    {
                        "text": "Question text",
                        "options": ["Option A", "Option B", "Option C", "Option D"],
                        "correctAnswer": 0,
                        "explanation": "Explanation of why this is the correct answer"
                    }
                ]
            }
            
            Important rules:
            1. Generate 5-10 questions based on the complexity requested
            2. Each question must have 4 options
            3. correctAnswer is the index (0-3) of the correct option
            4. Include clear explanations for each answer
            5. Return ONLY the JSON object, no additional text or markdown
            
            User request:
            ---
            %s
            ---
            
            Return only valid JSON:
            """.formatted(userPrompt);
    }
    
    /**
     * Call Gemini API with a prompt and return raw response
     * @param prompt The prompt to send to Gemini
     * @return Raw response from Gemini API
     */
    private String callGeminiApi(String prompt) {
        String url = geminiConfig.getApiUrl() + "?key=" + geminiConfig.getApiKey();
        
        // Build request body
        ObjectNode requestBody = objectMapper.createObjectNode();
        ArrayNode contents = objectMapper.createArrayNode();
        ObjectNode content = objectMapper.createObjectNode();
        ArrayNode parts = objectMapper.createArrayNode();
        ObjectNode part = objectMapper.createObjectNode();
        
        part.put("text", prompt);
        parts.add(part);
        content.set("parts", parts);
        contents.add(content);
        requestBody.set("contents", contents);
        
        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<String> entity;
        try {
            entity = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize request", e);
        }
        
        log.info("Calling Gemini API...");
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        
        if (response.getStatusCode().is2xxSuccessful()) {
            log.info("Gemini API call successful");
            return response.getBody();
        } else {
            throw new RuntimeException("Gemini API call failed with status: " + response.getStatusCode());
        }
    }
    
    private String extractJsonFromResponse(String geminiResponse) {
        try {
            JsonNode root = objectMapper.readTree(geminiResponse);
            
            // Navigate to candidates[0].content.parts[0].text
            JsonNode candidates = root.get("candidates");
            if (candidates != null && candidates.isArray() && candidates.size() > 0) {
                JsonNode content = candidates.get(0).get("content");
                if (content != null) {
                    JsonNode parts = content.get("parts");
                    if (parts != null && parts.isArray() && parts.size() > 0) {
                        String text = parts.get(0).get("text").asText();
                        
                        // Clean up the text - remove markdown code blocks if present
                        text = text.trim();
                        if (text.startsWith("```json")) {
                            text = text.substring(7);
                        } else if (text.startsWith("```")) {
                            text = text.substring(3);
                        }
                        if (text.endsWith("```")) {
                            text = text.substring(0, text.length() - 3);
                        }
                        text = text.trim();
                        
                        // Validate it's valid JSON
                        objectMapper.readTree(text);
                        
                        return text;
                    }
                }
            }
            
            throw new RuntimeException("Could not extract JSON from Gemini response");
            
        } catch (Exception e) {
            log.error("Failed to extract JSON from Gemini response: {}", geminiResponse, e);
            throw new RuntimeException("Failed to extract JSON from Gemini response", e);
        }
    }
}
