package com.elearning.bookingservice.controller;

import com.elearning.bookingservice.dto.response.ApiResponse;
import com.elearning.bookingservice.dto.response.BookingHistoryResponse;
import com.elearning.bookingservice.entity.Booking;
import com.elearning.bookingservice.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Admin Controller for booking-related admin operations
 * All endpoints require admin authentication (handled by API Gateway)
 */
@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final BookingRepository bookingRepository;

    /**
     * GET /api/v1/admin/transactions
     * Get all transactions (bookings) with pagination and sorting
     * 
     * @param page      Page number (0-indexed)
     * @param size      Page size
     * @param sortOrder Sort order (asc or desc), default desc
     * @return Page of BookingHistoryResponse
     */
    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<Page<BookingHistoryResponse>>> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "desc") String sortOrder) {

        log.info("Admin fetching all transactions - page: {}, size: {}, sortOrder: {}", page, size, sortOrder);

        Sort sort = "asc".equalsIgnoreCase(sortOrder)
                ? Sort.by("createdAt").ascending()
                : Sort.by("createdAt").descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Booking> bookings = bookingRepository.findAll(pageable);

        Page<BookingHistoryResponse> transactions = bookings.map(booking -> BookingHistoryResponse.builder()
                .id(booking.getId())
                .studentId(booking.getStudentId())
                .tutorId(booking.getTutorId())
                .tutorName(booking.getTutorName())
                .classId(booking.getClassId())
                .sessionsPurchased(booking.getSessionsPurchased())
                .discount(booking.getDiscount())
                .pricePerSession(booking.getPricePerSession())
                .amount(booking.getAmount())
                .paymentProvider(booking.getPaymentProvider())
                .transactionId(booking.getTransactionId())
                .providerTransactionId(booking.getProviderTransactionId())
                .schedule(booking.getSchedule())
                .status(booking.getStatus())
                .notes(booking.getNotes())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build());

        return ResponseEntity.ok(ApiResponse.success(transactions, "Transactions retrieved successfully"));
    }
}
