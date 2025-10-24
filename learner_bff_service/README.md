# Learner BFF Service (Backend For Frontend)

## 🎯 Giới thiệu

**Learner BFF** là một **API Gateway / Filter Service** được thiết kế để tối ưu hóa dữ liệu cho **learner dashboard** trong e-learning platform.

Nó **tập hợp (aggregate)** dữ liệu từ `learner_service`, `cart_service`, và các service khác để trả về **JSON tối ưu cho frontend**, giảm đáng kể số lượng API calls và đơn giản hóa trải nghiệm người dùng.

### 📊 Flow kiến trúc

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │
       ↓ (1-2 API calls)
┌──────────────────────────────────────┐
│   Learner BFF Service (8083)         │  ← Điểm vào chung
│  - API Gateway cho Learner           │
│  - Gom dữ liệu từ nhiều service      │
│  - Format dữ liệu cho FE             │
│  - Không có business logic phức tạp  │
└──────────────┬───────────────────────┘
               │ (5-10 API calls)
        ┌──────┼──────────┬──────────┐
        ↓      ↓          ↓          ↓
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │learner-svc   │  │cart-svc      │  │course-svc    │
    │ (8082)       │  │(via GW)      │  │(8084)        │
    │ Profile      │  │Giỏ hàng      │  │Khóa học      │
    │ Enrollment   │  │              │  │              │
    │ Wishlist     │  │              │  │              │
    │ Reviews      │  │              │  │              │
    └──────────────┘  └──────────────┘  └──────────────┘
