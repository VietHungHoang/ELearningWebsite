package com.elearning.cart_service.client;

import com.elearning.cart_service.config.CartServiceConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class OrderClient {

    private final RestTemplate restTemplate;
    private final CartServiceConfig config;

    public OrderResponse createOrder(CreateOrderRequest request) {
        String url = config.getOrderUrl();
        return restTemplate.postForObject(url, request, OrderResponse.class);
    }

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
        private String status;
        private Double totalAmount;
    }
}
