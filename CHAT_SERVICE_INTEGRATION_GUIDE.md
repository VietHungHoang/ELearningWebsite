# Chat Service - Hướng Dẫn Tích Hợp cho Frontend

## 📋 Tổng Quan

Chat Service là dịch vụ nhắn tin real-time cho nền tảng E-learning, hỗ trợ:
- ✅ Nhắn tin 1-1 và nhóm
- ✅ Real-time messaging qua WebSocket (STOMP protocol)
- ✅ Typing indicators
- ✅ Read receipts
- ✅ Message reactions
- ✅ File attachments
- ✅ Presence tracking (online/offline)

---

## 🔗 Thông Tin Kết Nối

### Base URLs (Localhost)
- **REST API**: `http://localhost:8089/api`
- **WebSocket Endpoint**: `ws://localhost:8089/ws/chat`

### Headers Bắt Buộc
Tất cả REST API requests cần header:
```
X-User-Id: <userId>
```

---

## 🔌 Kết Nối WebSocket

### 1. Cài đặt thư viện

#### Cho React/Vue/Angular:
```bash
npm install @stomp/stompjs sockjs-client
```

### 2. Khởi tạo kết nối WebSocket

#### React Example:
```javascript
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const connectWebSocket = (userId) => {
  const client = new Client({
    // Sử dụng SockJS cho tương thích tốt hơn
    webSocketFactory: () => new SockJS('http://localhost:8089/ws/chat'),
    
    connectHeaders: {
      'X-User-Id': userId
    },
    
    debug: (str) => {
      console.log('STOMP Debug:', str);
    },
    
    onConnect: (frame) => {
      console.log('Connected to WebSocket:', frame);
      
      // Subscribe to topics sau khi connected
      subscribeToConversation(client, conversationId);
    },
    
    onStompError: (frame) => {
      console.error('STOMP Error:', frame);
    },
    
    onWebSocketError: (error) => {
      console.error('WebSocket Error:', error);
    }
  });
  
  client.activate();
  return client;
};
```

#### TypeScript Example:
```typescript
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface MessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'TEXT' | 'FILE' | 'IMAGE' | 'VIDEO';
  createdAt: string;
  readBy: string[];
  reactions: Record<string, string>;
}

const client = new Client({
  webSocketFactory: () => new SockJS('http://localhost:8089/ws/chat'),
  
  connectHeaders: {
    'X-User-Id': userId
  },
  
  onConnect: () => {
    console.log('Connected!');
  }
});

client.activate();
```

---

## 📡 WebSocket Topics & Destinations

### Client GỬI messages đến server:

| Destination | Mô tả | Payload |
|------------|-------|---------|
| `/app/chat.sendMessage` | Gửi tin nhắn mới | `SendMessageRequest` |
| `/app/chat.typing` | Cập nhật trạng thái đang gõ | `TypingIndicatorRequest` |
| `/app/chat.read/{conversationId}/{messageId}` | Đánh dấu đã đọc | Không cần payload |
| `/app/chat.join/{conversationId}` | Tham gia conversation | Không cần payload |
| `/app/chat.leave/{conversationId}` | Rời conversation | Không cần payload |

### Client NHẬN messages từ server (Subscribe):

| Topic | Mô tả | Payload |
|-------|-------|---------|
| `/topic/conversation/{conversationId}` | Tin nhắn mới trong conversation | `MessageResponse` |
| `/topic/conversation/{conversationId}/typing` | Trạng thái typing | `TypingIndicatorResponse` |
| `/topic/conversation/{conversationId}/read` | Read receipts | `ReadReceipt` |
| `/topic/conversation/{conversationId}/presence` | User online/offline | `PresenceEvent` |
| `/user/queue/errors` | Lỗi cá nhân | Error message string |

---

## 💬 Sử Dụng WebSocket

