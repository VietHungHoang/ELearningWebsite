package com.elearning.bookingservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;

/**
 * Service for caching booking metadata (like locale) in Redis
 * This avoids cluttering the database with transient forwarding data
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BookingMetadataCache {

    private final RedisTemplate<String, String> redisTemplate;
    
    private static final String LOCALE_KEY_PREFIX = "booking:locale:";
    private static final Duration TTL = Duration.ofHours(24); // 24 hours TTL

    /**
     * Save locale for a booking
     */
    public void saveLocale(UUID bookingId, String locale) {
        String key = LOCALE_KEY_PREFIX + bookingId.toString();
        redisTemplate.opsForValue().set(key, locale, TTL);
        log.debug("Saved locale {} for booking {} in Redis", locale, bookingId);
    }

    /**
     * Get locale for a booking, returns "en" as default if not found
     */
    public String getLocale(UUID bookingId) {
        String key = LOCALE_KEY_PREFIX + bookingId.toString();
        String locale = redisTemplate.opsForValue().get(key);
        
        if (locale == null) {
            log.warn("Locale not found in Redis for booking {}, using default 'en'", bookingId);
            return "en"; // Default to English
        }
        
        log.debug("Retrieved locale {} for booking {} from Redis", locale, bookingId);
        return locale;
    }

    /**
     * Delete locale for a booking (cleanup after processing)
     */
    public void deleteLocale(UUID bookingId) {
        String key = LOCALE_KEY_PREFIX + bookingId.toString();
        redisTemplate.delete(key);
        log.debug("Deleted locale for booking {} from Redis", bookingId);
    }
}
