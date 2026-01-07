package com.elearning.bookingservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "class_info")
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassInfo extends BaseEntity {

    @Column(name = "class_id", nullable = false, unique = true)
    private UUID classId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "class_type")
    private String classType;
}
