package com.elearning.bookingservice.service.impl;

import com.elearning.bookingservice.dto.event.ClassCreatedEvent;
import com.elearning.bookingservice.entity.Booking;
import com.elearning.bookingservice.entity.ClassInfo;
import com.elearning.bookingservice.repository.BookingRepository;
import com.elearning.bookingservice.repository.ClassInfoRepository;
import com.elearning.bookingservice.service.ClassInfoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClassInfoServiceImpl implements ClassInfoService {

    private final ClassInfoRepository classInfoRepository;
    private final BookingRepository bookingRepository;

    @Override
    @Transactional
    public void handleClassCreatedEvent(ClassCreatedEvent event) {
        log.info("Handling class created event: bookingId={}, classId={}, title={}, classType={}",
                event.getBookingId(), event.getClassId(), event.getTitle(), event.getClassType());

        // 1. Save or update ClassInfo
        Optional<ClassInfo> existingClassInfo = classInfoRepository.findByClassId(event.getClassId());

        ClassInfo classInfo;
        if (existingClassInfo.isPresent()) {
            // Update existing
            classInfo = existingClassInfo.get();
            classInfo.setTitle(event.getTitle());
            classInfo.setClassType(event.getClassType());
            log.info("Updating existing ClassInfo for classId: {}", event.getClassId());
        } else {
            // Create new
            classInfo = ClassInfo.builder()
                    .classId(event.getClassId())
                    .title(event.getTitle())
                    .classType(event.getClassType())
                    .build();
            log.info("Creating new ClassInfo for classId: {}", event.getClassId());
        }

        classInfoRepository.save(classInfo);
        log.info("Saved ClassInfo with id: {}", classInfo.getId());

        // 2. Update Booking with classId if bookingId is provided
        if (event.getBookingId() != null) {
            Optional<Booking> bookingOpt = bookingRepository.findById(event.getBookingId());
            if (bookingOpt.isPresent()) {
                Booking booking = bookingOpt.get();
                booking.setClassId(event.getClassId());
                bookingRepository.save(booking);
                log.info("Updated booking {} with classId {}", event.getBookingId(), event.getClassId());
            } else {
                log.warn("Booking not found for bookingId: {}", event.getBookingId());
            }
        }
    }
}
