package com.elearning.quizservice.repository;

import com.elearning.quizservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository interface for User entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    /**
     * Find multiple users by their IDs
     */
    List<User> findByIdIn(List<UUID> ids);
}
