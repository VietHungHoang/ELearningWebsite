package com.elearning.learner_bff_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistResponse {
    private Long wishlistId;
    private Long accountId;
    private Long courseId;
    private java.time.LocalDateTime addedDate;
}
