package com.elearning.apigateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class GlobalLoggingFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(GlobalLoggingFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        String method = exchange.getRequest().getMethod().toString();
        
        log.info("=== GATEWAY REQUEST: {} {} ===", method, path);
        
        return chain.filter(exchange)
                .doOnSuccess(aVoid -> {
                    int statusCode = exchange.getResponse().getStatusCode() != null 
                            ? exchange.getResponse().getStatusCode().value() 
                            : 0;
                    log.info("=== GATEWAY RESPONSE: {} {} - Status: {} ===", method, path, statusCode);
                })
                .doOnError(error -> {
                    log.error("=== GATEWAY ERROR: {} {} - Error: {} ===", method, path, error.getMessage(), error);
                });
    }

    @Override
    public int getOrder() {
        return -1; // Run first
    }
}
