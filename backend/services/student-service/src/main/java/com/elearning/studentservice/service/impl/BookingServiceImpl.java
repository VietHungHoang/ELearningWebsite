package com.elearning.studentservice.service.impl;

import com.elearning.studentservice.service.BookingService;
import com.elearning.studentservice.client.ClassServiceClient;
import com.elearning.studentservice.client.PaymentServiceClient;
import com.elearning.studentservice.dto.request.CreateBookingRequest;
import com.elearning.studentservice.dto.request.CreateBookingResponse;
import com.elearning.studentservice.dto.request.CreateClassBookingRequest;
import com.elearning.studentservice.dto.request.CreatePaymentRequest;
import com.elearning.studentservice.dto.response.CreateClassBookingResponse;
import com.elearning.studentservice.dto.response.CreatePaymentResponse;
import com.elearning.studentservice.entity.Booking;
import com.elearning.studentservice.entity.BookingStatus;
import com.elearning.studentservice.entity.PaymentProvider;
import com.elearning.studentservice.repository.BookingRepository;
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
    public CreateBookingResponse createBooking(CreateBookingRequest request, UUID studentId) {
        log.info("Creating booking for student: {}, tutor: {}", studentId, request.getTutorId());

        // Create Booking record first
        String scheduleJson;
        try {
            scheduleJson = objectMapper.writeValueAsString(request.getSchedule());
        } catch (Exception e) {
            log.error("Error serializing schedule to JSON", e);
            throw new RuntimeException("Failed to serialize schedule", e);
        }

        Booking booking = Booking.builder()
                .studentId(studentId)
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
                .studentId(studentId)
                .sessions(request.getSessions())
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
                .bookingId(booking.getId())
                .amount(request.getAmount())
                .paymentProvider(request.getPaymentProvider())
                .redirectUrl(request.getRedirectUrl())
                .build();

        CreatePaymentResponse paymentResponse = paymentServiceClient.createPayment(paymentRequest);
        log.info("Created payment with ID: {} and URL: {}", paymentResponse.getPaymentId(), paymentResponse.getPaymentUrl());

        return CreateBookingResponse.builder()
                .bookingId(booking.getId())
                .paymentId(paymentResponse.getPaymentId())
                .paymentUrl(paymentResponse.getPaymentUrl())
                .build();
    }
}