# Course Service

## Overview
Course Service quản lý tất cả thông tin liên quan đến khóa học trong hệ thống E-learning, bao gồm tạo, cập nhật, tìm kiếm và quản lý trạng thái khóa học.

## Features
- ✅ **CRUD Operations**: Tạo, đọc, cập nhật, xóa khóa học
- ✅ **Search & Filter**: Tìm kiếm theo tiêu đề, lọc theo category, level, status, giá
- ✅ **Status Management**: Quản lý trạng thái khóa học (DRAFT, PUBLISHED, ARCHIVED, etc.)
- ✅ **Instructor Management**: Quản lý khóa học theo instructor
- ✅ **Featured Courses**: Đánh dấu và quản lý khóa học nổi bật
- ✅ **Statistics**: Thống kê số lượng khóa học theo các tiêu chí
- ✅ **Pagination**: Hỗ trợ phân trang cho danh sách lớn

## Architecture

### Domain Model
```
Course Entity:
├── Basic Info: title, description, shortDescription
├── Instructor: instructorId
├── Classification: category, level, status
├── Pricing: price, discountPrice
├── Media: thumbnailUrl
├── Metrics: enrolledCount, averageRating, ratingCount
├── Content: requirements, whatYouWillLearn, tags
├── Settings: isFeatured, isActive
└── Timestamps: createdAt, updatedAt
```

### Domain Models
- **CourseStatus** (enum): DRAFT, PUBLISHED, ARCHIVED, PENDING_REVIEW, REJECTED
- **CourseLevel** (enum): BEGINNER, INTERMEDIATE, ADVANCED, EXPERT  
- **Category** (entity): Dynamic categories với name, code, description, isActive

### API Endpoints

#### Course Management
- `POST /api/courses` - Tạo khóa học mới
- `GET /api/courses/{id}` - Lấy thông tin khóa học theo ID
- `GET /api/courses` - Lấy danh sách tất cả khóa học (có phân trang)
- `PUT /api/courses/{id}` - Cập nhật thông tin khóa học
- `DELETE /api/courses/{id}` - Xóa khóa học
- `PATCH /api/courses/{id}/status` - Cập nhật trạng thái khóa học

#### Search & Filter
- `GET /api/courses/search?keyword={keyword}` - Tìm kiếm theo tiêu đề
- `GET /api/courses/filter?categoryId={}&level={}&status={}&minPrice={}&maxPrice={}` - Lọc khóa học
- `GET /api/courses/instructor/{instructorId}` - Lấy khóa học theo instructor
- `GET /api/courses/category/{categoryId}` - Lấy khóa học theo category ID
- `GET /api/courses/level/{level}` - Lấy khóa học theo level
- `GET /api/courses/status/{status}` - Lấy khóa học theo status

#### Special Lists
- `GET /api/courses/featured` - Lấy khóa học nổi bật
- `GET /api/courses/most-enrolled?limit={}` - Khóa học có nhiều học viên nhất
- `GET /api/courses/recent?limit={}` - Khóa học mới nhất

#### Statistics
- `GET /api/courses/count/instructor/{instructorId}` - Đếm khóa học theo instructor
- `GET /api/courses/count/status/{status}` - Đếm khóa học theo status  
- `GET /api/courses/count/category/{categoryId}` - Đếm khóa học theo category ID

#### Category Management
- `GET /api/categories` - Lấy tất cả categories
- `GET /api/categories/active` - Lấy categories đang hoạt động
- `GET /api/categories/{id}` - Lấy category theo ID
- `GET /api/categories/code/{code}` - Lấy category theo code

### Technologies
- **Spring Boot 3.5.5** - Main framework
- **Spring Data JPA** - Data access layer
- **PostgreSQL** - Primary database
- **Lombok** - Code generation
- **Jakarta Validation** - Input validation
- **Maven** - Build tool

### Validation Rules
- Title: Required, max 200 characters
- Description: Required
- InstructorId: Required, not null
- Category: Required
- Price: Must be positive
- Rating: Between 0.0 and 5.0
- Duration: Must be positive

### Exception Handling
- `CourseNotFoundException` - Khóa học không tồn tại
- `CourseTitleAlreadyExistsException` - Tiêu đề khóa học đã tồn tại
- `ValidationException` - Lỗi validation input
- `GlobalExceptionHandler` - Xử lý exception toàn cục

### Response Format
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "title": "Java Programming Masterclass",
    "category": "PROGRAMMING",
    "level": "INTERMEDIATE",
    "price": 99.99,
    "enrolledCount": 1250,
    "averageRating": 4.7
  },
  "message": "Course retrieved successfully"
}
```

## Usage Examples

### Create Course
```bash
POST /api/courses
{
  "title": "React Complete Guide",
  "description": "Learn React from scratch to advanced level",
  "instructorId": 1,
  "category": "PROGRAMMING", 
  "level": "BEGINNER",
  "price": 49.99
}
```

### Search Courses
```bash
GET /api/courses/search?keyword=react
GET /api/courses/filter?category=PROGRAMMING&level=BEGINNER&maxPrice=50
```

### Update Course Status
```bash
PATCH /api/courses/1/status?status=PUBLISHED
```

## Database Schema
```sql
-- Categories table
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  code VARCHAR(20) UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  instructor_id BIGINT NOT NULL,
  status VARCHAR(20) DEFAULT 'DRAFT',
  category_id BIGINT NOT NULL REFERENCES categories(id),
  level VARCHAR(20) DEFAULT 'BEGINNER',
  price DECIMAL(10,2) DEFAULT 0.00,
  discount_price DECIMAL(10,2),
  thumbnail_url VARCHAR(500),
  duration_minutes INTEGER DEFAULT 0,
  enrolled_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  rating_count INTEGER DEFAULT 0,
  requirements TEXT,
  what_you_will_learn TEXT,
  tags TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Development Notes
- Sử dụng static mapper thay vì ModelMapper để tối ưu performance
- Implement pagination cho tất cả list endpoints
- Áp dụng @Transactional(readOnly = true) cho read operations
- Validation đầy đủ cho input data
- Exception handling toàn diện với meaningful messages
