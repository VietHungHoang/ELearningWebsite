package com.elearning.bookingservice.controller;

import com.elearning.bookingservice.dto.request.CreateDiscountRequest;
import com.elearning.bookingservice.dto.request.UpdateDiscountRequest;
import com.elearning.bookingservice.dto.request.ValidateDiscountRequest;
import com.elearning.bookingservice.dto.response.DiscountResponse;
import com.elearning.bookingservice.dto.response.ValidateDiscountResponse;
import com.elearning.bookingservice.entity.CreatorRole;
import com.elearning.bookingservice.service.DiscountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/v1")
@RequiredArgsConstructor
@Slf4j
public class DiscountController {

    private final DiscountService discountService;

    // ========== TUTOR ENDPOINTS ==========

    @PostMapping("/tutor/discounts")
    public ResponseEntity<DiscountResponse> createTutorDiscount(
            @RequestHeader("X-User-Id") UUID userId,
            @Valid @RequestBody CreateDiscountRequest request) {
        log.info("Tutor {} creating discount: {}", userId, request.getCode());
        DiscountResponse response = discountService.createDiscount(request, userId, CreatorRole.TUTOR);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/tutor/discounts")
    public ResponseEntity<Page<DiscountResponse>> getTutorDiscounts(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<DiscountResponse> discounts = discountService.getDiscountsByTutor(userId, pageable);
        return ResponseEntity.ok(discounts);
    }

    @GetMapping("/tutor/discounts/{id}")
    public ResponseEntity<DiscountResponse> getTutorDiscountById(
            @PathVariable UUID id) {
        DiscountResponse response = discountService.getDiscountById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/tutor/discounts/{id}")
    public ResponseEntity<DiscountResponse> updateTutorDiscount(
            @RequestHeader("X-User-Id") UUID userId,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateDiscountRequest request) {
        log.info("Tutor {} updating discount: {}", userId, id);
        DiscountResponse response = discountService.updateDiscount(id, request, userId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/tutor/discounts/{id}/toggle")
    public ResponseEntity<Map<String, String>> toggleTutorDiscount(
            @RequestHeader("X-User-Id") UUID userId,
            @PathVariable UUID id) {
        log.info("Tutor {} toggling discount: {}", userId, id);
        discountService.toggleDiscount(id, userId);
        return ResponseEntity.ok(Map.of("message", "Discount toggled successfully"));
    }

    @DeleteMapping("/tutor/discounts/{id}")
    public ResponseEntity<Map<String, String>> deleteTutorDiscount(
            @RequestHeader("X-User-Id") UUID userId,
            @PathVariable UUID id) {
        log.info("Tutor {} deleting discount: {}", userId, id);
        discountService.deleteDiscount(id, userId);
        return ResponseEntity.ok(Map.of("message", "Discount deleted successfully"));
    }

    // ========== PUBLIC ENDPOINTS ==========

    @PostMapping("/discounts/validate")
    public ResponseEntity<ValidateDiscountResponse> validateDiscount(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestParam(required = false) UUID tutorId,
            @Valid @RequestBody ValidateDiscountRequest request) {
        log.info("Validating discount {} for user {}", request.getCode(), userId);
        ValidateDiscountResponse response = discountService.validateDiscount(request, userId, tutorId);
        return ResponseEntity.ok(response);
    }

    // ========== ADMIN ENDPOINTS ==========

    @PostMapping("/admin/discounts")
    public ResponseEntity<DiscountResponse> createAdminDiscount(
            @RequestHeader("X-User-Id") UUID userId,
            @Valid @RequestBody CreateDiscountRequest request) {
        log.info("Admin {} creating discount: {}", userId, request.getCode());
        DiscountResponse response = discountService.createDiscount(request, userId, CreatorRole.ADMIN);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/discounts")
    public ResponseEntity<Page<DiscountResponse>> getAllDiscounts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<DiscountResponse> discounts = discountService.getAllDiscounts(pageable);
        return ResponseEntity.ok(discounts);
    }

    @PutMapping("/admin/discounts/{id}")
    public ResponseEntity<DiscountResponse> updateAdminDiscount(
            @RequestHeader("X-User-Id") UUID userId,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateDiscountRequest request) {
        log.info("Admin {} updating discount: {}", userId, id);
        DiscountResponse response = discountService.updateDiscount(id, request, userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/admin/discounts/{id}")
    public ResponseEntity<Map<String, String>> deleteAdminDiscount(
            @RequestHeader("X-User-Id") UUID userId,
            @PathVariable UUID id) {
        log.info("Admin {} deleting discount: {}", userId, id);
        discountService.deleteDiscount(id, userId);
        return ResponseEntity.ok(Map.of("message", "Discount deleted successfully"));
    }
}
