package com.elearning.chatservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for getting conversations with pagination and search
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetConversationsRequest {

    private String search;

    @Builder.Default
    private int page = 0;

    @Builder.Default
    private int size = 20;
}