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
        try {
            // Create SSL context that trusts all certificates
            SSLContext sslContext = createTrustAllSslContext();

            // Create HTTP client with custom SSL context
            org.apache.http.impl.client.CloseableHttpClient httpClient = org.apache.http.impl.client.HttpClients
                    .custom()
                    .setSSLContext(sslContext)
                    .setSSLHostnameVerifier(org.apache.http.conn.ssl.NoopHostnameVerifier.INSTANCE)
                    .build();

            // Create Resteasy client with custom HTTP client
            org.jboss.resteasy.client.jaxrs.ResteasyClient client = ((org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder) org.jboss.resteasy.client.jaxrs.internal.ResteasyClientBuilderImpl
                    .newBuilder())
                    .httpEngine(new org.jboss.resteasy.client.jaxrs.engines.ApacheHttpClient43Engine(httpClient))
                    .build();

            log.warn("Keycloak client configured with SSL verification disabled - only use for development/testing!");

            return KeycloakBuilder.builder()
                    .serverUrl(keycloakProperties.getAuthServerUrl())
                    .realm(keycloakProperties.getRealm())
                    .clientId(keycloakProperties.getResource())
                    .clientSecret(keycloakProperties.getClientSecret())
                    .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
                    .resteasyClient(client)
                    .build();
        } catch (Exception e) {
            log.error("Failed to configure Keycloak client with SSL", e);
            throw new RuntimeException("Failed to configure Keycloak client", e);
        }
    }

    /**
     * Create SSL context that trusts all certificates.
     * WARNING: Only use this for development/testing with self-signed certificates!
     */
    private SSLContext createTrustAllSslContext() throws Exception {
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

        // Create and initialize SSL context
        SSLContext sslContext = SSLContext.getInstance("TLS");
        sslContext.init(null, trustAllCerts, new java.security.SecureRandom());

        return sslContext;
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