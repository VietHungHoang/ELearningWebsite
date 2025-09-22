package com.elearning.quiz.repository;

import com.elearning.quiz.model.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Section, String> {
    List<Section> findByCourseIdOrderByOrderIndexAsc(String courseId);
}
