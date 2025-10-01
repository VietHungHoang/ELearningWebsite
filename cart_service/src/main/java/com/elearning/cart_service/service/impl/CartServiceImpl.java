package com.elearning.cart_service.service.impl;

import com.elearning.cart_service.client.CourseClient;
import com.elearning.cart_service.client.CouponClient;
import com.elearning.cart_service.client.CouponClient.CouponValidationResponse;
import com.elearning.cart_service.dto.request.AddToCartRequest;
import com.elearning.cart_service.dto.request.ApplyCouponRequest;
import com.elearning.cart_service.dto.request.CheckoutRequest;
import com.elearning.cart_service.dto.response.CartItemResponse;
import com.elearning.cart_service.dto.response.CartResponse;
import com.elearning.cart_service.dto.response.CheckoutResponse;
import com.elearning.cart_service.exception.ResourceNotFoundException;
import com.elearning.cart_service.model.Cart;
import com.elearning.cart_service.model.CartItem;
import com.elearning.cart_service.enums.CartStatus;
import com.elearning.cart_service.repository.CartItemRepository;
import com.elearning.cart_service.repository.CartRepository;
import com.elearning.cart_service.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CourseClient courseClient;
    private final CouponClient couponClient;

    // ================= Add To Cart =================
    @Override
    public CartResponse addToCart(Long learnerId, AddToCartRequest request) {
        Cart cart = cartRepository.findByLearnerIdAndStatus(learnerId, CartStatus.OPEN)
                .orElseGet(() -> cartRepository.save(
                        Cart.builder()
                                .learnerId(learnerId)
                                .status(CartStatus.OPEN)
                                .expiresAt(LocalDateTime.now().plusDays(15))
                                .build()));

        boolean exists = cartItemRepository.existsByCartIdAndCourseId(cart.getId(), request.getCourseId());
        if (exists)
            throw new IllegalStateException("Khóa học đã tồn tại trong giỏ hàng");

        CourseClient.CourseDTO course = courseClient.getCourseById(request.getCourseId());
        if (course == null || !Boolean.TRUE.equals(course.getIsActive()))
            throw new IllegalStateException("Khóa học không tồn tại hoặc đã bị khóa");

        BigDecimal priceSnapshot = BigDecimal.valueOf(
                course.getDiscountPrice() != null ? course.getDiscountPrice() : course.getListPrice());

        String appliedCoupon = null;
        if (request.getCouponCode() != null && !request.getCouponCode().isEmpty()) {
            CouponValidationResponse res = couponClient.validateCoupon(
                    request.getCourseId(), request.getCouponCode(), learnerId);
            if (!res.isValid())
                throw new IllegalArgumentException(res.getMessage());
            appliedCoupon = request.getCouponCode();
            priceSnapshot = priceSnapshot.subtract(BigDecimal.valueOf(res.getDiscountAmount()));
        }

        CartItem item = CartItem.builder()
                .cart(cart)
                .courseId(request.getCourseId())
                .priceSnapshot(priceSnapshot)
                .couponCode(appliedCoupon)
                .build();
        cartItemRepository.save(item);

        return mapToCartResponse(cart);
    }

    // ================= View Cart =================
    @Override
    public CartResponse getCart(Long learnerId) {
        Cart cart = cartRepository.findByLearnerIdAndStatus(learnerId, CartStatus.OPEN)
                .orElseThrow(() -> new ResourceNotFoundException("Cart trống hoặc không tồn tại"));
        return mapToCartResponse(cart);
    }

    // ================= Remove Item =================
    @Override
    public CartResponse removeItem(Long learnerId, Long courseId) {
        Cart cart = cartRepository.findByLearnerIdAndStatus(learnerId, CartStatus.OPEN)
                .orElseThrow(() -> new ResourceNotFoundException("Cart không tồn tại"));
        cartItemRepository.deleteByCartIdAndCourseId(cart.getId(), courseId);
        return mapToCartResponse(cart);
    }

    // ================= Apply Coupon =================
    @Override
    public CartResponse applyCoupon(Long learnerId, ApplyCouponRequest request) {
        Cart cart = cartRepository.findByLearnerIdAndStatus(learnerId, CartStatus.OPEN)
                .orElseThrow(() -> new ResourceNotFoundException("Cart không tồn tại"));

        CartItem item = cart.getItems().stream()
                .filter(ci -> ci.getCourseId().equals(request.getCourseId()))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Course không tồn tại trong cart"));

        CouponValidationResponse res = couponClient.validateCoupon(
                item.getCourseId(), request.getCouponCode(), learnerId);

        if (!res.isValid())
            throw new IllegalArgumentException(res.getMessage());

        item.setCouponCode(request.getCouponCode());
        item.setPriceSnapshot(item.getPriceSnapshot().subtract(BigDecimal.valueOf(res.getDiscountAmount())));
        cartItemRepository.save(item);

        return mapToCartResponse(cart);
    }

    // ================= Checkout =================
    @Override
    public CheckoutResponse checkout(Long learnerId, CheckoutRequest request) {
        Cart cart = cartRepository.findByLearnerIdAndStatus(learnerId, CartStatus.OPEN)
                .orElseThrow(() -> new ResourceNotFoundException("Cart không tồn tại"));

        if (cart.getExpiresAt() != null && cart.getExpiresAt().isBefore(LocalDateTime.now()))
            throw new IllegalStateException("Cart đã hết hạn");

        for (CartItem item : cart.getItems()) {
            String coupon = item.getCouponCode();
            if (coupon != null) {
                CouponValidationResponse res = couponClient.validateCoupon(
                        item.getCourseId(), coupon, learnerId);
                if (!res.isValid())
                    throw new IllegalStateException(
                            "Coupon " + coupon + " không hợp lệ cho khóa học " + item.getCourseId());
            }
        }

        Long mockOrderId = 1001L;
        BigDecimal totalAmount = cart.getItems().stream()
                .map(CartItem::getPriceSnapshot)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cartRepository.delete(cart);

        return CheckoutResponse.builder()
                .orderId(mockOrderId)
                .totalAmount(totalAmount)
                .status("PAID")
                .message("Checkout thành công")
                .build();
    }

    // ================= Helper =================
    private CartResponse mapToCartResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(i -> {
                    CartItemResponse res = new CartItemResponse();
                    res.setId(i.getId());
                    res.setCourseId(i.getCourseId());
                    res.setFinalPrice(i.getPriceSnapshot());
                    res.setListPrice(i.getPriceSnapshot());
                    res.setDiscountPrice(i.getPriceSnapshot());
                    res.setAppliedCoupon(i.getCouponCode());
                    res.setValid(true);
                    return res;
                })
                .collect(Collectors.toList());

        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setLearnerId(cart.getLearnerId());
        response.setStatus(cart.getStatus().name());
        response.setExpiresAt(cart.getExpiresAt());
        response.setItems(items);
        response.setTotalAmount(items.stream()
                .map(CartItemResponse::getFinalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        return response;
    }
}
