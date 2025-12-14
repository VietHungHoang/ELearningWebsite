package com.elearning.classservice.service.impl;

import com.elearning.classservice.service.CacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class CacheServiceImpl implements CacheService {

    private final RedisTemplate<String, Object> redisTemplate;

    @Override
    public void set(String key, Object value) {
        try {
            redisTemplate.opsForValue().set(key, value);
            log.debug("Cache set: key={}, value={}", key, value);
        } catch (Exception e) {
            log.error("Error setting cache for key: {}", key, e);
        }
    }

    @Override
    public void set(String key, Object value, Duration timeout) {
        try {
            redisTemplate.opsForValue().set(key, value, timeout);
            log.debug("Cache set with expiration: key={}, value={}, timeout={}s", key, value, timeout.getSeconds());
        } catch (Exception e) {
            log.error("Error setting cache with expiration for key: {}", key, e);
        }
    }

    @Override
    public Object get(String key) {
        try {
            Object value = redisTemplate.opsForValue().get(key);
            log.debug("Cache get: key={}, value={}", key, value);
            return value;
        } catch (Exception e) {
            log.error("Error getting cache for key: {}", key, e);
            return null;
        }
    }

    @Override
    public <T> T get(String key, Class<T> type) {
        try {
            Object value = redisTemplate.opsForValue().get(key);
            if (value != null && type.isInstance(value)) {
                log.debug("Cache get with type: key={}, value={}", key, value);
                return type.cast(value);
            }
            return null;
        } catch (Exception e) {
            log.error("Error getting cache with type for key: {}", key, e);
            return null;
        }
    }

    @Override
    public boolean hasKey(String key) {
        try {
            Boolean exists = redisTemplate.hasKey(key);
            return Boolean.TRUE.equals(exists);
        } catch (Exception e) {
            log.error("Error checking key existence: {}", key, e);
            return false;
        }
    }

    @Override
    public void delete(String key) {
        try {
            redisTemplate.delete(key);
            log.debug("Cache deleted: key={}", key);
        } catch (Exception e) {
            log.error("Error deleting cache for key: {}", key, e);
        }
    }

    @Override
    public void delete(String... keys) {
        try {
            redisTemplate.delete(Set.of(keys));
            log.debug("Cache deleted multiple keys: {}", (Object) keys);
        } catch (Exception e) {
            log.error("Error deleting multiple cache keys", e);
        }
    }

    @Override
    public void expire(String key, Duration timeout) {
        try {
            redisTemplate.expire(key, timeout);
            log.debug("Cache expiration set: key={}, timeout={}s", key, timeout.getSeconds());
        } catch (Exception e) {
            log.error("Error setting expiration for key: {}", key, e);
        }
    }

    @Override
    public Set<String> keys(String pattern) {
        try {
            return redisTemplate.keys(pattern);
        } catch (Exception e) {
            log.error("Error getting keys with pattern: {}", pattern, e);
            return Set.of();
        }
    }

    @Override
    public void clearAll() {
        try {
            redisTemplate.getConnectionFactory().getConnection().flushAll();
            log.info("All cache cleared");
        } catch (Exception e) {
            log.error("Error clearing all cache", e);
        }
    }
}