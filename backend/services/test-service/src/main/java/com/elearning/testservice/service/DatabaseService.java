package com.elearning.testservice.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class DatabaseService {

    private final JdbcTemplate mainJdbcTemplate;
    private final JdbcTemplate keycloakJdbcTemplate;

    public DatabaseService(
            @Qualifier("mainJdbcTemplate") JdbcTemplate mainJdbcTemplate,
            @Qualifier("keycloakJdbcTemplate") JdbcTemplate keycloakJdbcTemplate) {
        this.mainJdbcTemplate = mainJdbcTemplate;
        this.keycloakJdbcTemplate = keycloakJdbcTemplate;
    }

    /**
     * Query từ schema PUBLIC (main database)
     * Ví dụ: SELECT * FROM users WHERE id = ?
     */
    public List<Map<String, Object>> queryFromPublicSchema(String sql, Object... params) {
        return mainJdbcTemplate.queryForList(sql, params);
    }

    /**
     * Execute UPDATE/INSERT/DELETE trên schema PUBLIC
     * Ví dụ: INSERT INTO users (name, email) VALUES (?, ?)
     */
    public int executeOnPublicSchema(String sql, Object... params) {
        return mainJdbcTemplate.update(sql, params);
    }

    /**
     * Query từ schema KEYCLOAK
     * Ví dụ: SELECT * FROM user_entity WHERE username = ?
     */
    public List<Map<String, Object>> queryFromKeycloakSchema(String sql, Object... params) {
        return keycloakJdbcTemplate.queryForList(sql, params);
    }

    /**
     * Execute UPDATE/INSERT/DELETE trên schema KEYCLOAK
     */
    public int executeOnKeycloakSchema(String sql, Object... params) {
        return keycloakJdbcTemplate.update(sql, params);
    }

    /**
     * Query một giá trị đơn từ PUBLIC schema
     */
    public <T> T queryForObjectFromPublic(String sql, Class<T> requiredType, Object... params) {
        return mainJdbcTemplate.queryForObject(sql, requiredType, params);
    }

    /**
     * Query một giá trị đơn từ KEYCLOAK schema
     */
    public <T> T queryForObjectFromKeycloak(String sql, Class<T> requiredType, Object... params) {
        return keycloakJdbcTemplate.queryForObject(sql, requiredType, params);
    }
}
