package com.elearning.apigateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

/**
 * Global Filter to decode JWT token and inject user info into downstream requests
 * 
 * This filter:
 * 1. Extracts JWT token from Authorization header
 * 2. Decodes and validates the token
 * 3. Adds user information as custom headers to downstream services
 * 
 * Headers added:
 * - X-User-Id: User ID from token
 * - X-User-Email: User email
 * - X-User-Roles: User roles (comma-separated)
 * - X-User-Name: User name
 */
@Component
public class JwtTokenFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info("=== JwtTokenFilter CALLED for path: {} ===", exchange.getRequest().getPath());
        
        // Check if Authorization header exists
        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
        log.info("Authorization header present: {}", authHeader != null);
        
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .flatMap(authentication -> {
                    log.info("JwtTokenFilter: Processing authentication for request: {}", exchange.getRequest().getPath());
                    if (authentication instanceof JwtAuthenticationToken) {
                        JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
                        Jwt jwt = jwtAuth.getToken();
                        
                        log.info("Processing JWT token for request: {}", exchange.getRequest().getPath());
                        
                        // Extract user info from JWT token
                        String userId = extractClaim(jwt, "sub");
                        String email = extractClaim(jwt, "email");
                        String name = extractClaim(jwt, "name");
                        String preferredUsername = extractClaim(jwt, "preferred_username");
                        List<String> roles = extractRoles(jwt);
                        
                        // Build modified request with additional headers
                        ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                                .header("X-User-Id", userId != null ? userId : "")
                                .header("X-User-Email", email != null ? email : "")
                                .header("X-User-Name", name != null ? name : preferredUsername != null ? preferredUsername : "")
                                .header("X-User-Roles", roles != null ? String.join(",", roles) : "")
                                .header("X-Auth-Token", jwt.getTokenValue())
                                .build();
                        
                        log.info("Added user headers - UserId: {}, Email: {}, Roles: {}", userId, email, roles);
                        
                        // Continue with modified request
                        return chain.filter(exchange.mutate().request(modifiedRequest).build());
                    }
                    
                    // No JWT token found, continue without adding headers
                    log.info("No JWT authentication found in SecurityContext");
                    return chain.filter(exchange);
                })
                .switchIfEmpty(Mono.defer(() -> {
                    log.info("SecurityContext is empty, continuing without user headers");
                    return chain.filter(exchange);
                }));
    }

    /**
     * Extract a claim from JWT token
     */
    private String extractClaim(Jwt jwt, String claimName) {
        try {
            Object claim = jwt.getClaim(claimName);
            return claim != null ? claim.toString() : null;
        } catch (Exception e) {
            log.warn("Failed to extract claim '{}' from JWT: {}", claimName, e.getMessage());
            return null;
        }
    }

    /**
     * Extract roles from JWT token
     * Handles both Keycloak and standard JWT role structures
     */
    @SuppressWarnings("unchecked")
    private List<String> extractRoles(Jwt jwt) {
        try {
            // Try Keycloak structure: realm_access.roles
            Map<String, Object> realmAccess = jwt.getClaim("realm_access");
            if (realmAccess != null && realmAccess.containsKey("roles")) {
                return (List<String>) realmAccess.get("roles");
            }
            
            // Try standard roles claim
            Object roles = jwt.getClaim("roles");
            if (roles instanceof List) {
                return (List<String>) roles;
            }
            
            // Try authorities claim
            Object authorities = jwt.getClaim("authorities");
            if (authorities instanceof List) {
                return (List<String>) authorities;
            }
            
            log.debug("No roles found in JWT token");
            return List.of();
        } catch (Exception e) {
            log.warn("Failed to extract roles from JWT: {}", e.getMessage());
            return List.of();
        }
    }

    /**
     * Set high priority to run this filter early in the chain
     * Lower number = higher priority
     */
    @Override
    public int getOrder() {
        return -100; // Run early, before most other filters
    }
}
