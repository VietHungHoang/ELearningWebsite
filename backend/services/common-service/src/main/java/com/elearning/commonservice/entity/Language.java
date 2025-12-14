package com.elearning.commonservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "languages", indexes = {
    @Index(name = "idx_languages_name", columnList = "name"),
    @Index(name = "idx_languages_code", columnList = "code")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Language {
    @Id
    private String code;
    private String name;
}