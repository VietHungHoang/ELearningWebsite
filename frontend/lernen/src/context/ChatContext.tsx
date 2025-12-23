import React, { createContext, useContext, useState, useCallback } from 'react';

interface ChatContextType {
    openChatWithTutor: (tutorId: string, tutorName: string) => void;
    openChatWithConversation: (conversationId: string) => void;
    pendingTutorId: string | null;
    pendingTutorName: string | null;
    pendingConversationId: string | null;
    clearPendingTutor: () => void;
    clearPendingConversation: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

interface ChatProviderProps {
    children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [pendingTutorId, setPendingTutorId] = useState<string | null>(null);
    const [pendingTutorName, setPendingTutorName] = useState<string | null>(null);
    const [pendingConversationId, setPendingConversationId] = useState<string | null>(null);

    const openChatWithTutor = useCallback((tutorId: string, tutorName: string) => {
        setPendingTutorId(tutorId);
        setPendingTutorName(tutorName);
    }, []);

    const openChatWithConversation = useCallback((conversationId: string) => {
        setPendingConversationId(conversationId);
    }, []);

    const clearPendingTutor = useCallback(() => {
        setPendingTutorId(null);
        setPendingTutorName(null);
    }, []);

    const clearPendingConversation = useCallback(() => {
        setPendingConversationId(null);
    }, []);

    const value = {
        openChatWithTutor,
        openChatWithConversation,
        pendingTutorId,
        pendingTutorName,
        pendingConversationId,
        clearPendingTutor,
        clearPendingConversation,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};