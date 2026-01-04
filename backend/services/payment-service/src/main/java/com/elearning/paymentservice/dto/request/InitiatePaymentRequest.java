package com.elearning.paymentservice.dto.request;

// currency will be represented as a string (e.g., "VND", "USD")
import com.elearning.paymentservice.enums.PaymentGateway;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InitiatePaymentRequest {

    @NotNull(message = "Order ID is required")
    private UUID orderId;

    @NotNull(message = "User ID is required")
    private UUID userId;

    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    private String currency;

    @NotNull(message = "Payment provider is required")
    private PaymentGateway paymentProvider;

    @NotBlank(message = "Redirect URL is required")
    @Pattern(regexp = "^http?://.*", message = "Redirect URL must be a valid HTTP/HTTPS URL")
    private String redirectUrl;
}