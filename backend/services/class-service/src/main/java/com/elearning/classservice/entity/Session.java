package com.elearning.classservice.entity;

import com.elearning.classservice.entity.enums.ScheduleStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "class_sessions")
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Session extends BaseEntity {
    
    // Nullable để hỗ trợ phiên học thử (trial session) không thuộc lớp nào
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = true)
    private ClassEntity classEntity;
    
    @Column(name = "tutor_id", nullable = false)
    private UUID tutorId;
    
    @Column(name = "is_trial", nullable = false)
    @Builder.Default
    private Boolean isTrial = false;
    
    @Column(name = "session_number")
    private Integer sessionNumber;
    
    @Column(name = "title")
    private String title;
    
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;
    
    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;
    
    @Column(name = "meeting_link")
    private String meetingLink;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ScheduleStatus status; // SCHEDULED, ONGOING, COMPLETED, CANCELLED
    
    // Zoom Integration fields
    @Column(name = "zoom_meeting_id")
    private String zoomMeetingId;
    
    @Column(name = "zoom_password")
    private String zoomPassword;
    
    @Column(name = "zoom_join_url")
    private String zoomJoinUrl;
    
    @Column(name = "notes")
    private String notes;
    
    // Attendance tracking
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SessionParticipant> participants = new ArrayList<>();
}