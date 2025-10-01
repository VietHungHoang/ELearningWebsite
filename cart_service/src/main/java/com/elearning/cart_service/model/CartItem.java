package com.elearning.cart_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Thực thể CartItem đại diện cho 1 khóa học trong giỏ hàng
 */
@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // ID cart item

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart; // Cart chứa item này

    @Column(nullable = false)
    private Long courseId; // ID khóa học được thêm vào cart

    @Column(nullable = false)
    private BigDecimal priceSnapshot; // Giá snapshot tại thời điểm thêm vào cart

    @Column(length = 50)
    private String couponCode; // Mã coupon (có thể null nếu không dùng)

    @Column(nullable = false)
    private BigDecimal finalPrice; // Giá cuối cùng sau coupon
}
