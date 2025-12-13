package com.elearning.commonservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cities", indexes = {
        @Index(name = "idx_countries_name", columnList = "name"),
        @Index(name = "idx_countries_code", columnList = "code")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class City {
    @Id
    private String code;
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_code")
    private Country country;
}