package com.elearning.bookingservice.controller;

import com.elearning.bookingservice.dto.response.ApiResponse;
import com.elearning.bookingservice.dto.response.BookingHistoryResponse;
import com.elearning.bookingservice.dto.response.TransactionDetailResponse;
import com.elearning.bookingservice.entity.Booking;
import com.elearning.bookingservice.entity.ClassInfo;
import com.elearning.bookingservice.repository.BookingRepository;
import com.elearning.bookingservice.repository.ClassInfoRepository;
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
        private final ClassInfoRepository classInfoRepository;

        /**
         * GET /api/v1/admin/transactions
         * Get all transactions (bookings) with pagination, sorting, and filters
         * 
         * @param page          Page number (0-indexed)
         * @param size          Page size
         * @param sortOrder     Sort order (asc or desc), default desc
         * @param search        Search term (searches in studentId, tutorName,
         *                      transactionId)
         * @param status        Filter by booking status
         * @param paymentMethod Filter by payment provider (MOMO, VNPAY, SEPAY)
         * @param startDate     Filter by start date (ISO format)
         * @param endDate       Filter by end date (ISO format)
         * @return Page of BookingHistoryResponse
         */
        @GetMapping("/transactions")
        public ResponseEntity<ApiResponse<Page<BookingHistoryResponse>>> getAllTransactions(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @RequestParam(defaultValue = "desc") String sortOrder) {

                log.info("Admin fetching transactions - page: {}, size: {}, sortOrder: {}", page, size, sortOrder);

                Sort sort = "asc".equalsIgnoreCase(sortOrder)
                                ? Sort.by("createdAt").ascending()
                                : Sort.by("createdAt").descending();

                Pageable pageable = PageRequest.of(page, size, sort);

                // Simple findAll with pagination
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

        /**
         * GET /api/v1/admin/transactions/{id}
         * Get transaction detail by ID
         * 
         * @param id Transaction/Booking ID
         * @return TransactionDetailResponse with full booking, student, tutor, and
         *         class info
         */
        @GetMapping("/transactions/{id}")
        public ResponseEntity<ApiResponse<TransactionDetailResponse>> getTransactionById(
                        @PathVariable java.util.UUID id) {
                log.info("Admin fetching transaction detail for id: {}", id);

                Booking booking = bookingRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));

                // Get class info if classId exists
                String className = null;
                String classType = null;
                if (booking.getClassId() != null) {
                        ClassInfo classInfo = classInfoRepository.findByClassId(booking.getClassId()).orElse(null);
                        if (classInfo != null) {
                                className = classInfo.getTitle();
                                classType = classInfo.getClassType();
                        }
                }

                TransactionDetailResponse response = TransactionDetailResponse.builder()
                                .id(booking.getId())
                                .transactionId(booking.getTransactionId())
                                .providerTransactionId(booking.getProviderTransactionId())
                                .amount(booking.getAmount())
                                .discount(booking.getDiscount())
                                .pricePerSession(booking.getPricePerSession())
                                .sessionsPurchased(booking.getSessionsPurchased())
                                .paymentProvider(booking.getPaymentProvider())
                                .status(booking.getStatus())
                                .schedule(booking.getSchedule())
                                .notes(booking.getNotes())
                                .createdAt(booking.getCreatedAt())
                                .updatedAt(booking.getUpdatedAt())
                                .studentId(booking.getStudentId())
                                .tutorId(booking.getTutorId())
                                .tutorName(booking.getTutorName())
                                .classId(booking.getClassId())
                                .className(className)
                                .classType(classType)
                                .build();

                return ResponseEntity.ok(ApiResponse.success(response, "Transaction detail retrieved successfully"));
        }
}
