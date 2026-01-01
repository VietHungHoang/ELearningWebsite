package com.elearning.studentservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "students")
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Student extends BaseEntity {
    
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    
    @Column(name = "full_name", nullable = false)
    private String fullName;
    
    @Column(name = "avatar_url")
    private String avatarUrl;
    
    @Column(name = "date_of_birth")
    private LocalDateTime dateOfBirth;
    
    @Column(name = "country")
    private String country;
    
    @Column(name = "learning_goals")
    private String learningGoals;
    
    @Column(name = "strengths", columnDefinition = "TEXT")
    private String strengths;
    
    @Column(name = "weaknesses", columnDefinition = "TEXT")
    private String weaknesses;
}
