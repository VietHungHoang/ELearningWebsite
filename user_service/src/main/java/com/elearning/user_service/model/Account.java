package com.elearning.user_service.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role; // ADMIN, INSTRUCTOR, LEARNER

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true; // ✅ mặc định là kích hoạt
    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL)
    private Profile profile;
}
