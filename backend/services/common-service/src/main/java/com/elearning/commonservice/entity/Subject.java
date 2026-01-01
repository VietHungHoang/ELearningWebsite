package com.elearning.commonservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "subjects", indexes = {
    @Index(name = "idx_subjects_category_id", columnList = "category_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Subject extends BaseEntity {
    private String nameVi;
    private String nameEn;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}