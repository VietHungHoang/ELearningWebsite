package main.java.com.elearning.healthcheckservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

/**
 * Health Check Service
 * Periodically pings all backend services to prevent them from sleeping on
 * Render
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class HealthCheckService {

    private final RestTemplate restTemplate;

    // Service URLs from configuration
    @Value("${services.auth-service.url}")
    private String authServiceUrl;

    @Value("${services.notification-service.url}")
    private String notificationServiceUrl;

    @Value("${services.common-service.url}")
    private String commonServiceUrl;

    @Value("${services.tutor-service.url}")
    private String tutorServiceUrl;

    @Value("${services.class-service.url}")
    private String classServiceUrl;

    @Value("${services.student-service.url}")
    private String studentServiceUrl;

    @Value("${services.search-service.url}")
    private String searchServiceUrl;

    @Value("${services.chat-service.url}")
    private String chatServiceUrl;

    @Value("${services.booking-service.url}")
    private String bookingServiceUrl;

    @Value("${services.payment-service.url}")
    private String paymentServiceUrl;

    @Value("${services.quiz-service.url}")
    private String quizServiceUrl;

    @Value("${services.file-service.url}")
    private String fileServiceUrl;

    @Value("${services.bff-service.url}")
    private String bffServiceUrl;

    @Value("${health-check.timeout:5000}")
    private int timeout;

    // Map of service names to their health check URLs
    private Map<String, String> getServiceHealthUrls() {
        Map<String, String> healthUrls = new HashMap<>();
        healthUrls.put("auth-service", authServiceUrl + "/api/v1/auth/health");
        healthUrls.put("notification-service", notificationServiceUrl + "/api/v1/notification/health");
        healthUrls.put("common-service", commonServiceUrl + "/api/v1/common/health");
        healthUrls.put("tutor-service", tutorServiceUrl + "/api/v1/tutor/health");
        healthUrls.put("class-service", classServiceUrl + "/api/v1/class/health");
        healthUrls.put("student-service", studentServiceUrl + "/api/v1/student/health");
        healthUrls.put("search-service", searchServiceUrl + "/api/v1/search/health");
        healthUrls.put("chat-service", chatServiceUrl + "/api/v1/chat/health");
        healthUrls.put("booking-service", bookingServiceUrl + "/api/v1/booking/health");
        healthUrls.put("payment-service", paymentServiceUrl + "/api/v1/payment/health");
        healthUrls.put("quiz-service", quizServiceUrl + "/api/v1/quiz/health");
        healthUrls.put("file-service", fileServiceUrl + "/api/v1/file/health");
        healthUrls.put("bff-service", bffServiceUrl + "/api/v1/bff/health");
        return healthUrls;
    }

    /**
     * Scheduled health check - runs every 10 minutes
     */
    @Scheduled(fixedRateString = "${health-check.interval:600000}")
    public void performHealthCheck() {
        LocalDateTime timestamp = LocalDateTime.now();
        log.info("[HealthCheck] Starting scheduled health check at {}", timestamp);

        Map<String, String> healthUrls = getServiceHealthUrls();
        Map<String, HealthCheckResult> results = new HashMap<>();

        // Perform health checks asynchronously
        CompletableFuture<?>[] futures = healthUrls.entrySet().stream()
                .map(entry -> checkServiceHealth(entry.getKey(), entry.getValue())
                        .thenAccept(result -> results.put(entry.getKey(), result)))
                .toArray(CompletableFuture[]::new);

        // Wait for all checks to complete
        try {
            CompletableFuture.allOf(futures).get(timeout * healthUrls.size(), TimeUnit.MILLISECONDS);
        } catch (Exception e) {
            log.error("[HealthCheck] Timeout or error waiting for health checks: {}", e.getMessage());
        }

        // Log summary
        int total = results.size();
        long successful = results.values().stream().filter(HealthCheckResult::isHealthy).count();
        long failed = total - successful;

        log.info("[HealthCheck] Completed: {}/{} services responding ({} failed)", successful, total, failed);

        // Log detailed results
        results.forEach((serviceName, result) -> {
            if (result.isHealthy()) {
                log.info("[HealthCheck] ✓ {} - OK ({}ms)", serviceName, result.getResponseTime());
            } else {
                log.warn("[HealthCheck] ✗ {} - FAILED: {}", serviceName, result.getError());
            }
        });

        log.info("[HealthCheck] Health check cycle completed at {}", LocalDateTime.now());
    }

    /**
     * Check health of a single service
     */
    private CompletableFuture<HealthCheckResult> checkServiceHealth(String serviceName, String healthUrl) {
        return CompletableFuture.supplyAsync(() -> {
            long startTime = System.currentTimeMillis();

            try {
                ResponseEntity<String> response = restTemplate.getForEntity(healthUrl, String.class);
                long responseTime = System.currentTimeMillis() - startTime;

                if (response.getStatusCode().is2xxSuccessful()) {
                    return new HealthCheckResult(true, responseTime, null);
                } else {
                    return new HealthCheckResult(false, responseTime,
                            "HTTP " + response.getStatusCode().value());
                }
            } catch (Exception e) {
                long responseTime = System.currentTimeMillis() - startTime;
                return new HealthCheckResult(false, responseTime, e.getMessage());
            }
        });
    }

    /**
     * Health check result data class
     */
    private static class HealthCheckResult {
        private final boolean healthy;
        private final long responseTime;
        private final String error;

        public HealthCheckResult(boolean healthy, long responseTime, String error) {
            this.healthy = healthy;
            this.responseTime = responseTime;
            this.error = error;
        }

        public boolean isHealthy() {
            return healthy;
        }

        public long getResponseTime() {
            return responseTime;
        }

        public String getError() {
            return error;
        }
    }
}