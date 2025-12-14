import apiService from "./apiService";
import axiosInstance from "../lib/axiosInstance";

// ==================== INTERFACES ====================

export interface MessageAttachment {
    id: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    fileUrl: string;
}

export interface MessageResponse {
    id: string;
    conversationId: string;
    senderId: string;
    type: 'TEXT' | 'FILE' | 'IMAGE' | 'VIDEO';
    content: string;
    attachments: MessageAttachment[];
    status: 'SENT' | 'DELIVERED' | 'READ';
    readBy: string[];
    reactions: Record<string, string>; // userId -> emoji
    createdAt: string;
    updatedAt: string;
    editedAt?: string;
    isEdited: boolean;
    replyToMessageId?: string;
    replyToMessage?: MessageResponse;
}

export interface ParticipantResponse {
    userId: string;
    joinedAt: string;
    lastSeenAt?: string;
    isTyping: boolean;
    unreadCount: number;
}

export interface ConversationResponse {
    id: string;
    name?: string;
    type: 'ONE_TO_ONE' | 'GROUP' | 'CLASS_GROUP';
    participantIds: string[];
    classId?: string;
    lastMessageId?: string;
    lastMessageAt?: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
    participants?: ParticipantResponse[];
    lastMessage?: MessageResponse;
}

export interface SendMessageRequest {
    conversationId: string;
    type: 'TEXT' | 'FILE' | 'IMAGE' | 'VIDEO';
    content?: string;
    replyToMessageId?: string;
}

export interface CreateConversationRequest {
    name?: string;
    type: 'ONE_TO_ONE' | 'GROUP' | 'CLASS_GROUP';
    participantIds: string[];
    classId?: string;
}

export interface UpdateMessageRequest {
    messageId: string;
    content: string;
}

export interface MarkAsReadRequest {
    conversationId: string;
    messageId?: string; // null để mark all as read
}

export interface AddReactionRequest {
    emoji: string;
}

// ==================== CONVERSATION APIS ====================

/**
 * Tạo conversation mới
 * Note: userId sẽ được tự động thêm vào header X-User-Id qua interceptor
 */
