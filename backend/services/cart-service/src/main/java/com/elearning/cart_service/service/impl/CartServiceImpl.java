package com.elearning.cart_service.service.impl;

import com.elearning.cart_service.dto.request.AddToCartRequest;
import com.elearning.cart_service.dto.request.ApplyCouponRequest;
import com.elearning.cart_service.dto.request.CheckoutRequest;
import com.elearning.cart_service.dto.response.CartResponse;
import com.elearning.cart_service.dto.response.CartItemResponse;
import com.elearning.cart_service.dto.response.CheckoutResponse;
import com.elearning.cart_service.enums.CartStatus;
import com.elearning.cart_service.model.Cart;
import com.elearning.cart_service.model.CartItem;
import com.elearning.cart_service.repository.CartRepository;
import com.elearning.cart_service.repository.CartItemRepository;
import com.elearning.cart_service.service.CartService;
import com.elearning.cart_service.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    public CartResponse getCart(Long learnerId) {
        Cart cart = getOrCreateCart(learnerId);
        return mapToCartResponse(cart);
    }

    @Override
    public CartResponse addToCart(Long learnerId, AddToCartRequest request) {
        Cart cart = getOrCreateCart(learnerId);

        // Check if course already exists in cart
        boolean exists = cart.getItems().stream()
                .anyMatch(item -> item.getCourseId().equals(request.getCourseId()));

        if (exists) {
            throw new RuntimeException("Course already exists in cart");
        }

        // Create new cart item with mock data
        CartItem cartItem = CartItem.builder()
                .cart(cart)
                .courseId(request.getCourseId())
                .priceSnapshot(getMockPrice(request.getCourseId()))
                .finalPrice(getMockPrice(request.getCourseId()))

                .name(getMockCourseName(request.getCourseId()))
                .category(getMockCourseCategory(request.getCourseId()))
                .tutor(getMockInstructorName(request.getCourseId()))
                .image(getMockThumbnailUrl(request.getCourseId()))
                .rating(getMockRating(request.getCourseId()))
                .reviews(getMockReviews(request.getCourseId()))
                .level(getMockLevel(request.getCourseId()))
                .language(getMockLanguage(request.getCourseId()))
                .lessons(getMockLessons(request.getCourseId()))
                .duration(getMockDuration(request.getCourseId()))
                .totalStudents(getMockTotalStudents(request.getCourseId()))
                .description(getMockDescription(request.getCourseId()))
                .instructorAvatar(getMockInstructorAvatar(request.getCourseId()))
                .hasCertificate(getMockHasCertificate(request.getCourseId()))
                .lastUpdated(LocalDateTime.now().toString())
                .availableCoupon(getMockAvailableCoupon(request.getCourseId()))
                .build();

        cart.getItems().add(cartItem);
        cartRepository.save(cart);

        return mapToCartResponse(cart);
    }

    private String getMockCourseName(Long courseId) {
        return switch (courseId.intValue()) {
            case 1 -> "Mastering Algebra";
            case 2 -> "Intro to Physics";
            case 3 -> "Digital Art Fundamentals";
            default -> "Course " + courseId;
        };
    }

    private String getMockCourseCategory(Long courseId) {
        return switch (courseId.intValue()) {
            case 1 -> "Mathematics";
            case 2 -> "Science";
            case 3 -> "Art";
            default -> "General";
        };
    }

    private String getMockInstructorName(Long courseId) {
        return switch (courseId.intValue()) {
            case 1 -> "Cynthia Hunter";
            case 2 -> "Steven Ford";
            case 3 -> "Arianne Kearns";
            default -> "Unknown Instructor";
        };
    }

    private String getMockThumbnailUrl(Long courseId) {
        return switch (courseId.intValue()) {
            case 1 -> "https://picsum.photos/seed/course1/128/128";
            case 2 -> "https://picsum.photos/seed/course2/128/128";
            case 3 -> "https://picsum.photos/seed/course4/128/128";
            default -> "/assets/images/course/default.jpg";
        };
    }

    private Double getMockRating(Long courseId) {
        return switch (courseId.intValue()) {
            case 1 -> 4.9;
            case 2 -> 4.8;
            case 3 -> 4.9;
            default -> 4.0;
        };
    }

    private Integer getMockReviews(Long courseId) {
        return switch (courseId.intValue()) {
            case 1 -> 150;
            case 2 -> 142;
            case 3 -> 212;
            case 4 -> 320;
            default -> 0;
        };
    }

    private BigDecimal getMockPrice(Long courseId) {
        return switch (courseId.intValue()) {
            case 1 -> BigDecimal.valueOf(99.99);
            case 2 -> BigDecimal.valueOf(129.99);
            case 3 -> BigDecimal.valueOf(149.99);
            case 4 -> BigDecimal.valueOf(199.99);
            default -> BigDecimal.valueOf(99.99);
        };
    }

    private String getMockLevel(Long courseId) {
        return switch (courseId.intValue()) {
            case 1 -> "Beginner";
            case 2 -> "Intermediate";
            case 3 -> "Advanced";
            case 4 -> "All Levels";
            default -> "Beginner";
        };
    }

    private String getMockLanguage(Long courseId) {
        return switch (courseId.intValue()) {
            case 1 -> "English";
            case 2 -> "English";
            case 3 -> "Vietnamese";
            case 4 -> "English";
            default -> "English";
        };
    }

    private Integer getMockLessons(Long courseId) {
        return switch (courseId.intValue()) {
            case 1 -> 24;
            case 2 -> 18;
            case 3 -> 32;
            case 4 -> 42;
            default -> 12;
        };
    }

    private String getMockDuration(Long courseId) {
        return switch (courseId.intValue()) {
            case 1 -> "12 hours";
            case 2 -> "8 hours";
            case 3 -> "16 hours";
            case 4 -> "20 hours";
            default -> "6 hours";
        };
    }

    private Integer getMockTotalStudents(Long courseId) {
        return switch (courseId.intValue()) {
            case 1 -> 2500;
            case 2 -> 1800;
            case 3 -> 3200;
            case 4 -> 5400;
            default -> 500;
        };
    }

    private String getMockDescription(Long courseId) {
        return switch (courseId.intValue()) {
            case 1 -> "Master algebraic concepts with step-by-step guidance from industry experts.";
            case 2 ->
                "Explore the fundamentals of physics through interactive experiments and real-world applications.";
            case 3 -> "Learn digital art techniques using professional tools and industry-standard practices.";
            case 4 -> "Complete Python programming course from basics to advanced projects with hands-on coding.";
            default -> "Learn this amazing course with our expert instructors.";
        };
    }

    private String getMockInstructorAvatar(Long courseId) {
        return switch (courseId.intValue()) {
            case 1 -> "https://picsum.photos/seed/avatar1/64/64";
            case 2 -> "https://picsum.photos/seed/avatar2/64/64";
            case 3 -> "https://picsum.photos/seed/avatar3/64/64";
            case 4 -> "https://picsum.photos/seed/avatar4/64/64";
            default -> "/assets/images/team/avatar.jpg";
        };
    }

    private Boolean getMockHasCertificate(Long courseId) {
        return switch (courseId.intValue()) {
            case 1 -> true;
            case 2 -> true;
            case 3 -> true;
            case 4 -> true;
            default -> true;
        };
    }

    private String getMockAvailableCoupon(Long courseId) {
        return switch (courseId.intValue()) {
            case 1 -> "{\"code\":\"SAVE20\",\"type\":\"percentage\",\"value\":20}";
            case 2 -> "{\"code\":\"LEARN15\",\"type\":\"percentage\",\"value\":15}";
            case 3 -> "{\"code\":\"ARTIST30\",\"type\":\"percentage\",\"value\":30}";
            case 4 -> "{\"code\":\"CODE25\",\"type\":\"percentage\",\"value\":25}";
            default -> "{\"code\":\"SAVE20\",\"type\":\"percentage\",\"value\":20}";
        };
    }

    @Override
    @Transactional
    public CartResponse removeItem(Long learnerId, Long courseId) {

        Cart cart = cartRepository.findByLearnerIdAndStatus(learnerId, CartStatus.OPEN)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        if (!cartItemRepository.existsByCartIdAndCourseId(cart.getId(), courseId)) {
            throw new ResourceNotFoundException("Cart item not found for courseId: " + courseId);
        }
        cartItemRepository.deleteByCartIdAndCourseId(cart.getId(), courseId);

        Cart updatedCart = cartRepository.findById(cart.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found after delete"));

        return mapToCartResponse(updatedCart);
    }

    @Override
    public CheckoutResponse checkout(Long learnerId, CheckoutRequest request) {
        Cart cart = cartRepository.findByLearnerIdAndStatus(learnerId, CartStatus.OPEN)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.setStatus(CartStatus.CONVERTED);
        cartRepository.save(cart);

        BigDecimal totalAmount = cart.getItems().stream()
                .map(CartItem::getFinalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        CheckoutResponse response = new CheckoutResponse();
        response.setOrderId(12345L);
        response.setTotalAmount(totalAmount);
        response.setStatus("COMPLETED");
        response.setMessage("Order placed successfully");

        return response;
    }

    @Override
    public CartResponse applyCoupon(Long learnerId, ApplyCouponRequest request) {
        Cart cart = getOrCreateCart(learnerId);

        cart.getItems().stream()
                .filter(item -> item.getCourseId().equals(request.getCourseId()))
                .findFirst()
                .ifPresent(item -> {
                    item.setCouponCode(request.getCouponCode());
                    if ("SAVE10".equals(request.getCouponCode())) {
                        BigDecimal discount = item.getFinalPrice().multiply(BigDecimal.valueOf(0.1));
                        item.setFinalPrice(item.getFinalPrice().subtract(discount));
                    }
                });

        cartRepository.save(cart);
        return mapToCartResponse(cart);
    }

    private Cart getOrCreateCart(Long learnerId) {
        Optional<Cart> existingCart = cartRepository.findByLearnerIdAndStatus(learnerId, CartStatus.OPEN);

        if (existingCart.isPresent()) {
            return existingCart.get();
        }

        Cart newCart = Cart.builder()
                .learnerId(learnerId)
                .status(CartStatus.OPEN)
                .build();

        return cartRepository.save(newCart);
    }

    private CartResponse mapToCartResponse(Cart cart) {
        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setLearnerId(cart.getLearnerId());
        response.setStatus(cart.getStatus().name());

        BigDecimal totalAmount = cart.getItems().stream()
                .map(CartItem::getFinalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        response.setTotalAmount(totalAmount);

        response.setItems(cart.getItems().stream()
                .map(this::mapToCartItemResponse)
                .toList());

        return response;
    }

    private CartItemResponse mapToCartItemResponse(CartItem item) {
        CartItemResponse response = CartItemResponse.builder()
                .id(item.getId()) 
                .courseId(item.getCourseId()) 
                .name(item.getName() != null ? item.getName() : "Course " + item.getCourseId())
                .category(item.getCategory() != null ? item.getCategory() : "General")
                .tutor(item.getTutor() != null ? item.getTutor() : "Unknown Instructor")
                .price(item.getFinalPrice() != null ? item.getFinalPrice() : BigDecimal.ZERO)
                .image(item.getImage() != null ? item.getImage() : "/assets/images/course/default.jpg")
                .rating(item.getRating() != null ? item.getRating() : 0.0)
                .reviews(item.getReviews() != null ? item.getReviews() : 0)
                .level(item.getLevel() != null ? item.getLevel() : "Beginner")
                .language(item.getLanguage() != null ? item.getLanguage() : "English")
                .lessons(item.getLessons() != null ? item.getLessons() : 0)
                .duration(item.getDuration() != null ? item.getDuration() : "Self-paced")
                .availableCoupon(java.util.Map.of("code", "SAVE20", "type", "percentage", "value", 20))
                .build();

        return response;
    }

}