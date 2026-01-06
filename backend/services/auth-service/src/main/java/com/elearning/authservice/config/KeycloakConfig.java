package com.elearning.authservice.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.cert.X509Certificate;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class KeycloakConfig {

    private final KeycloakProperties keycloakProperties;

    @Bean
    public Keycloak keycloak() {
        // Disable SSL verification for self-signed certificates
        disableSslVerification();

        return KeycloakBuilder.builder()
                .serverUrl(keycloakProperties.getAuthServerUrl())
                .realm(keycloakProperties.getRealm())
                .clientId(keycloakProperties.getResource())
                .clientSecret(keycloakProperties.getClientSecret())
                .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
                .build();
    }

    /**
     * Disable SSL verification globally for Keycloak connections.
     * WARNING: Only use this for development/testing with self-signed certificates!
     */
    private void disableSslVerification() {
        try {
            // Create a trust manager that does not validate certificate chains
            TrustManager[] trustAllCerts = new TrustManager[] {
                    new X509TrustManager() {
                        public X509Certificate[] getAcceptedIssuers() {
                            return new X509Certificate[0];
                        }

                        public void checkClientTrusted(X509Certificate[] certs, String authType) {
                            // Trust all clients
                        }

                        public void checkServerTrusted(X509Certificate[] certs, String authType) {
                            // Trust all servers
                        }
                    }
            };

            // Install the all-trusting trust manager
            SSLContext sc = SSLContext.getInstance("TLS");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            javax.net.ssl.HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

            // Create all-trusting host name verifier
            javax.net.ssl.HttpsURLConnection.setDefaultHostnameVerifier((hostname, session) -> true);

            log.warn("SSL verification disabled - only use this for development/testing!");
        } catch (Exception e) {
            log.error("Failed to disable SSL verification", e);
            throw new RuntimeException("Failed to disable SSL verification", e);
        }
    }

    @jakarta.annotation.PostConstruct
    public void logConfiguration() {
        log.info("Keycloak Configuration:");
        log.info("Auth Server URL: {}", keycloakProperties.getAuthServerUrl());
        log.info("Realm: {}", keycloakProperties.getRealm());
        log.info("Client ID: {}", keycloakProperties.getResource());
        String clientSecret = keycloakProperties.getClientSecret();
        String maskedSecret = (clientSecret != null && clientSecret.length() > 4)
                ? clientSecret.substring(0, 4) + "*****"
                : "*****";
        log.info("Client Secret: {}", maskedSecret);
    }
}