### 1. Subscribe to Conversation
```javascript
const subscribeToConversation = (client, conversationId) => {
  // Subscribe to new messages
  const messageSubscription = client.subscribe(
    `/topic/conversation/${conversationId}`,
    (message) => {
      const messageData = JSON.parse(message.body);
      console.log('New message:', messageData);
      // Update UI with new message
      addMessageToUI(messageData);
    }
  );
  
  // Subscribe to typing indicators
  const typingSubscription = client.subscribe(
    `/topic/conversation/${conversationId}/typing`,
    (message) => {
      const typingData = JSON.parse(message.body);
      console.log('Users typing:', typingData.typingUserIds);
      // Show typing indicator in UI
      updateTypingIndicator(typingData.typingUserIds);
    }
  );
  
  // Subscribe to read receipts
  const readSubscription = client.subscribe(
    `/topic/conversation/${conversationId}/read`,
    (message) => {
      const readData = JSON.parse(message.body);
      console.log('Message read:', readData);
      // Update message read status in UI
      markMessageAsRead(readData.messageId, readData.userId);
    }
  );
  
  // Subscribe to presence events
  const presenceSubscription = client.subscribe(
    `/topic/conversation/${conversationId}/presence`,
    (message) => {
      const presenceData = JSON.parse(message.body);
      console.log('Presence:', presenceData);
      // Update user online/offline status
      updateUserPresence(presenceData.userId, presenceData.status);
    }
  );
  
  // Subscribe to personal errors
  const errorSubscription = client.subscribe(
    '/user/queue/errors',
    (message) => {
      console.error('Error:', message.body);
      // Show error to user
      showError(message.body);
    }
  );
  
  // Return subscriptions để có thể unsubscribe sau
  return {
    messageSubscription,
    typingSubscription,
    readSubscription,
    presenceSubscription,
    errorSubscription
  };
};
```

### 2. Gửi tin nhắn
```javascript
const sendMessage = (client, conversationId, content) => {
  const messageRequest = {
    conversationId: conversationId,
    type: 'TEXT',
    content: content,
    replyToMessageId: null  // Optional: ID của message đang reply
  };
  
  client.publish({
    destination: '/app/chat.sendMessage',
    body: JSON.stringify(messageRequest)
  });
};
```

### 3. Typing Indicator
```javascript
const updateTypingStatus = (client, conversationId, isTyping) => {
  const typingRequest = {
    conversationId: conversationId,
    isTyping: isTyping
  };
  
  client.publish({
    destination: '/app/chat.typing',
    body: JSON.stringify(typingRequest)
  });
};

// Usage: Gọi khi user bắt đầu gõ
updateTypingStatus(client, conversationId, true);

// Gọi khi user ngừng gõ (sau 2-3 giây không gõ)
updateTypingStatus(client, conversationId, false);
```

### 4. Mark as Read
```javascript
const markAsRead = (client, conversationId, messageId) => {
  client.publish({
    destination: `/app/chat.read/${conversationId}/${messageId}`,
    body: ''  // No payload needed
  });
};
```

### 5. Join/Leave Conversation
```javascript
const joinConversation = (client, conversationId) => {
  client.publish({
    destination: `/app/chat.join/${conversationId}`,
    body: ''
  });
};

const leaveConversation = (client, conversationId) => {
  client.publish({
    destination: `/app/chat.leave/${conversationId}`,
    body: ''
  });
};
```

---

## 🔄 REST API Endpoints

### Conversation Management

#### 1. Tạo conversation mới
```http
POST /api/conversations
Headers: X-User-Id: {userId}
Content-Type: application/json

{
  "name": "Group Discussion",
  "type": "GROUP",
  "participantIds": ["user1", "user2", "user3"]
}
```

#### 2. Lấy hoặc tạo conversation 1-1
```http
GET /api/conversations/one-to-one/{otherUserId}
Headers: X-User-Id: {userId}
```

#### 3. Lấy thông tin conversation
```http
GET /api/conversations/{conversationId}
Headers: X-User-Id: {userId}
```

#### 4. Lấy danh sách conversations của user
```http
GET /api/conversations/user/{userId}?type=ONE_TO_ONE&page=0&size=20
```

#### 5. Thêm participants
```http
PUT /api/conversations/{conversationId}/participants
Headers: X-User-Id: {userId}
Content-Type: application/json

["userId1", "userId2"]
```

#### 6. Xóa participant
```http
DELETE /api/conversations/{conversationId}/participants/{participantId}
Headers: X-User-Id: {userId}
```

#### 7. Cập nhật conversation
```http
PUT /api/conversations/{conversationId}?name=New Name
Headers: X-User-Id: {userId}
```

#### 8. Xóa conversation
```http
DELETE /api/conversations/{conversationId}
Headers: X-User-Id: {userId}
```

#### 9. Tìm kiếm conversations
```http
GET /api/conversations/search?query=search_term&page=0&size=20
Headers: X-User-Id: {userId}
```

