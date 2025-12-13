package com.elearning.classservice.entity;

import com.elearning.classservice.entity.enums.AttendanceStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "session_participants")
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionParticipant extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;
    
    @Column(name = "student_id", nullable = false)
    private UUID studentId;
    
    @Column(name = "student_name")
    private String studentName;
    
    // Attendance status
    @Enumerated(EnumType.STRING)
    @Column(name = "attendance_status", nullable = false)
    @Builder.Default
    private AttendanceStatus attendanceStatus = AttendanceStatus.REGISTERED;
    
    // Join/Leave tracking
    @Column(name = "joined_at")
    private LocalDateTime joinedAt;
    
    @Column(name = "left_at")
    private LocalDateTime leftAt;
    
    @Column(name = "duration_minutes")
    private Integer durationMinutes;
    
    // Zoom participant info
    @Column(name = "zoom_participant_id")
    private String zoomParticipantId;
    
    @Column(name = "zoom_user_id")
    private String zoomUserId;
    
    @Column(name = "zoom_join_time")
    private LocalDateTime zoomJoinTime;
    
    @Column(name = "zoom_leave_time")
    private LocalDateTime zoomLeaveTime;
    
    // Additional tracking
    @Column(name = "is_host")
    @Builder.Default
    private Boolean isHost = false;
    
    @Column(name = "device_type")
    private String deviceType; // Desktop, Mobile, etc
    
    @Column(name = "notes")
    private String notes;
}
