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
    
    @Column(name = "fullname", nullable = false)
    private String fullname;
    
    @Column(name = "phone")
    private String phone;
    
    @Column(name = "avatar")
    private String avatar;
    
    @Column(name = "bio")
    private String bio;
    
    @Column(name = "date_of_birth")
    private LocalDateTime dateOfBirth;
    
    @Column(name = "address")
    private String address;
    
    @Column(name = "city")
    private String city;
    
    @Column(name = "country")
    private String country;
    
    @Column(name = "learning_goals")
    private String learningGoals;
    
    @Column(name = "strengths", columnDefinition = "TEXT")
    private String strengths; // JSON array or comma-separated
    
    @Column(name = "weaknesses", columnDefinition = "TEXT")
    private String weaknesses; // JSON array or comma-separated
}
