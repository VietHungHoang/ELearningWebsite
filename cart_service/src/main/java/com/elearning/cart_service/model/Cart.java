package com.elearning.cart_service.model;

import com.elearning.cart_service.enums.CartStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Thực thể Cart đại diện cho giỏ hàng của learner
 */
@Entity
@Table(name = "carts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // ID cart

    @Column(nullable = false)
    private Long learnerId; // ID của learner sở hữu cart

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private CartStatus status = CartStatus.OPEN; // Trạng thái giỏ: OPEN / CONVERTED / EXPIRED

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt; // Thời điểm tạo cart

    private LocalDateTime expiresAt; // Thời điểm hết hạn cart (15 ngày kể từ created)

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<CartItem> items = new ArrayList<>(); // Danh sách item trong cart
}
