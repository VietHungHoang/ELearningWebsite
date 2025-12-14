package com.elearning.tutorservice.repository;

import com.elearning.tutorservice.entity.TutorReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TutorReviewRepository extends JpaRepository<TutorReview, UUID> {
}