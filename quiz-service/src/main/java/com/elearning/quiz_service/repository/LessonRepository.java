package com.elearning.quiz_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.elearning.quiz_service.model.Lesson;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
}