```

## 🏗️ Kiến trúc Microservices

### Downstream Services (Upstream để BFF)

- **Learner Service** (port 8082): Profile, Enrollments, Wishlist, Reviews, Quiz Attempts
- **Cart Service** (via API Gateway): Cart operations, item management
- **Course Service** (port 8084): Course details, ratings

### Caching Strategy

- **Redis** (localhost:6379): Cache course info, cart data
- **TTL**: Configurable per entity (courses: 1 hour, carts: 30 min)

## 🚀 Port

- **8083** (configurable trong `application.properties`)

## 📡 Endpoints chính

### � Dashboard

#### 1. GET `/api/v1/bff/dashboard/{accountId}`

Aggregate dashboard data đầy đủ cho learner

**Response:**

```json
{
  "code": 200,
  "message": "Tải bảng điều khiển thành công",
  "data": {
    "learnerName": "Nguyễn Văn A",
    "learnerEmail": "user@example.com",
    "profilePictureUrl": "https://...",

    "totalEnrolledCourses": 5,
    "completedCourses": 2,
    "inProgressCourses": 3,
    "averageLearningProgress": 65.5,

    "enrolledCourses": [
      {
        "courseId": 101,
        "courseName": "Java Spring Boot",
        "thumbnail": "https://...",
        "progress": 75.5,
        "status": "IN_PROGRESS",
        "enrolledAt": 1697000000000
      }
    ],

    "cartItemCount": 3,
    "wishlistItemCount": 5,
    "cartItems": [...],

    "totalReviewsGiven": 8,
    "averageRating": 4.5,
    "recentReviews": [...],

    "recommendedCourses": [...]
  }
}
```

### 📝 Enrollments (Khóa học đã đăng ký)

#### 2. POST `/api/v1/learners/enrollments`

Đăng ký khóa học

**Request:**

```json
{
  "accountId": 1,
  "courseId": 101
}
```

**Response:**

```json
{
  "code": 200,
  "message": "Đăng ký khóa học thành công",
  "data": {
    "enrollmentId": 1,
    "courseId": 101,
    "status": "IN_PROGRESS",
    "enrolledAt": 1698000000000
  }
}
```

#### 3. GET `/api/v1/learners/enrollments/{accountId}`

Lấy danh sách khóa học đã đăng ký

**Response:**

```json
{
  "code": 200,
  "message": "Lấy danh sách khóa học thành công",
  "data": [
    {
      "courseId": 101,
      "courseName": "Java Spring Boot",
      "progress": 75.5,
      "status": "IN_PROGRESS",
      "enrolledAt": 1697000000000
    }
  ]
}
```

### 🛒 Cart (Giỏ hàng)

#### 4. GET `/api/v1/learners/cart/{accountId}`

Lấy giỏ hàng

**Response:**

```json
{
  "code": 200,
  "message": "Lấy giỏ hàng thành công",
  "data": {
    "cartId": 1,
    "items": [
      {
        "courseId": 101,
        "courseName": "Java Spring Boot",
        "price": 199.99,
        "quantity": 1
      }
    ],
    "totalPrice": 199.99
  }
}
```

#### 5. POST `/api/v1/learners/cart/{accountId}/add`

Thêm khóa học vào giỏ hàng

**Request:**

```json
{
  "courseId": 101
}
```

**Response:**

```json
{
  "code": 200,
  "message": "Thêm vào giỏ hàng thành công",
  "data": {}
}
```

#### 6. DELETE `/api/v1/learners/cart/{accountId}/remove/{courseId}`

Xóa khỏi giỏ hàng

**Response:**

```json
{
  "code": 200,
  "message": "Xóa khỏi giỏ hàng thành công",
  "data": {}
}
```

### ❤️ Wishlist (Danh sách yêu thích)

#### 7. POST `/api/v1/learners/wishlist`

Thêm vào danh sách yêu thích

**Request:**

```json
{
  "accountId": 1,
  "courseId": 101
}
```

**Response:**

```json
{
  "code": 200,
  "message": "Thêm vào danh sách yêu thích thành công",
  "data": {}
}
```

#### 8. GET `/api/v1/learners/wishlist/{accountId}`

Lấy danh sách yêu thích

**Response:**

```json
{
  "code": 200,
  "message": "Lấy danh sách yêu thích thành công",
  "data": [
    {
      "courseId": 101,
      "courseName": "Java Spring Boot",
      "price": 199.99,
      "rating": 4.5
    }
  ]
}
```

#### 9. DELETE `/api/v1/learners/wishlist/{accountId}/{courseId}`

Xóa khỏi danh sách yêu thích

**Response:**

```json
{
  "code": 200,
  "message": "Xóa khỏi danh sách yêu thích thành công",
  "data": {}
}
```

### ⭐ Reviews (Bình luận & đánh giá)

#### 10. POST `/api/v1/learners/reviews`

Tạo bình luận/đánh giá khóa học

**Request:**

```json
{
  "accountId": 1,
  "courseId": 101,
  "rating": 5,
  "content": "Khóa học rất hay!"
}
```

**Response:**

```json
{
  "code": 200,
  "message": "Tạo bình luận thành công",
  "data": {
    "reviewId": 1,
    "rating": 5,
    "content": "Khóa học rất hay!",
    "createdAt": 1698000000000
  }
}
```

#### 11. GET `/api/v1/learners/reviews/{accountId}`

Lấy bình luận của người dùng

**Response:**

```json
{
  "code": 200,
  "message": "Lấy bình luận thành công",
  "data": [
    {
      "reviewId": 1,
      "courseId": 101,
      "rating": 5,
      "content": "Khóa học rất hay!"
    }
  ]
}
```

### 🧪 Quiz Attempts (Làm bài thi)

#### 12. POST `/api/v1/learners/quiz-attempts`

Tạo bài thi

**Request:**

```json
{
  "accountId": 1,
  "courseId": 101,
  "questions": "q1,q2,q3",
  "score": 85.5
}
```

**Response:**

```json
{
  "code": 200,
  "message": "Tạo bài thi thành công",
  "data": {
    "attemptId": 1,
    "score": 85.5,
    "createdAt": 1698000000000
  }
}
```

#### 13. GET `/api/v1/learners/quiz-attempts/{accountId}`

Lấy danh sách bài thi

**Response:**

```json
{
  "code": 200,
  "message": "Lấy danh sách bài thi thành công",
  "data": [
    {
      "attemptId": 1,
      "courseId": 101,
      "score": 85.5,
      "createdAt": 1698000000000
    }
  ]
}
```

### 👤 Profile (Hồ sơ cá nhân)

#### 14. GET `/api/v1/learners/profile/{accountId}`

Lấy thông tin hồ sơ cá nhân

**Response:**

```json
{
  "code": 200,
  "message": "Lấy thông tin cá nhân thành công",
  "data": {
    "accountId": 1,
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "0123456789",
    "address": "123 Main St",
    "profilePictureUrl": "https://..."
  }
}
```

#### 15. PUT `/api/v1/learners/profile/{accountId}`

Cập nhật hồ sơ cá nhân

**Request:**

```json
{
  "name": "Nguyễn Văn A Updated",
  "phone": "0987654321",
  "address": "456 New St"
}
```

**Response:**

```json
{
  "code": 200,
  "message": "Cập nhật hồ sơ thành công",
  "data": {}
}
```

## ⚙️ Cấu hình (application.properties)

```properties
server.port=8083
spring.application.name=learner-bff-service

# Redis
spring.data.redis.host=localhost
spring.data.redis.port=6379

# Downstream services
service.learner.base-url=http://localhost:8082/api/v1/learners
service.cart.base-url=http://api-gateway/api/v1/cart
service.course.base-url=http://localhost:8084/api/v1/courses

# Learner BFF specific
learner.cache.course-ttl=3600
learner.cache.cart-ttl=1800
```

## 🛠️ Build & Run

### Build

```bash
mvn clean install
```

### Run

```bash
mvn spring-boot:run
```

Hoặc:

```bash
java -jar target/learner-bff-service-0.0.1-SNAPSHOT.jar
```

### Docker

```dockerfile
FROM openjdk:17-jdk-slim
COPY target/learner-bff-service-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## 📚 Swagger/OpenAPI

