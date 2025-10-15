# E-Learning Backend

## 📋 Tổng quan

Backend của hệ thống E-Learning được xây dựng theo kiến trúc microservices với Spring Boot, cung cấp các API để quản lý quiz, courses, và user progress.

## 🏗️ Kiến trúc hệ thống

### Microservices
- **quiz-service** (Port 8081): Quản lý quiz, câu hỏi, và attempts
- **course-service** (Port 8082): Quản lý courses và sections  
- **user-service** (Port 8083): Quản lý users (students, tutors)
- **api-gateway** (Port 8080): API Gateway cho routing

### Technology Stack
- **Java 17+**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **MySQL 8.0**
- **Spring Security**
- **Spring Cloud Gateway**
- **Docker & Docker Compose**
- **Maven 3.6+**

## 🚀 Hướng dẫn cài đặt và chạy

### 1. Yêu cầu hệ thống

#### Phần mềm cần thiết:
- **Java 17+** - [Download Oracle JDK](https://www.oracle.com/java/technologies/downloads/) hoặc [OpenJDK](https://openjdk.org/)
- **Maven 3.6+** - [Download Maven](https://maven.apache.org/download.cgi)
- **Docker Desktop** - [Download Docker](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download Git](https://git-scm.com/downloads)

#### Kiểm tra cài đặt:
```bash
# Kiểm tra Java version
java -version

# Kiểm tra Maven version  
mvn -version

# Kiểm tra Docker version
docker --version
docker-compose --version
```

### 2. Clone và setup dự án

```bash
# Clone repository
git clone <repository-url>
cd elearning-react/backend

# Kiểm tra cấu trúc thư mục
ls -la
```

### 3. Khởi động Database

#### Sử dụng Docker (Khuyến nghị):
```bash
# Khởi động MySQL database
docker-compose up -d mysql

# Kiểm tra container đang chạy
docker ps

# Xem logs nếu cần
docker logs elearning-mysql
```

#### Cấu hình Database:
- **Host**: localhost:3307
- **Database**: elearning_quiz
- **Username**: root
- **Password**: rootpassword

### 4. Khởi động Quiz Service

#### Cách 1: Sử dụng IntelliJ IDEA (Khuyến nghị cho IDE)

**Bước 1: Import Project**
1. Mở IntelliJ IDEA
2. Chọn `File` → `Open`
3. Chọn thư mục `elearning-react/backend/quiz-service`
4. IntelliJ sẽ tự động detect đây là Maven project
5. Chờ IntelliJ download dependencies và index project

**Bước 2: Cấu hình Database**
1. Đảm bảo MySQL đã chạy: `docker-compose up -d mysql`
2. Kiểm tra database connection trong `application.yml`

**Bước 3: Chạy Application**
1. Mở file `QuizServiceApplication.java`
2. Click vào icon ▶️ bên cạnh class name hoặc method `main`
3. Chọn `Run 'QuizServiceApplication'`
4. Hoặc sử dụng shortcut `Ctrl+Shift+F10`

**Bước 4: Kiểm tra Logs**
- Xem logs trong tab `Run` ở dưới cùng IntelliJ
- Đảm bảo thấy message: `Started QuizServiceApplication`

#### Cách 2: Sử dụng Script tự động

**Trên Windows:**
```bash
# Chạy script tự động
start-services.bat
```

**Trên Linux/Mac:**
```bash
# Cấp quyền thực thi
chmod +x start-services.sh

# Chạy script tự động
./start-services.sh
```

#### Cách 3: Chạy thủ công với Maven

```bash
# Di chuyển vào thư mục quiz-service
cd quiz-service

# Build và chạy ứng dụng
mvn clean install
mvn spring-boot:run
```

### 5. Kiểm tra Services đang chạy

Sau khi khởi động thành công, bạn có thể truy cập:

- **🎯 Quiz Service API**: http://localhost:8081
- **📚 Swagger UI**: http://localhost:8081/swagger-ui.html
- **📖 API Documentation**: http://localhost:8081/api-docs
- **❤️ Health Check**: http://localhost:8081/actuator/health
- **📊 Database**: localhost:3307

## 📚 API Documentation

### Quiz Management APIs

#### Tạo Quiz mới
```http
POST /api/quizzes
Content-Type: application/json

{
  "title": "React Basics Quiz",
  "description": "Test your React knowledge",
  "sectionId": 1,
  "tutorId": 1,
  "timeLimit": 30,
  "maxAttempts": 3
}
```

#### Lấy danh sách Quiz
```http
GET /api/quizzes
GET /api/quizzes/section/{sectionId}
GET /api/quizzes/tutor/{tutorId}
```

#### Cập nhật Quiz
```http
PUT /api/quizzes/{id}
Content-Type: application/json

{
  "title": "Updated Quiz Title",
  "description": "Updated description"
}
```

### Quiz Question APIs

#### Tạo câu hỏi mới
```http
POST /api/quiz-questions
Content-Type: application/json

{
  "quizId": 1,
  "questionText": "What is React?",
  "questionType": "MULTIPLE_CHOICE",
  "points": 10,
  "options": [
    {
      "optionText": "A JavaScript library",
      "isCorrect": true
    },
    {
      "optionText": "A database",
      "isCorrect": false
    }
  ]
}
```

### Quiz Attempt APIs

#### Bắt đầu làm quiz
```http
POST /api/quiz-attempts
Content-Type: application/json

{
  "quizId": 1,
  "studentId": 1
}
```

#### Submit câu trả lời
```http
POST /api/quiz-attempts/{attemptId}/submit
Content-Type: application/json

{
  "answers": [
    {
      "questionId": 1,
      "selectedOptionIds": [1]
    }
  ]
}
```

## 🧪 Testing APIs

### Sử dụng Swagger UI
1. Truy cập http://localhost:8081/swagger-ui.html
2. Click vào endpoint cần test
3. Click "Try it out"
4. Nhập dữ liệu và click "Execute"

### Sử dụng REST Client (VS Code)
1. Cài đặt extension "REST Client" trong VS Code
2. Tạo file `.http` với các API calls
3. Click "Send Request" để test

### Sử dụng Postman
1. Import collection từ file `postman-collection.json`
2. Set environment variables
3. Chạy các requests

### Sử dụng curl
```bash
# Test health check
curl http://localhost:8081/actuator/health

# Test API endpoint
curl -X GET http://localhost:8081/api/quizzes
```

## 🔧 Scripts tiện ích

### Database Scripts
```bash
# Insert sample data
insert_sample_data.bat

# Clean và insert data mới
clean_and_insert_data.bat

# Reset course tables
reset_course_tables.bat

# Update complete data
update_complete_data.bat
```

### Service Scripts
```bash
# Restart backend services
restart_backend.bat

# Rebuild và restart
rebuild_and_restart.bat

# Test APIs
test_api.bat
```

## 🐛 Troubleshooting

### Lỗi thường gặp

#### 1. Database Connection Error
```bash
# Kiểm tra MySQL container
docker ps | grep mysql

# Xem logs
docker logs elearning-mysql

# Restart database
docker-compose restart mysql
```

#### 2. Port đã được sử dụng
```bash
# Kiểm tra port đang sử dụng
netstat -ano | findstr :8081
netstat -ano | findstr :3307

# Kill process nếu cần
taskkill /PID <process_id> /F
```

#### 3. Java Version Error
```bash
# Kiểm tra Java version
java -version

# Cần Java 17+
# Nếu chưa có, download từ Oracle hoặc OpenJDK
```

#### 4. Maven Build Error

**Với IntelliJ IDEA:**
1. Mở `Maven` tab ở bên phải
2. Click vào `Reload All Maven Projects` (icon refresh)
3. Hoặc `File` → `Reload Gradle/Maven Projects`
4. Nếu vẫn lỗi: `File` → `Invalidate Caches and Restart`

**Với Command Line:**
```bash
# Clean và rebuild
mvn clean install -U

# Skip tests nếu cần
mvn clean install -DskipTests
```

#### 6. IntelliJ IDEA Issues

**Project không load được:**
1. `File` → `Close Project`
2. `File` → `Open` → Chọn lại thư mục `quiz-service`
3. Chờ IntelliJ detect Maven project

**Dependencies không download:**
1. Mở `Maven` tab (bên phải)
2. Click `Reload All Maven Projects`
3. Kiểm tra `Settings` → `Build Tools` → `Maven` → `Maven home directory`

**Application không chạy:**
1. Kiểm tra `Run Configuration`:
   - `Run` → `Edit Configurations`
   - Đảm bảo `Main class` là `com.elearning.quiz.QuizServiceApplication`
   - `Working directory` là thư mục `quiz-service`

**Port đã được sử dụng:**
1. `Run` → `Edit Configurations`
2. Thêm VM options: `-Dserver.port=8082`
3. Hoặc thay đổi port trong `application.yml`

### Logs và Debugging

#### Xem logs ứng dụng
```bash
# Logs trong console khi chạy mvn spring-boot:run
# Hoặc check file logs trong target/logs/
```

#### Xem logs database
```bash
docker logs elearning-mysql -f
```

#### Debug mode
```bash
# Chạy với debug mode
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

## 📊 Database Schema

### Tables chính
- **quizzes**: Thông tin quiz
- **quiz_questions**: Câu hỏi quiz
- **quiz_question_options**: Lựa chọn câu hỏi
- **quiz_attempts**: Kết quả làm quiz
- **courses**: Thông tin khóa học
- **sections**: Phần của khóa học
- **lessons**: Bài học

### Sample Data
Database sẽ tự động tạo với sample data từ file `sql/init.sql`

## 🔗 Kết nối với Frontend

### Cấu hình Frontend
1. **API Base URL**: `http://localhost:8081/api`
2. **Quiz API Service**: `frontend/src/services/quizApi.ts`
3. **Updated Hook**: `frontend/src/hooks/useQuiz.ts`

### Test Integration
1. Chạy backend services
2. Chạy frontend: `cd frontend && npm start`
3. Test quiz functionality trong frontend

## 🚀 Deployment

### Development

#### Sử dụng IntelliJ IDEA (Khuyến nghị)
```bash
# 1. Khởi động database
docker-compose up -d mysql

# 2. Mở IntelliJ IDEA
# 3. Import project: File → Open → chọn thư mục quiz-service
# 4. Chạy QuizServiceApplication.java
# 5. Test APIs tại http://localhost:8081/swagger-ui.html
```

#### Sử dụng Command Line
```bash
# Chạy tất cả services
./start-services.sh

# Hoặc chạy từng service riêng lẻ
docker-compose up -d mysql
cd quiz-service && mvn spring-boot:run
```

### Production
```bash
# Build JAR file
mvn clean package -DskipTests

# Chạy JAR file
java -jar target/quiz-service-1.0.0.jar

# Hoặc sử dụng Docker
docker build -t quiz-service .
docker run -p 8081:8081 quiz-service
```

## 📈 Monitoring và Health Checks

### Health Endpoints
- **Health Check**: `/actuator/health`
- **Info**: `/actuator/info`
- **Metrics**: `/actuator/metrics`

### Monitoring Tools
- **Spring Boot Actuator**: Built-in monitoring
- **Micrometer**: Metrics collection
- **Prometheus**: Metrics scraping (nếu cần)

## 🎯 Roadmap

### Phase 1 (Hiện tại)
- ✅ Quiz Service hoàn thiện
- ✅ Database setup
- ✅ Basic APIs

### Phase 2 (Tiếp theo)
- 🔄 Course Service
- 🔄 User Service
- 🔄 Authentication & Authorization
- 🔄 API Gateway

### Phase 3 (Tương lai)
- 📋 Microservices communication
- 📋 Service discovery (Eureka)
- 📋 Load balancing
- 📋 Distributed tracing

## 📞 Support

Nếu gặp vấn đề, hãy:
1. Kiểm tra phần Troubleshooting
2. Xem logs để debug
3. Tạo issue trên repository
4. Liên hệ team development

---

**Chúc bạn coding vui vẻ! 🚀**