# Quiz Service

Quiz Service for E-learning Platform - Quản lý bài quiz, câu hỏi, và lịch sử làm bài của học sinh.

## Tính năng

### 1. Quản lý Quiz (Tutor)
- ✅ Tạo quiz với nhiều câu hỏi
- ✅ Chỉnh sửa và xóa quiz
- ✅ Publish/Archive quiz
- ✅ Cấu hình thời gian, điểm đạt, số lần làm tối đa
- ✅ Shuffle câu hỏi và đáp án
- ✅ Xem thống kê chi tiết từng quiz

### 2. Loại câu hỏi
- ✅ **Single Choice**: Chọn 1 đáp án duy nhất
- ✅ **Multiple Choice**: Chọn nhiều đáp án

### 3. Làm bài (Student)
- ✅ Bắt đầu làm quiz
- ✅ Lưu câu trả lời tự động
- ✅ Nộp bài và chấm điểm tự động
- ✅ Xem kết quả và đáp án đúng
- ✅ Xem lịch sử các lần làm

### 4. Thống kê & Analytics
- ✅ Điểm trung bình, cao nhất, thấp nhất
- ✅ Tỷ lệ đạt (pass rate)
- ✅ Thống kê từng câu hỏi (độ khó, tỷ lệ đúng)
- ✅ Phân tích lựa chọn đáp án

## Database Schema

### Entities
1. **Quiz** - Thông tin bài quiz
2. **Question** - Câu hỏi trong quiz
3. **QuestionOption** - Đáp án cho câu hỏi
4. **QuizAttempt** - Lần làm bài của học sinh
5. **StudentAnswer** - Câu trả lời của học sinh

## API Endpoints

### Quiz Management (Tutor)
```
POST   /api/quizzes                         - Tạo quiz mới
GET    /api/quizzes/{id}                    - Chi tiết quiz
PUT    /api/quizzes/{id}                    - Cập nhật quiz
DELETE /api/quizzes/{id}                    - Xóa quiz
POST   /api/quizzes/{id}/publish            - Publish quiz
POST   /api/quizzes/{id}/archive            - Archive quiz
GET    /api/quizzes/class/{classId}         - Danh sách quiz theo lớp
GET    /api/quizzes/creator/{creatorId}     - Danh sách quiz theo tutor
GET    /api/quizzes/{id}/statistics         - Thống kê quiz
```

### Question Management
```
POST   /api/quizzes/{quizId}/questions      - Thêm câu hỏi
GET    /api/quizzes/{quizId}/questions      - Danh sách câu hỏi
PUT    /api/quizzes/{quizId}/questions/{id} - Cập nhật câu hỏi
DELETE /api/quizzes/{quizId}/questions/{id} - Xóa câu hỏi
```

### Student Quiz Taking
```
GET    /api/student/quizzes/{id}                  - Xem quiz
POST   /api/student/quizzes/{id}/start            - Bắt đầu làm bài
POST   /api/student/quizzes/attempts/{id}/answers - Lưu câu trả lời
POST   /api/student/quizzes/attempts/{id}/submit  - Nộp bài
GET    /api/student/quizzes/attempts/{id}/result  - Xem kết quả
GET    /api/student/quizzes/{id}/attempts         - Lịch sử làm bài
```

## Request/Response Examples

### Tạo Quiz
```json
{
  "classId": "uuid",
  "title": "Final Exam - Spring Framework",
  "description": "Kiểm tra cuối kỳ về Spring Framework",
  "timeLimitMinutes": 60,
  "passingScore": 70,
  "maxAttempts": 2,
  "shuffleQuestions": true,
  "shuffleOptions": true,
  "showCorrectAnswers": true,
  "questions": [
    {
      "questionText": "What is Spring Boot?",
      "type": "SINGLE_CHOICE",
      "points": 10,
      "options": [
        { "optionText": "A framework", "isCorrect": true },
        { "optionText": "A database", "isCorrect": false },
        { "optionText": "A library", "isCorrect": false },
        { "optionText": "An IDE", "isCorrect": false }
      ]
    }
  ]
}
```

### Nộp bài
```json
{
  "answers": [
    {
      "questionId": "uuid",
      "selectedOptionIds": ["uuid1", "uuid2"]
    }
  ],
  "timeSpentSeconds": 1800
}
```

### Kết quả
```json
{
  "attemptId": "uuid",
  "quizId": "uuid",
  "quizTitle": "Final Exam",
  "score": 80,
  "totalScore": 100,
  "percentage": 80.0,
  "passed": true,
  "timeSpentSeconds": 1800,
  "questions": [
    {
      "questionId": "uuid",
      "questionText": "What is Spring Boot?",
      "points": 10,
      "pointsEarned": 10,
      "isCorrect": true,
      "options": [
        {
          "optionId": "uuid",
          "optionText": "A framework",
          "isCorrect": true,
          "isSelected": true
        }
      ]
    }
  ]
}
```

## Business Rules

1. **Quiz Status**
   - DRAFT: Đang soạn thảo, chưa publish
   - ACTIVE: Đã publish, học sinh có thể làm
   - ARCHIVED: Đã archive, không thể làm

2. **Attempt Status**
   - IN_PROGRESS: Đang làm bài
   - SUBMITTED: Đã nộp, chờ chấm
   - GRADED: Đã chấm xong
   - ABANDONED: Bỏ dở

3. **Validation**
   - Quiz phải có ít nhất 1 câu hỏi mới publish được
   - Mỗi câu hỏi phải có ít nhất 2 đáp án
   - Single choice chỉ có 1 đáp án đúng
   - Multiple choice có thể có nhiều đáp án đúng
   - Không được vượt quá maxAttempts

4. **Grading**
   - Chấm tự động ngay khi submit
   - Single choice: Đúng = full points, Sai = 0
   - Multiple choice: Chọn đúng tất cả = full points, còn lại = 0
   - Percentage = (score / totalScore) * 100
   - Passed = percentage >= passingScore

## Tính năng nâng cao (Future)

- [ ] Question Bank - Ngân hàng câu hỏi tái sử dụng
- [ ] Loại câu hỏi mới: True/False, Fill in blank, Essay
- [ ] Partial scoring cho Multiple Choice
- [ ] Time limit cho từng câu hỏi
- [ ] Chống gian lận (track tab switch, copy/paste)
- [ ] AI-powered question generation
- [ ] Adaptive learning
- [ ] Export kết quả ra Excel/PDF

## Technologies

- Spring Boot 3.5.5
- Spring Data JPA
- PostgreSQL
- Lombok
- Jackson
- Kafka (for events)

## Configuration

```yaml
server:
  port: 8085

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/elearning_quiz
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

## Running the Service

```bash
# Build
mvn clean package

# Run
java -jar target/quiz-service-0.0.1-SNAPSHOT.jar

# Or with Docker
docker-compose up quiz-service
```

## Author

E-learning Platform Team
