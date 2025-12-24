package com.elearning.bookingservice.service.impl;

import com.elearning.bookingservice.service.BookingService;
import com.elearning.bookingservice.client.ClassServiceClient;
import com.elearning.bookingservice.client.PaymentServiceClient;
import com.elearning.bookingservice.dto.request.CreateBookingRequest;
import com.elearning.bookingservice.dto.request.CreateBookingResponse;
import com.elearning.bookingservice.dto.request.CreateClassBookingRequest;
import com.elearning.bookingservice.dto.request.CreatePaymentRequest;
import com.elearning.bookingservice.dto.response.CreateClassBookingResponse;
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

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation of BookingService
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final ClassServiceClient classServiceClient;
    private final PaymentServiceClient paymentServiceClient;
    private final BookingRepository bookingRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    @Transactional
    public CreateBookingResponse createBooking(CreateBookingRequest request) {
        log.info("Creating booking for student: {}, tutor: {}", request.getStudentId(), request.getTutorId());

        // Create Booking record first
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
                .classId(null) // Will be updated after API call
                .sessionsPurchased(request.getSessions())
                .discount(request.getDiscount())
                .amount(request.getAmount())
                .paymentProvider(PaymentProvider.valueOf(request.getPaymentProvider().toUpperCase()))
                .schedule(scheduleJson)
                .status(BookingStatus.PENDING)
                .build();

        booking = bookingRepository.save(booking);
        log.info("Created booking record with ID: {}", booking.getId());

        // Now call class-service to create class, enrollment, sessions
        List<CreateClassBookingRequest.ScheduleItem> scheduleItems = request.getSchedule().stream()
                .map(item -> CreateClassBookingRequest.ScheduleItem.builder().time(item.getTime()).build())
                .collect(Collectors.toList());

        CreateClassBookingRequest classBookingRequest = CreateClassBookingRequest.builder()
                .tutorId(request.getTutorId())
                .studentId(request.getStudentId())
                .sessions(request.getSessions())
                .pricePerHour(request.getAmount() / request.getSessions())
                .schedule(scheduleItems)
                .build();

        CreateClassBookingResponse classBookingResponse = classServiceClient.createClassBooking(classBookingRequest);
        UUID classId = classBookingResponse.getClassId();
        log.info("Created class booking with classId: {}", classId);

        // Update booking with classId
        booking.setClassId(classId);
        bookingRepository.save(booking);
        log.info("Updated booking {} with classId: {}", booking.getId(), classId);

        // Call payment service to create payment request
        CreatePaymentRequest paymentRequest = CreatePaymentRequest.builder()
                .orderId(booking.getId())
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