const createConversation = async (request: CreateConversationRequest): Promise<ConversationResponse> => {
    const response = await apiService.post<ConversationResponse>('conversations', request);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

/**
 * Lấy hoặc tạo conversation 1-1
 */
const getOrCreateOneToOneConversation = async (otherUserId: string): Promise<ConversationResponse> => {
    const response = await apiService.get<ConversationResponse>(`conversations/one-to-one/${otherUserId}`);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

/**
 * Lấy thông tin conversation
 */
const getConversation = async (conversationId: string): Promise<ConversationResponse> => {
    const response = await apiService.get<ConversationResponse>(`conversations/${conversationId}`);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

/**
 * Lấy danh sách conversations của user
 */
const getUserConversations = async (
    userId: string,
    type?: 'ONE_TO_ONE' | 'GROUP' | 'CLASS_GROUP',
    page: number = 0,
    size: number = 20
): Promise<{
    content: ConversationResponse[];
    pageable: { page: number; size: number; sort: string[] };
    totalElements: number;
    totalPages: number;
}> => {
    const params: Record<string, unknown> = { page, size };
    if (type) params.type = type;
    
    const response = await apiService.get<{
        content: ConversationResponse[];
        pageable: { page: number; size: number; sort: string[] };
        totalElements: number;
        totalPages: number;
    }>(`conversations/user/${userId}`, params);
    
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

/**
 * Thêm participants vào conversation
 */
const addParticipants = async (conversationId: string, participantIds: string[]): Promise<ConversationResponse> => {
    const response = await apiService.put<ConversationResponse>(`conversations/${conversationId}/participants`, participantIds);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

/**
 * Xóa participant khỏi conversation
 */
const removeParticipant = async (conversationId: string, participantId: string): Promise<void> => {
    const response = await apiService.delete<void>(`conversations/${conversationId}/participants/${participantId}`);
    if (!response.success) {
        throw new Error(response.message);
    }
};

/**
 * Cập nhật conversation
 */
const updateConversation = async (conversationId: string, name: string): Promise<ConversationResponse> => {
    const response = await apiService.put<ConversationResponse>(`conversations/${conversationId}?name=${encodeURIComponent(name)}`);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

/**
 * Xóa conversation
 */
const deleteConversation = async (conversationId: string): Promise<void> => {
    const response = await apiService.delete<void>(`conversations/${conversationId}`);
    if (!response.success) {
        throw new Error(response.message);
    }
};

/**
 * Tìm kiếm conversations
 */
const searchConversations = async (
    query: string,
    page: number = 0,
    size: number = 20
): Promise<{
    content: ConversationResponse[];
    totalElements: number;
    totalPages: number;
}> => {
    const response = await apiService.get<{
        content: ConversationResponse[];
        totalElements: number;
        totalPages: number;
    }>('conversations/search', { query, page, size });
    
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

// ==================== MESSAGE APIS ====================

/**
 * Gửi tin nhắn text (qua REST API)
 */
const sendMessage = async (request: SendMessageRequest): Promise<MessageResponse> => {
    const response = await apiService.post<MessageResponse>('messages', request);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

/**
 * Gửi tin nhắn với files
 * Note: userId phải được pass vào header vì multipart/form-data không qua apiService
 */
const sendMessageWithFiles = async (
    message: SendMessageRequest,
    files: File[],
    userId: string
): Promise<MessageResponse> => {
    const formData = new FormData();
    formData.append('message', new Blob([JSON.stringify(message)], { type: 'application/json' }));
    files.forEach(file => formData.append('files', file));

    try {
        const response = await axiosInstance.post<MessageResponse>('messages/with-files', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-User-Id': userId,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to send message with files');
    }
};

/**
 * Lấy tin nhắn của conversation
 */
const getConversationMessages = async (
    conversationId: string,
    page: number = 0,
    size: number = 50
): Promise<{
    content: MessageResponse[];
    totalElements: number;
    totalPages: number;
}> => {
    const response = await apiService.get<{
        content: MessageResponse[];
        totalElements: number;
        totalPages: number;
    }>(`messages/conversation/${conversationId}`, { page, size });
    
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

/**
 * Sửa tin nhắn
 */
const updateMessage = async (request: UpdateMessageRequest): Promise<MessageResponse> => {
    const response = await apiService.put<MessageResponse>('messages', request);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

/**
 * Xóa tin nhắn
 */
const deleteMessage = async (messageId: string): Promise<void> => {
    const response = await apiService.delete<void>(`messages/${messageId}`);
    if (!response.success) {
        throw new Error(response.message);
    }
};

/**
 * Mark as read
 */
const markAsRead = async (request: MarkAsReadRequest): Promise<void> => {
    const response = await apiService.post<void>('messages/read', request);
    if (!response.success) {
        throw new Error(response.message);
    }
};

/**
 * Thêm reaction
 */
const addReaction = async (messageId: string, request: AddReactionRequest): Promise<MessageResponse> => {
    const response = await apiService.post<MessageResponse>(`messages/${messageId}/reactions`, request);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

/**
 * Xóa reaction
 */
const removeReaction = async (messageId: string): Promise<MessageResponse> => {
    const response = await apiService.delete<MessageResponse>(`messages/${messageId}/reactions`);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

/**
 * Đếm số tin nhắn chưa đọc
 */
const getUnreadCount = async (conversationId: string): Promise<number> => {
    const response = await apiService.get<number>(`messages/conversation/${conversationId}/unread-count`);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

/**
 * Tìm kiếm tin nhắn
 */
const searchMessages = async (
    conversationId: string,
    query: string
): Promise<MessageResponse[]> => {
    const response = await apiService.get<MessageResponse[]>(`messages/conversation/${conversationId}/search`, { query });
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

// ==================== EXPORTS ====================

export default {
    // Conversation APIs
    createConversation,
    getOrCreateOneToOneConversation,
    getConversation,
    getUserConversations,
    addParticipants,
    removeParticipant,
    updateConversation,
    deleteConversation,
    searchConversations,
    
    // Message APIs
    sendMessage,
    sendMessageWithFiles,
    getConversationMessages,
    updateMessage,
    deleteMessage,
    markAsRead,
    addReaction,
    removeReaction,
    getUnreadCount,
    searchMessages,
};