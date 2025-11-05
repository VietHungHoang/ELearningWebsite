package com.elearning.bffservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import com.elearning.bffservice.client.CartServiceClient;
import com.elearning.bffservice.client.CourseServiceClient;
import com.elearning.bffservice.dto.request.AddToCartRequest;
import com.elearning.bffservice.dto.request.ApplyCouponRequest;
import com.elearning.bffservice.dto.request.CheckoutRequest;
import com.elearning.bffservice.bff.response.AddToCartBFFResponse;
import com.elearning.bffservice.bff.response.ApplyCouponBFFResponse;
import com.elearning.bffservice.bff.response.CheckoutBFFResponse;
import com.elearning.bffservice.bff.response.RemoveFromCartBFFResponse;
import com.elearning.bffservice.bff.response.ViewCartBFFResponse;
import com.elearning.bffservice.dto.response.CartResponse;
import com.elearning.bffservice.service.CartService;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartServiceClient cartServiceClient;
    private final CourseServiceClient courseServiceClient;

    @Override
    public ViewCartBFFResponse getCart(String learnerId) {
        CartResponse cart = cartServiceClient.getCart(learnerId);

        if (cart == null) {
            return ViewCartBFFResponse.builder()
                    .cartId(null)
                    .learnerId(learnerId) // String thay vì Long
                    .items(java.util.Collections.emptyList())
                    .subtotal(java.math.BigDecimal.ZERO)
                    .discountAmount(java.math.BigDecimal.ZERO)
                    .totalAmount(java.math.BigDecimal.ZERO)
                    .discountPercentage(0)
                    .availableCoupons(java.util.Collections.emptyList())
                    .build();
        }

        List<ViewCartBFFResponse.CartItemBFF> enrichedItems = cart.getItems().stream()
                .map(item -> {
                    CourseServiceClient.CourseBasicInfo courseInfo = courseServiceClient
                            .getCourseBasicInfo(item.getCourseId());

                    return ViewCartBFFResponse.CartItemBFF.builder()
                            .id(item.getId())
                            .courseId(item.getCourseId())
                            .courseTitle(courseInfo != null ? courseInfo.getTitle()
                                    : "Unknown Course")
                            .instructorName(courseInfo != null
                                    ? courseInfo.getInstructorName()
                                    : "Unknown Instructor")
                            .price(courseInfo != null ? courseInfo.getPrice()
                                    : java.math.BigDecimal.ZERO)
                            .build();
                })
                .collect(Collectors.toList());

        java.math.BigDecimal subtotal = enrichedItems.stream()
                .map(item -> item.getPrice())
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        List<String> availableCoupons = cart.getItems().stream()
                .map(item -> courseServiceClient.getCourseBasicInfo(item.getCourseId()))
                .filter(courseInfo -> courseInfo != null && courseInfo.getAvailableCoupons() != null)
                .flatMap(courseInfo -> courseInfo.getAvailableCoupons().stream())
                .distinct()
                .collect(Collectors.toList());

        java.math.BigDecimal discountAmount = java.math.BigDecimal.ZERO;
        java.math.BigDecimal totalAmount = subtotal.subtract(discountAmount);

        return ViewCartBFFResponse.builder()
                .cartId(cart.getId())
                .learnerId(learnerId)
                .items(enrichedItems)
                .subtotal(subtotal)
                .discountAmount(discountAmount)
                .totalAmount(totalAmount)
                .discountPercentage(0)
                .availableCoupons(availableCoupons)
                .build();
    }

    @Override
    public AddToCartBFFResponse addToCart(String learnerId, AddToCartRequest request) {
        CartResponse updatedCart = cartServiceClient.addToCart(learnerId, request);

        return AddToCartBFFResponse.builder()
                .cartId(updatedCart.getId())
                .courseId(request.getCourseId())
                .itemCount(updatedCart.getItems() != null ? updatedCart.getItems().size() : 0)
                .totalAmount(updatedCart.getTotalAmount())
                .build();
    }

    @Override
    public RemoveFromCartBFFResponse removeItem(String learnerId, Long courseId) {
        CartResponse updatedCart = cartServiceClient.removeItem(String.valueOf(learnerId), courseId);

        return RemoveFromCartBFFResponse.builder()
                .cartId(updatedCart.getId())
                .courseId(courseId)
                .itemCount(updatedCart.getItems() != null ? updatedCart.getItems().size() : 0)
                .totalAmount(updatedCart.getTotalAmount())
                .build();
    }

    @Override
    public ApplyCouponBFFResponse applyCoupon(String learnerId, ApplyCouponRequest request) {

        CartResponse updatedCart = cartServiceClient.applyCoupon(learnerId,
                request.getCourseId(),
                request.getCouponCode());

        java.math.BigDecimal discountAmount = java.math.BigDecimal.ZERO; // TODO: implement actual discount
                                                                         // logic
        java.math.BigDecimal totalAmount = updatedCart != null ? updatedCart.getTotalAmount()
                : java.math.BigDecimal.ZERO;

        return ApplyCouponBFFResponse.builder()
                .cartId(updatedCart != null ? updatedCart.getId() : null)
                .courseId(request.getCourseId())
                .couponCode(request.getCouponCode())
                .discountAmount(discountAmount)
                .totalAmount(totalAmount)
                .itemCount(updatedCart != null && updatedCart.getItems() != null
                        ? updatedCart.getItems().size()
                        : 0)
                .build();
    }

    @Override
    public CheckoutBFFResponse checkout(String learnerId, CheckoutRequest request) {
        CartResponse checkoutResult = cartServiceClient.checkout(learnerId);

        if (checkoutResult == null) {
            return CheckoutBFFResponse.builder()
                    .orderId(null)
                    .totalAmount(java.math.BigDecimal.ZERO)
                    .message("Checkout failed: empty response from service")
                    .build();
        }

        return CheckoutBFFResponse.builder()
                .orderId(checkoutResult.getId())
                .totalAmount(checkoutResult.getTotalAmount())
                .message("Checkout processed successfully")
                .build();
    }
}