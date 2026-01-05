package com.elearning.chatservice.repository;

import com.elearning.chatservice.entity.UserCache;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for UserCache entity
 */
@Repository
public interface UserCacheRepository extends MongoRepository<UserCache, UUID> {

    /**
     * Find multiple users by their IDs
     */
    List<UserCache> findByIdIn(List<UUID> ids);
}
