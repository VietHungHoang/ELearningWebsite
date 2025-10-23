# Chat Service - E-Learning Platform

A real-time chat service built with Spring Boot for e-learning platforms, featuring WebSocket messaging, presence tracking, and unread message management.

## 🚀 Features

### Core Features

- **Real-time Messaging**: WebSocket + STOMP for instant message delivery
- **Presence Tracking**: Track online/offline status of users with Redis
- **Message Delivery Status**: Track sent → delivered → read status
- **Read Receipts**: Mark messages as read with timestamps
- **Unread Count Badges**: Display unread message count instead of push notifications
- **REST APIs**: Complete REST API for all chat operations

### Technical Features

- **Multi-environment**: Dev/Prod configurations
- **API Documentation**: Swagger UI integration
- **Database**: MongoDB for messages, Redis for cache/presence
- **WebSocket**: STOMP protocol for real-time communication
- **Enrollment Integration**: Auto-create conversations on course enrollment

## 🛠️ Technology Stack

| Component       | Technology        | Version |
| --------------- | ----------------- | ------- |
| Framework       | Spring Boot       | 3.5.6   |
| Language        | Java              | 17      |
| Database        | MongoDB           | -       |
| Cache           | Redis             | -       |
| Real-time       | WebSocket + STOMP | -       |
| Build Tool      | Maven             | -       |
| Code Generation | Lombok            | -       |
| API Testing     | Postman           | -       |

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- MongoDB (running on localhost:27017)
- Redis (running on localhost:6379)

## 🚀 Quick Start

### 1. Clone and Build

```bash
git clone <repository-url>
cd chat_service
mvn clean install
```

### 2. Start Services

Make sure MongoDB and Redis are running:

```bash
# MongoDB (if using local)
mongod

# Redis (if using local)
redis-server
```

### 3. Run Application

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8084`

### 4. Access Points

- **API Base URL**: `http://localhost:8084/api/v1/chat`
- **Swagger UI**: `http://localhost:8084/swagger-ui/index.html`
- **WebSocket Endpoint**: `ws://localhost:8084/ws`

## 📚 API Documentation

### REST APIs

#### Conversations

- `GET /api/v1/chat/conversations/{userId}` - Get user conversations
- `POST /api/v1/chat/messages/{conversationId}` - Send message
- `GET /api/v1/chat/messages/{conversationId}` - Get message history

#### Messages

- `POST /api/v1/chat/messages/{messageId}/read?userId={userId}` - Mark as read

#### Unread Count

- `GET /api/v1/chat/unread/{userId}` - Get unread count
- `POST /api/v1/chat/unread/{userId}/reset` - Reset unread count

#### Enrollment Integration

- `POST /internal/enrollments?learnerId={}&instructorId={}&courseId={}` - Create conversation

### WebSocket Events

#### Connect

```javascript
// Connect to WebSocket
const socket = new SockJS("/ws");
const stompClient = Stomp.over(socket);

// Subscribe to conversation
stompClient.connect({}, function (frame) {
  stompClient.subscribe("/topic/conversation/conv-123", function (message) {
    console.log("Received:", JSON.parse(message.body));
  });
});
```

#### Send Message

```javascript
// Send message
stompClient.send(
  "/app/chat.sendMessage",
  {},
  JSON.stringify({
    senderId: "user-1",
    conversationId: "conv-123",
    content: "Hello World!",
  })
);
```

## 🧪 Testing with Postman

1. Import the collection: `Chat_Service_API.postman_collection.json`
2. Set environment variables:
   - `base_url`: `http://localhost:8084`
   - `user_id`: `user-1` (or any test user ID)
3. Test the APIs in order:
   - Create conversation via enrollment
   - Send messages
   - Get message history
   - Mark messages as read
   - Check unread counts

### Sample Test Flow

1. **Create Conversation**

   ```
   POST /internal/enrollments?learnerId=user-1&instructorId=instructor-1&courseId=course-123
   ```

2. **Send Message**

   ```
   POST /api/v1/chat/messages/conv-123
   {
     "senderId": "user-1",
     "content": "Hello!"
   }
   ```

3. **Get Messages**

   ```
   GET /api/v1/chat/messages/conv-123
   ```

4. **Check Unread Count**
   ```
   GET /api/v1/chat/unread/user-2
   ```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controller    │    │    Service      │    │  Repository     │
│                 │    │                 │    │                 │
│ - ChatController│    │ - ChatService   │    │ - MessageRepo   │
│ - EnrollmentCtrl│    │ - PresenceSvc   │    │ - ConversationRepo│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Database      │
                    │                 │
                    │ - MongoDB       │
                    │ - Redis         │
                    └─────────────────┘
```

### Key Components

- **Controller Layer**: REST endpoints and WebSocket handlers
- **Service Layer**: Business logic, presence tracking, unread counts
- **Repository Layer**: Data access for MongoDB
- **WebSocket Layer**: Real-time messaging with STOMP
- **Configuration**: Multi-environment setup

## 🔧 Configuration

### Application Properties

**application.yml** (common settings)

```yaml
server:
  port: 8084

spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/chat_service
  redis:
    host: localhost
    port: 6379

websocket:
  app: /app
  topic: /topic
  endpoint: /ws
```

**application-dev.yml** (development)

```yaml
logging:
  level:
    com.elearning.chat_service: DEBUG
```

**application-prod.yml** (production)

```yaml
logging:
  level:
    com.elearning.chat_service: INFO
```

## 📊 Data Models

### Message

```json
{
  "id": "msg-123",
  "senderId": "user-1",
  "conversationId": "conv-123",
  "content": "Hello World!",
  "status": "sent|delivered|read",
  "deliveredAt": "2025-10-23T10:00:00Z",
  "readAt": "2025-10-23T10:05:00Z",
  "readBy": "user-2",
  "createdAt": "2025-10-23T10:00:00Z"
}
```

### Conversation

```json
{
  "id": "conv-123",
  "courseId": "course-123",
  "learnerId": "user-1",
  "instructorId": "instructor-1",
  "participantIds": ["user-1", "instructor-1"],
  "createdAt": "2025-10-23T09:00:00Z"
}
```

---

**Happy Coding! 🎉**
