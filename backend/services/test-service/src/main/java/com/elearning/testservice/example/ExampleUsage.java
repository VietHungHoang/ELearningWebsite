package com.elearning.testservice.example;

import com.elearning.testservice.service.DatabaseService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Ví dụ về cách sử dụng DatabaseService
 */
@Service
public class ExampleUsage {

    private final DatabaseService databaseService;

    public ExampleUsage(DatabaseService databaseService) {
        this.databaseService = databaseService;
    }

    // ========== VÍ DỤ QUERY TỪ PUBLIC SCHEMA ==========

    public List<Map<String, Object>> getAllUsers() {
        String sql = "SELECT * FROM users";
        return databaseService.queryFromPublicSchema(sql);
    }

    public Map<String, Object> getUserById(Long userId) {
        String sql = "SELECT * FROM users WHERE id = ?";
        List<Map<String, Object>> results = databaseService.queryFromPublicSchema(sql, userId);
        return results.isEmpty() ? null : results.get(0);
    }

    public Long countUsers() {
        String sql = "SELECT COUNT(*) FROM users";
        return databaseService.queryForObjectFromPublic(sql, Long.class);
    }

    public int createUser(String name, String email) {
        String sql = "INSERT INTO users (name, email) VALUES (?, ?)";
        return databaseService.executeOnPublicSchema(sql, name, email);
    }

    public int updateUser(Long userId, String name) {
        String sql = "UPDATE users SET name = ? WHERE id = ?";
        return databaseService.executeOnPublicSchema(sql, name, userId);
    }

    public int deleteUser(Long userId) {
        String sql = "DELETE FROM users WHERE id = ?";
        return databaseService.executeOnPublicSchema(sql, userId);
    }

    // ========== VÍ DỤ QUERY TỪ KEYCLOAK SCHEMA ==========

    public List<Map<String, Object>> getAllKeycloakUsers() {
        String sql = "SELECT * FROM user_entity";
        return databaseService.queryFromKeycloakSchema(sql);
    }

    public Map<String, Object> getKeycloakUserByUsername(String username) {
        String sql = "SELECT * FROM user_entity WHERE username = ?";
        List<Map<String, Object>> results = databaseService.queryFromKeycloakSchema(sql, username);
        return results.isEmpty() ? null : results.get(0);
    }

    public Long countKeycloakUsers() {
        String sql = "SELECT COUNT(*) FROM user_entity";
        return databaseService.queryForObjectFromKeycloak(sql, Long.class);
    }

    // ========== VÍ DỤ JOIN GIỮA NHIỀU BẢNG ==========

    public List<Map<String, Object>> getUsersWithRoles() {
        String sql = """
            SELECT u.id, u.name, u.email, r.role_name
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            WHERE u.active = ?
            ORDER BY u.created_at DESC
            """;
        return databaseService.queryFromPublicSchema(sql, true);
    }

    // ========== VÍ DỤ TRANSACTION ==========

    public void transferData(Long fromId, Long toId, Double amount) {
        // Sử dụng @Transactional nếu cần transaction
        String deductSql = "UPDATE accounts SET balance = balance - ? WHERE id = ?";
        String addSql = "UPDATE accounts SET balance = balance + ? WHERE id = ?";
        
        databaseService.executeOnPublicSchema(deductSql, amount, fromId);
        databaseService.executeOnPublicSchema(addSql, amount, toId);
    }
}
