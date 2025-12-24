package com.elearning.paymentservice.dto.sepay;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SepayOrder {
    
    @JsonProperty("order_id")
    private String orderId;
    
    @JsonProperty("order_amount")
    private BigDecimal orderAmount;
    
    @JsonProperty("order_description")
    private String orderDescription;
    
    @JsonProperty("order_status")
    private String orderStatus;
}
