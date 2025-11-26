package com.elearning.classservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

/**
 * Entity to store recurring class schedule pattern
 */
@Entity
@Table(name = "class_schedules")
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassSchedule extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity classEntity;
    
    @Column(name = "day_of_week", nullable = false)
    private String dayOfWeek; // Comma-separated: "MONDAY,WEDNESDAY,FRIDAY"
    
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime; // e.g., 15:00
    
    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes; // e.g., 60
    
    /**
     * Format schedule to human-readable string
     * Example: "Mon, Wed, Fri - 3:00 PM"
     */
    public String formatSchedule() {
        if (dayOfWeek == null || dayOfWeek.isBlank()) {
            return "";
        }
        
        // Parse days
        List<DayOfWeek> days = List.of(dayOfWeek.split(",")).stream()
            .map(String::trim)
            .map(d -> DayOfWeek.valueOf(d.toUpperCase()))
            .sorted()
            .collect(Collectors.toList());
        
        // Format days: "Mon, Wed, Fri"
        String daysStr = days.stream()
            .map(day -> day.getDisplayName(TextStyle.SHORT, Locale.ENGLISH))
            .collect(Collectors.joining(", "));
        
        // Format time: "3:00 PM"
        String timeStr = startTime.format(java.time.format.DateTimeFormatter.ofPattern("h:mm a"));
        
        return daysStr + " - " + timeStr;
    }
}
