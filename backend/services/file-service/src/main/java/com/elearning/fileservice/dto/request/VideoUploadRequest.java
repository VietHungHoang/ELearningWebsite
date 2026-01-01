package com.elearning.fileservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VideoUploadRequest {
    
    @NotBlank(message = "Content type is required")
    @Pattern(regexp = "^video/(mp4|quicktime|x-msvideo|webm|x-ms-wmv)$", 
             message = "Content type must be video/mp4, video/quicktime, video/x-msvideo, video/webm, or video/x-ms-wmv")
    private String contentType;
}