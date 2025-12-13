package com.elearning.classservice.service;

import java.time.Duration;
import java.util.Set;

public interface CacheService {

    /**
     * Lưu giá trị vào cache với key
     */
    void set(String key, Object value);

    /**
     * Lưu giá trị vào cache với key và thời gian expire
     */
    void set(String key, Object value, Duration timeout);

    /**
     * Lấy giá trị từ cache theo key
     */
    Object get(String key);

    /**
     * Lấy giá trị từ cache theo key với type cụ thể
     */
    <T> T get(String key, Class<T> type);

    /**
     * Kiểm tra key có tồn tại trong cache không
     */
    boolean hasKey(String key);

    /**
     * Xóa key khỏi cache
     */
    void delete(String key);

    /**
     * Xóa nhiều key khỏi cache
     */
    void delete(String... keys);

    /**
     * Set thời gian expire cho key
     */
    void expire(String key, Duration timeout);

    /**
     * Lấy tất cả keys matching pattern
     */
    Set<String> keys(String pattern);

    /**
     * Xóa tất cả cache
     */
    void clearAll();
}