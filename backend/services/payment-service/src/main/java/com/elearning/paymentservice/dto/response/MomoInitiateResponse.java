package com.elearning.paymentservice.dto.response;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MomoInitiateResponse {

    @NotBlank
    private String partnerCode;

    @NotBlank
    private String requestId;

    @NotBlank
    private String orderId;

    @NotNull
    @Min(0)
    private Long amount;

    @NotNull
    private Long responseTime;

    @NotBlank
    private String message;

    @NotNull
    private Integer resultCode;

    @NotBlank
    private String payUrl;

    private String deeplink;
    private String qrCodeUrl;
    private String deeplinkMiniApp;
    private String signature;
    private Long userFee;

}
