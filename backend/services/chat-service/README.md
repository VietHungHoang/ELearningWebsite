# Chat Service

Real-time chat service cho E-learning Platform với support cho 1-1 và group chat.

## Features

### ✅ Core Features
- **1-1 Chat**: Chat giữa 2 users (Student-Tutor, Admin-Tutor, Student-Student)
- **Group Chat**: Group chat với nhiều participants (1-n)
- **Class-based Group**: Group chat trong context của một class

### ✅ Messaging Features
- ✉️ Text messages
- 📎 File attachments (images, videos, documents)
- ✏️ Edit messages
- 🗑️ Delete messages
- 💬 Reply to messages
- 😊 Emoji reactions
- ✅ Read receipts
- ⌨️ Typing indicators
- 🔍 Search messages
- 📄 Message history với pagination

### ✅ Real-time Features
- WebSocket/STOMP protocol
- Real-time message delivery
- Typing indicators
- Read receipts
- User presence (online/offline)

### ✅ Storage
- MongoDB cho messages và conversations
- Permanent storage
- Pagination support

## Tech Stack

- **Framework**: Spring Boot 3.5.5
- **Database**: MongoDB
- **Real-time**: WebSocket với STOMP
- **File Storage**: Local file system (có thể mở rộng sang S3)
- **Java**: 17

## Architecture

```
chat-service/
├── entity/           # Domain models (Conversation, Message, Participant)
├── repository/       # MongoDB repositories
├── service/          # Business logic
├── controller/       # REST controllers
├── dto/             # Request/Response DTOs
├── config/          # Configuration (WebSocket, CORS, File Upload)
└── ChatServiceApplication.java
```

## API Endpoints

### REST API

#### Conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations` - Get user's conversations
- `GET /api/conversations/{id}` - Get conversation by ID
- `GET /api/conversations/one-to-one/{userId}` - Get or create 1-1 conversation
- `PUT /api/conversations/{id}` - Update conversation
- `DELETE /api/conversations/{id}` - Delete conversation
- `PUT /api/conversations/{id}/participants` - Add participants
- `DELETE /api/conversations/{id}/participants/{userId}` - Remove participant
- `GET /api/conversations/search?query={text}` - Search conversations

#### Messages
- `POST /api/messages` - Send text message
- `POST /api/messages/with-files` - Send message với files
- `GET /api/messages/{id}` - Get message by ID
- `GET /api/messages/conversation/{conversationId}` - Get message history
- `PUT /api/messages` - Edit message
- `DELETE /api/messages/{id}` - Delete message
- `POST /api/messages/read` - Mark as read
- `POST /api/messages/{id}/reactions` - Add reaction
- `DELETE /api/messages/{id}/reactions` - Remove reaction
- `GET /api/messages/conversation/{conversationId}/unread-count` - Get unread count
- `GET /api/messages/conversation/{conversationId}/search?query={text}` - Search messages
- `GET /api/messages/conversation/{conversationId}/type/{type}` - Get messages by type

### WebSocket API

#### Connection
```
URL: ws://localhost:8089/ws/chat
Protocol: STOMP
```

#### Client -> Server

```javascript
// Send message
stompClient.send("/app/chat.sendMessage", {}, JSON.stringify({
  conversationId: "conv123",
  type: "TEXT",
  content: "Hello!"
}));

// Typing indicator
stompClient.send("/app/chat.typing", {}, JSON.stringify({
  conversationId: "conv123",
  isTyping: true
}));

// Mark as read
stompClient.send("/app/chat.read/conv123/msg123", {}, {});

// Join conversation
stompClient.send("/app/chat.join/conv123", {}, {});

// Leave conversation
stompClient.send("/app/chat.leave/conv123", {}, {});
```

#### Client Subscriptions

```javascript
// Subscribe to conversation messages
stompClient.subscribe("/topic/conversation/conv123", (message) => {
  const msg = JSON.parse(message.body);
  console.log("New message:", msg);
});

// Subscribe to typing indicators
stompClient.subscribe("/topic/conversation/conv123/typing", (message) => {
  const typing = JSON.parse(message.body);
  console.log("Typing users:", typing.typingUserIds);
});

// Subscribe to read receipts
stompClient.subscribe("/topic/conversation/conv123/read", (message) => {
  const receipt = JSON.parse(message.body);
  console.log("Message read:", receipt);
});

// Subscribe to presence events
stompClient.subscribe("/topic/conversation/conv123/presence", (message) => {
  const presence = JSON.parse(message.body);
  console.log("User presence:", presence);
});

// Subscribe to private errors
stompClient.subscribe("/user/queue/errors", (message) => {
  console.error("Error:", message.body);
});
```

## Configuration

### Environment Variables

```yaml
# MongoDB
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DATABASE=chat_db
MONGO_USERNAME=
MONGO_PASSWORD=

# File Upload
FILE_UPLOAD_DIR=./uploads

# WebSocket
WEBSOCKET_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4200
```

### Application Properties

```yaml
server:
  port: 8089

spring:
  application:
    name: chat-service
  data:
    mongodb:
      host: ${MONGO_HOST:localhost}
      port: ${MONGO_PORT:27017}
      database: ${MONGO_DATABASE:chat_db}
```

## Running the Service

### Development
```bash
# With Maven
mvn spring-boot:run

# With Docker
docker-compose up chat-service
```

### Production
```bash
# Build
mvn clean package -DskipTests

# Run
java -jar target/chat-service-0.0.1-SNAPSHOT.jar
```

## Data Models

### Conversation
```json
{
  "id": "conv123",
  "name": "Group Name",
  "type": "GROUP",
  "participantIds": ["user1", "user2", "user3"],
  "classId": "class123",
  "lastMessageId": "msg456",
  "lastMessageAt": "2025-11-22T10:30:00",
  "createdBy": "user1",
  "createdAt": "2025-11-22T09:00:00"
}
```

### Message
```json
{
  "id": "msg123",
  "conversationId": "conv123",
  "senderId": "user1",
  "type": "TEXT",
  "content": "Hello!",
  "attachments": [],
  "status": "READ",
  "readBy": ["user1", "user2"],
  "reactions": {
    "user2": "👍"
  },
  "createdAt": "2025-11-22T10:30:00",
  "isEdited": false,
  "isDeleted": false
}
```

## Future Enhancements

- [ ] Voice messages
- [ ] Video calls
- [ ] Message forwarding
- [ ] @ mentions
- [ ] Message pinning
- [ ] File upload to S3/Cloud Storage
- [ ] Image/Video thumbnail generation
- [ ] End-to-end encryption
- [ ] Message analytics
- [ ] Rate limiting
- [ ] Spam detection

## Notes

- Tất cả REST API endpoints yêu cầu `X-User-Id` header
- WebSocket yêu cầu authentication (Principal)
- Files được lưu trong local file system tại `./uploads/{conversationId}/`
- Messages được lưu vĩnh viễn trong MongoDB
- Support pagination cho message history

## Author

Graduation Project - E-Learning Platform
