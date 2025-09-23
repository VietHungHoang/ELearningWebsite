package com.elearning.courseservice.repository;

import com.elearning.courseservice.model.Category;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // // Find by name
    // Optional<Category> findByName(String name);

    // Find active categories
    List<Category> findByIsActiveTrueOrderByNameAsc();

    // // Find all ordered by name
    // List<Category> findAllByOrderByNameAsc();

    // // Check if name exists
    // boolean existsByName(String name);
}
