package com.elearning.paymentservice.dto.sepay;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SepayIpnRequest {
    
    private Long timestamp;
    
    @JsonProperty("notification_type")
    private String notificationType;
    
    private SepayOrder order;
    private SepayTransaction transaction;
    private SepayCustomer customer;
}
