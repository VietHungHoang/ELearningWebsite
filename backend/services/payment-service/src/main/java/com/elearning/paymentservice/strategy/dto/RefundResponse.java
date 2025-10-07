package com.elearning.paymentservice.strategy.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RefundResponse {
    private String refundId;
    private String status;
}
