package com.elearning.bookingservice.repository;

import com.elearning.bookingservice.entity.Booking;
import com.elearning.bookingservice.entity.BookingStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    Page<Booking> findByStudentId(UUID studentId, Pageable pageable);

    Page<Booking> findByStudentIdAndStatus(UUID studentId, BookingStatus status, Pageable pageable);
}