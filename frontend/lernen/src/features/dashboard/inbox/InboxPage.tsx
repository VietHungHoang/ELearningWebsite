import React, { useState, useMemo, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { HiSearch, HiCog, HiPaperAirplane, HiUser, HiUsers, HiPlus, HiPhotograph, HiDocument, HiVideoCamera } from 'react-icons/hi';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { type BreadcrumbItem } from '../components/Breadcrumb';
import { useAuth } from '../../../context/AuthContext';
import chatService, { type MessageResponse } from '../../../services/chatService';
import chatWebSocketService from '../../../services/chatWebSocketService';
import userCacheService, { type UserInfo } from '../../../services/userCacheService';
import BirdLoading from '../../../components/ui/BirdLoading';

// ==================== INTERFACES ====================

interface Message {
    id: string;
    text: string;
    timestamp: string;
    sender: 'me' | 'them';
    senderName?: string;
    senderId: string;
}

interface Conversation {
    id: string;
    contactName: string;
    contactAvatar: string;
    onlineStatus: 'Online' | 'Offline';
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    type: 'private' | 'group';
    participantIds: string[];
}

// ==================== HELPER FUNCTIONS ====================

const formatTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    if (diff < 172800000) return 'Yesterday';
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
};

const mapConversationType = (apiType: string): 'private' | 'group' => {
    return apiType === 'ONE_ON_ONE' ? 'private' : 'group';
};

// ==================== COMPONENTS ====================

