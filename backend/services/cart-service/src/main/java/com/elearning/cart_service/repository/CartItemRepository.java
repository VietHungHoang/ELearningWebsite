package com.elearning.cart_service.repository;

import com.elearning.cart_service.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    boolean existsByCartIdAndCourseId(Long cartId, Long courseId);
    
    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.cart.id = :cartId AND ci.courseId = :courseId")
    void deleteByCartIdAndCourseId(Long cartId, Long courseId);
}
