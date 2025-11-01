package com.elearning.cart_service.service.impl;

import com.elearning.cart_service.dto.request.AddToCartRequest;
import com.elearning.cart_service.dto.request.ApplyCouponRequest;
import com.elearning.cart_service.dto.request.CheckoutRequest;
import com.elearning.cart_service.dto.response.CartResponse;
import com.elearning.cart_service.dto.response.CartItemResponse;
import com.elearning.cart_service.dto.response.CheckoutResponse;
import com.elearning.cart_service.model.Cart;
import com.elearning.cart_service.model.CartItem;
import com.elearning.cart_service.client.CourseClient;
import com.elearning.cart_service.service.CartService;
import com.elearning.cart_service.repository.CartRepository;
import com.elearning.cart_service.repository.CartItemRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CourseClient courseClient;

    @Override
    public CartResponse getCart(String learnerId) {
        Cart cart = getOrCreateCart(learnerId);
        return mapToCartResponse(cart);
    }

    @Override
    public CartResponse addToCart(String learnerId, AddToCartRequest request) {
        Cart cart = getOrCreateCart(learnerId);
        boolean exists = cart.getItems().stream()
                .anyMatch(item -> item.getCourseId().equals(request.getCourseId()));
        if (exists) {
            throw new RuntimeException("Course already exists in cart");
        }
        CartItem cartItem = CartItem.builder()
                .cart(cart)
                .courseId(request.getCourseId())
                .build();
        cart.getItems().add(cartItem);
        cartRepository.save(cart);
        return mapToCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeItem(String learnerId, Long courseId) {

        Cart cart = cartRepository.findByLearnerId(learnerId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        if (!cartItemRepository.existsByCartIdAndCourseId(cart.getId(), courseId)) {
            throw new RuntimeException("Cart item not found for courseId: " + courseId);
        }
        cartItemRepository.deleteByCartIdAndCourseId(cart.getId(), courseId);

        Cart updatedCart = cartRepository.findById(cart.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found after delete"));

        return mapToCartResponse(updatedCart);
    }

    @Override
    public CheckoutResponse checkout(String learnerId, CheckoutRequest request) {
        Cart cart = cartRepository.findByLearnerId(learnerId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cartRepository.save(cart);

        BigDecimal totalAmount = cart.getItems().stream()
                .map(item -> {
                    try {
                        CourseClient.CourseDTO course = courseClient.getCourseById(item.getCourseId());
                        return course != null && course.getDiscountPrice() != null
                                ? BigDecimal.valueOf(course.getDiscountPrice())
                                : BigDecimal.valueOf(99.99);
                    } catch (Exception e) {
                        return BigDecimal.valueOf(99.99);
                    }
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        CheckoutResponse response = new CheckoutResponse();
        response.setOrderId(12345L);
        response.setTotalAmount(totalAmount);
        response.setMessage("Order placed successfully");

        return response;
    }

    @Override
    public CartResponse applyCoupon(String learnerId, ApplyCouponRequest request) {
        throw new RuntimeException("Coupon functionality is not available");
    }

    private Cart getOrCreateCart(String learnerId) {
        Optional<Cart> existingCart = cartRepository.findByLearnerId(learnerId);

        if (existingCart.isPresent()) {
            return existingCart.get();
        }

        Cart newCart = Cart.builder()
                .learnerId(learnerId)
                .build();

        return cartRepository.save(newCart);
    }

    private CartResponse mapToCartResponse(Cart cart) {
        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setLearnerId(cart.getLearnerId());

        BigDecimal totalAmount = cart.getItems().stream()
                .map(item -> {
                    try {
                        CourseClient.CourseDTO course = courseClient.getCourseById(item.getCourseId());
                        return course != null && course.getDiscountPrice() != null
                                ? BigDecimal.valueOf(course.getDiscountPrice())
                                : BigDecimal.valueOf(99.99);
                    } catch (Exception e) {
                        return BigDecimal.valueOf(99.99);
                    }
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        response.setTotalAmount(totalAmount);

        response.setItems(cart.getItems().stream()
                .map(this::mapToCartItemResponse)
                .toList());

        return response;
    }

    private CartItemResponse mapToCartItemResponse(CartItem item) {
        return CartItemResponse.builder()
                .id(item.getId())
                .courseId(item.getCourseId())
                .build();
    }

}