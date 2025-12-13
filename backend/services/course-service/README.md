# Course Service

## Overvie
Course Service manages core course metadata for the E-learning platform. This service follows a modular microservices architecture where course content management is handled by a separate content service.

## Features

- **Draft Course Creation**: Basic course creation with title, category, and level
- **Category Management**: Dynamic categories with validation

## Technologies
- **Spring Boot 3.5.5** - Main framework
- **Spring Data JPA** - Data access layer with modular repository pattern
- **MySQL** - Primary database
- **Lombok** - Code generation with SuperBuilder for inheritance
- **Jakarta Validation** - Input validation
- **Maven** - Build tool

## Project Structure
```
course-service/
├── src/main/java/com/elearning/courseservice/
│   ├── controller/
│   │   └── CourseController.java          # Draft API + commented endpoints
│   ├── service/
│   │   ├── CourseService.java             # Interface with 1 active method
│   │   └── impl/CourseServiceImpl.java    # Implementation with utilities
│   ├── dto/
│   │   ├── request/
│   │   │   └── CreateDraftCourseRequest.java  # Draft creation DTO
│   │   └── response/
│   │       ├── DraftCourseResponse.java       # Draft response DTO
│   │       └── ApiResponse.java               # Standardized response
│   ├── model/
│   │   ├── BaseEntity.java               # Shared timestamp fields
│   │   ├── Course.java                   # Core course entity
│   │   ├── CourseDetail.java            # Content information
│   │   ├── CoursePricing.java           # Pricing information
│   │   ├── CourseAnalytics.java         # Performance metrics
│   │   └── Category.java                # Course categories
│   ├── repository/
│   │   ├── CourseRepository.java
│   │   ├── CourseContentRepository.java
│   │   ├── CoursePricingRepository.java
│   │   ├── CourseAnalyticsRepository.java
│   │   └── CategoryRepository.java
│   ├── exception/
│   │   ├── CourseNotFoundException.java
│   │   ├── CategoryNotFoundException.java
│   │   └── GlobalExceptionHandler.java
│   ├── enums/
│   │   ├── CourseStatus.java
│   │   ├── CourseLevel.java
│   │   └── PricingType.java
│   └── utils/
│       └── CourseUtils.java             # Level conversion utilities
└── README.md
```

## Exception Handling
- `CourseNotFoundException` - Course not found
- `CategoryNotFoundException` - Category not found  
- `ValidationException` - Input validation errors
- `GlobalExceptionHandler` - Centralized exception handling

## API Usage

### Create Draft Course
```bash
POST /api/courses/draft
Content-Type: application/json

{
  "title": "Java Programming Basics",
  "category": 1,
  "level": "beginner"
}
```

### Response Format
```json
{
  "status": 201,
  "message": "Draft course created successfully",
  "data": "1"
}
```

## Database Schema
```sql
-- Base entity pattern with shared timestamps
CREATE TABLE courses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  instructor_id BIGINT NOT NULL,
  status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED', 'PENDING_REVIEW', 'REJECTED') DEFAULT 'DRAFT',
  category_id BIGINT NOT NULL,
  level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS') DEFAULT 'BEGINNER',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Modular related tables with shared primary keys
CREATE TABLE course_content (
  course_id BIGINT PRIMARY KEY,
  description TEXT,
  short_description TEXT,
  thumbnail_url VARCHAR(500),
  promo_video_url VARCHAR(500),
  requirements TEXT,
  what_you_will_learn TEXT,
  tags TEXT,
  language VARCHAR(10) DEFAULT 'vi',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE course_pricing (
  course_id BIGINT PRIMARY KEY,
  base_price DECIMAL(10,2) DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'USD',
  pricing_type ENUM('FREE', 'PAID', 'SUBSCRIPTION') DEFAULT 'PAID',
  is_tax_included BOOLEAN DEFAULT FALSE,
  tax_rate DECIMAL(5,4) DEFAULT 0.0000,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE course_analytics (
  course_id BIGINT PRIMARY KEY,
  enrolled_count INT DEFAULT 0,
  completed_count INT DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  rating_count INT DEFAULT 0,
  total_duration_minutes INT DEFAULT 0,
  total_lectures INT DEFAULT 0,
  total_sections INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon_name VARCHAR(50) UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```