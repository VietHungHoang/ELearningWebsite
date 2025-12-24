package com.elearning.paymentservice.strategy.impl;

import org.springframework.stereotype.Component;

import com.elearning.paymentservice.strategy.PaymentGatewayStrategy;
import com.elearning.paymentservice.strategy.dto.*;
import com.elearning.paymentservice.config.GatewayProperties;
import com.elearning.paymentservice.config.PaymentProvidersProperties;
import com.elearning.paymentservice.exception.ConfigurationException;
import com.elearning.paymentservice.exception.PaymentGatewayException;
import com.elearning.paymentservice.dto.request.InitiatePaymentRequest;
import com.elearning.paymentservice.dto.request.MomoInitiateRequest;
import com.elearning.paymentservice.dto.response.MomoInitiateResponse;
import com.elearning.paymentservice.enums.PaymentGateway;

import com.elearning.paymentservice.util.CommonUtils;

import com.elearning.paymentservice.util.CryptoUtils;

import java.util.UUID;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class MomoGatewayStrategy implements PaymentGatewayStrategy {

    private final GatewayProperties momoConfig;

    public MomoGatewayStrategy(PaymentProvidersProperties paymentProvidersProperties) {
        this.momoConfig = paymentProvidersProperties.getProvider(PaymentGateway.MOMO)
                .orElseThrow(() -> new ConfigurationException("Missing configuration for payment provider 'Momo'"));
    }

    @Override
    public GatewayCreationResponse createPaymentIntent(InitiatePaymentRequest request) {
        if(CommonUtils.isNullOrEmpty(momoConfig.getSecretKey())) {
            throw new IllegalStateException("Missing secret key for MoMo configuration");
        }
        String partnerCode = momoConfig.getPartnerCode();
        String requestId = request.getOrderId().toString();

        MomoInitiateRequest momoRequest = MomoInitiateRequest.builder()
            .partnerCode(partnerCode)
            .requestId(requestId)
            .amount(request.getAmount().longValue())
            .orderId(request.getOrderId().toString())  
            .orderInfo("Payment for order " + request.getOrderId())
            .redirectUrl(request.getRedirectUrl())
            .ipnUrl("http://localhost:8081/payment/webhook/momo")
            .build();

        String signature = createMomoSignature(momoRequest);
        momoRequest.setSignature(signature);

        // Call MoMo API
        RestTemplate rest = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<MomoInitiateRequest> entity = new HttpEntity<>(momoRequest, headers);

        String url = momoConfig.getEndpoint();
        String tryUrl = url.endsWith("/") ? url + "create" : url + "/create";

        ResponseEntity<String> resp = rest.postForEntity(tryUrl, entity, String.class);
        if (resp.getStatusCode().is2xxSuccessful()) {
            resp.getBody();
            ObjectMapper mapper = new ObjectMapper();
            try {
                MomoInitiateResponse momoResp = mapper.readValue(resp.getBody(), MomoInitiateResponse.class);
                String paymentUrl = momoResp.getPayUrl();
                return GatewayCreationResponse.builder()
                        .paymentUrl(paymentUrl)
                        .providerTransactionId(momoResp.getRequestId())
                        .build();
            } catch (Exception e) {
                throw new PaymentGatewayException("Failed to parse MoMo response: " + e.getMessage(), e);
            }
        } else {
            throw new PaymentGatewayException("Failed to initiate MoMo payment: " + resp.getStatusCode());
        }
    }

    @Override
    public StandardizedPaymentResult handleWebhook(WebhookPayload payload) {
        // Parse payload and map to standardized result. Simplified here.
        return StandardizedPaymentResult.builder()
                .orderId((String) payload.getRawPayload().get("orderId"))
                .providerTransactionId((String) payload.getRawPayload().get("transactionId"))
                .status((String) payload.getRawPayload().getOrDefault("status", "PENDING"))
                .build();
    }

    @Override
    public RefundResponse createRefund(RefundRequest request) {
        // Call Momo refund API; here we return a dummy response.
        return RefundResponse.builder()
                .refundId("REF-" + UUID.randomUUID())
                .status("PENDING")
                .build();
    }

    
    private String createMomoSignature(MomoInitiateRequest req) {
        String accessKey = momoConfig.getAccessKey();
        String secretKey = momoConfig.getSecretKey();

        String rawSyntax = "accessKey=" + accessKey
                + "&amount=" + req.getAmount()
                + "&extraData=" + req.getExtraData()
                + "&ipnUrl=" + req.getIpnUrl()
                + "&orderId=" + req.getOrderId()
                + "&orderInfo=" + req.getOrderInfo()
                + "&partnerCode=" + req.getPartnerCode()
                + "&redirectUrl=" + req.getRedirectUrl()
                + "&requestId=" + req.getRequestId()
                + "&requestType=" + req.getRequestType();
        try {
            return CryptoUtils.hmacSha256Hex(secretKey, rawSyntax);
        } catch (Exception e) {
            throw new PaymentGatewayException("Failed to create MoMo signature: " + e.getMessage(), e);
        }
    }
}
