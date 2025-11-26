package com.elearning.tutorservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;

@Entity
@Table(name = "certifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Certification extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tutor_id", nullable = false)
    private Tutor tutor;

    @Column(nullable = false)
    private String name; // Certificate name (e.g., IELTS 8.0)

    @Column(name = "issuing_organization", nullable = false)
    private String issuingOrganization; // Issuing organization (e.g., British Council)

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "expiration_date")
    private LocalDate expirationDate; // Null if no expiration

    @Column(name = "credential_id", length = 100)
    private String credentialId; // Certificate ID for verification

    @Column(name = "credential_url", length = 500)
    private String credentialUrl; // Online verification link
}