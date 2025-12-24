package com.elearning.classservice.entity;

import com.elearning.classservice.entity.enums.ClassStatus;
import com.elearning.classservice.entity.enums.ClassType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "classes")
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassEntity extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tutor_id", nullable = false)
    private User tutor;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    private String description;

    @Column(name = "subject_id")
    private UUID subjectId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "class_type", nullable = false)
    private ClassType classType; // ONE_ON_ONE, GROUP
    
    @Column(name = "max_students")
    private Integer maxStudents;
    
    @Column(name = "price_per_hour")
    private Double pricePerHour;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ClassStatus status; // DRAFT, PUBLISHED, IN_PROGRESS, COMPLETED, CANCELLED
    
    @OneToMany(mappedBy = "classEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ClassEnrollment> enrollments = new ArrayList<>();
    
    @OneToMany(mappedBy = "classEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Session> sessions = new ArrayList<>();
    
    @OneToMany(mappedBy = "classEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ClassSchedule> schedules = new ArrayList<>();
    
    @OneToMany(mappedBy = "classEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ClassMaterial> materials = new ArrayList<>();
    
    @OneToMany(mappedBy = "classEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ClassAnnouncement> announcements = new ArrayList<>();
    
    @OneToMany(mappedBy = "classEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ClassAssignment> assignments = new ArrayList<>();
    
    @OneToMany(mappedBy = "classEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<StudentInClass> studentInClasses = new ArrayList<>();
}
