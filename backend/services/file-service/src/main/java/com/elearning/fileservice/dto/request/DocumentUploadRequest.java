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
public class DocumentUploadRequest {
    
    @NotBlank(message = "Content type is required")
    @Pattern(regexp = "^(application/(pdf|msword|vnd\\.(openxmlformats-officedocument\\.(wordprocessingml\\.document|presentationml\\.presentation|spreadsheetml\\.sheet)|ms-(powerpoint|excel)))|text/plain)$", 
             message = "Content type must be a valid document type (pdf, doc, docx, ppt, pptx, xls, xlsx, txt)")
    private String contentType;
    
    private String description;
}
