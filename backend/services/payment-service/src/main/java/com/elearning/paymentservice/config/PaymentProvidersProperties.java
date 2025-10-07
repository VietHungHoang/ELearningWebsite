package com.elearning.paymentservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import com.elearning.paymentservice.enums.PaymentProvider;

/**
 * Typed properties holder for external payment provider configuration.
 * Designed to be extensible: add entries under `payment.providers.<provider>` in YAML.
 */
@Configuration
@ConfigurationProperties(prefix = "payment")
@AllArgsConstructor
@NoArgsConstructor
public class PaymentProvidersProperties {

    private Map<String, GatewayProperties> providers = new HashMap<>();

    public Map<String, GatewayProperties> getProviders() {
        return providers;
    }

    public void setProviders(Map<String, GatewayProperties> providers) {
        this.providers = providers;
    }

    public Optional<GatewayProperties> getProvider(String name) {
        return Optional.ofNullable(providers.get(name));
    }

    public Optional<GatewayProperties> getProvider(PaymentProvider provider) {
        if (provider == null) return Optional.empty();
        return getProvider(provider.name().toLowerCase());
    }
}