Truy cập: `http://localhost:8083/swagger-ui.html`

## 🏛️ Kiến trúc từng component

### Clients (HTTP calls)

- `LearnerServiceClient` (14 methods): Profile, enrollments, reviews, wishlist, quiz attempts
- `CartServiceClient` (5 methods): Cart operations, item management, apply coupon
- `CourseServiceClient` (2 methods): Course details, ratings

### Services (Business Logic)

- `DashboardService`: Aggregate dashboard data (enrollments + cart + wishlist + reviews)
- `EnrollmentService`: Enrollment operations
- `CartService`: Cart management
- `ProfileService`: Profile management
- `ReviewService`: Review operations
- `WishlistService`: Wishlist management
- `QuizAttemptService`: Quiz attempt tracking

### Controllers (REST Endpoints)

- `DashboardController`: Dashboard aggregation (1 endpoint)
- `EnrollmentController`: Enrollment management (5 endpoints)
- `CartController`: Cart operations (4 endpoints)
- `ProfileController`: Profile operations (2 endpoints)
- `ReviewController`: Review operations (4 endpoints)
- `WishlistController`: Wishlist operations (3 endpoints)
- `QuizAttemptController`: Quiz attempt operations (2 endpoints)

**Total: 7 Controllers, 7 Services, 3 Clients, 21 Endpoints**

## 📋 Error Handling

- **Graceful degradation**: Nếu một downstream service thất bại, BFF trả về partial data nếu có thể
- **Logging**: Tất cả operations được log chi tiết với prefix "BFF Service:"
- **Validation**: Dữ liệu được validate trước khi gửi đến backend

## 🔐 Security

- **Authentication**: JWT token validation (via API Gateway)
- **Authorization**: User chỉ có thể truy cập dữ liệu của chính mình
- **Input validation**: Sanitize & validate tất cả inputs

## 📈 Lợi ích của Learner BFF

- **Performance**: Giảm 5-10 API calls từ frontend xuống 1-2 calls
- **UX**: Data sẵn sàng, ít loading states
- **Maintainability**: Frontend chỉ tương tác với BFF, không cần biết về backend services
- **Scalability**: BFF có thể scale riêng, cache shared data
- **Flexibility**: Dễ dàng thêm/thay đổi data format cho frontend mà không ảnh hưởng backend
- **Aggregation**: Dashboard gom dữ liệu từ nhiều service thành một response duy nhất

## 🎯 Kiểu dữ liệu trong Response

### DashboardResponse (Dashboard Aggregation)

```java
- enrolledCourses: List<Map>
- totalEnrolledCourses: Integer
- completedCourses: Integer
- inProgressCourses: Integer
- averageLearningProgress: Double
- cartItemCount: Integer
- wishlistItemCount: Integer
- cartItems: List<Map>
- recentReviews: List<Map>
- totalReviewsGiven: Integer
- averageRating: Double
- recommendedCourses: List<Map>
- learnerName: String
- learnerEmail: String
- profilePictureUrl: String
```

### Request DTOs

- `EnrollmentRequest`: accountId, courseId
- `CartRequest`: accountId, courseId
- `ProfileUpdateRequest`: name, phone, address, email
- `ReviewRequest`: accountId, courseId, rating, content
- `WishlistRequest`: accountId, courseId
- `QuizAttemptRequest`: accountId, courseId, questions, score

## 🔄 Caching Strategy

| Entity      | TTL    | Invalidation           |
| ----------- | ------ | ---------------------- |
| Courses     | 1 hour | Manual or after update |
| Carts       | 30 min | On add/remove item     |
| Enrollments | 15 min | On status change       |
| Wishlist    | 30 min | On add/remove          |

## 📊 Statistics & Metrics

Dashboard tự động tính toán:

- ✅ Learning progress trung bình (%)
- ✅ Tổng khóa học hoàn thành
- ✅ Tổng khóa học đang học
- ✅ Điểm đánh giá trung bình
- ✅ Tổng số bình luận đã tạo

## 🚀 Deployment

### Docker Compose

```yaml
version: "3.8"
services:
  learner-bff:
    build: .
    ports:
      - "8083:8083"
    environment:
      - SERVICE_LEARNER_BASE_URL=http://learner-service:8082/api/v1/learners
      - SERVICE_CART_BASE_URL=http://api-gateway/api/v1/cart
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      - redis
      - learner-service
```

## 📝 Next Steps (Tương lai)

1. ✅ Thêm Dashboard aggregation
2. ✅ Thêm Enrollment management
3. ✅ Thêm Cart operations
4. ✅ Thêm Wishlist management
5. ✅ Thêm Reviews
6. ✅ Thêm Quiz tracking
7. ⏳ Thêm request caching optimization
8. ⏳ Thêm metrics (Micrometer + Prometheus)
9. ⏳ Thêm GraphQL endpoint option
10. ⏳ Thêm WebSocket support cho real-time notifications
