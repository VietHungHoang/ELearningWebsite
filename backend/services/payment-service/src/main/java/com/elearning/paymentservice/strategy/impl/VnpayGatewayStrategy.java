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
        if(CommonUtils.isNullOrEmpty(vnpayConfig.getSecretKey())) {
            throw new IllegalStateException("Missing secret key for VNPay configuration");
        }

        String tmnCode = vnpayConfig.getPartnerCode();
        String txnRef = request.getOrderId().toString();
        String amount = String.valueOf(request.getAmount().longValue() * 100); // VNPay amount in smallest unit
        String orderInfo = "Payment for order " + request.getOrderId();
        String returnUrl = request.getRedirectUrl();
        String ipnUrl = "http://localhost:8086/payment/callback";

        LocalDateTime now = LocalDateTime.now();
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
            .vnp_CreateDate(createDate)
            .vnp_ExpireDate(expireDate)
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
        String secretKey = vnpayConfig.getSecretKey();

        String rawSyntax = "vnp_Amount=" + req.getVnp_Amount()
                + "&vnp_Command=" + req.getVnp_Command()
                + "&vnp_CreateDate=" + req.getVnp_CreateDate()
                + "&vnp_CurrCode=" + req.getVnp_CurrCode()
                + "&vnp_ExpireDate=" + req.getVnp_ExpireDate()
                + "&vnp_IpnUrl=" + req.getVnp_IpnUrl()
                + "&vnp_Locale=" + req.getVnp_Locale()
                + "&vnp_OrderInfo=" + req.getVnp_OrderInfo()
                + "&vnp_OrderType=" + req.getVnp_OrderType()
                + "&vnp_ReturnUrl=" + req.getVnp_ReturnUrl()
                + "&vnp_TmnCode=" + req.getVnp_TmnCode()
                + "&vnp_TxnRef=" + req.getVnp_TxnRef()
                + "&vnp_Version=" + req.getVnp_Version();
        try {
            return CryptoUtils.hmacSha256Hex(secretKey, rawSyntax);
        } catch (Exception e) {
            throw new PaymentGatewayException("Failed to create VNPay signature: " + e.getMessage(), e);
        }
    }

    private String buildVnpayUrl(VnpayInitiateRequest req) {
        return UriComponentsBuilder.fromUriString(vnpayConfig.getEndpoint())
                .queryParam("vnp_Version", req.getVnp_Version())
                .queryParam("vnp_Command", req.getVnp_Command())
                .queryParam("vnp_TmnCode", req.getVnp_TmnCode())
                .queryParam("vnp_Amount", req.getVnp_Amount())
                .queryParam("vnp_CurrCode", req.getVnp_CurrCode())
                .queryParam("vnp_TxnRef", req.getVnp_TxnRef())
                .queryParam("vnp_OrderInfo", req.getVnp_OrderInfo())
                .queryParam("vnp_OrderType", req.getVnp_OrderType())
                .queryParam("vnp_Locale", req.getVnp_Locale())
                .queryParam("vnp_ReturnUrl", req.getVnp_ReturnUrl())
                .queryParam("vnp_IpnUrl", req.getVnp_IpnUrl())
                .queryParam("vnp_CreateDate", req.getVnp_CreateDate())
                .queryParam("vnp_ExpireDate", req.getVnp_ExpireDate())
                .queryParam("vnp_SecureHash", req.getVnp_SecureHash())
                .build().toUriString();
    }
}