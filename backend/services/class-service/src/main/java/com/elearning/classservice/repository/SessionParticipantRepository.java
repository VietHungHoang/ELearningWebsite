package com.elearning.classservice.repository;

import com.elearning.classservice.entity.enums.AttendanceStatus;
import com.elearning.classservice.entity.SessionParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SessionParticipantRepository extends JpaRepository<SessionParticipant, UUID> {
    
    /**
     * Tìm tất cả participants trong một session
     */
    List<SessionParticipant> findBySessionId(UUID sessionId);
    
    /**
     * Tìm tất cả sessions mà một student đã tham gia
     */
    List<SessionParticipant> findByStudentId(UUID studentId);
    
    /**
     * Tìm participant của một student trong một session cụ thể
     */
    Optional<SessionParticipant> findBySessionIdAndStudentId(UUID sessionId, UUID studentId);
    
    /**
     * Tìm participants theo trạng thái attendance
     */
    List<SessionParticipant> findBySessionIdAndAttendanceStatus(UUID sessionId, AttendanceStatus status);
    
    /**
     * Đếm số lượng học viên PRESENT trong một session
     */
    @Query("SELECT COUNT(sp) FROM SessionParticipant sp WHERE sp.session.id = :sessionId AND sp.attendanceStatus = 'PRESENT'")
    Long countPresentParticipants(@Param("sessionId") UUID sessionId);
    
    /**
     * Tìm tất cả sessions của một student trong một class
     */
    @Query("SELECT sp FROM SessionParticipant sp WHERE sp.studentId = :studentId AND sp.session.classEntity.id = :classId ORDER BY sp.session.startTime")
    List<SessionParticipant> findByStudentIdAndClassId(@Param("studentId") UUID studentId, @Param("classId") UUID classId);
    
    /**
     * Lấy attendance history của student (tính phần trăm tham dự)
     */
    @Query("SELECT COUNT(sp) FROM SessionParticipant sp WHERE sp.studentId = :studentId AND sp.attendanceStatus IN ('PRESENT', 'LATE')")
    Long countAttendedSessions(@Param("studentId") UUID studentId);
    
    /**
     * Kiểm tra student đã join session chưa (có Zoom participant ID)
     */
    @Query("SELECT CASE WHEN COUNT(sp) > 0 THEN true ELSE false END FROM SessionParticipant sp WHERE sp.session.id = :sessionId AND sp.studentId = :studentId AND sp.zoomParticipantId IS NOT NULL")
    boolean hasJoinedZoomMeeting(@Param("sessionId") UUID sessionId, @Param("studentId") UUID studentId);
    
    /**
     * Tìm tất cả trial students của một tutor (participants trong trial sessions)
     */
    @Query("SELECT DISTINCT sp.studentId FROM SessionParticipant sp WHERE sp.session.tutorId = :tutorId AND sp.session.isTrial = true")
    List<UUID> findDistinctTrialStudentsByTutorId(@Param("tutorId") UUID tutorId);
    
    /**
     * Tìm tất cả participants trong trial sessions của tutor
     */
    @Query("SELECT sp FROM SessionParticipant sp WHERE sp.session.tutorId = :tutorId AND sp.session.isTrial = true ORDER BY sp.createdAt DESC")
    List<SessionParticipant> findTrialParticipantsByTutorId(@Param("tutorId") UUID tutorId);
}
