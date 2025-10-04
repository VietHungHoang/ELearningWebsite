package com.elearning.courseservice.repository;

import com.elearning.courseservice.model.Language;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Long> {
    
    @Query("SELECT l FROM Language l ORDER BY l.name ASC")
    List<Language> findAllOrderByName();
    
    @Query("SELECT l FROM Language l ORDER BY l.name ASC")
    Page<Language> findAllOrderByName(Pageable pageable);
}