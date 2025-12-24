package com.elearning.paymentservice.dto.sepay;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SepayCustomer {
    
    private String phone;
    private String email;
}
