package com.elearning.tutorservice.util;

import com.elearning.tutorservice.dto.request.AvailabilityFilter;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

public class AvailabilityUtils {

    private static final Map<String, Short> DAY_MAP = Map.of(
        "MONDAY", (short) 1,
        "TUESDAY", (short) 2,
        "WEDNESDAY", (short) 3,
        "THURSDAY", (short) 4,
        "FRIDAY", (short) 5,
        "SATURDAY", (short) 6,
        "SUNDAY", (short) 7
    );

    private static final Map<String, LocalTime[]> SESSION_MAP = Map.of(
        "MORNING", new LocalTime[]{LocalTime.of(5, 0), LocalTime.of(11, 0)},
        "AFTERNOON", new LocalTime[]{LocalTime.of(11, 0), LocalTime.of(18, 0)},
        "EVENING", new LocalTime[]{LocalTime.of(18, 0), LocalTime.of(23, 59)}
    );

    public static List<AvailabilityFilter> parseAvailableDays(List<String> availableDays) {
        if (availableDays == null || availableDays.isEmpty()) {
            return null;
        }

        return availableDays.stream()
            .map(daySession -> {
                String[] parts = daySession.split("_");
                if (parts.length != 2) {
                    throw new IllegalArgumentException("Invalid format: " + daySession);
                }
                String day = parts[0].toUpperCase();
                String session = parts[1].toUpperCase();

                Short dayOfWeek = DAY_MAP.get(day);
                if (dayOfWeek == null) {
                    throw new IllegalArgumentException("Invalid day: " + day);
                }

                LocalTime[] times = SESSION_MAP.get(session);
                if (times == null) {
                    throw new IllegalArgumentException("Invalid session: " + session);
                }

                AvailabilityFilter filter = new AvailabilityFilter();
                filter.setDayOfWeek(dayOfWeek);
                filter.setStartTime(times[0]);
                filter.setEndTime(times[1]);
                return filter;
            })
            .toList();
    }
}