# E-Learning Backend - Quick Start Guide

## 🚀 Cách chạy Backend

### 1. Yêu cầu hệ thống
- Java 17+
- Maven 3.6+
- Docker & Docker Compose
- MySQL 8.0+

### 2. Khởi động Database
```bash
# Chạy MySQL database
cd backend
docker-compose up -d mysql

# Kiểm tra database đã chạy
docker ps
```

### 3. Khởi động Quiz Service
```bash
# Chạy Quiz Service
cd backend/quiz-service
mvn spring-boot:run

# Hoặc sử dụng script Windows
cd backend
start-services.bat
```

### 4. Kiểm tra Services
- **Quiz Service**: http://localhost:8081
- **Swagger UI**: http://localhost:8081/swagger-ui.html
- **API Docs**: http://localhost:8081/api-docs
- **Database**: localhost:3306

## 📋 APIs Available

### Quiz Management
- `POST /api/quizzes` - Tạo quiz mới
- `GET /api/quizzes/{id}` - Lấy quiz theo ID
- `GET /api/quizzes/section/{sectionId}` - Lấy quiz theo section
- `GET /api/quizzes/tutor/{tutorId}` - Lấy quiz theo tutor
- `PUT /api/quizzes/{id}` - Cập nhật quiz
- `DELETE /api/quizzes/{id}` - Xóa quiz

### Quiz Attempts
- `POST /api/quiz-attempts` - Bắt đầu làm quiz
- `GET /api/quiz-attempts/{id}` - Lấy kết quả quiz
- `PUT /api/quiz-attempts/{id}/answers` - Lưu câu trả lời
- `POST /api/quiz-attempts/{id}/submit` - Submit quiz

## 🧪 Test APIs

Sử dụng file `test-apis.http` để test các APIs:

1. Mở file `backend/test-apis.http` trong VS Code
2. Cài đặt extension "REST Client"
3. Click "Send Request" trên từng API call

## 🔗 Kết nối với Frontend

Frontend đã được cập nhật để sử dụng API thực:

1. **Quiz API Service**: `frontend/src/services/quizApi.ts`
2. **Updated Hook**: `frontend/src/hooks/useQuiz.ts`
3. **API Base URL**: `http://localhost:8081/api`

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Kiểm tra MySQL container
docker logs elearning-mysql

# Restart database
docker-compose restart mysql
```

### Port Conflicts
- Quiz Service: 8081
- MySQL: 3306
- Redis: 6379

### Java Version Issues
```bash
# Kiểm tra Java version
java -version

# Cần Java 17+
```

## 📊 Database Schema

### Tables Created
- `quizzes` - Thông tin quiz
- `quiz_questions` - Câu hỏi quiz
- `quiz_question_options` - Lựa chọn câu hỏi
- `quiz_attempts` - Kết quả làm quiz

### Sample Data
Database sẽ tự động tạo với schema từ `sql/init.sql`

## 🎯 Next Steps

1. **Test APIs** - Sử dụng Swagger UI hoặc test-apis.http
2. **Connect Frontend** - Chạy frontend và test quiz functionality
3. **Add Authentication** - Thêm JWT authentication
4. **Add More Services** - Course Service, User Service
5. **Add API Gateway** - Eureka Server, Spring Cloud Gateway
