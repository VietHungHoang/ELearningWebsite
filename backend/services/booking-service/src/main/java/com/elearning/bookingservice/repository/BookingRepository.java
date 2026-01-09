package com.elearning.bookingservice.repository;

import com.elearning.bookingservice.entity.Booking;
import com.elearning.bookingservice.entity.BookingStatus;
import com.elearning.bookingservice.entity.PaymentProvider;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    Page<Booking> findByStudentId(UUID studentId, Pageable pageable);

    Page<Booking> findByStudentIdAndStatus(UUID studentId, BookingStatus status, Pageable pageable);

    /**
     * Search transactions by studentId, tutorName, or transactionId
     * 
     * @param searchTerm Search term (should include % wildcards)
     * @param pageable   Pagination info
     * @return Page of matching bookings
     */
    @Query("SELECT b FROM Booking b WHERE " +
            "LOWER(CAST(b.studentId AS string)) LIKE LOWER(:searchTerm) OR " +
            "LOWER(b.tutorName) LIKE LOWER(:searchTerm) OR " +
            "LOWER(b.transactionId) LIKE LOWER(:searchTerm) OR " +
            "LOWER(b.providerTransactionId) LIKE LOWER(:searchTerm)")
    Page<Booking> searchTransactions(@Param("searchTerm") String searchTerm, Pageable pageable);

    /**
     * Advanced filter for transactions with multiple optional criteria
     * 
     * @param status        Filter by booking status (optional)
     * @param paymentMethod Filter by payment provider (optional)
     * @param startDate     Filter by start date (optional)
     * @param endDate       Filter by end date (optional)
     * @param searchTerm    Search term for studentId, tutorName, transactionId
     * @param pageable
     * @return
     */
    @Query("SELECT b FROM Booking b WHERE " +
            "(:status IS NULL OR b.status = :status) AND " +
            "(:paymentMethod IS NULL OR b.paymentProvider = :paymentMethod) AND " +
            "(:startDate IS NULL OR b.createdAt >= :startDate) AND " +
            "(:endDate IS NULL OR b.createdAt <= :endDate) AND " +
            "(:searchTerm IS NULL OR " +
            "LOWER(CAST(b.studentId AS string)) LIKE LOWER(:searchTerm) OR " +
            "LOWER(b.tutorName) LIKE LOWER(:searchTerm) OR " +
            "LOWER(CAST(b.transactionId AS string)) LIKE LOWER(:searchTerm) OR " +
            "LOWER(b.providerTransactionId) LIKE LOWER(:searchTerm))")
    Page<Booking> findWithFilters(
            @Param("status") BookingStatus status,
            @Param("paymentMethod") PaymentProvider paymentMethod,
            @Param("startDate") java.time.LocalDateTime startDate,
            @Param("endDate") java.time.LocalDateTime endDate,
            @Param("searchTerm") String searchTerm,
            Pageable pageable);
}