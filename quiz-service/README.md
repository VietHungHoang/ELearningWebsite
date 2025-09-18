# 📘 Quiz Service API Documentation

---

## 1. Get All Quizzes by Lesson
- **Method**: GET  
- **URL**: `/api/quizzes/lesson/{lessonId}`  
- **Description**: Lấy danh sách tất cả quiz thuộc một lesson cụ thể.  

**Example Request**:
```
GET http://localhost:8081/api/quizzes/lesson/101
```

**Example Response**:
```json
[
  {
    "id": 1,
    "title": "Java Basics Quiz",
    "lessonId": 101,
    "questions": [
      {
        "id": 11,
        "content": "What is Java?",
        "answers": [
          {"id": 101, "content": "A programming language", "correct": true},
          {"id": 102, "content": "A coffee brand", "correct": false},
          {"id": 103, "content": "An island", "correct": false},
          {"id": 104, "content": "A framework", "correct": false}
        ]
      }
    ]
  }
]
```

---

## 2. Get Quiz by ID
- **Method**: GET  
- **URL**: `/api/quizzes/{id}`  
- **Description**: Lấy thông tin chi tiết của một quiz theo ID.  

**Example Request**:
```
GET http://localhost:8081/api/quizzes/1
```

**Example Response**:
```json
{
  "id": 1,
  "title": "Java Basics Quiz",
  "lessonId": 101,
  "questions": [
    {
      "id": 11,
      "content": "What is Java?",
      "answers": [
        {"id": 101, "content": "A programming language", "correct": true},
        {"id": 102, "content": "A coffee brand", "correct": false},
        {"id": 103, "content": "An island", "correct": false},
        {"id": 104, "content": "A framework", "correct": false}
      ]
    },
    {
      "id": 12,
      "content": "What does JVM stand for?",
      "answers": [
        {"id": 201, "content": "Java Virtual Machine", "correct": true},
        {"id": 202, "content": "Java Vendor Manager", "correct": false},
        {"id": 203, "content": "Joint Visual Model", "correct": false},
        {"id": 204, "content": "Java Version Module", "correct": false}
      ]
    }
  ]
}
```

---

## 3. Create Quiz for Lesson
- **Method**: POST  
- **URL**: `/api/quizzes`  
- **Description**: Tạo quiz mới gắn với một lesson.  
- **Request Body**:
```json
{
  "lessonId": 101,
  "title": "New Quiz",
  "questions": [
    {
      "content": "What is an IDE?",
      "answers": [
        {"content": "Integrated Development Environment", "correct": true},
        {"content": "Internet Data Exchange", "correct": false},
        {"content": "Internal Debugging Engine", "correct": false},
        {"content": "Instant Development Executor", "correct": false}
      ]
    }
  ]
}
```

**Example Response**:
```json
{
  "id": 2,
  "title": "New Quiz",
  "lessonId": 101,
  "questions": [
    {
      "id": 21,
      "content": "What is an IDE?",
      "answers": [
        {"id": 301, "content": "Integrated Development Environment", "correct": true},
        {"id": 302, "content": "Internet Data Exchange", "correct": false},
        {"id": 303, "content": "Internal Debugging Engine", "correct": false},
        {"id": 304, "content": "Instant Development Executor", "correct": false}
      ]
    }
  ]
}
```

---

## 4. Get Question by Quiz and Index
- **Method**: GET  
- **URL**: `/api/quizzes/{id}/question/{questionIndex}`  
- **Description**: Lấy câu hỏi trong quiz theo index (vị trí).  

**Example Request**:
```
GET http://localhost:8081/api/quizzes/1/question/0
```

**Example Response**:
```json
{
  "id": 11,
  "content": "What is Java?",
  "answers": [
    {"id": 101, "content": "A programming language", "correct": true},
    {"id": 102, "content": "A coffee brand", "correct": false},
    {"id": 103, "content": "An island", "correct": false},
    {"id": 104, "content": "A framework", "correct": false}
  ]
}
```

---

## 5. Submit Answer
- **Method**: POST  
- **URL**: `/api/quizzes/{id}/answer`  
- **Description**: Người dùng trả lời câu hỏi. Nếu còn câu hỏi sẽ trả về câu tiếp theo, nếu hết thì trả về điểm số.  
- **Request Body**:
```json
{
  "questionId": 11,
  "answerId": 101,
  "questionIndex": 0
}
```

**Example Response** (còn câu hỏi tiếp theo):
```json
{
  "questionId": 11,
  "isCorrect": true,
  "nextQuestion": {
    "id": 12,
    "content": "What does JVM stand for?",
    "answers": [
      {"id": 201, "content": "Java Virtual Machine", "correct": true},
      {"id": 202, "content": "Java Vendor Manager", "correct": false},
      {"id": 203, "content": "Joint Visual Model", "correct": false},
      {"id": 204, "content": "Java Version Module", "correct": false}
    ]
  },
  "nextQuestionIndex": 1
}
```

**Example Response** (quiz đã hoàn thành):
```json
{
  "quizCompleted": true,
  "score": 2
}
```

---

## 6. Update Quiz Status
- **Method**: PUT  
- **URL**: `/api/quizzes/{id}/status?status=PUBLISHED`  
- **Description**: Cập nhật trạng thái của quiz (ví dụ từ `DRAFT` sang `PUBLISHED`).  

**Example Request**:
```json
PUT http://localhost:8081/api/quizzes/1/status?status=PUBLISHED

```

**Example Response**:
```json
{
  "id": 1,
  "title": "Java Basics Quiz",
  "status": "PUBLISHED",
  "lessonId": 101
}
---

## 7. Get Results by User
- **Method**: GET  
- **URL**: `/api/quizzes/results/{userId}`  
- **Description**: Lấy danh sách kết quả quiz mà một user đã thực hiện.  

**Example Request**:
```json
GET http://localhost:8081/api/quizzes/results/1001

```

**Example Response**:
```json
[
  {
    "id": 1,
    "quizId": 1,
    "userId": 1001,
    "score": 2,
    "submittedAt": "2025-09-18T16:30:00"
  },
  {
    "id": 2,
    "quizId": 2,
    "userId": 1001,
    "score": 3,
    "submittedAt": "2025-09-18T17:00:00"
  }
]
