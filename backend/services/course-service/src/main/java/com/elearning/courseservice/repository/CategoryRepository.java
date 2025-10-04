package com.elearning.courseservice.repository;

import com.elearning.courseservice.model.Category;
import com.elearning.courseservice.projection.CategoryBasicProjection;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // // Find by name
    // Optional<Category> findByName(String name);

    // Find all categories
    List<Category> findAllByOrderByNameAsc();
    
    // Find root categories (categories without parent)
    List<Category> findByParentIsNullOrderByNameAsc();
    
    // Find subcategories by parent ID
    List<Category> findByParentIdOrderByNameAsc(Long parentId);
    
    // Optimized query for basic root categories - only select id and name
    @Query("SELECT c.id as id, c.name as name FROM Category c WHERE c.parent IS NULL ORDER BY c.name ASC")
    List<CategoryBasicProjection> findBasicRootCategories();

    // // Find all ordered by name
    // List<Category> findAllByOrderByNameAsc();

    // // Check if name exists
    // boolean existsByName(String name);
}