const ContactListItem: React.FC<{ conv: Conversation; isActive: boolean; onClick: () => void; }> = ({ conv, isActive, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-start gap-4 p-3 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-[#F9F3EB]' : 'hover:bg-gray-50'}`}
    >
        <div className="relative flex-shrink-0">
            <img src={conv.contactAvatar} alt={conv.contactName} className="w-10 h-10 rounded-full object-cover" />
            {conv.onlineStatus === 'Online' && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
            <div className="absolute top-0 right-0 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-gray-200">
                {conv.type === 'group' ? (
                    <HiUsers className="w-2.5 h-2.5 text-gray-600" />
                ) : (
                    <HiUser className="w-2.5 h-2.5 text-gray-600" />
                )}
            </div>
        </div>
        <div className="flex-grow min-w-0">
            <div className="flex justify-between items-center">
                <p className="font-bold text-gray-800 text-sm truncate">{conv.contactName}</p>
                <p className="text-xs text-gray-400 flex-shrink-0">{conv.lastMessageTime}</p>
            </div>
            <div className="flex justify-between items-start mt-1">
                <p className="text-xs text-gray-500 truncate pr-2">{conv.lastMessage}</p>
                {conv.unreadCount > 0 && (
                    <span className="flex-shrink-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{conv.unreadCount}</span>
                )}
            </div>
        </div>
    </div>
);

interface ChatWindowProps {
    conversation: Conversation | null;
    messages: Message[];
    i18nPrefix: string;
    onSendMessage: (text: string) => void;
    isTyping: boolean;
    currentUserId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, messages, i18nPrefix, onSendMessage, isTyping }) => {
    const { t } = useTranslation();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const attachmentRef = useRef<HTMLDivElement>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isAttachmentPanelOpen, setIsAttachmentPanelOpen] = useState(false);
    const prevConversationIdRef = useRef<string | null>(null);
    const prevMessagesLengthRef = useRef<number>(0);
    const isInitialMountRef = useRef(true);

    useLayoutEffect(() => {
        if (!conversation || !messagesContainerRef.current) return;

        const conversationChanged = prevConversationIdRef.current !== conversation.id;
        const newMessageAdded = !conversationChanged && messages.length > prevMessagesLengthRef.current;

        if (conversationChanged) {
            prevConversationIdRef.current = conversation.id;
            prevMessagesLengthRef.current = messages.length;
        } else {
            prevMessagesLengthRef.current = messages.length;
        }

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (!messagesContainerRef.current) return;

                if (conversationChanged || isInitialMountRef.current) {
                    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
                    isInitialMountRef.current = false;
                } else if (newMessageAdded) {
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }, [conversation?.id, messages.length]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (attachmentRef.current && !attachmentRef.current.contains(event.target as Node)) {
                setIsAttachmentPanelOpen(false);
            }
        };

        if (isAttachmentPanelOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAttachmentPanelOpen]);

    if (!conversation) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                <h3 className="text-lg font-semibold">{t(`${i18nPrefix}.empty.title`)}</h3>
                <p className="text-sm">{t(`${i18nPrefix}.empty.description`)}</p>
            </div>
        );
    }

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;
        onSendMessage(newMessage.trim());
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-full min-h-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <img src={conversation.contactAvatar} alt={conversation.contactName} className="w-10 h-10 rounded-full flex-shrink-0 object-cover" />
                    <div>
                        <p className="font-bold text-gray-800">{conversation.contactName}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <div className={`w-2 h-2 ${conversation.onlineStatus === 'Online' ? 'bg-green-500' : 'bg-gray-400'} rounded-full`}></div>
                            {conversation.onlineStatus === 'Online' ? t(`${i18nPrefix}.status.online`) : t(`${i18nPrefix}.status.offline`)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                        <HiCog className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-gray-50 min-h-0" style={{ scrollBehavior: 'auto', overflowAnchor: 'none' }}>
                <div className="">
                    {messages.map((msg, index) => {
                        const prevMsg = index > 0 ? messages[index - 1] : null;
                        const isSameSender = prevMsg && (
                            (msg.sender === 'me' && prevMsg.sender === 'me') ||
                            (msg.sender === 'them' && prevMsg.sender === 'them' &&
                                (conversation.type === 'private' || msg.senderName === prevMsg.senderName))
                        );

                        return (
                            <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} mb-1 ${!isSameSender && index > 0 ? 'mt-4' : ''}`}>
                                {msg.sender === 'them' && !isSameSender && <img src={conversation.contactAvatar} className="w-6 h-6 rounded-full object-cover" />}
                                {msg.sender === 'them' && isSameSender && <div className="w-6" />}
                                <div className={`max-w-xs lg:max-w-md ${msg.sender === 'me' ? '' : 'min-w-0'}`}>
                                    {msg.sender === 'them' && conversation.type === 'group' && msg.senderName && !isSameSender && (
                                        <p className="text-xs text-gray-500 mb-1 ml-1">{msg.senderName}</p>
                                    )}
                                    <div className={`px-4 py-3 rounded-2xl ${msg.sender === 'me' ? 'bg-[#0b6459] text-white rounded-br-lg' : 'bg-gray-100 text-gray-800 rounded-bl-lg'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                        <p className={`text-[12px] mt-0.5 ${msg.sender === 'me' ? 'text-gray-200' : 'text-gray-500'} text-right`}>{msg.timestamp}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex items-end gap-3 justify-start mt-2">
                            <img src={conversation.contactAvatar} className="w-6 h-6 rounded-full object-cover" />
                            <div className="bg-gray-100 text-gray-500 px-4 py-3 rounded-2xl rounded-bl-lg">
                                <span className="text-sm italic">Đang nhập...</span>
                            </div>
                        </div>
                    )}
                </div>
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200 relative flex-shrink-0" ref={attachmentRef}>
                {isAttachmentPanelOpen && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 w-40">
                        <div className="flex flex-col gap-1">
                            <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <HiPhotograph className="w-5 h-5 text-blue-500" />
                                <span className="text-sm text-gray-700">{t(`${i18nPrefix}.attachments.photo`)}</span>
                            </button>
                            <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <HiVideoCamera className="w-5 h-5 text-red-500" />
                                <span className="text-sm text-gray-700">{t(`${i18nPrefix}.attachments.video`)}</span>
                            </button>
                            <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <HiDocument className="w-5 h-5 text-green-500" />
                                <span className="text-sm text-gray-700">{t(`${i18nPrefix}.attachments.document`)}</span>
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSendMessage} className="relative">
                    <button
                        type="button"
                        onClick={() => setIsAttachmentPanelOpen(!isAttachmentPanelOpen)}
                        className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <HiPlus className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t(`${i18nPrefix}.messagePlaceholder`)}
                        className="w-full bg-transparent border-transparent rounded-lg pl-12 pr-12 py-2 text-sm focus:outline-none placeholder:text-gray-400"
                    />
                    <button type="submit" className="absolute inset-y-0 right-0 px-4 text-gray-500 hover:text-[#0b6459]">
                        <HiPaperAirplane className="w-5 h-5 rotate-90" />
                    </button>
                </form>
            </div>
        </div>
    );
};

// ==================== MAIN COMPONENT ====================

interface InboxContentProps {
    initialSelectedStudentId?: string | null;
}

