package com.elearning.paymentservice.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Sepay webhook payment notification
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SepayWebhookRequest {

    @JsonProperty("id")
    private Long id;  // ID giao dịch trên SePay

    @JsonProperty("gateway")
    private String gateway;  // Brand name của ngân hàng

    @JsonProperty("transactionDate")
    private String transactionDate;  // Thời gian xảy ra giao dịch phía ngân hàng

    @JsonProperty("accountNumber")
    private String accountNumber;  // Số tài khoản ngân hàng

    @JsonProperty("code")
    private String code;  // Mã code thanh toán

    @JsonProperty("content")
    private String content;  // Nội dung chuyển khoản

    @JsonProperty("transferType")
    private String transferType;  // Loại giao dịch: in/out

    @JsonProperty("transferAmount")
    private Long transferAmount;  // Số tiền giao dịch

    @JsonProperty("accumulated")
    private Long accumulated;  // Số dư tài khoản (lũy kế)

    @JsonProperty("subAccount")
    private String subAccount;  // Tài khoản ngân hàng phụ

    @JsonProperty("referenceCode")
    private String referenceCode;  // Mã tham chiếu của tin nhắn sms

    @JsonProperty("description")
    private String description;  // Toàn bộ nội dung tin nhắn sms
}
