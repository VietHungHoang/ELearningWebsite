package com.elearning.testservice.config;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

@Configuration
public class KeycloakConfig {

    @Value("${keycloak.server-url}")
    private String serverUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.client-id}")
    private String clientId;

    @Value("${keycloak.client-secret:}")
    private String clientSecret;

    @Value("${keycloak.username:}")
    private String username;

    @Value("${keycloak.password:}")
    private String password;

    @Value("${spring.datasource.keycloak.jdbc-url}")
    private String keycloakJdbcUrl;

    @Value("${spring.datasource.keycloak.username}")
    private String keycloakUsername;

    @Value("${spring.datasource.keycloak.password}")
    private String keycloakPassword;

    @Bean(name = "keycloakDataSource")
    public DataSource keycloakDataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setUrl(keycloakJdbcUrl);
        dataSource.setUsername(keycloakUsername);
        dataSource.setPassword(keycloakPassword);
        return dataSource;
    }

    @Bean(name = "keycloakJdbcTemplate")
    public JdbcTemplate keycloakJdbcTemplate(@Qualifier("keycloakDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    @Bean
    public Keycloak keycloakAdminClient() {
        KeycloakBuilder builder = KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm(realm)
                .clientId(clientId);

        if (clientSecret != null && !clientSecret.isEmpty()) {
            builder.clientSecret(clientSecret).grantType("client_credentials");
        } else {
            builder.username(username).password(password).grantType("password");
        }

        return builder.build();
    }
}