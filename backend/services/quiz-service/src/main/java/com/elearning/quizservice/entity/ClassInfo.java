package com.elearning.quizservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Denormalized class info - cached from class-service
 */
@Entity
@Table(name = "class_info")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassInfo {
    
    @Id
    private UUID id;
    
    @Column(nullable = false)
    private String title;
    
    /**
     * Students enrolled in this class
     */
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "class_students",
        joinColumns = @JoinColumn(name = "class_id"),
        inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    @Builder.Default
    private List<User> students = new ArrayList<>();
}
