package com.elearning.cart_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;


@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @Column(nullable = false)
    private Long courseId;

    @Column(nullable = false)
    private BigDecimal priceSnapshot;

    @Column(length = 50)
    private String couponCode;

    @Column(nullable = false)
    private BigDecimal finalPrice;


    @Column(length = 255)
    private String name; 

    @Column(length = 100)
    private String category;

    @Column(length = 255)
    private String tutor; 

    @Column(length = 255)
    private String image; 

    @Column(columnDefinition = "DOUBLE DEFAULT 0")
    private Double rating; 

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer reviews; 
    @Column(length = 50)
    private String level; 

    @Column(length = 50)
    private String language; 

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer lessons; 

    @Column(length = 50)
    private String duration; 

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer totalStudents;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 255)
    private String instructorAvatar;

    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean hasCertificate;

    @Column(length = 255)
    private String lastUpdated;

    @Column(columnDefinition = "TEXT")
    private String availableCoupon; 
}
