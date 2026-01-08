import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { HiX, HiPaperAirplane, HiSearch, HiUserGroup, HiUser, HiEmojiHappy, HiPaperClip, HiPhotograph, HiVideoCamera, HiDocument } from 'react-icons/hi';
import { BsChatDotsFill } from 'react-icons/bs';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import chatService, { type ConversationResponse, type MessageResponse } from '../../services/chatService';
import chatWebSocketService from '../../services/chatWebSocketService';
import { uploadService } from '../../services/uploadService';
import ChatIconButton from './ChatIconButton';
import EmojiPicker from 'emoji-picker-react';

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: Date;
    isOwn: boolean;
    type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE';
    fileName?: string; // Original filename from user's upload
    isLoading?: boolean; // For pending upload messages
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
    // ... states ...
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
    const [showFileDropdown, setShowFileDropdown] = useState(false);
    const [wsConnected, setWsConnected] = useState(false);
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
    const typingTimeoutRef = useRef<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // File upload refs
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const documentInputRef = useRef<HTMLInputElement>(null);

    // Pagination states
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(false);
    // Control scroll behavior: 'auto' (instant), 'smooth' (animate), or null (no scroll)
    const shouldScrollToBottom = useRef<'auto' | 'smooth' | null>('auto');

    // State to store previous scroll height for restoration
    const prevScrollHeightRef = useRef<number>(0);

    const scrollToBottom = () => {
        if (shouldScrollToBottom.current && messagesContainerRef.current) {
            if (shouldScrollToBottom.current === 'auto') {
                // Instant scroll
                messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
            } else {
                // Smooth scroll
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    useLayoutEffect(() => {
        scrollToBottom();
        // Hide initial loading overlay after scroll is done for "auto" scroll (initial load)
        if (shouldScrollToBottom.current === 'auto' && isInitialLoading) {
            // Artificial delay to ensure user sees transition and layout stabilizes
            const timer = setTimeout(() => {
                setIsInitialLoading(false);
            }, 300); // 300ms delay
            return () => clearTimeout(timer);
        }
    }, [messages, isInitialLoading]);

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

    // Close file dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showFileDropdown && !(event.target as Element).closest('.file-dropdown-container')) {
                setShowFileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showFileDropdown]);

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
                        type: message.type || 'TEXT',
                    };

                    // Auto scroll smooth on new message
                    shouldScrollToBottom.current = 'smooth';
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

    // Poll for conversation updates when in list view (for real-time updates)
    useEffect(() => {
        if (showConversationList && isOpen && state.isAuthenticated) {
            const interval = setInterval(() => {
                fetchConversations();
            }, 15000);  // Poll every 15 seconds
            return () => clearInterval(interval);
        }
    }, [showConversationList, isOpen, state.isAuthenticated]);

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
                avatarUrl: getConversationAvatar(apiConv, state.user!.id),
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
        // For ONE_TO_ONE conversations, get name from participantDetails
        if (apiConv.type === 'ONE_TO_ONE' && apiConv.participantDetails) {
            const other = apiConv.participantDetails.find(p => p.userId !== currentUserId);
            if (other && other.fullName) return other.fullName;
        }
        // Fallback to participant IDs
        if (apiConv.type === 'ONE_TO_ONE') {
            const otherParticipantId = apiConv.participantIds.find((id: string) => id !== currentUserId);
            return `User ${otherParticipantId?.substring(0, 8) || 'Unknown'}`;
        }
        return 'Unknown Conversation';
    };

    const getConversationAvatar = (apiConv: ConversationResponse, currentUserId: string): string | undefined => {
        if (apiConv.type === 'ONE_TO_ONE' && apiConv.participantDetails) {
            const other = apiConv.participantDetails.find(p => p.userId !== currentUserId);
            return other?.avatarUrl;
        }
        return undefined;
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
            // Reset pagination
            setPage(0);
            setHasMore(true);
            setMessages([]);
            shouldScrollToBottom.current = 'auto'; // Instant scroll on conversation change
            setIsInitialLoading(true); // Start loading
            fetchMessages(selectedConversation.id, 0);
        }
    }, [selectedConversation, state.user]);

    const fetchMessages = async (conversationId: string, pageNum: number) => {
        try {
            if (pageNum > 0) {
                setIsFetchingMore(true);
                shouldScrollToBottom.current = null; // Don't scroll to bottom when loading history
            }

            const data = await chatService.getConversationMessages(conversationId, pageNum, 20);

            if (data.length < 20) {
                setHasMore(false);
            }

            const mappedMessages: Message[] = data.map(msg => ({
                id: msg.id,
                senderId: msg.senderId,
                senderName: 'Unknown', // TODO: Get from participants cache
                content: msg.content,
                timestamp: new Date(msg.createdAt),
                isOwn: msg.senderId === state.user?.id,
                type: msg.type || 'TEXT',
            }));

            setMessages(prev => {
                if (pageNum === 0) return mappedMessages;
                // Prepend older messages: merge and deduplicate just in case
                const existingIds = new Set(prev.map(m => m.id));
                const uniqueNewMessages = mappedMessages.filter(m => !existingIds.has(m.id));
                return [...uniqueNewMessages, ...prev];
            });

            // If page 0 and no messages (empty conv), turn off loading
            if (pageNum === 0 && mappedMessages.length === 0) {
                setTimeout(() => setIsInitialLoading(false), 300);
            }

        } catch (error) {
            console.error('Failed to load messages:', error);
            if (pageNum === 0) setIsInitialLoading(false);
        } finally {
            setIsFetchingMore(false);
        }
    };



    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight } = e.currentTarget;

        if (scrollTop === 0 && hasMore && !isFetchingMore && selectedConversation) {
            // User scrolled to top, load more
            prevScrollHeightRef.current = scrollHeight; // Save current scroll height

            const nextPage = page + 1;
            setPage(nextPage);
            fetchMessages(selectedConversation.id, nextPage);
        }
    };

    // Effect to restore scroll position when messages change (and not scrolling to bottom)
    useLayoutEffect(() => {
        if (!shouldScrollToBottom.current && messagesContainerRef.current && prevScrollHeightRef.current > 0) {
            const container = messagesContainerRef.current;
            const newScrollHeight = container.scrollHeight;
            const diff = newScrollHeight - prevScrollHeightRef.current;

            // Restore scroll position
            container.scrollTop = diff;

            // Reset ref
            prevScrollHeightRef.current = 0;
        }
    }, [messages]);

    const findOrCreateConversationWithTutor = async (tutorId: string, tutorName: string) => {
        if (!state.user) return;

        setIsInitialLoading(true); // Start loading immediately

        // First, check if conversation already exists
        const existingConversation = conversations.find(conv =>
            conv.type === 'individual' && conv.participants?.includes(tutorId) && conv.participants?.includes(state.user!.id)
        );

        if (existingConversation) {
            // Update name if it was generated from ID
            if (existingConversation.name.startsWith('User ')) {
                const updatedConv = { ...existingConversation, name: tutorName };
                setConversations(prev => prev.map(c =>
                    c.id === existingConversation.id ? updatedConv : c
                ));
                setSelectedConversation(updatedConv);
            } else {
                setSelectedConversation(existingConversation);
            }
            setShowConversationList(false);
            return;
        }

        // If not found in current conversations, try to create new conversation
        try {
            const createRequest = {
                type: 'ONE_TO_ONE' as const,
                participantIds: [tutorId],
                participantInfos: [
                    { id: state.user.id, fullName: state.user.name || 'User', avatarUrl: state.user.avatarUrl },
                    { id: tutorId, fullName: tutorName, avatarUrl: undefined }
                ]
            };
            const apiResponse = await chatService.createConversation(createRequest);

            // Map API response to component format
            const newConversation: Conversation = {
                id: apiResponse.id,
                name: tutorName,
                type: mapConversationType(apiResponse.type),
                avatarUrl: getConversationAvatar(apiResponse, state.user!.id),
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
                    type: sentMessage.type || 'TEXT',
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

    // File selection and upload handlers with S3 flow
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'IMAGE' | 'VIDEO' | 'FILE') => {
        const files = e.target.files;
        if (files && files.length > 0) {
            await handleUploadAndSendFiles(Array.from(files), fileType);
        }
        e.target.value = '';
    };

    const handleUploadAndSendFiles = async (files: File[], fileType: 'IMAGE' | 'VIDEO' | 'FILE') => {
        if (!state.user || !selectedConversation || files.length === 0) return;

        setShowFileDropdown(false);

        // Generate a temporary ID for pending message
        const tempId = `temp-${Date.now()}`;
        const originalFileName = files[0].name; // Store original filename

        // Step 1: Create pending message with loading state immediately
        const pendingMessage: Message = {
            id: tempId,
            senderId: state.user.id,
            senderName: 'You',
            content: '', // Will be filled after upload
            timestamp: new Date(),
            isOwn: true,
            type: fileType,
            fileName: originalFileName,
            isLoading: true,
        };

        shouldScrollToBottom.current = 'smooth';
        setMessages(prev => [...prev, pendingMessage]);

        try {
            const uploadedUrls: string[] = [];

            for (const file of files) {
                // Get presigned URL based on file type
                let presignedData;
                if (fileType === 'IMAGE') {
                    presignedData = await uploadService.getPreSignedImageUrl(file.type);
                } else if (fileType === 'VIDEO') {
                    presignedData = await uploadService.getPreSignedVideoUrl(file.type);
                } else {
                    presignedData = await uploadService.getPreSignedUrl(file.type);
                }

                // Upload file to S3
                await uploadService.uploadFileToS3(presignedData.presignedUrl, file);

                // Store the final URL
                uploadedUrls.push(presignedData.finalUrl);
            }

            // Send message with file URLs
            const messageContent = uploadedUrls.join('\n');
            const messageRequest = {
                conversationId: selectedConversation.id,
                type: fileType,
                content: messageContent,
            };

            const sentMessage = await chatService.sendMessage(messageRequest);

            // Replace pending message with sent message (keeping original filename)
            setMessages(prev => prev.map(msg =>
                msg.id === tempId
                    ? {
                        id: sentMessage.id,
                        senderId: sentMessage.senderId,
                        senderName: 'You',
                        content: sentMessage.content,
                        timestamp: new Date(sentMessage.createdAt),
                        isOwn: true,
                        type: sentMessage.type || fileType,
                        fileName: originalFileName, // Keep original filename
                        isLoading: false,
                    }
                    : msg
            ));

            // Update conversation last message
            setConversations(prev =>
                prev.map(conv =>
                    conv.id === selectedConversation.id
                        ? { ...conv, lastMessage: `Đã gửi ${files.length} tệp`, lastMessageTime: new Date() }
                        : conv
                )
            );
        } catch (error) {
            console.error('Failed to upload and send files:', error);
            // Remove pending message on error
            setMessages(prev => prev.filter(msg => msg.id !== tempId));
            alert('Không thể gửi tệp. Vui lòng thử lại.');
        }
    };

    const handleSelectConversation = (conversation: Conversation) => {
        setIsInitialLoading(true); // Start loading immediately
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

    // State for emoji picker
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Add imports at the top
    const handleEmojiClick = (emojiData: any) => {
        setInputMessage((prev) => prev + emojiData.emoji);
        // setShowEmojiPicker(false); // Optional: keep open for multiple emojis
    };

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showEmojiPicker && !(event.target as Element).closest('.emoji-picker-container')) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmojiPicker]);

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
                <div className="fixed bottom-4 right-6 w-[340px] h-[480px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
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
                            <div
                                ref={messagesContainerRef}
                                onScroll={handleScroll}
                                className="relative flex-1 overflow-y-auto p-3 bg-gradient-to-b from-gray-50 to-white space-y-2"
                            >
                                {/* Loading Overlay */}
                                {isInitialLoading && (
                                    <div className="absolute inset-0 bg-white z-10 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0b6459] border-t-transparent"></div>
                                    </div>
                                )}

                                {isFetchingMore && !isInitialLoading && (
                                    <div className="flex justify-center py-2">
                                        <div className="w-5 h-5 border-2 border-[#0b6459] border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}

                                {!isInitialLoading && messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                            <BsChatDotsFill className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <p className="text-gray-600 text-xs font-medium">Chưa có tin nhắn</p>
                                        <p className="text-gray-400 text-[10px] mt-1">Bắt đầu cuộc trò chuyện!</p>
                                    </div>
                                ) : (
                                    <>
                                        {[...messages].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()).map((message) => {
                                            return (
                                                <div
                                                    key={message.id}
                                                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`${message.type === 'IMAGE' || message.type === 'VIDEO' || message.type === 'FILE' ? 'w-[50%] max-w-[200px]' : 'max-w-[80%]'} rounded-2xl ${message.type === 'IMAGE' || message.type === 'VIDEO' || message.type === 'FILE' ? '' : 'px-3 py-2 shadow-sm'} ${message.type === 'IMAGE' || message.type === 'VIDEO' || message.type === 'FILE'
                                                            ? ''
                                                            : message.isOwn
                                                                ? 'bg-gradient-to-r from-[#0b6459] to-[#0d7a6c] text-white rounded-br-sm'
                                                                : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
                                                            }`}
                                                    >
                                                        {!message.isOwn && (
                                                            <p className={`text-[10px] font-semibold mb-0.5 text-[#0b6459] ${message.type === 'IMAGE' || message.type === 'VIDEO' ? 'px-3 pt-2' : ''}`}>
                                                                {message.senderName}
                                                            </p>
                                                        )}

                                                        {/* Loading state */}
                                                        {message.isLoading ? (
                                                            <div className="flex items-center gap-2 py-2">
                                                                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                                                <span className="text-xs opacity-80">
                                                                    {message.type === 'IMAGE' ? 'Đang gửi ảnh...' :
                                                                        message.type === 'VIDEO' ? 'Đang gửi video...' :
                                                                            `Đang gửi ${message.fileName || 'tệp'}...`}
                                                                </span>
                                                            </div>
                                                        ) : message.type === 'IMAGE' ? (
                                                            <div className="overflow-hidden rounded-2xl">
                                                                <a href={message.content.split('\n')[0]} target="_blank" rel="noopener noreferrer">
                                                                    <img
                                                                        src={message.content.split('\n')[0]}
                                                                        alt="Attached image"
                                                                        className="w-full h-auto object-cover hover:opacity-90 transition-opacity cursor-pointer"
                                                                        onError={(e) => {
                                                                            e.currentTarget.src = '/placeholder-image.png';
                                                                        }}
                                                                    />
                                                                </a>
                                                            </div>
                                                        ) : message.type === 'VIDEO' ? (
                                                            <div className="overflow-hidden rounded-2xl">
                                                                <video
                                                                    src={message.content.split('\n')[0]}
                                                                    controls
                                                                    className="w-full h-auto"
                                                                    preload="metadata"
                                                                >
                                                                    Your browser does not support video playback.
                                                                </video>
                                                            </div>
                                                        ) : message.type === 'FILE' ? (
                                                            <>
                                                                <a
                                                                    href={message.content.split('\n')[0]}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={`flex items-center gap-2 hover:opacity-80 transition-opacity px-3 py-2 rounded-2xl ${message.isOwn
                                                                        ? 'bg-gradient-to-r from-[#0b6459] to-[#0d7a6c] text-white'
                                                                        : 'bg-white border border-gray-100 text-gray-800'
                                                                        }`}
                                                                >
                                                                    <HiDocument className="w-5 h-5 flex-shrink-0" />
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-xs leading-relaxed truncate font-medium">
                                                                            {message.fileName || 'Tập tin'}
                                                                        </p>
                                                                        <p className={`text-[9px] ${message.isOwn ? 'text-white/60' : 'text-gray-400'}`}>Click để tải xuống</p>
                                                                    </div>
                                                                </a>
                                                                {!message.isLoading && (
                                                                    <p className="text-[9px] mt-1 px-3 text-gray-800">
                                                                        {formatTime(message.timestamp)}
                                                                    </p>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <p className="text-xs leading-relaxed">{message.content}</p>
                                                        )}

                                                        {/* Timestamp for IMAGE/VIDEO and TEXT messages */}
                                                        {!message.isLoading && (message.type === 'IMAGE' || message.type === 'VIDEO') && (
                                                            <p className="text-[9px] mt-1 px-3 pb-2 text-gray-800">
                                                                {formatTime(message.timestamp)}
                                                            </p>
                                                        )}
                                                        {!message.isLoading && message.type === 'TEXT' && (
                                                            <p className={`text-[9px] mt-1 ${message.isOwn ? 'text-white/70' : 'text-gray-400'}`}>
                                                                {formatTime(message.timestamp)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
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
                            <form onSubmit={handleSendMessage} className="p-2.5 border-t border-gray-100 bg-white relative">
                                <div className="flex items-center gap-2">
                                    <div className="relative file-dropdown-container">
                                        <button
                                            type="button"
                                            onClick={() => setShowFileDropdown(!showFileDropdown)}
                                            className="text-gray-400 hover:text-[#0b6459] transition-colors p-1"
                                            aria-label="Send file"
                                        >
                                            <HiPaperClip className="w-4 h-4" />
                                        </button>

                                        {/* Hidden File Inputs */}
                                        <input
                                            ref={imageInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={(e) => handleFileSelect(e, 'IMAGE')}
                                        />
                                        <input
                                            ref={videoInputRef}
                                            type="file"
                                            accept="video/*"
                                            className="hidden"
                                            onChange={(e) => handleFileSelect(e, 'VIDEO')}
                                        />
                                        <input
                                            ref={documentInputRef}
                                            type="file"
                                            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar"
                                            multiple
                                            className="hidden"
                                            onChange={(e) => handleFileSelect(e, 'FILE')}
                                        />

                                        {/* File Type Dropdown */}
                                        {showFileDropdown && (
                                            <div className="absolute bottom-full left-0 mb-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                                                <button
                                                    type="button"
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => imageInputRef.current?.click()}
                                                >
                                                    <HiPhotograph className="w-4 h-4 text-blue-500" />
                                                    <span>Ảnh</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => videoInputRef.current?.click()}
                                                >
                                                    <HiVideoCamera className="w-4 h-4 text-red-500" />
                                                    <span>Video</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => documentInputRef.current?.click()}
                                                >
                                                    <HiDocument className="w-4 h-4 text-green-500" />
                                                    <span>Tài liệu</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 relative emoji-picker-container">
                                        {/* Emoji Picker */}
                                        {showEmojiPicker && (
                                            <div className="fixed bottom-[75px] right-[40px] z-50 shadow-lg rounded-xl overflow-hidden bg-white">
                                                <EmojiPicker
                                                    onEmojiClick={handleEmojiClick}
                                                    width="270px"
                                                    height="300px"
                                                    autoFocusSearch={false}
                                                    skinTonesDisabled
                                                    searchDisabled={false}
                                                    searchPlaceHolder="Tìm kiếm emoji..."
                                                    previewConfig={{
                                                        showPreview: false
                                                    }}
                                                    categories={[
                                                        { category: 'suggested' as any, name: 'Gần đây' },
                                                        { category: 'smileys_people' as any, name: 'Cảm xúc & Con người' },
                                                        { category: 'animals_nature' as any, name: 'Động vật & Thiên nhiên' },
                                                        { category: 'food_drink' as any, name: 'Đồ ăn' },
                                                        { category: 'travel_places' as any, name: 'Du lịch' },
                                                        { category: 'activities' as any, name: 'Hoạt động' },
                                                        { category: 'objects' as any, name: 'Đồ vật' },
                                                        { category: 'symbols' as any, name: 'Ký hiệu' },
                                                        { category: 'flags' as any, name: 'Cờ' },
                                                    ]}
                                                    style={{
                                                        '--epr-emoji-size': '20px',
                                                        '--epr-search-input-text-size': '9px',
                                                        '--epr-category-label-fontsize': '10px',
                                                        '--epr-category-label-height': '26px',
                                                        '--epr-category-navigation-button-size': '18px',
                                                        '--epr-highlight-color': '#0b6459',
                                                        '--epr-category-icon-active-color': '#0b6459',
                                                        '--epr-active-category-icon-color': '#0b6459',
                                                    } as React.CSSProperties}
                                                />
                                            </div>
                                        )}
                                        <input
                                            type="text"
                                            value={inputMessage}
                                            onChange={handleInputChange}
                                            placeholder="Nhập tin nhắn..."
                                            className="w-full bg-gray-50 border border-gray-200 rounded-full px-3 py-2 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-[#0b6459]/20 focus:border-[#0b6459] transition-all placeholder:text-gray-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            className={`absolute right-2 top-1/2 transform -translate-y-1/2 transition-colors ${showEmojiPicker ? 'text-[#0b6459]' : 'text-gray-400 hover:text-[#0b6459]'}`}
                                            aria-label="Send emoji"
                                        >
                                            <HiEmojiHappy className="w-4 h-4" />
                                        </button>
                                    </div>
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