const InboxPage: React.FC<InboxContentProps> = ({ initialSelectedStudentId }) => {
    const { state } = useAuth();
    const { t } = useTranslation();
    const { setBreadcrumb } = useBreadcrumb();

    const isTutor = state.user?.role === 'tutor';
    const i18nPrefix = isTutor ? 'dashboard.inbox' : 'dashboard.messages';
    const currentUserId = state.user?.id || '';

    // State
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [messageTypeFilter, setMessageTypeFilter] = useState<'all' | 'private' | 'group'>('all');
    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [wsConnected, setWsConnected] = useState(false);
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
    const [userCache, setUserCache] = useState<Map<string, UserInfo>>(new Map()); // eslint-disable-line @typescript-eslint/no-unused-vars

    // Breadcrumb
    useEffect(() => {
        const breadcrumbItems: BreadcrumbItem[] = [
            { label: t('dashboard.header.breadcrumb.dashboard'), path: '/dashboard' },
            { label: t(`${i18nPrefix}.title`), isActive: true }
        ];
        setBreadcrumb(breadcrumbItems);
    }, [setBreadcrumb, t, i18nPrefix]);

    // Fetch conversations
    const fetchConversations = useCallback(async () => {
        if (!state.user) return;

        setLoading(true);
        setError(null);

        try {
            const data = await chatService.getAllConversationsForUser();

            // Prefetch all participant user info
            const allParticipantIds = data.flatMap(conv => conv.participantIds).filter(id => id !== currentUserId);
            const usersMap = await userCacheService.getUsersInfo(allParticipantIds);
            setUserCache(prev => new Map([...prev, ...usersMap]));

            const mappedConversations: Conversation[] = data.map(apiConv => {
                // For 1-1 chats, get the other participant's name
                const otherParticipantId = apiConv.participantIds.find(id => id !== currentUserId);
                const otherUser = otherParticipantId ? usersMap.get(otherParticipantId) : null;
                const contactName = apiConv.name || userCacheService.getDisplayName(otherUser ?? null) || `Conversation ${apiConv.id.slice(0, 8)}`;
                const contactAvatar = userCacheService.getAvatarUrl(otherUser ?? null, apiConv.id);

                return {
                    id: apiConv.id,
                    contactName,
                    contactAvatar,
                    onlineStatus: 'Offline' as const,
                    lastMessage: apiConv.lastMessage?.content || 'No messages yet',
                    lastMessageTime: apiConv.lastMessageAt ? formatTime(apiConv.lastMessageAt) : '',
                    unreadCount: 0,
                    type: mapConversationType(apiConv.type),
                    participantIds: apiConv.participantIds,
                };
            });

            setConversations(mappedConversations);

            // Auto-select first conversation
            if (mappedConversations.length > 0 && !selectedConversationId) {
                setSelectedConversationId(initialSelectedStudentId || mappedConversations[0].id);
            }
        } catch (err) {
            console.error('Failed to fetch conversations:', err);
            setError('Failed to load conversations');
        } finally {
            setLoading(false);
        }
    }, [state.user, selectedConversationId, initialSelectedStudentId]);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // Fetch messages for selected conversation
    const fetchMessages = useCallback(async (conversationId: string) => {
        if (!state.user) return;

        setLoadingMessages(true);

        try {
            const data = await chatService.getConversationMessages(conversationId, 0, 50);

            // Prefetch sender user info
            const senderIds = [...new Set(data.map(msg => msg.senderId).filter(id => id !== currentUserId))];
            const sendersMap = await userCacheService.getUsersInfo(senderIds);
            setUserCache(prev => new Map([...prev, ...sendersMap]));

            const mappedMessages: Message[] = data.map(msg => {
                const senderUser = sendersMap.get(msg.senderId);
                return {
                    id: msg.id,
                    text: msg.content,
                    timestamp: formatTime(msg.createdAt),
                    sender: msg.senderId === currentUserId ? 'me' : 'them',
                    senderName: msg.senderId === currentUserId ? 'You' : userCacheService.getDisplayName(senderUser ?? null),
                    senderId: msg.senderId,
                };
            });

            setMessages(mappedMessages.reverse()); // API returns newest first
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        } finally {
            setLoadingMessages(false);
        }
    }, [state.user, currentUserId]);

    useEffect(() => {
        if (selectedConversationId) {
            fetchMessages(selectedConversationId);
        }
    }, [selectedConversationId, fetchMessages]);

    // WebSocket connection
    useEffect(() => {
        if (!state.user || !state.isAuthenticated) return;

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

        return () => {
            chatWebSocketService.disconnect();
            setWsConnected(false);
        };
    }, [state.user, state.isAuthenticated]);

    // Subscribe to conversation messages
    useEffect(() => {
        if (!selectedConversationId || !wsConnected) return;

        chatWebSocketService.subscribeToConversation(
            selectedConversationId,
            (message: MessageResponse) => {
                const newMessage: Message = {
                    id: message.id,
                    text: message.content,
                    timestamp: formatTime(message.createdAt),
                    sender: message.senderId === currentUserId ? 'me' : 'them',
                    senderName: message.senderId === currentUserId ? 'You' : `User ${message.senderId.slice(0, 8)}`,
                    senderId: message.senderId,
                };
                setMessages(prev => [...prev, newMessage]);

                // Update conversation last message
                setConversations(prev =>
                    prev.map(conv =>
                        conv.id === selectedConversationId
                            ? { ...conv, lastMessage: message.content, lastMessageTime: formatTime(message.createdAt) }
                            : conv
                    )
                );
            }
        );

        // Subscribe to typing indicators
        chatWebSocketService.subscribeToTypingIndicators(
            selectedConversationId,
            (indicator) => {
                if (indicator.userId !== currentUserId) {
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
            chatWebSocketService.unsubscribeFromConversation(selectedConversationId);
        };
    }, [selectedConversationId, wsConnected, currentUserId]);

    // Send message handler
    const handleSendMessage = async (text: string) => {
        if (!selectedConversationId || !state.user) return;

        const messageRequest = {
            conversationId: selectedConversationId,
            type: 'TEXT' as const,
            content: text,
        };

        try {
            if (wsConnected) {
                chatWebSocketService.sendMessage(messageRequest, state.user.id);
            } else {
                const sentMessage = await chatService.sendMessage(messageRequest);
                const newMessage: Message = {
                    id: sentMessage.id,
                    text: sentMessage.content,
                    timestamp: formatTime(sentMessage.createdAt),
                    sender: 'me',
                    senderName: 'You',
                    senderId: sentMessage.senderId,
                };
                setMessages(prev => [...prev, newMessage]);
            }
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    // Filtered conversations
    const filteredConversations = useMemo(() => {
        return conversations.filter(conv => {
            const matchesSearch = conv.contactName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = messageTypeFilter === 'all' || conv.type === messageTypeFilter;
            return matchesSearch && matchesType;
        });
    }, [conversations, searchTerm, messageTypeFilter]);

    const selectedConversation = useMemo(() => {
        return conversations.find(c => c.id === selectedConversationId) || null;
    }, [conversations, selectedConversationId]);

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <BirdLoading title={t('common.loading')} />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={fetchConversations}
                    className="px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43]"
                >
                    {t('common.retry')}
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full min-h-0">
            <div className="flex bg-white rounded-2xl shadow-sm overflow-hidden flex-1 min-h-0">
                {/* Left Pane: Contact List */}
                <div className="w-full md:w-2/5 xl:w-1/3 max-w-sm border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">{t(`${i18nPrefix}.title`)}</h2>
                        <div className="relative mt-4">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <HiSearch className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder={t(`${i18nPrefix}.searchPlaceholder`)}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white rounded-lg pl-10 pr-4 py-2.5 text-sm border border-gray-200 focus:outline-none hover:shadow-md transition-all duration-300 ease-in-out placeholder:text-gray-400"
                            />
                        </div>
                        {/* Message Type Filter */}
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => setMessageTypeFilter('all')}
                                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${messageTypeFilter === 'all'
                                    ? 'bg-[#0b6459] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {t(`${i18nPrefix}.filters.all`)}
                            </button>
                            <button
                                onClick={() => setMessageTypeFilter('private')}
                                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${messageTypeFilter === 'private'
                                    ? 'bg-[#0b6459] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {t(`${i18nPrefix}.filters.private`)}
                            </button>
                            <button
                                onClick={() => setMessageTypeFilter('group')}
                                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${messageTypeFilter === 'group'
                                    ? 'bg-[#0b6459] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {t(`${i18nPrefix}.filters.group`)}
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 p-2 overflow-y-auto custom-scrollbar">
                        {filteredConversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                <HiUser className="w-12 h-12 text-gray-300 mb-3" />
                                <p className="text-gray-500 text-sm">No conversations yet</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {filteredConversations.map(conv => (
                                    <ContactListItem
                                        key={conv.id}
                                        conv={conv}
                                        isActive={conv.id === selectedConversationId}
                                        onClick={() => setSelectedConversationId(conv.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Pane: Chat Window */}
                <div className="hidden md:flex w-3/5 xl:w-2/3 flex-col relative min-h-0">
                    {loadingMessages ? (
                        <div className="flex items-center justify-center h-full">
                            <BirdLoading title={t('common.loading')} size="sm" />
                        </div>
                    ) : (
                        <ChatWindow
                            key={selectedConversationId}
                            conversation={selectedConversation}
                            messages={messages}
                            i18nPrefix={i18nPrefix}
                            onSendMessage={handleSendMessage}
                            isTyping={typingUsers.size > 0}
                            currentUserId={currentUserId}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default InboxPage;