### Message Management

#### 1. Gửi tin nhắn text (qua REST API)
```http
POST /api/messages
Headers: X-User-Id: {userId}
Content-Type: application/json

{
  "conversationId": "conv123",
  "type": "TEXT",
  "content": "Hello world!",
  "replyToMessageId": null
}
```

#### 2. Gửi tin nhắn với files
```http
POST /api/messages/with-files
Headers: X-User-Id: {userId}
Content-Type: multipart/form-data

message: {
  "conversationId": "conv123",
  "type": "FILE",
  "content": "Check out these files"
}
files: [file1, file2, ...]
```

#### 3. Lấy tin nhắn của conversation
```http
GET /api/messages/conversation/{conversationId}?page=0&size=50
Headers: X-User-Id: {userId}
```

#### 4. Sửa tin nhắn
```http
PUT /api/messages
Headers: X-User-Id: {userId}
Content-Type: application/json

{
  "messageId": "msg123",
  "content": "Updated content"
}
```

#### 5. Xóa tin nhắn
```http
DELETE /api/messages/{messageId}
Headers: X-User-Id: {userId}
```

#### 6. Mark as read (qua REST API)
```http
POST /api/messages/read
Headers: X-User-Id: {userId}
Content-Type: application/json

{
  "conversationId": "conv123",
  "messageId": "msg123"
}
```

#### 7. Mark all as read
```http
POST /api/messages/read
Headers: X-User-Id: {userId}
Content-Type: application/json

{
  "conversationId": "conv123",
  "messageId": null
}
```

#### 8. Thêm reaction
```http
POST /api/messages/{messageId}/reactions
Headers: X-User-Id: {userId}
Content-Type: application/json

{
  "emoji": "👍"
}
```

#### 9. Xóa reaction
```http
DELETE /api/messages/{messageId}/reactions
Headers: X-User-Id: {userId}
```

#### 10. Đếm số tin nhắn chưa đọc
```http
GET /api/messages/conversation/{conversationId}/unread-count
Headers: X-User-Id: {userId}
```

#### 11. Tìm kiếm tin nhắn
```http
GET /api/messages/conversation/{conversationId}/search?query=keyword
Headers: X-User-Id: {userId}
```

---

## 📦 Data Models

### SendMessageRequest
```typescript
interface SendMessageRequest {
  conversationId: string;
  type: 'TEXT' | 'FILE' | 'IMAGE' | 'VIDEO';
  content?: string;
  replyToMessageId?: string;
}
```

### MessageResponse
```typescript
interface MessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  type: 'TEXT' | 'FILE' | 'IMAGE' | 'VIDEO';
  content: string;
  attachments: MessageAttachment[];
  status: 'SENT' | 'DELIVERED' | 'READ';
  readBy: string[];
  reactions: Record<string, string>;  // userId -> emoji
  createdAt: string;
  updatedAt: string;
  editedAt?: string;
  isEdited: boolean;
  replyToMessageId?: string;
  replyToMessage?: MessageResponse;
}

interface MessageAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
}
```

### ConversationResponse
```typescript
interface ConversationResponse {
  id: string;
  name?: string;
  type: 'ONE_TO_ONE' | 'GROUP';
  participants: ParticipantResponse[];
  lastMessage?: MessageResponse;
  createdAt: string;
  updatedAt: string;
}

interface ParticipantResponse {
  userId: string;
  joinedAt: string;
  lastSeenAt?: string;
  isTyping: boolean;
  unreadCount: number;
}
```

### TypingIndicatorRequest
```typescript
interface TypingIndicatorRequest {
  conversationId: string;
  isTyping: boolean;
}
```

### TypingIndicatorResponse
```typescript
interface TypingIndicatorResponse {
  conversationId: string;
  typingUserIds: string[];
}
```

### ReadReceipt
```typescript
interface ReadReceipt {
  messageId: string;
  userId: string;
}
```

### PresenceEvent
```typescript
interface PresenceEvent {
  userId: string;
  status: 'JOINED' | 'LEFT';
}
```

---

## 🎯 Ví Dụ Hoàn Chỉnh - React Chat Component

