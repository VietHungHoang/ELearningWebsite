package com.elearning.paymentservice.strategy.impl;

import org.springframework.stereotype.Component;

import com.elearning.paymentservice.strategy.PaymentGatewayStrategy;
import com.elearning.paymentservice.strategy.dto.*;
import com.elearning.paymentservice.config.GatewayProperties;
import com.elearning.paymentservice.config.PaymentProvidersProperties;
import com.elearning.paymentservice.exception.ConfigurationException;
import com.elearning.paymentservice.exception.PaymentGatewayException;
import com.elearning.paymentservice.dto.request.InitiatePaymentRequest;
import com.elearning.paymentservice.dto.request.VnpayInitiateRequest;
import com.elearning.paymentservice.enums.PaymentGateway;

import com.elearning.paymentservice.util.CommonUtils;

import com.elearning.paymentservice.util.CryptoUtils;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Component
public class VnpayGatewayStrategy implements PaymentGatewayStrategy {

    private final GatewayProperties vnpayConfig;

    public VnpayGatewayStrategy(PaymentProvidersProperties paymentProvidersProperties) {
        this.vnpayConfig = paymentProvidersProperties.getProvider(PaymentGateway.VNPAY)
                .orElseThrow(() -> new ConfigurationException("Missing configuration for payment provider 'VNPay'"));
    }

    @Override
    public GatewayCreationResponse createPaymentIntent(InitiatePaymentRequest request) {
        if(CommonUtils.isNullOrEmpty(vnpayConfig.getHashSecret())) {
            throw new IllegalStateException("Missing hash secret for VNPay configuration");
        }

        String tmnCode = vnpayConfig.getTmnCode();
        String txnRef = request.getOrderId().toString();
        String amount = String.valueOf(request.getAmount().longValue() * 100); // VNPay amount in smallest unit
        String orderInfo = "Thanh toan don hang " + request.getOrderId();
        String returnUrl = request.getRedirectUrl();
        String ipnUrl = "http://localhost:8086/payment/callback";

        // VNPay requires Vietnam timezone (GMT+7) for createDate and expireDate
        java.time.ZonedDateTime now = java.time.ZonedDateTime.now(java.time.ZoneId.of("Asia/Ho_Chi_Minh"));
        String createDate = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String expireDate = now.plusMinutes(15).format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        VnpayInitiateRequest vnpayRequest = VnpayInitiateRequest.builder()
            .vnp_Version("2.1.0")
            .vnp_Command("pay")
            .vnp_TmnCode(tmnCode)
            .vnp_Amount(amount)
            .vnp_CurrCode("VND")
            .vnp_TxnRef(txnRef)
            .vnp_OrderInfo(orderInfo)
            .vnp_OrderType("other")
            .vnp_Locale("vn")
            .vnp_ReturnUrl(returnUrl)
            .vnp_IpnUrl(ipnUrl)
            .vnp_IpAddr("127.0.0.1") // Client IP address - required by VNPay
            .vnp_CreateDate(createDate)
            .vnp_ExpireDate(expireDate)
            .vnp_SecureHashType("SHA512")
            .build();

        String secureHash = createVnpaySignature(vnpayRequest);
        vnpayRequest.setVnp_SecureHash(secureHash);

        // Build payment URL
        String paymentUrl = buildVnpayUrl(vnpayRequest);

        return GatewayCreationResponse.builder()
                .paymentUrl(paymentUrl)
                .providerTransactionId(txnRef)
                .build();
    }

    @Override
    public StandardizedPaymentResult handleWebhook(WebhookPayload payload) {
        // Parse payload and map to standardized result. Simplified here.
        String responseCode = (String) payload.getRawPayload().getOrDefault("vnp_ResponseCode", "00");
        String status = "00".equals(responseCode) ? "SUCCESS" : "FAILED";
        return StandardizedPaymentResult.builder()
                .orderId((String) payload.getRawPayload().get("vnp_TxnRef"))
                .providerTransactionId((String) payload.getRawPayload().get("vnp_TransactionNo"))
                .status(status)
                .build();
    }

    @Override
    public RefundResponse createRefund(RefundRequest request) {
        // Call VNPay refund API; here we return a dummy response.
        return RefundResponse.builder()
                .refundId("REF-" + UUID.randomUUID())
                .status("PENDING")
                .build();
    }

    private String createVnpaySignature(VnpayInitiateRequest req) {
        String secretKey = vnpayConfig.getHashSecret();

        try {
            // VNPay requires URL encoding for BOTH keys and values in hashdata
            // Parameters must be sorted alphabetically by parameter name
            java.util.Map<String, String> params = new java.util.TreeMap<>();
            params.put("vnp_Amount", req.getVnp_Amount());
            params.put("vnp_Command", req.getVnp_Command());
            params.put("vnp_CreateDate", req.getVnp_CreateDate());
            params.put("vnp_CurrCode", req.getVnp_CurrCode());
            params.put("vnp_ExpireDate", req.getVnp_ExpireDate());
            params.put("vnp_IpAddr", req.getVnp_IpAddr());
            params.put("vnp_Locale", req.getVnp_Locale());
            params.put("vnp_OrderInfo", req.getVnp_OrderInfo());
            params.put("vnp_OrderType", req.getVnp_OrderType());
            params.put("vnp_ReturnUrl", req.getVnp_ReturnUrl());
            params.put("vnp_TmnCode", req.getVnp_TmnCode());
            params.put("vnp_TxnRef", req.getVnp_TxnRef());
            params.put("vnp_Version", req.getVnp_Version());

            StringBuilder hashData = new StringBuilder();
            boolean first = true;
            for (java.util.Map.Entry<String, String> entry : params.entrySet()) {
                if (!first) {
                    hashData.append("&");
                }
                hashData.append(java.net.URLEncoder.encode(entry.getKey(), "UTF-8"));
                hashData.append("=");
                hashData.append(java.net.URLEncoder.encode(entry.getValue(), "UTF-8"));
                first = false;
            }

            return CryptoUtils.hmacSha512Hex(secretKey, hashData.toString());
        } catch (Exception e) {
            throw new PaymentGatewayException("Failed to create VNPay signature: " + e.getMessage(), e);
        }
    }

    private String buildVnpayUrl(VnpayInitiateRequest req) {
        // URL params must match signature params (alphabetically sorted)
        // vnp_SecureHashType is not required for v2.1.0
        return UriComponentsBuilder.fromUriString(vnpayConfig.getEndpoint())
                .queryParam("vnp_Amount", req.getVnp_Amount())
                .queryParam("vnp_Command", req.getVnp_Command())
                .queryParam("vnp_CreateDate", req.getVnp_CreateDate())
                .queryParam("vnp_CurrCode", req.getVnp_CurrCode())
                .queryParam("vnp_ExpireDate", req.getVnp_ExpireDate())
                .queryParam("vnp_IpAddr", req.getVnp_IpAddr())
                .queryParam("vnp_Locale", req.getVnp_Locale())
                .queryParam("vnp_OrderInfo", req.getVnp_OrderInfo())
                .queryParam("vnp_OrderType", req.getVnp_OrderType())
                .queryParam("vnp_ReturnUrl", req.getVnp_ReturnUrl())
                .queryParam("vnp_TmnCode", req.getVnp_TmnCode())
                .queryParam("vnp_TxnRef", req.getVnp_TxnRef())
                .queryParam("vnp_Version", req.getVnp_Version())
                .queryParam("vnp_SecureHash", req.getVnp_SecureHash())
                .encode()  // URL encode all parameter values
                .toUriString();
    }
}