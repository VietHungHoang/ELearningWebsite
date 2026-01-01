package com.elearning.tutorservice.service;

import com.elearning.tutorservice.config.GeminiConfig;
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
public class GeminiService {
    
    private final GeminiConfig geminiConfig;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    /**
     * Parse resume text using Gemini API and return JSON matching TutorOnboardingDto structure
     * 
     * @param resumeText The extracted text from resume file
     * @param existingJsonData Existing onboarding JSON data (contains id, email, fullName)
     * @return JSON string matching TutorOnboardingDto structure
     */
    public String parseResumeToJson(String resumeText, String existingJsonData) {
        log.info("Parsing resume text with Gemini API. Text length: {}", resumeText.length());
        
        try {
            // Parse existing data to preserve id, email, fullName
            JsonNode existingData = objectMapper.readTree(existingJsonData);
            String id = existingData.has("id") ? existingData.get("id").asText() : "";
            String email = existingData.has("email") ? existingData.get("email").asText() : "";
            String fullName = existingData.has("fullName") ? existingData.get("fullName").asText() : "";
            
            // Build prompt for Gemini
            String prompt = buildPrompt(resumeText, id, email, fullName);
            
            // Call Gemini API
            String response = callGeminiApi(prompt);
            
            // Extract JSON from response
            String jsonResult = extractJsonFromResponse(response);
            
            log.info("Successfully parsed resume to JSON");
            return jsonResult;
            
        } catch (Exception e) {
            log.error("Failed to parse resume with Gemini", e);
            throw new RuntimeException("Failed to parse resume: " + e.getMessage(), e);
        }
    }
    
    private String buildPrompt(String resumeText, String id, String email, String fullName) {
        return """
            You are an AI assistant that extracts information from resumes and formats it as JSON.
            
            Extract information from the following resume text and return a JSON object with this exact structure:
            {
                "id": "%s",
                "email": "%s",
                "fullName": "%s",
                "headline": "Professional headline/title from resume",
                "introduction": "Brief introduction or summary from resume",
                "countryCode": "Two-letter country code (e.g., US, VN) if found",
                "gender": "MALE, FEMALE, or OTHER if mentioned, otherwise null",
                "educations": [
                    {
                        "title": "Degree name",
                        "institution": "University/School name",
                        "startDate": "YYYY-MM-DD format or null",
                        "endDate": "YYYY-MM-DD format or null",
                        "location": "Location if mentioned",
                        "description": "Additional details"
                    }
                ],
                "experiences": [
                    {
                        "title": "Job title",
                        "institution": "Company name",
                        "startDate": "YYYY-MM-DD format or null",
                        "endDate": "YYYY-MM-DD format or null",
                        "location": "Location if mentioned",
                        "description": "Job description/responsibilities"
                    }
                ],
                "certifications": [
                    {
                        "name": "Certification name",
                        "issuingOrganization": "Issuing organization",
                        "issueDate": "YYYY-MM-DD format or null",
                        "expirationDate": "YYYY-MM-DD format or null",
                        "credentialId": "Credential ID if mentioned",
                        "credentialUrl": "URL if mentioned"
                    }
                ],
                "socialLinks": [
                    {
                        "platform": "LINKEDIN, GITHUB, TWITTER, FACEBOOK, or OTHER",
                        "url": "URL"
                    }
                ]
            }
            
            Important rules:
            1. Keep id, email, and fullName exactly as provided: id="%s", email="%s", fullName="%s"
            2. If a field is not found in the resume, set it to null or empty array []
            3. For dates, use YYYY-MM-DD format. If only year is known, use YYYY-01-01
            4. Return ONLY the JSON object, no additional text or markdown
            
            Resume text:
            ---
            %s
            ---
            
            Return only valid JSON:
            """.formatted(id, email, fullName, id, email, fullName, resumeText);
    }
    
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
