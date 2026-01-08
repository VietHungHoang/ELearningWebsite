package com.elearning.bookingservice.service.impl;

import com.elearning.bookingservice.service.BookingService;
import com.elearning.bookingservice.service.BookingMetadataCache;
import com.elearning.bookingservice.client.PaymentServiceClient;
import com.elearning.bookingservice.dto.request.CreateBookingRequest;
import com.elearning.bookingservice.dto.request.CreateBookingResponse;
import com.elearning.bookingservice.dto.request.CreatePaymentRequest;
import com.elearning.bookingservice.dto.response.BookingHistoryResponse;
import com.elearning.bookingservice.dto.response.CreatePaymentResponse;
import com.elearning.bookingservice.entity.Booking;
import com.elearning.bookingservice.entity.BookingStatus;
import com.elearning.bookingservice.entity.ClassInfo;
import com.elearning.bookingservice.entity.PaymentProvider;
import com.elearning.bookingservice.repository.BookingRepository;
import com.elearning.bookingservice.repository.ClassInfoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Implementation of BookingService
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

        private final PaymentServiceClient paymentServiceClient;
        private final BookingRepository bookingRepository;
        private final ClassInfoRepository classInfoRepository;
        private final BookingMetadataCache metadataCache;
        private final ObjectMapper objectMapper = new ObjectMapper();

        @Override
        public CreateBookingResponse createBooking(CreateBookingRequest request) {
                log.info("Creating booking for student: {}, tutor: {}", request.getStudentId(), request.getTutorId());

                // Step 1: Save booking (short transaction - releases connection quickly)
                Booking booking = saveBooking(request);
                log.info("Created booking record with ID: {}", booking.getId());

                // Step 1.5: Save locale to Redis cache (not persisted in DB)
                if (request.getLocale() != null) {
                        metadataCache.saveLocale(booking.getId(), request.getLocale());
                }

                // Step 2: Call payment service OUTSIDE transaction (no DB connection held)
                CreatePaymentRequest paymentRequest = CreatePaymentRequest.builder()
                                .orderId(booking.getId())
                                .userId(request.getStudentId())
                                .amount(request.getAmount())
                                .paymentProvider(request.getPaymentProvider())
                                .redirectUrl(request.getRedirectUrl())
                                .build();

                CreatePaymentResponse paymentResponse = paymentServiceClient.createPayment(paymentRequest);
                log.info("Created payment with ID: {} and status: {}",
                                paymentResponse.getPaymentId(),
                                paymentResponse.getStatus());

                return CreateBookingResponse.builder()
                                .bookingId(booking.getId())
                                .paymentId(paymentResponse.getPaymentId())
                                .provider(paymentResponse.getProvider())
                                .status(paymentResponse.getStatus())
                                .paymentMethodType(paymentResponse.getPaymentMethodType())
                                .paymentData(CreateBookingResponse.PaymentData.builder()
                                                .redirectUrl(paymentResponse.getPaymentData() != null
                                                                ? paymentResponse.getPaymentData().getRedirectUrl()
                                                                : null)
                                                .qrCodeContent(paymentResponse.getPaymentData() != null
                                                                ? paymentResponse.getPaymentData().getQrCodeContent()
                                                                : null)
                                                .sdkParameters(paymentResponse.getPaymentData() != null
                                                                ? paymentResponse.getPaymentData().getSdkParameters()
                                                                : null)
                                                .build())
                                .build();
        }

        @Override
        @Transactional(readOnly = true)
        public Page<BookingHistoryResponse> getBookingHistory(UUID studentId, BookingStatus status, Pageable pageable) {
                log.info("Fetching booking history for student: {}, status: {}", studentId, status);

                Page<Booking> bookings;
                if (status != null) {
                        bookings = bookingRepository.findByStudentIdAndStatus(studentId, status, pageable);
                } else {
                        bookings = bookingRepository.findByStudentId(studentId, pageable);
                }

                return bookings.map(this::mapToBookingHistoryResponse);
        }

        private BookingHistoryResponse mapToBookingHistoryResponse(Booking booking) {
                // Get class info from ClassInfo if classId exists
                String className = null;
                String classType = null;
                if (booking.getClassId() != null) {
                        classInfoRepository.findByClassId(booking.getClassId())
                                        .ifPresent(classInfo -> {
                                                // Using local variables to capture values
                                        });
                        // Get both className and classType
                        var classInfoOpt = classInfoRepository.findByClassId(booking.getClassId());
                        if (classInfoOpt.isPresent()) {
                                className = classInfoOpt.get().getTitle();
                                classType = classInfoOpt.get().getClassType();
                        }
                }

                return BookingHistoryResponse.builder()
                                .id(booking.getId())
                                .studentId(booking.getStudentId())
                                .tutorId(booking.getTutorId())
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
                                .className(className)
                                .classType(classType)
                                .build();
        }

        /**
         * Save booking in a separate short transaction to release DB connection quickly
         */
        @Transactional
        protected Booking saveBooking(CreateBookingRequest request) {
                // Serialize schedule to JSON array
                String scheduleJson;
                try {
                        scheduleJson = objectMapper.writeValueAsString(request.getSchedule());
                } catch (Exception e) {
                        log.error("Error serializing schedule to JSON", e);
                        throw new RuntimeException("Failed to serialize schedule", e);
                }

                Booking booking = Booking.builder()
                                .studentId(request.getStudentId())
                                .tutorId(request.getTutorId())
                                .tutorName(request.getTutorName())
                                .classId(null)
                                .sessionsPurchased(request.getSessions())
                                .discount(request.getDiscount())
                                .amount(request.getAmount())
                                .paymentProvider(PaymentProvider.valueOf(request.getPaymentProvider().toUpperCase()))
                                .schedule(scheduleJson)
                                .status(BookingStatus.PENDING)
                                .build();

                return bookingRepository.save(booking);
        }
}