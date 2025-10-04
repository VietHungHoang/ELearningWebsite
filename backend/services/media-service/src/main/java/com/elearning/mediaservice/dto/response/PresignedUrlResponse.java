package com.elearning.mediaservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PresignedUrlResponse {
    
    private String objectKey;
    private String presignedUrl;
    private String finalUrl;
    private LocalDateTime expiresAt;
}
