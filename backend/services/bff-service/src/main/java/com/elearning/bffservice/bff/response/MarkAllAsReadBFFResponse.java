package com.elearning.bffservice.bff.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarkAllAsReadBFFResponse {

    private String userId;
    private Long updatedCount;
    private String message;
}