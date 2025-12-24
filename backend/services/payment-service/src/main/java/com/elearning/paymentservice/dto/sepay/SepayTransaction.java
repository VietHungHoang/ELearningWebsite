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
public class SepayTransaction {
    
    @JsonProperty("reference_number")
    private String referenceNumber;
    
    @JsonProperty("transaction_id")
    private String transactionId;
    
    private Long timestamp;
    
    private BigDecimal amount;
    
    @JsonProperty("account_number")
    private String accountNumber;
    
    @JsonProperty("sub_account_id")
    private String subAccountId;
    
    @JsonProperty("transfer_type")
    private String transferType;
    
    @JsonProperty("transfer_content")
    private String transferContent;
    
    @JsonProperty("reference_date")
    private String referenceDate;
    
    @JsonProperty("bank_brand_name")
    private String bankBrandName;
}
