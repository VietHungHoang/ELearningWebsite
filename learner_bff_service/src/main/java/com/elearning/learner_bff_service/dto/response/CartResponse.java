package com.elearning.learner_bff_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse {

    private Long cartId;
    private Long accountId;
    private Integer itemCount;
    private Double totalPrice;
    private List<Map<String, Object>> items;
}
