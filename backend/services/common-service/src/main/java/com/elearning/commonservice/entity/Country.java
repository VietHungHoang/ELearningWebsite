package com.elearning.commonservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "countries", indexes = {
    @Index(name = "idx_countries_name", columnList = "name"),
    @Index(name = "idx_countries_code", columnList = "code")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Country {
    @Id
    private String code;
    private String name;
}