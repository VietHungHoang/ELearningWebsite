package com.elearning.paymentservice.strategy;

import com.elearning.paymentservice.enums.PaymentGateway;
import com.elearning.paymentservice.strategy.impl.MomoGatewayStrategy;
import com.elearning.paymentservice.strategy.impl.VnpayGatewayStrategy;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

@Component
public class PaymentGatewayFactory {

    private final ApplicationContext ctx;

    public PaymentGatewayFactory(ApplicationContext ctx) {
        this.ctx = ctx;
    }

    public PaymentGatewayStrategy getStrategy(PaymentGateway provider) {
        if (provider == null) throw new IllegalArgumentException("Payment provider is required");

        return switch (provider) {
            case MOMO -> ctx.getBean(MomoGatewayStrategy.class);
            case VNPAY -> ctx.getBean(VnpayGatewayStrategy.class);
            // SePay doesn't use strategy pattern - only IPN webhook
            // case STRIPE -> ctx.getBean(StripeStrategy.class);
            default -> throw new IllegalArgumentException("Unsupported payment provider: " + provider);
        };
    }
}
