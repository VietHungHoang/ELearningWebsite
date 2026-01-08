package com.elearning.tutorservice.repository;

import com.elearning.tutorservice.entity.TutorEarnings;
import com.elearning.tutorservice.entity.enums.ClassType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TutorEarningsRepository extends JpaRepository<TutorEarnings, UUID> {

    /**
     * Tìm earnings theo tutor ID
     */
    @Query("SELECT te FROM TutorEarnings te WHERE te.tutorId = :tutorId ORDER BY te.createdAt DESC")
    List<TutorEarnings> findByTutorId(@Param("tutorId") UUID tutorId);

    /**
     * Tìm earnings theo tutor ID với phân trang
     */
    @Query("SELECT te FROM TutorEarnings te WHERE te.tutorId = :tutorId ORDER BY te.createdAt DESC")
    Page<TutorEarnings> findByTutorId(@Param("tutorId") UUID tutorId, Pageable pageable);

    /**
     * Tìm earnings theo tutor ID và class type với phân trang
     */
    @Query("SELECT te FROM TutorEarnings te WHERE te.tutorId = :tutorId AND te.classType = :classType ORDER BY te.createdAt DESC")
    Page<TutorEarnings> findByTutorIdAndClassType(@Param("tutorId") UUID tutorId, @Param("classType") ClassType classType, Pageable pageable);

    /**
     * Tính tổng thu nhập của tutor trong khoảng thời gian (tất cả status)
     */
    @Query("SELECT COALESCE(SUM(te.amount), 0) FROM TutorEarnings te WHERE te.tutorId = :tutorId AND te.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal getTotalEarningsByTutorAndDateRange(@Param("tutorId") UUID tutorId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Tính tổng thu nhập pending của tutor
     */
    @Query("SELECT COALESCE(SUM(te.amount), 0) FROM TutorEarnings te WHERE te.tutorId = :tutorId AND te.status = 'PENDING'")
    BigDecimal getPendingEarningsByTutor(@Param("tutorId") UUID tutorId);

    /**
     * Tìm earnings của tutor theo tháng
     */
    @Query("SELECT te FROM TutorEarnings te WHERE te.tutorId = :tutorId AND YEAR(te.createdAt) = :year AND MONTH(te.createdAt) = :month ORDER BY te.createdAt DESC")
    List<TutorEarnings> findByTutorIdAndMonth(@Param("tutorId") UUID tutorId, @Param("year") int year, @Param("month") int month);

    /**
     * Đếm số sessions đã hoàn thành của tutor
     */
    @Query("SELECT COUNT(te) FROM TutorEarnings te WHERE te.tutorId = :tutorId AND te.status = 'PAID'")
    Long countCompletedSessionsByTutor(@Param("tutorId") UUID tutorId);

    /**
     * Tính available balance (PENDING status)
     */
    @Query("SELECT COALESCE(SUM(te.amount), 0) FROM TutorEarnings te WHERE te.tutorId = :tutorId AND te.status = 'PENDING'")
    BigDecimal getAvailableBalanceByTutor(@Param("tutorId") UUID tutorId);

    /**
     * Tính pending balance (PROCESSING status)
     */
    @Query("SELECT COALESCE(SUM(te.amount), 0) FROM TutorEarnings te WHERE te.tutorId = :tutorId AND te.status = 'PROCESSING'")
    BigDecimal getPendingBalanceByTutor(@Param("tutorId") UUID tutorId);

    /**
     * Tính tổng thu nhập của tutor
     */
    @Query("SELECT COALESCE(SUM(te.amount), 0) FROM TutorEarnings te WHERE te.tutorId = :tutorId")
    BigDecimal getTotalEarnedByTutor(@Param("tutorId") UUID tutorId);

    /**
     * Đếm số lần rút tiền trong tháng hiện tại
     */
    @Query("SELECT COUNT(DISTINCT DATE(te.updatedAt)) FROM TutorEarnings te WHERE te.tutorId = :tutorId AND te.updatedAt >= :startOfMonth")
    Long getWithdrawalCountByTutorThisMonth(@Param("tutorId") UUID tutorId, @Param("startOfMonth") LocalDateTime startOfMonth);

    /**
     * Đếm số giờ dạy (số bản ghi TutorEarnings) trong khoảng thời gian
     */
    @Query("SELECT COUNT(te) FROM TutorEarnings te WHERE te.tutorId = :tutorId AND te.createdAt BETWEEN :startDate AND :endDate")
    Long countTeachingHoursByTutorAndDateRange(@Param("tutorId") UUID tutorId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Lấy thống kê thu nhập hàng tháng của tutor trong 12 tháng gần nhất (tất cả status)
     */
    @Query("SELECT YEAR(te.createdAt) as year, MONTH(te.createdAt) as month, SUM(te.amount) as income " +
           "FROM TutorEarnings te " +
           "WHERE te.tutorId = :tutorId AND te.createdAt >= :startDate " +
           "GROUP BY YEAR(te.createdAt), MONTH(te.createdAt) " +
           "ORDER BY YEAR(te.createdAt) DESC, MONTH(te.createdAt) DESC")
    List<Object[]> getMonthlyIncomeStats(@Param("tutorId") UUID tutorId, @Param("startDate") LocalDateTime startDate);
}