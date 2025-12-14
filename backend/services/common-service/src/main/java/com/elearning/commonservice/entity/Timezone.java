package com.elearning.commonservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "timezones", indexes = {
    @Index(name = "idx_timezones_utc_offset", columnList = "utc_offset")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Timezone extends BaseEntity {

    private String name;
    @Column(name = "utc_offset")
    private String utcOffset; // e.g., "+07:00"
}