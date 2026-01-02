package com.elearning.bookingservice.service;

import com.elearning.bookingservice.dto.request.CreateDiscountRequest;
import com.elearning.bookingservice.dto.request.UpdateDiscountRequest;
import com.elearning.bookingservice.dto.request.ValidateDiscountRequest;
import com.elearning.bookingservice.dto.response.DiscountResponse;
import com.elearning.bookingservice.dto.response.ValidateDiscountResponse;
import com.elearning.bookingservice.entity.*;
import com.elearning.bookingservice.repository.DiscountRepository;
import com.elearning.bookingservice.repository.DiscountUsageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DiscountService {

    private final DiscountRepository discountRepository;
    private final DiscountUsageRepository discountUsageRepository;

    @Transactional
    public DiscountResponse createDiscount(CreateDiscountRequest request, UUID createdBy, CreatorRole role) {
        if (discountRepository.existsByCode(request.getCode())) {
            throw new IllegalArgumentException("Discount code already exists");
        }

        Discount discount = Discount.builder()
                .code(request.getCode().toUpperCase())
                .type(request.getType())
                .discountValue(request.getDiscountValue())
                .maxDiscount(request.getMaxDiscount())
                .maxUses(request.getMaxUses())
                .maxUsesPerUser(request.getMaxUsesPerUser() != null ? request.getMaxUsesPerUser() : 1)
                .minOrderValue(request.getMinOrderValue() != null ? request.getMinOrderValue() : BigDecimal.ZERO)
                .applyTo(request.getApplyTo())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .scope(role == CreatorRole.ADMIN ? DiscountScope.PLATFORM : DiscountScope.TUTOR)
                .createdBy(createdBy)
                .createdByRole(role)
                .description(request.getDescription())
                .isActive(true)
                .build();

        discount = discountRepository.save(discount);
        log.info("Created discount: {} by {}", discount.getCode(), createdBy);
        return DiscountResponse.from(discount);
    }

    public Page<DiscountResponse> getDiscountsByTutor(UUID tutorId, Pageable pageable) {
        return discountRepository.findByCreatedByOrderByCreatedAtDesc(tutorId, pageable)
                .map(DiscountResponse::from);
    }

    public Page<DiscountResponse> getAllDiscounts(Pageable pageable) {
        return discountRepository.findAll(pageable).map(DiscountResponse::from);
    }

    public DiscountResponse getDiscountById(UUID id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Discount not found"));
        return DiscountResponse.from(discount);
    }

    @Transactional
    public DiscountResponse updateDiscount(UUID id, UpdateDiscountRequest request, UUID userId) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Discount not found"));

        // Check ownership for tutors
        if (discount.getCreatedByRole() == CreatorRole.TUTOR && !discount.getCreatedBy().equals(userId)) {
            throw new IllegalArgumentException("You can only update your own discounts");
        }

        if (request.getCode() != null) discount.setCode(request.getCode().toUpperCase());
        if (request.getType() != null) discount.setType(request.getType());
        if (request.getDiscountValue() != null) discount.setDiscountValue(request.getDiscountValue());
        if (request.getMaxDiscount() != null) discount.setMaxDiscount(request.getMaxDiscount());
        if (request.getMaxUses() != null) discount.setMaxUses(request.getMaxUses());
        if (request.getMaxUsesPerUser() != null) discount.setMaxUsesPerUser(request.getMaxUsesPerUser());
        if (request.getMinOrderValue() != null) discount.setMinOrderValue(request.getMinOrderValue());
        if (request.getApplyTo() != null) discount.setApplyTo(request.getApplyTo());
        if (request.getStartDate() != null) discount.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) discount.setEndDate(request.getEndDate());
        if (request.getDescription() != null) discount.setDescription(request.getDescription());
        if (request.getIsActive() != null) discount.setIsActive(request.getIsActive());

        discount = discountRepository.save(discount);
        log.info("Updated discount: {}", discount.getCode());
        return DiscountResponse.from(discount);
    }

    @Transactional
    public void toggleDiscount(UUID id, UUID userId) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Discount not found"));

        if (discount.getCreatedByRole() == CreatorRole.TUTOR && !discount.getCreatedBy().equals(userId)) {
            throw new IllegalArgumentException("You can only toggle your own discounts");
        }

        discount.setIsActive(!discount.getIsActive());
        discountRepository.save(discount);
        log.info("Toggled discount {} to {}", discount.getCode(), discount.getIsActive());
    }

    @Transactional
    public void deleteDiscount(UUID id, UUID userId) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Discount not found"));

        if (discount.getCreatedByRole() == CreatorRole.TUTOR && !discount.getCreatedBy().equals(userId)) {
            throw new IllegalArgumentException("You can only delete your own discounts");
        }

        discount.setIsActive(false);
        discountRepository.save(discount);
        log.info("Deactivated discount: {}", discount.getCode());
    }

    public ValidateDiscountResponse validateDiscount(ValidateDiscountRequest request, UUID userId, UUID tutorId) {
        Discount discount = discountRepository.findByCode(request.getCode().toUpperCase()).orElse(null);

        if (discount == null) {
            return ValidateDiscountResponse.builder()
                    .valid(false)
                    .message("Discount code not found")
                    .build();
        }

        // Check active
        if (!discount.getIsActive()) {
            return ValidateDiscountResponse.builder()
                    .valid(false)
                    .message("Discount is inactive")
                    .build();
        }

        // Check date
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(discount.getStartDate())) {
            return ValidateDiscountResponse.builder()
                    .valid(false)
                    .message("Discount is not yet active")
                    .build();
        }
        if (now.isAfter(discount.getEndDate())) {
            return ValidateDiscountResponse.builder()
                    .valid(false)
                    .message("Discount has expired")
                    .build();
        }

        // Check max uses
        if (discount.getMaxUses() != null && discount.getCurrentUses() >= discount.getMaxUses()) {
            return ValidateDiscountResponse.builder()
                    .valid(false)
                    .message("Discount usage limit reached")
                    .build();
        }

        // Check user usage
        long userUsageCount = discountUsageRepository.countByDiscountIdAndUserId(discount.getId(), userId);
        if (userUsageCount >= discount.getMaxUsesPerUser()) {
            return ValidateDiscountResponse.builder()
                    .valid(false)
                    .message("You have already used this discount")
                    .build();
        }

        // Check min order value
        if (request.getAmount().compareTo(discount.getMinOrderValue()) < 0) {
            return ValidateDiscountResponse.builder()
                    .valid(false)
                    .message("Minimum order value is " + discount.getMinOrderValue())
                    .build();
        }

        // Check scope
        if (discount.getScope() == DiscountScope.TUTOR && !discount.getCreatedBy().equals(tutorId)) {
            return ValidateDiscountResponse.builder()
                    .valid(false)
                    .message("Discount not applicable for this class")
                    .build();
        }

        // Calculate discount
        BigDecimal discountAmount = calculateDiscount(discount, request.getAmount());
        BigDecimal finalAmount = request.getAmount().subtract(discountAmount);

        return ValidateDiscountResponse.builder()
                .valid(true)
                .message("Discount applied successfully")
                .discountAmount(discountAmount)
                .finalAmount(finalAmount)
                .build();
    }

    private BigDecimal calculateDiscount(Discount discount, BigDecimal amount) {
        if (discount.getType() == DiscountType.PERCENTAGE) {
            BigDecimal percentDiscount = amount.multiply(discount.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (discount.getMaxDiscount() != null) {
                return percentDiscount.min(discount.getMaxDiscount());
            }
            return percentDiscount;
        } else {
            return discount.getDiscountValue().min(amount);
        }
    }
}
