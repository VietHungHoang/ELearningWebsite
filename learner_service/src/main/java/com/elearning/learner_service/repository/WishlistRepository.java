package com.elearning.learner_service.repository;

import com.elearning.learner_service.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    List<Wishlist> findByAccountId(Long accountId);

    Wishlist findByAccountIdAndCourseId(Long accountId, Long courseId);

    void deleteByAccountIdAndCourseId(Long accountId, Long courseId);
}
