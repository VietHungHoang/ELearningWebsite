package com.elearning.bookingservice.service.impl;

import com.elearning.bookingservice.service.BookingService;
import com.elearning.bookingservice.client.PaymentServiceClient;
import com.elearning.bookingservice.dto.request.CreateBookingRequest;
import com.elearning.bookingservice.dto.request.CreateBookingResponse;
import com.elearning.bookingservice.dto.request.CreatePaymentRequest;
import com.elearning.bookingservice.dto.response.CreatePaymentResponse;
import com.elearning.bookingservice.entity.Booking;
import com.elearning.bookingservice.entity.BookingStatus;
import com.elearning.bookingservice.entity.PaymentProvider;
import com.elearning.bookingservice.repository.BookingRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    @Transactional
    public CreateBookingResponse createBooking(CreateBookingRequest request) {
        log.info("Creating booking for student: {}, tutor: {}", request.getStudentId(), request.getTutorId());

        // Serialize schedule to JSON array
        String scheduleJson;
        try {
            scheduleJson = objectMapper.writeValueAsString(request.getSchedule());
        } catch (Exception e) {
            log.error("Error serializing schedule to JSON", e);
            throw new RuntimeException("Failed to serialize schedule", e);
        }

        // Create Booking record - classId will be set later after class is created
        Booking booking = Booking.builder()
                .studentId(request.getStudentId())
                .tutorId(request.getTutorId())
                .classId(null) // Will be set after payment success via Kafka event
                .sessionsPurchased(request.getSessions())
                .discount(request.getDiscount())
                .amount(request.getAmount())
                .paymentProvider(PaymentProvider.valueOf(request.getPaymentProvider().toUpperCase()))
                .schedule(scheduleJson)
                .status(BookingStatus.PENDING)
                .build();

        booking = bookingRepository.save(booking);
        log.info("Created booking record with ID: {}", booking.getId());

        // Call payment service to create payment request
        CreatePaymentRequest paymentRequest = CreatePaymentRequest.builder()
                .orderId(booking.getId())
                .userId(request.getStudentId()) // Pass studentId as userId for payment
                .amount(request.getAmount())
                .paymentProvider(request.getPaymentProvider())
                .redirectUrl(request.getRedirectUrl())
                .build();

        CreatePaymentResponse paymentResponse = paymentServiceClient.createPayment(paymentRequest);
        log.info("Created payment with ID: {} and status: {}", paymentResponse.getPaymentId(), paymentResponse.getStatus());

        return CreateBookingResponse.builder()
                .bookingId(booking.getId())
                .paymentId(paymentResponse.getPaymentId())
                .provider(paymentResponse.getProvider())
                .status(paymentResponse.getStatus())
                .paymentMethodType(paymentResponse.getPaymentMethodType())
                .paymentData(CreateBookingResponse.PaymentData.builder()
                        .redirectUrl(paymentResponse.getPaymentData() != null ? paymentResponse.getPaymentData().getRedirectUrl() : null)
                        .qrCodeContent(paymentResponse.getPaymentData() != null ? paymentResponse.getPaymentData().getQrCodeContent() : null)
                        .sdkParameters(paymentResponse.getPaymentData() != null ? paymentResponse.getPaymentData().getSdkParameters() : null)
                        .build())
                .build();
    }
}