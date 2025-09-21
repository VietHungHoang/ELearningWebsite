# E-Learning Backend

## Microservices Architecture

### Services
- **quiz-service**: Quản lý quiz, câu hỏi, và attempts
- **course-service**: Quản lý courses và sections
- **user-service**: Quản lý users (students, tutors)
- **api-gateway**: API Gateway cho routing

### Technology Stack
- Spring Boot 3.x
- Spring Data JPA
- MySQL/PostgreSQL
- Spring Security
- Spring Cloud Gateway
- Docker

## Quick Start

1. Start database: `docker-compose up -d`
2. Start services: `./start-services.sh`
3. API Gateway: http://localhost:8080
4. Quiz Service: http://localhost:8081
5. Course Service: http://localhost:8082
6. User Service: http://localhost:8083
