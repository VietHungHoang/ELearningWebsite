package com.elearning.cart_service.repository;

import com.elearning.cart_service.model.Cart;
import com.elearning.cart_service.enums.CartStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    /**
     * Tìm cart đang mở của 1 learner
     * → phục vụ khi user ấn Add to Cart
     */
    Optional<Cart> findByLearnerIdAndStatus(Long learnerId, CartStatus status);

    /**
     * Lấy danh sách cart đã hết hạn (để cleanup)
     */
    List<Cart> findByStatus(CartStatus status);
}
