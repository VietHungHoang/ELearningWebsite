package com.elearning.classservice.entity;

import com.elearning.classservice.entity.enums.ScheduleStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "change_schedule_requests")
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangeScheduleRequestEntity extends BaseEntity {

    @Column(name = "old_schedule", nullable = false)
    private LocalDateTime oldSchedule;

    @Column(name = "new_schedule", nullable = false)
    private LocalDateTime newSchedule;

    @Column(name = "reason")
    private String reason;

    @Column(name = "class_id", nullable = false)
    private UUID classId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private ScheduleStatus status = ScheduleStatus.PENDING;
}