package com.elearning.learner_service.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistRequest {
    private Long accountId;
    private Long courseId;
}
