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

            // Configure connection manager with pooling
            org.apache.http.config.Registry<org.apache.http.conn.socket.ConnectionSocketFactory> socketFactoryRegistry = org.apache.http.config.RegistryBuilder.<org.apache.http.conn.socket.ConnectionSocketFactory>create()
                    .register("https", new org.apache.http.conn.ssl.SSLConnectionSocketFactory(
                            sslContext,
                            org.apache.http.conn.ssl.NoopHostnameVerifier.INSTANCE))
                    .register("http", org.apache.http.conn.socket.PlainConnectionSocketFactory.getSocketFactory())
                    .build();

            org.apache.http.impl.conn.PoolingHttpClientConnectionManager connectionManager = new org.apache.http.impl.conn.PoolingHttpClientConnectionManager(
                    socketFactoryRegistry);
            connectionManager.setMaxTotal(50);
            connectionManager.setDefaultMaxPerRoute(20);
            connectionManager.setValidateAfterInactivity(5000); // Validate connections after 5 seconds of inactivity

            // Configure request config with timeouts
            org.apache.http.client.config.RequestConfig requestConfig = org.apache.http.client.config.RequestConfig
                    .custom()
                    .setConnectTimeout(30000) // 30 seconds connection timeout
                    .setSocketTimeout(60000) // 60 seconds socket timeout
                    .setConnectionRequestTimeout(10000) // 10 seconds to get connection from pool
                    .build();

            // Create HTTP client with connection pooling, retry, and keep-alive
            org.apache.http.impl.client.CloseableHttpClient httpClient = org.apache.http.impl.client.HttpClients
                    .custom()
                    .setConnectionManager(connectionManager)
                    .setDefaultRequestConfig(requestConfig)
                    .setRetryHandler(new org.apache.http.impl.client.DefaultHttpRequestRetryHandler(3, true)) // Retry
                                                                                                              // up to 3
                                                                                                              // times
                    .setKeepAliveStrategy((response, context) -> 30000) // Keep connections alive for 30 seconds
                    .evictExpiredConnections()
                    .evictIdleConnections(60, java.util.concurrent.TimeUnit.SECONDS) // Evict idle connections after 60
                                                                                     // seconds
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