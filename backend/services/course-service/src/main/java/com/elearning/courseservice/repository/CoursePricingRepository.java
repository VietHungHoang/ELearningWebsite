package com.elearning.courseservice.repository;

import com.elearning.courseservice.model.CoursePricing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoursePricingRepository extends JpaRepository<CoursePricing, Long> {
    
    // Optional<CoursePricing> findByCourseId(Long courseId);
    
    // void deleteByCourseId(Long courseId);
    
    // boolean existsByCourseId(Long courseId);
    
    // @Query("SELECT cp FROM CoursePricing cp WHERE cp.basePrice BETWEEN :minPrice AND :maxPrice")
    // List<CoursePricing> findByPriceBetween(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice);
    
    // List<CoursePricing> findByPricingType(CoursePricing.PricingType pricingType);
    
    // @Query("SELECT cp FROM CoursePricing cp WHERE cp.isDiscountActive = true AND cp.discountStartDate <= CURRENT_TIMESTAMP AND cp.discountEndDate >= CURRENT_TIMESTAMP")
    // List<CoursePricing> findActiveDiscounts();
}