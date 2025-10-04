package com.elearning.mediaservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompleteUploadRequest {
    
    @NotBlank(message = "Upload ID is required")
    private String uploadId;
    
    @NotNull(message = "ETags list is required")
    private List<String> etags;
}
