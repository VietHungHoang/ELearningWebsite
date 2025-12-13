package com.elearning.apigateway.util;

import org.springframework.http.server.reactive.ServerHttpRequest;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility class for JWT-related operations
 * Contains constants for custom headers added by JwtTokenFilter
 */
public class JwtHeaderConstants {
    
    // Custom header names injected by API Gateway
    public static final String HEADER_USER_ID = "X-User-Id";
    public static final String HEADER_USER_EMAIL = "X-User-Email";
    public static final String HEADER_USER_NAME = "X-User-Name";
    public static final String HEADER_USER_ROLES = "X-User-Roles";
    public static final String HEADER_AUTH_TOKEN = "X-Auth-Token";
    
    private JwtHeaderConstants() {
        // Utility class, prevent instantiation
    }
    
    /**
     * Extract user ID from request headers
     */
    public static String getUserId(ServerHttpRequest request) {
        List<String> headers = request.getHeaders().get(HEADER_USER_ID);
        return headers != null && !headers.isEmpty() ? headers.get(0) : null;
    }
    
    /**
     * Extract user email from request headers
     */
    public static String getUserEmail(ServerHttpRequest request) {
        List<String> headers = request.getHeaders().get(HEADER_USER_EMAIL);
        return headers != null && !headers.isEmpty() ? headers.get(0) : null;
    }
    
    /**
     * Extract user name from request headers
     */
    public static String getUserName(ServerHttpRequest request) {
        List<String> headers = request.getHeaders().get(HEADER_USER_NAME);
        return headers != null && !headers.isEmpty() ? headers.get(0) : null;
    }
    
    /**
     * Extract user roles from request headers
     */
    public static List<String> getUserRoles(ServerHttpRequest request) {
        List<String> headers = request.getHeaders().get(HEADER_USER_ROLES);
        if (headers != null && !headers.isEmpty()) {
            String rolesStr = headers.get(0);
            if (rolesStr != null && !rolesStr.isEmpty()) {
                return Arrays.stream(rolesStr.split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.toList());
            }
        }
        return List.of();
    }
}
