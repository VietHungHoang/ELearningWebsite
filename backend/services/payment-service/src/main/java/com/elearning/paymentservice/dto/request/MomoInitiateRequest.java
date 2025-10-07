package com.elearning.paymentservice.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for initiating a MoMo payment (request body sent to MoMo's create payment endpoint).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MomoInitiateRequest {

    @NotBlank
    private String partnerCode;

    // @NotBlank
    // private String accessKey;

    @NotBlank
    private String requestId;

    @Min(1000)
    @Max(20000000)
    private Long amount;

    @NotBlank
    private String orderId;

    @NotBlank
    private String orderInfo;

    @NotBlank
    private String redirectUrl;

    @NotBlank
    private String ipnUrl;

    @Builder.Default
    private String requestType = "captureWallet";
    
    @Builder.Default
    private String extraData = "";

    @Builder.Default
    private String lang = "vi";

    @NotBlank
    private String signature;

}