```typescript
import React, { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

const ChatComponent: React.FC<{ conversationId: string; userId: string }> = ({
  conversationId,
  userId
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const clientRef = useRef<Client | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Khởi tạo WebSocket
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8089/ws/chat'),
      connectHeaders: {
        'X-User-Id': userId
      },
      onConnect: () => {
        console.log('Connected to chat service');

        // Subscribe to messages
        client.subscribe(`/topic/conversation/${conversationId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });

        // Subscribe to typing indicators
        client.subscribe(
          `/topic/conversation/${conversationId}/typing`,
          (message) => {
            const data = JSON.parse(message.body);
            setTypingUsers(data.typingUserIds);
          }
        );

        // Join conversation
        client.publish({
          destination: `/app/chat.join/${conversationId}`,
          body: ''
        });
      },
      onStompError: (error) => {
        console.error('STOMP error:', error);
      }
    });

    client.activate();
    clientRef.current = client;

    // Cleanup
    return () => {
      if (client) {
        client.publish({
          destination: `/app/chat.leave/${conversationId}`,
          body: ''
        });
        client.deactivate();
      }
    };
  }, [conversationId, userId]);

  const sendMessage = () => {
    if (!inputMessage.trim() || !clientRef.current) return;

    const messageRequest = {
      conversationId,
      type: 'TEXT',
      content: inputMessage
    };

    clientRef.current.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(messageRequest)
    });

    setInputMessage('');
    updateTyping(false);
  };

  const updateTyping = (isTyping: boolean) => {
    if (!clientRef.current) return;

    clientRef.current.publish({
      destination: '/app/chat.typing',
      body: JSON.stringify({
        conversationId,
        isTyping
      })
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);

    // Send typing indicator
    updateTyping(true);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      updateTyping(false);
    }, 2000);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <strong>{msg.senderId}:</strong> {msg.content}
          </div>
        ))}
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            {typingUsers.join(', ')} đang gõ...
          </div>
        )}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Nhập tin nhắn..."
        />
        <button onClick={sendMessage}>Gửi</button>
      </div>
    </div>
  );
};

export default ChatComponent;
```

---

## ⚠️ Lưu Ý Quan Trọng

### 1. Authentication
- Hiện tại service sử dụng header `X-User-Id` để xác thực
- Trong production, cần integrate với auth service để lấy JWT token
- Cần thêm interceptor để tự động thêm token vào mọi request

### 2. Reconnection
- Nên implement logic reconnect khi WebSocket bị disconnect
- STOMP client có sẵn `reconnectDelay` option:
```javascript
const client = new Client({
  reconnectDelay: 5000,  // 5 seconds
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000
});
```

### 3. Typing Indicator
- Nên debounce việc gửi typing indicator (2-3 seconds)
- Tự động tắt typing sau khi không có input

### 4. Error Handling
- Subscribe to `/user/queue/errors` để nhận lỗi
- Hiển thị thông báo lỗi cho user

### 5. Performance
- Implement pagination khi load messages
- Lazy load old messages khi user scroll lên
- Unsubscribe khỏi topics khi component unmount

### 6. File Upload
- Max file size: 50MB
- Sử dụng endpoint `/api/messages/with-files` với `multipart/form-data`

---

## 🐛 Troubleshooting

### WebSocket không kết nối được
1. Kiểm tra service có đang chạy không: `http://localhost:8089/actuator/health`
2. Kiểm tra CORS settings trong `application.yml`
3. Kiểm tra browser console có lỗi không

### Không nhận được messages
1. Kiểm tra đã subscribe đúng topic chưa
2. Kiểm tra `conversationId` có đúng không
3. Kiểm tra connection status: `client.connected`

### Messages bị duplicate
1. Đảm bảo không subscribe nhiều lần
2. Unsubscribe khi component unmount
3. Sử dụng message ID để deduplicate

---

## 📞 Liên Hệ Hỗ Trợ

Nếu có vấn đề khi tích hợp, hãy liên hệ:
- Backend Team Lead: [Tên người phụ trách]
- Email: [Email liên hệ]

---

## 📚 Tài Liệu Tham Khảo

- [STOMP Protocol](https://stomp.github.io/)
- [SockJS](https://github.com/sockjs/sockjs-client)
- [@stomp/stompjs Documentation](https://stomp-js.github.io/stomp-websocket/)
- [Spring WebSocket Documentation](https://docs.spring.io/spring-framework/reference/web/websocket.html)

---

**Last Updated**: December 6, 2025
**Version**: 1.0.0
