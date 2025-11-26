// package com.elearning.classservice.repository;

// import com.elearning.classservice.entity.TutorEarnings;
// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.Pageable;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
// import org.springframework.stereotype.Repository;

// import java.math.BigDecimal;
// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.UUID;

// @Repository
// public interface TutorEarningsRepository extends JpaRepository<TutorEarnings, UUID> {

//     /**
//      * Tìm tất cả earnings của một tutor
//      */
//     List<TutorEarnings> findByTutorIdOrderByCreatedAtDesc(UUID tutorId);

//     /**
//      * Tìm earnings theo session
//      */
//     List<TutorEarnings> findBySessionId(UUID sessionId);

//     /**
//      * Tìm earnings theo status
//      */
//     Page<TutorEarnings> findByTutorIdAndStatus(UUID tutorId, TutorEarnings.EarningsStatus status, Pageable pageable);

//     /**
//      * Tính tổng thu nhập của tutor trong khoảng thời gian
//      */
//     @Query("SELECT COALESCE(SUM(te.amount), 0) FROM TutorEarnings te WHERE te.tutor.id = :tutorId AND te.status = 'PAID' AND te.paidAt BETWEEN :startDate AND :endDate")
//     BigDecimal getTotalEarningsByTutorAndDateRange(@Param("tutorId") UUID tutorId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

//     /**
//      * Tính tổng thu nhập pending của tutor
//      */
//     @Query("SELECT COALESCE(SUM(te.amount), 0) FROM TutorEarnings te WHERE te.tutor.id = :tutorId AND te.status = 'PENDING'")
//     BigDecimal getPendingEarningsByTutor(@Param("tutorId") UUID tutorId);

//     /**
//      * Tìm earnings của tutor theo tháng
//      */
//     @Query("SELECT te FROM TutorEarnings te WHERE te.tutor.id = :tutorId AND YEAR(te.createdAt) = :year AND MONTH(te.createdAt) = :month ORDER BY te.createdAt DESC")
//     List<TutorEarnings> findByTutorIdAndMonth(@Param("tutorId") UUID tutorId, @Param("year") int year, @Param("month") int month);

//     /**
//      * Đếm số sessions đã hoàn thành của tutor
//      */
//     @Query("SELECT COUNT(te) FROM TutorEarnings te WHERE te.tutor.id = :tutorId AND te.status = 'PAID'")
//     Long countCompletedSessionsByTutor(@Param("tutorId") UUID tutorId);
// }