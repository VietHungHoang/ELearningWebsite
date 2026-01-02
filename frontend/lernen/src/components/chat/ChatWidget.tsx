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
                <div className="fixed bottom-6 right-6 w-[340px] h-[480px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#0b6459] to-[#0d7a6c] text-white px-4 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {!showConversationList && selectedConversation && (
                                <button
                                    onClick={handleBackToList}
                                    className="hover:bg-white/20 rounded-full p-1.5 transition-all duration-200"
                                    aria-label="Back to conversations"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            )}
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <BsChatDotsFill className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm leading-tight">
                                    {showConversationList ? 'Tin nhắn' : selectedConversation?.name}
                                </h3>
                                <p className="text-[10px] opacity-80">
                                    {showConversationList
                                        ? `${conversations.length} cuộc trò chuyện`
                                        : selectedConversation?.type === 'class'
                                            ? 'Nhóm lớp'
                                            : selectedConversation?.type === 'group'
                                                ? 'Nhóm học tập'
                                                : 'Tin nhắn trực tiếp'
                                    }
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 rounded-full p-1.5 transition-all duration-200"
                            aria-label="Close chat"
                        >
                            <HiX className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Conversations List */}
                    {showConversationList && (
                        <>
                            {/* Search Bar */}
                            <div className="p-2.5 border-b border-gray-100 bg-gray-50/50">
                                <div className="relative">
                                    <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Tìm kiếm..."
                                        className="w-full bg-white border border-gray-200 rounded-full pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0b6459]/20 focus:border-[#0b6459] transition-all"
                                    />
                                </div>
                            </div>

                            {/* Conversations List */}
                            <div className="flex-1 overflow-y-auto">
                                {loadingConversations ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#0b6459] border-t-transparent mx-auto"></div>
                                            <p className="mt-2 text-xs text-gray-500">Đang tải...</p>
                                        </div>
                                    </div>
                                ) : conversationsError ? (
                                    <div className="flex items-center justify-center h-full p-4">
                                        <div className="text-center">
                                            <p className="text-xs text-red-500 mb-2">Không thể tải cuộc trò chuyện</p>
                                            <button
                                                onClick={fetchConversations}
                                                className="text-xs bg-[#0b6459] text-white px-3 py-1 rounded-full hover:bg-[#084c43] transition-colors"
                                            >
                                                Thử lại
                                            </button>
                                        </div>
                                    </div>
                                ) : filteredConversations.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                            <BsChatDotsFill className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <p className="text-gray-600 text-xs font-medium">Chưa có cuộc trò chuyện</p>
                                        <p className="text-gray-400 text-[10px] mt-1">Bắt đầu trò chuyện với gia sư!</p>
                                    </div>
                                ) : (
                                    filteredConversations.map((conversation) => (
                                        <button
                                            key={conversation.id}
                                            onClick={() => handleSelectConversation(conversation)}
                                            className="w-full p-2.5 hover:bg-gray-50 border-b border-gray-50 transition-colors text-left group"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-[#0b6459] to-[#0d7a6c] rounded-full flex items-center justify-center text-white shadow-sm">
                                                    {getConversationIcon(conversation.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-0.5">
                                                        <h4 className="font-medium text-xs text-gray-800 truncate group-hover:text-[#0b6459] transition-colors">
                                                            {conversation.name}
                                                        </h4>
                                                        {conversation.lastMessageTime && (
                                                            <span className="text-[10px] text-gray-400 ml-2 flex-shrink-0">
                                                                {formatTime(conversation.lastMessageTime)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-[10px] text-gray-500 truncate">
                                                            {conversation.lastMessage || 'Chưa có tin nhắn'}
                                                        </p>
                                                        {conversation.unreadCount > 0 && (
                                                            <span className="bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center ml-2 flex-shrink-0 font-medium">
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
                            <div className="flex-1 overflow-y-auto p-3 bg-gradient-to-b from-gray-50 to-white space-y-2">
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                            <BsChatDotsFill className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <p className="text-gray-600 text-xs font-medium">Chưa có tin nhắn</p>
                                        <p className="text-gray-400 text-[10px] mt-1">Bắt đầu cuộc trò chuyện!</p>
                                    </div>
                                ) : (
                                    <>
                                        {[...messages].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()).map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] rounded-2xl px-3 py-2 shadow-sm ${message.isOwn
                                                        ? 'bg-gradient-to-r from-[#0b6459] to-[#0d7a6c] text-white rounded-br-sm'
                                                        : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
                                                        }`}
                                                >
                                                    {!message.isOwn && (
                                                        <p className="text-[10px] font-semibold mb-0.5 text-[#0b6459]">
                                                            {message.senderName}
                                                        </p>
                                                    )}
                                                    <p className="text-xs leading-relaxed">{message.content}</p>
                                                    <p
                                                        className={`text-[9px] mt-1 ${message.isOwn ? 'text-white/70' : 'text-gray-400'
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
                                                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-3 py-2 shadow-sm">
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleSendMessage} className="p-2.5 border-t border-gray-100 bg-white">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={inputMessage}
                                        onChange={handleInputChange}
                                        placeholder="Nhập tin nhắn..."
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0b6459]/20 focus:border-[#0b6459] transition-all placeholder:text-gray-400"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputMessage.trim()}
                                        className="bg-gradient-to-r from-[#0b6459] to-[#0d7a6c] text-white rounded-full p-2 hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                                        aria-label="Send message"
                                    >
                                        <HiPaperAirplane className="w-4 h-4" />
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
