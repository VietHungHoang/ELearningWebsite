import React, { useState, useEffect, useRef } from 'react';
import { HiX, HiPaperAirplane, HiSearch, HiUserGroup, HiUser } from 'react-icons/hi';
import { BsChatDotsFill } from 'react-icons/bs';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import chatService, { type ConversationResponse, type MessageResponse } from '../../services/chatService';
import chatWebSocketService from '../../services/chatWebSocketService';
import ChatIconButton from './ChatIconButton';

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: Date;
    isOwn: boolean;
}

interface Conversation {
    id: string;
    name: string;
    type: 'individual' | 'group' | 'class';
    avatarUrl?: string;
    lastMessage?: string;
    lastMessageTime?: Date;
    unreadCount: number;
    participants?: string[]; // Array of user IDs;
}

const ChatWidget: React.FC = () => {
    const { state } = useAuth();
    const { pendingTutorId, pendingTutorName, clearPendingTutor } = useChat();
    const [isOpen, setIsOpen] = useState(false);
    const [showConversationList, setShowConversationList] = useState(true);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [conversationsError, setConversationsError] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [wsConnected, setWsConnected] = useState(false);
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
    const typingTimeoutRef = useRef<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // WebSocket connection
    useEffect(() => {
        if (state.isAuthenticated && state.user && isOpen) {
            chatWebSocketService.connect(
                state.user.id,
                () => {
                    console.log('Chat WebSocket connected');
                    setWsConnected(true);
                },
                (error) => {
                    console.error('Chat WebSocket error:', error);
                    setWsConnected(false);
                }
            );
        }

        return () => {
            if (state.user) {
                chatWebSocketService.disconnect();
                setWsConnected(false);
            }
        };
    }, [state.isAuthenticated, state.user, isOpen]);

    // Subscribe to selected conversation
    useEffect(() => {
        if (selectedConversation && wsConnected) {
            // Subscribe to new messages
            chatWebSocketService.subscribeToConversation(
                selectedConversation.id,
                (message: MessageResponse) => {
                    const newMessage: Message = {
                        id: message.id,
                        senderId: message.senderId,
                        senderName: message.senderId === state.user?.id ? 'You' : 'Unknown', // TODO: Get from participants
                        content: message.content,
                        timestamp: new Date(message.createdAt),
                        isOwn: message.senderId === state.user?.id,
                    };
                    setMessages(prev => [...prev, newMessage]);

                    // Update conversation last message
                    setConversations(prev =>
                        prev.map(conv =>
                            conv.id === selectedConversation.id
                                ? { ...conv, lastMessage: message.content, lastMessageTime: new Date(message.createdAt) }
                                : conv
                        )
                    );
                }
            );

            // Subscribe to typing indicators
            chatWebSocketService.subscribeToTypingIndicators(
                selectedConversation.id,
                (indicator) => {
                    if (indicator.userId !== state.user?.id) {
                        setTypingUsers(prev => {
                            const updated = new Set(prev);
                            if (indicator.isTyping) {
                                updated.add(indicator.userId);
                            } else {
                                updated.delete(indicator.userId);
                            }
                            return updated;
                        });
                    }
                }
            );

            return () => {
                chatWebSocketService.unsubscribeFromConversation(selectedConversation.id);
            };
        }
    }, [selectedConversation, wsConnected, state.user]);

    // Fetch conversations when user is authenticated and chat is opened
    useEffect(() => {
        if (state.isAuthenticated && state.user && isOpen && conversations.length === 0) {
            fetchConversations();
        }
    }, [state.isAuthenticated, state.user, isOpen]);

    // Handle opening chat with specific tutor
    useEffect(() => {
        if (pendingTutorId && pendingTutorName && state.isAuthenticated && state.user) {
            setIsOpen(true);
            clearPendingTutor();
            // Find or create conversation with tutor
            findOrCreateConversationWithTutor(pendingTutorId, pendingTutorName);
        }
    }, [pendingTutorId, pendingTutorName, state.isAuthenticated, state.user, clearPendingTutor]);

    const fetchConversations = async () => {
        if (!state.user) return;

        setLoadingConversations(true);
        setConversationsError(null);

        try {
            const data = await chatService.getAllConversationsForUser();

            // Map API response to component format
            const mappedConversations: Conversation[] = data.map(apiConv => ({
                id: apiConv.id,
                name: apiConv.name || getConversationName(apiConv, state.user!.id),
                type: mapConversationType(apiConv.type),
                lastMessageTime: apiConv.lastMessageAt ? new Date(apiConv.lastMessageAt) : undefined,
                unreadCount: 0, // TODO: Calculate from API or WebSocket
                participants: apiConv.participantIds,
            }));

            setConversations(mappedConversations);
        } catch (error) {
            console.error('Error fetching conversations:', error);
            setConversationsError(error instanceof Error ? error.message : 'Failed to load conversations');
        } finally {
            setLoadingConversations(false);
        }
    };

    const getConversationName = (apiConv: ConversationResponse, currentUserId: string): string => {
        // For ONE_TO_ONE conversations without name, generate name from other participant
        if (apiConv.type === 'ONE_ON_ONE') {
            const otherParticipantId = apiConv.participantIds.find((id: string) => id !== currentUserId);
            // TODO: Fetch participant name from API or cache
            return `User ${otherParticipantId}`;
        }
        return 'Unknown Conversation';
    };

    const mapConversationType = (apiType: string): Conversation['type'] => {
        switch (apiType) {
            case 'ONE_TO_ONE':
                return 'individual';
            case 'GROUP':
                return 'group';
            case 'CLASS_GROUP':
                return 'class';
            default:
                return 'individual';
        }
    };

    // Load messages when conversation is selected
    useEffect(() => {
        if (selectedConversation && state.user) {
            loadMessages(selectedConversation.id);
        }
    }, [selectedConversation, state.user]);

    const loadMessages = async (conversationId: string) => {
        try {
            const data = await chatService.getConversationMessages(conversationId, 0, 50);
            const mappedMessages: Message[] = data.map(msg => ({
                id: msg.id,
                senderId: msg.senderId,
                senderName: 'Unknown', // TODO: Get from participants cache
                content: msg.content,
                timestamp: new Date(msg.createdAt),
                isOwn: msg.senderId === state.user?.id,
            }));
            setMessages(mappedMessages);
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    };

    const findOrCreateConversationWithTutor = async (tutorId: string, tutorName: string) => {
        if (!state.user) return;

        // First, check if conversation already exists
        const existingConversation = conversations.find(conv =>
            conv.type === 'individual' && conv.participants?.includes(tutorId) && conv.participants?.includes(state.user!.id)
        );

        if (existingConversation) {
            setSelectedConversation(existingConversation);
            setShowConversationList(false);
            return;
        }

        // If not found in current conversations, try to create new conversation
        try {
            const createRequest = {
                type: 'ONE_TO_ONE' as const,
                participantIds: [tutorId],
            };
            const apiResponse = await chatService.createConversation(createRequest);

            // Map API response to component format
            const newConversation: Conversation = {
                id: apiResponse.id,
                name: apiResponse.name || tutorName,
                type: mapConversationType(apiResponse.type),
                lastMessageTime: apiResponse.lastMessageAt ? new Date(apiResponse.lastMessageAt) : undefined,
                unreadCount: 0,
                participants: apiResponse.participantIds,
            };

            // Add to conversations list
            setConversations(prev => [...prev, newConversation]);
            setSelectedConversation(newConversation);
            setShowConversationList(false);
        } catch (error) {
            console.error('Failed to create conversation with tutor:', error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || !state.user || !selectedConversation) return;

        const content = inputMessage;
        setInputMessage(''); // Clear input immediately

        try {
            const messageRequest = {
                conversationId: selectedConversation.id,
                type: 'TEXT' as const,
                content,
            };

            // Try to send via WebSocket first
            try {
                chatWebSocketService.sendMessage(messageRequest, state.user.id);
                // Message will be added via WebSocket subscription
            } catch (wsError) {
                console.warn('WebSocket send failed, falling back to API:', wsError);
                // Fallback to REST API
                const sentMessage = await chatService.sendMessage(messageRequest);

                // Add the sent message to messages immediately
                const newMessage: Message = {
                    id: sentMessage.id,
                    senderId: sentMessage.senderId,
                    senderName: 'You', // Since it's own message
                    content: sentMessage.content,
                    timestamp: new Date(sentMessage.createdAt),
                    isOwn: true,
                };
                setMessages(prev => [...prev, newMessage]);

                // Update conversation last message
                setConversations(prev =>
                    prev.map(conv =>
                        conv.id === selectedConversation.id
                            ? { ...conv, lastMessage: content, lastMessageTime: new Date() }
                            : conv
                    )
                );
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            // Re-add the message to input on error
            setInputMessage(content);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputMessage(e.target.value);

        // Send typing indicator
        if (selectedConversation && wsConnected && state.user) {
            chatWebSocketService.sendTypingIndicator(selectedConversation.id, true, state.user.id);

            // Clear existing timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // Set new timeout to stop typing indicator
            typingTimeoutRef.current = window.setTimeout(() => {
                if (state.user) {
                    chatWebSocketService.sendTypingIndicator(selectedConversation.id, false, state.user.id);
                }
            }, 2000);
        }
    };

    const handleSelectConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation);
        setShowConversationList(false);
        
        // Mark as read
        setConversations(prev =>
            prev.map(conv =>
                conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
            )
        );
    };

    const handleBackToList = () => {
        setShowConversationList(true);
        setSelectedConversation(null);
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getConversationIcon = (type: Conversation['type']) => {
        switch (type) {
            case 'class':
            case 'group':
                return <HiUserGroup className="w-5 h-5" />;
            default:
                return <HiUser className="w-5 h-5" />;
        }
    };

    const filteredConversations = conversations.filter(conv =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

    // Don't render if user is not logged in
    if (!state.isAuthenticated || !state.user) {
        return null;
    }

    return (
        <>
            {/* Chat Icon Button */}
            {!isOpen && (
                <ChatIconButton
                    totalUnread={totalUnread}
                    onClick={() => {
                        setIsOpen(true);
                        if (state.isAuthenticated && state.user) {
                            fetchConversations();
                        }
                    }}
                />
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
                    {/* Header */}
                    <div className="bg-[#0b6459] text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {!showConversationList && selectedConversation && (
                                <button
                                    onClick={handleBackToList}
                                    className="hover:bg-white/20 rounded-full p-1 transition mr-1"
                                    aria-label="Back to conversations"
                                >
                                    ←
                                </button>
                            )}
                            <BsChatDotsFill className="w-5 h-5" />
                            <div>
                                <h3 className="font-semibold text-sm">
                                    {showConversationList ? 'Messages' : selectedConversation?.name}
                                </h3>
                                <p className="text-xs opacity-90">
                                    {showConversationList 
                                        ? `${conversations.length} conversations` 
                                        : selectedConversation?.type === 'class' 
                                            ? 'Class Group'
                                            : selectedConversation?.type === 'group'
                                                ? 'Study Group'
                                                : 'Direct Message'
                                    }
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 rounded-full p-1 transition"
                            aria-label="Close chat"
                        >
                            <HiX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Conversations List */}
                    {showConversationList && (
                        <>
                            {/* Search Bar */}
                            <div className="p-3 border-b border-gray-200">
                                <div className="relative">
                                    <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search conversations..."
                                        className="w-full bg-gray-100 border border-gray-300 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b6459] focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Conversations List */}
                            <div className="flex-1 overflow-y-auto">
                                {loadingConversations ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0b6459] mx-auto"></div>
                                            <p className="mt-2 text-sm text-gray-500">Loading conversations...</p>
                                        </div>
                                    </div>
                                ) : conversationsError ? (
                                    <div className="flex items-center justify-center h-full p-4">
                                        <div className="text-center">
                                            <p className="text-sm text-red-500 mb-2">Failed to load conversations</p>
                                            <button
                                                onClick={fetchConversations}
                                                className="text-xs bg-[#0b6459] text-white px-3 py-1 rounded hover:bg-[#084c43]"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    </div>
                                ) : filteredConversations.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                        <BsChatDotsFill className="w-12 h-12 text-gray-300 mb-3" />
                                        <p className="text-gray-500 text-sm">No conversations yet</p>
                                        <p className="text-gray-400 text-xs mt-1">Start chatting with your tutors or classmates!</p>
                                    </div>
                                ) : (
                                    filteredConversations.map((conversation) => (
                                        <button
                                            key={conversation.id}
                                            onClick={() => handleSelectConversation(conversation)}
                                            className="w-full p-3 hover:bg-gray-50 border-b border-gray-100 transition text-left"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                                                    {getConversationIcon(conversation.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-semibold text-sm text-gray-800 truncate">
                                                            {conversation.name}
                                                        </h4>
                                                        {conversation.lastMessageTime && (
                                                            <span className="text-xs text-gray-400">
                                                                {formatTime(conversation.lastMessageTime)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {conversation.lastMessage || 'No messages yet'}
                                                        </p>
                                                        {conversation.unreadCount > 0 && (
                                                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-2">
                                                                {conversation.unreadCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </>
                    )}

                    {/* Chat Messages View */}
                    {!showConversationList && selectedConversation && (
                        <>
                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <BsChatDotsFill className="w-12 h-12 text-gray-300 mb-3" />
                                        <p className="text-gray-500 text-sm">No messages yet</p>
                                        <p className="text-gray-400 text-xs mt-1">Start the conversation!</p>
                                    </div>
                                ) : (
                                    <>
                                        {[...messages].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()).map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[75%] rounded-lg px-3 py-2 ${
                                                        message.isOwn
                                                            ? 'bg-[#0b6459] text-white'
                                                            : 'bg-white border border-gray-200 text-gray-800'
                                                    }`}
                                                >
                                                    {!message.isOwn && (
                                                        <p className="text-xs font-semibold mb-1 text-gray-600">
                                                            {message.senderName}
                                                        </p>
                                                    )}
                                                    <p className="text-sm">{message.content}</p>
                                                    <p
                                                        className={`text-xs mt-1 ${
                                                            message.isOwn ? 'text-white/70' : 'text-gray-400'
                                                        }`}
                                                    >
                                                        {formatTime(message.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                        
                                        {/* Typing Indicator */}
                                        {typingUsers.size > 0 && (
                                            <div className="flex justify-start">
                                                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-500 text-sm">
                                                    <span className="italic">Someone is typing...</span>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={inputMessage}
                                        onChange={handleInputChange}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-gray-100 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b6459] focus:border-transparent"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputMessage.trim()}
                                        className="bg-[#0b6459] text-white rounded-full p-2 hover:bg-[#084c43] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Send message"
                                    >
                                        <HiPaperAirplane className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default ChatWidget;
