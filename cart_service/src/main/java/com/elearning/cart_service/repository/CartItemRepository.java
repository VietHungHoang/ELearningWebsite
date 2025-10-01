package com.elearning.cart_service.repository;

import com.elearning.cart_service.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Check course đã tồn tại trong cart chưa
    boolean existsByCartIdAndCourseId(Long cartId, Long courseId);

    // Xoá 1 item trong cart
    void deleteByCartIdAndCourseId(Long cartId, Long courseId);
}
