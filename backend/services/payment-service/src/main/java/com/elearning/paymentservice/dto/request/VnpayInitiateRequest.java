package com.elearning.paymentservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for VNPay payment parameters.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VnpayInitiateRequest {

    private String vnp_Version;
    private String vnp_Command;
    private String vnp_TmnCode;
    private String vnp_Amount;
    private String vnp_CurrCode;
    private String vnp_TxnRef;
    private String vnp_OrderInfo;
    private String vnp_OrderType;
    private String vnp_Locale;
    private String vnp_ReturnUrl;
    private String vnp_IpnUrl;
    private String vnp_CreateDate;
    private String vnp_ExpireDate;
    private String vnp_SecureHash;
}