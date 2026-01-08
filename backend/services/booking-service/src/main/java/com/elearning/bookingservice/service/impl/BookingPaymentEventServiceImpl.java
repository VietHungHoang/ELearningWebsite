package com.elearning.bookingservice.service.impl;

import com.elearning.bookingservice.dto.event.BookingPaymentFailedEvent;
import com.elearning.bookingservice.dto.event.BookingPaymentSuccessEvent;
import com.elearning.bookingservice.entity.Booking;
import com.elearning.bookingservice.entity.BookingStatus;
import com.elearning.bookingservice.kafka.KafkaProducer;
import com.elearning.bookingservice.repository.BookingRepository;
import com.elearning.bookingservice.service.BookingPaymentEventService;
import com.elearning.bookingservice.service.BookingMetadataCache;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingPaymentEventServiceImpl implements BookingPaymentEventService {

        private final BookingRepository bookingRepository;
        private final KafkaProducer kafkaProducer;
        private final BookingMetadataCache metadataCache;

        @Override
        @Transactional
        public void handlePaymentSuccess(BookingPaymentSuccessEvent event) {
                log.info("Handling payment success for bookingId: {}", event.getBookingId());

                // Find booking by ID
                Booking booking = bookingRepository.findById(event.getBookingId())
                                .orElseThrow(() -> new RuntimeException("Booking not found: " + event.getBookingId()));

                // Update booking status to CONFIRMED
                booking.setStatus(BookingStatus.CONFIRMED);
                booking.setTransactionId(event.getTransactionId());
                booking.setProviderTransactionId(event.getProviderTransactionId());
                bookingRepository.save(booking);

                log.info("Updated booking {} status to CONFIRMED after payment success", event.getBookingId());

                // Get locale from Redis cache
                String locale = metadataCache.getLocale(event.getBookingId());

                // Forward event to class-service with classId and creation details
                BookingPaymentSuccessEvent classServiceEvent = BookingPaymentSuccessEvent.builder()
                                .bookingId(event.getBookingId())
                                .classId(booking.getClassId())
                                .transactionId(event.getTransactionId())
                                .providerTransactionId(event.getProviderTransactionId())
                                .tutorId(booking.getTutorId())
                                .studentId(booking.getStudentId())
                                .tutorName(booking.getTutorName())
                                .locale(locale)
                                .schedule(booking.getSchedule())
                                .sessionsPurchased(booking.getSessionsPurchased())
                                .notes(booking.getNotes())
                                .build();

                kafkaProducer.sendBookingPaymentSuccessToClassService(classServiceEvent);
                log.info("Forwarded payment success event to class-service for classId: {}", booking.getClassId());

                // Cleanup: delete locale from Redis after forwarding
                metadataCache.deleteLocale(event.getBookingId());
        }

        @Override
        @Transactional
        public void handlePaymentFailed(BookingPaymentFailedEvent event) {
                log.info("Handling payment failed for bookingId: {}, reason: {}",
                                event.getBookingId(), event.getReason());

                // Find booking by ID
                Booking booking = bookingRepository.findById(event.getBookingId())
                                .orElseThrow(() -> new RuntimeException("Booking not found: " + event.getBookingId()));

                // Update booking status to CANCELLED
                booking.setStatus(BookingStatus.CANCELLED);
                booking.setNotes("Payment failed: " + event.getReason());
                bookingRepository.save(booking);

                log.info("Updated booking {} status to CANCELLED due to payment failure", event.getBookingId());

                // Forward event to class-service with classId for rollback
                BookingPaymentFailedEvent classServiceEvent = BookingPaymentFailedEvent.builder()
                                .bookingId(event.getBookingId())
                                .classId(booking.getClassId())
                                .reason(event.getReason())
                                .build();

                kafkaProducer.sendBookingPaymentFailedToClassService(classServiceEvent);
                log.info("Forwarded payment failed event to class-service for rollback of classId: {}",
                                booking.getClassId());
        }
}
