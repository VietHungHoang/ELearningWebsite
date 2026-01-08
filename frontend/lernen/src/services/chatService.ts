import apiService from "./apiService";
import axiosInstance from "../lib/axiosInstance";
import type { PaginatedResponse } from "../types/api";

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
    type: "TEXT" | "FILE" | "IMAGE" | "VIDEO";
    content: string;
    attachments: MessageAttachment[];
    status: "SENT" | "DELIVERED" | "READ";
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

export interface UserInfo {
    id: string;
    fullName: string;
    avatarUrl?: string;
}

export interface ParticipantUserInfo {
    userId: string;
    fullName: string;
    avatarUrl?: string;
}

export interface ConversationResponse {
    id: string;
    name?: string;
    type: "ONE_TO_ONE" | "GROUP";
    participantIds: string[];
    participantDetails?: ParticipantUserInfo[];
    classId?: string;
    lastMessageId?: string;
    lastMessageAt?: string;
    createdAt: string;
    participants?: ParticipantResponse[];
    lastMessage?: MessageResponse;
}

export interface SendMessageRequest {
    conversationId: string;
    type: "TEXT" | "FILE" | "IMAGE" | "VIDEO";
    content?: string;
    replyToMessageId?: string;
}

export interface CreateConversationRequest {
    name?: string;
    type: "ONE_TO_ONE" | "GROUP";
    participantIds: string[];
    classId?: string;
    participantInfos?: UserInfo[];
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
    const response = await apiService.post<ConversationResponse>("/v1/chat/conversations", request);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

/**
 * Lấy hoặc tạo conversation 1-1
 */
const getOrCreateOneToOneConversation = async (otherUserId: string): Promise<ConversationResponse> => {
    const response = await apiService.get<ConversationResponse>(`/v1/chat/conversations/one-to-one/${otherUserId}`);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

/**
 * Lấy thông tin conversation
 */
const getConversation = async (conversationId: string): Promise<ConversationResponse> => {
    const response = await apiService.get<ConversationResponse>(`/v1/chat/conversations/${conversationId}`);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

/**
 * Lấy danh sách conversations của user
 */
const getAllConversationsForUser = async (
    type?: "ONE_ON_ONE | GROUP",
    page: number = 0,
    size: number = 20
): Promise<ConversationResponse[]> => {
    const params: Record<string, unknown> = { page, size };
    if (type) params.type = type;

    const response = await apiService.get<PaginatedResponse<ConversationResponse>>(`/v1/chat/conversations`, params);

    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data.content;
};

/**
 * Thêm participants vào conversation
 */
const addParticipants = async (conversationId: string, participantIds: string[]): Promise<ConversationResponse> => {
    const response = await apiService.put<ConversationResponse>(
        `/v1/chat/conversations/${conversationId}/participants`,
        participantIds
    );
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

/**
 * Xóa participant khỏi conversation
 */
const removeParticipant = async (conversationId: string, participantId: string): Promise<void> => {
    const response = await apiService.delete<void>(`/v1/chat/conversations/${conversationId}/participants/${participantId}`);
    if (!response.success) {
        throw new Error(response.message);
    }
};

/**
 * Cập nhật conversation
 */
const updateConversation = async (conversationId: string, name: string): Promise<ConversationResponse> => {
    const response = await apiService.put<ConversationResponse>(
        `/v1/chat/conversations/${conversationId}?name=${encodeURIComponent(name)}`
    );
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

/**
 * Xóa conversation
 */
const deleteConversation = async (conversationId: string): Promise<void> => {
    const response = await apiService.delete<void>(`/v1/chat/conversations/${conversationId}`);
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
    }>("/v1/chat/conversations/search", { query, page, size });

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
    const response = await apiService.post<MessageResponse>("/v1/chat/messages", request);
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
    formData.append("message", new Blob([JSON.stringify(message)], { type: "application/json" }));
    files.forEach((file) => formData.append("files", file));

    try {
        const response = await axiosInstance.post<MessageResponse>("/v1/chat/messages/with-files", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "X-User-Id": userId,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to send message with files");
    }
};

/**
 * Lấy tin nhắn của conversation
 */
const getConversationMessages = async (
    conversationId: string,
    page: number = 0,
    size: number = 50
): Promise<MessageResponse[]> => {
    const response = await apiService.get<PaginatedResponse<MessageResponse>>(
        `/v1/chat/messages/conversations/${conversationId}`,
        { page, size }
    );

    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data.content;
};

/**
 * Sửa tin nhắn
 */
const updateMessage = async (request: UpdateMessageRequest): Promise<MessageResponse> => {
    const response = await apiService.put<MessageResponse>("/v1/chat/messages", request);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

/**
 * Xóa tin nhắn
 */
const deleteMessage = async (messageId: string): Promise<void> => {
    const response = await apiService.delete<void>(`/v1/chat/messages/${messageId}`);
    if (!response.success) {
        throw new Error(response.message);
    }
};

/**
 * Mark as read
 */
const markAsRead = async (request: MarkAsReadRequest): Promise<void> => {
    const response = await apiService.post<void>("/v1/chat/messages/read", request);
    if (!response.success) {
        throw new Error(response.message);
    }
};

/**
 * Thêm reaction
 */
const addReaction = async (messageId: string, request: AddReactionRequest): Promise<MessageResponse> => {
    const response = await apiService.post<MessageResponse>(`/v1/chat/messages/${messageId}/reactions`, request);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

/**
 * Xóa reaction
 */
const removeReaction = async (messageId: string): Promise<MessageResponse> => {
    const response = await apiService.delete<MessageResponse>(`/v1/chat/messages/${messageId}/reactions`);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

/**
 * Đếm số tin nhắn chưa đọc
 */
const getUnreadCount = async (conversationId: string): Promise<number> => {
    const response = await apiService.get<number>(`/v1/chat/messages/conversation/${conversationId}/unread-count`);
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
};

/**
 * Tìm kiếm tin nhắn
 */
const searchMessages = async (conversationId: string, query: string): Promise<MessageResponse[]> => {
    const response = await apiService.get<MessageResponse[]>(`/v1/chat/messages/conversation/${conversationId}/search`, {
        query,
    });
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
    getAllConversationsForUser,
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
