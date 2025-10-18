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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
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

        // Create new cart item
        CartItem cartItem = CartItem.builder()
                .cart(cart)
                .courseId(request.getCourseId())
                .priceSnapshot(BigDecimal.valueOf(99.99)) // Mock price - should get from course service
                .finalPrice(BigDecimal.valueOf(99.99)) // Mock price
                .build();

        cart.getItems().add(cartItem);
        cartRepository.save(cart);

        return mapToCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeItem(Long learnerId, Long courseId) {
        // Find cart of learner
        Cart cart = cartRepository.findByLearnerIdAndStatus(learnerId, CartStatus.OPEN)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        // Check if item exists before deleting
        if (!cartItemRepository.existsByCartIdAndCourseId(cart.getId(), courseId)) {
            throw new ResourceNotFoundException("Cart item not found for courseId: " + courseId);
        }

        // Delete item from cart using repository method
        cartItemRepository.deleteByCartIdAndCourseId(cart.getId(), courseId);

        // Refresh cart after delete to get updated data
        Cart updatedCart = cartRepository.findById(cart.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found after delete"));

        return mapToCartResponse(updatedCart);
    }

    @Override
    public CheckoutResponse checkout(Long learnerId, CheckoutRequest request) {
        Cart cart = cartRepository.findByLearnerIdAndStatus(learnerId, CartStatus.OPEN)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        // Mark cart as converted
        cart.setStatus(CartStatus.CONVERTED);
        cartRepository.save(cart);

        // Calculate total amount
        BigDecimal totalAmount = cart.getItems().stream()
                .map(CartItem::getFinalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Create checkout response
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

        // Find the item and apply coupon (mock logic)
        cart.getItems().stream()
                .filter(item -> item.getCourseId().equals(request.getCourseId()))
                .findFirst()
                .ifPresent(item -> {
                    item.setCouponCode(request.getCouponCode());
                    // Mock discount logic
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

        // Create new cart
        Cart newCart = Cart.builder()
                .learnerId(learnerId)
                .status(CartStatus.OPEN)
                .expiresAt(LocalDateTime.now().plusDays(15))
                .build();

        return cartRepository.save(newCart);
    }

    private CartResponse mapToCartResponse(Cart cart) {
        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setLearnerId(cart.getLearnerId());
        response.setStatus(cart.getStatus().name());
        response.setExpiresAt(cart.getExpiresAt());

        // Calculate total amount
        BigDecimal totalAmount = cart.getItems().stream()
                .map(CartItem::getFinalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        response.setTotalAmount(totalAmount);

        // Map items
        response.setItems(cart.getItems().stream()
                .map(this::mapToCartItemResponse)
                .toList());

        return response;
    }

    private CartItemResponse mapToCartItemResponse(CartItem item) {
    CartItemResponse response = new CartItemResponse();
    response.setId(item.getId());
    response.setCourseId(item.getCourseId());

    // =========================
    // 🔹 MOCK COURSE-SERVICE DATA (UDEMY-STYLE)
    // =========================
    String title = "Unknown Course";
    String instructor = "N/A";
    String instructorAvatar = "/assets/images/team/avatar.jpg";
    String thumbnail = "/assets/images/course/default.jpg";
    String description = "Course description not available";
    String category = "Uncategorized";
    String level = "All Levels";
    BigDecimal listPrice = item.getPriceSnapshot() != null ? item.getPriceSnapshot() : BigDecimal.valueOf(100);
    BigDecimal discount = BigDecimal.ZERO;
    Double rating = 0.0;
    Integer totalRatings = 0;
    Integer totalStudents = 0;
    String duration = "0 hours";
    String language = "English";
    Boolean hasCertificate = true;
    String lastUpdated = LocalDateTime.now().minusDays(30).toString();
    List<String> whatYouWillLearn = new ArrayList<>();
    List<String> requirements = new ArrayList<>();
    List<String> includes = new ArrayList<>();

    // Mock data based on courseId
    switch (item.getCourseId().intValue()) {
        case 1:
            title = "Spring Boot Masterclass: Build Production-Ready Applications";
            instructor = "John Doe";
            instructorAvatar = "/assets/images/team/avatar-01.jpg";
            thumbnail = "/assets/images/course/spring-boot-masterclass.jpg";
            description = "Learn Spring Boot from scratch and build production-ready applications with this comprehensive masterclass.";
            category = "Development";
            level = "Intermediate";
            listPrice = BigDecimal.valueOf(129.99);
            discount = BigDecimal.valueOf(25.00);
            rating = 4.7;
            totalRatings = 1250;
            totalStudents = 8500;
            duration = "12.5 hours";
            language = "English";
            lastUpdated = LocalDateTime.now().minusDays(15).toString();
            whatYouWillLearn = Arrays.asList(
                "Build REST APIs with Spring Boot",
                "Implement Spring Security",
                "Work with Spring Data JPA",
                "Deploy applications to production"
            );
            requirements = Arrays.asList(
                "Basic Java knowledge",
                "Understanding of web development"
            );
            includes = Arrays.asList(
                "12.5 hours on-demand video",
                "Downloadable resources",
                "Full lifetime access",
                "Access on mobile and TV",
                "Certificate of completion"
            );
            break;
            
        case 2:
            title = "React for Beginners: Complete Guide to Modern React";
            instructor = "Jane Smith";
            instructorAvatar = "/assets/images/team/avatar-02.jpg";
            thumbnail = "/assets/images/course/react-beginners.jpg";
            description = "Master React fundamentals and build modern web applications with hooks, context, and best practices.";
            category = "Development";
            level = "Beginner";
            listPrice = BigDecimal.valueOf(99.99);
            discount = BigDecimal.valueOf(15.00);
            rating = 4.5;
            totalRatings = 890;
            totalStudents = 6200;
            duration = "8.5 hours";
            language = "English";
            lastUpdated = LocalDateTime.now().minusDays(45).toString();
            whatYouWillLearn = Arrays.asList(
                "Understand React fundamentals",
                "Work with components and props",
                "Master React hooks",
                "Build real-world applications"
            );
            requirements = Arrays.asList(
                "Basic JavaScript knowledge",
                "HTML and CSS fundamentals"
            );
            includes = Arrays.asList(
                "8.5 hours on-demand video",
                "5 coding exercises",
                "Full lifetime access",
                "Certificate of completion"
            );
            break;
            
        case 3:
            title = "Docker Deep Dive: Containerization for Developers";
            instructor = "Alex Johnson";
            instructorAvatar = "/assets/images/team/avatar-03.jpg";
            thumbnail = "/assets/images/course/docker-deep-dive.jpg";
            description = "Master Docker containerization, orchestration, and deployment strategies for modern applications.";
            category = "DevOps";
            level = "Advanced";
            listPrice = BigDecimal.valueOf(149.99);
            discount = BigDecimal.valueOf(30.00);
            rating = 4.8;
            totalRatings = 650;
            totalStudents = 3200;
            duration = "15.5 hours";
            language = "English";
            lastUpdated = LocalDateTime.now().minusDays(7).toString();
            whatYouWillLearn = Arrays.asList(
                "Master Docker fundamentals",
                "Work with Docker Compose",
                "Implement container orchestration",
                "Deploy to production environments"
            );
            requirements = Arrays.asList(
                "Basic Linux knowledge",
                "Understanding of virtualization"
            );
            includes = Arrays.asList(
                "15.5 hours on-demand video",
                "Docker cheat sheets",
                "Full lifetime access",
                "Certificate of completion",
                "Access on mobile and TV"
            );
            break;
            
        case 4:
            title = "Python Data Science: Complete Machine Learning Bootcamp";
            instructor = "Dr. Sarah Wilson";
            instructorAvatar = "/assets/images/team/avatar-04.jpg";
            thumbnail = "/assets/images/course/python-data-science.jpg";
            description = "Complete guide to Python data science, machine learning, and AI with real-world projects.";
            category = "Data Science";
            level = "Intermediate";
            listPrice = BigDecimal.valueOf(199.99);
            discount = BigDecimal.valueOf(50.00);
            rating = 4.6;
            totalRatings = 2100;
            totalStudents = 15800;
            duration = "22 hours";
            language = "English";
            lastUpdated = LocalDateTime.now().minusDays(20).toString();
            whatYouWillLearn = Arrays.asList(
                "Master Python for data science",
                "Build machine learning models",
                "Work with pandas and numpy",
                "Create data visualizations"
            );
            requirements = Arrays.asList(
                "Basic Python programming",
                "Mathematics fundamentals"
            );
            includes = Arrays.asList(
                "22 hours on-demand video",
                "50+ coding exercises",
                "Full lifetime access",
                "Certificate of completion",
                "Downloadable resources"
            );
            break;
            
        case 5:
            title = "AWS Cloud Architecture: Solutions Architect Professional";
            instructor = "Mike Chen";
            instructorAvatar = "/assets/images/team/avatar-05.jpg";
            thumbnail = "/assets/images/course/aws-cloud-architecture.jpg";
            description = "Master AWS cloud architecture, design patterns, and best practices for enterprise applications.";
            category = "Cloud Computing";
            level = "Advanced";
            listPrice = BigDecimal.valueOf(179.99);
            discount = BigDecimal.valueOf(40.00);
            rating = 4.9;
            totalRatings = 780;
            totalStudents = 4500;
            duration = "18 hours";
            language = "English";
            lastUpdated = LocalDateTime.now().minusDays(10).toString();
            whatYouWillLearn = Arrays.asList(
                "Design scalable AWS architectures",
                "Implement security best practices",
                "Master cost optimization",
                "Deploy high-availability systems"
            );
            requirements = Arrays.asList(
                "AWS fundamentals knowledge",
                "Basic networking concepts"
            );
            includes = Arrays.asList(
                "18 hours on-demand video",
                "Architecture diagrams",
                "Full lifetime access",
                "Certificate of completion",
                "AWS practice exams"
            );
            break;
            
        default:
            // Default mock data for unknown courses
            title = "Premium Course #" + item.getCourseId();
            instructor = "Expert Instructor";
            thumbnail = "/assets/images/course/course-" + (item.getCourseId() % 5 + 1) + ".jpg";
            description = "This is a premium course with comprehensive content and practical exercises.";
            category = "Technology";
            level = "Beginner";
            listPrice = BigDecimal.valueOf(89.99);
            discount = BigDecimal.valueOf(10.00);
            rating = 4.0;
            totalRatings = 100;
            totalStudents = 500;
            duration = "6 hours";
            whatYouWillLearn = Arrays.asList(
                "Learn fundamental concepts",
                "Practice with real examples",
                "Build practical projects"
            );
            includes = Arrays.asList(
                "6 hours on-demand video",
                "Full lifetime access",
                "Certificate of completion"
            );
            break;
    }

    // =========================
    // 🔹 Build Response with Udemy-style data
    // =========================
    response.setCourseTitle(title);
    response.setInstructorName(instructor);
    response.setInstructorAvatar(instructorAvatar);
    response.setThumbnailUrl(thumbnail);
    response.setDescription(description);
    response.setCategory(category);
    response.setLevel(level);
    response.setListPrice(listPrice);
    response.setDiscountPrice(discount);
    response.setFinalPrice(item.getFinalPrice() != null ? item.getFinalPrice() : listPrice.subtract(discount));
    response.setRating(rating);
    response.setTotalRatings(totalRatings);
    response.setTotalStudents(totalStudents);
    response.setDuration(duration);
    response.setLanguage(language);
    response.setHasCertificate(hasCertificate);
    response.setLastUpdated(lastUpdated);
    response.setWhatYouWillLearn(whatYouWillLearn);
    response.setRequirements(requirements);
    response.setIncludes(includes);
    response.setAppliedCoupon(item.getCouponCode());
    response.setValid(true);

    return response;
}
}