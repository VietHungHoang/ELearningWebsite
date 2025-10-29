package com.elearning.cart_service.client;

import com.elearning.cart_service.config.CartServiceConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * Gọi API Order Service
 */
@Component
@RequiredArgsConstructor
public class OrderClient {

    private final RestTemplate restTemplate;
    private final CartServiceConfig config;

    /**
     * Gửi dữ liệu sang Order Service để tạo order mới
     */
    public OrderResponse createOrder(CreateOrderRequest request) {
        String url = config.getOrderUrl();
        return restTemplate.postForObject(url, request, OrderResponse.class);
    }

    // ========== DTO nội bộ ==========

    @lombok.Data
    public static class CreateOrderRequest {
        private Long learnerId;
        private Double totalAmount;
        private java.util.List<OrderItem> items;

        @lombok.Data
        public static class OrderItem {
            private Long courseId;
            private Double price;
        }
    }

    @lombok.Data
    public static class OrderResponse {
        private Long orderId;
        private String status;     // PENDING / PAID ...
        private Double totalAmount;
    }
}
