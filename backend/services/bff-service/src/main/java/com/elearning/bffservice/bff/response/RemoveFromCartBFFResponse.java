package com.elearning.bffservice.bff.response;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RemoveFromCartBFFResponse {
    private Long cartId;
    private Long courseId;
    private Integer itemCount;
    private BigDecimal totalAmount;
}