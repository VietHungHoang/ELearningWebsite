package com.elearning.fileservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InitiateUploadResponse {
    
    private Long videoId;
    private String uploadId; // AWS multipart upload ID
    private List<String> presignedUrls; // URLs for each chunk
    private Integer chunkSize; // Size of each chunk in bytes
    private Integer totalChunks; // Total number of chunks
}
