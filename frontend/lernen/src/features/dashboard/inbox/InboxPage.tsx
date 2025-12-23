import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HiSearch, HiCog, HiPaperAirplane, HiUser, HiUsers, HiPlus, HiPhotograph, HiDocument, HiVideoCamera, HiX } from 'react-icons/hi';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import Breadcrumb, { type BreadcrumbItem } from '../components/Breadcrumb';

interface Message {
    id: number;
    text: string;
    timestamp: string;
    sender: 'me' | 'them';
    senderName?: string; // For group chats
}

interface Conversation {
    id: number;
    contactName: string;
    contactAvatar: string;
    onlineStatus: 'Online' | 'Offline';
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    messages: Message[];
    type: 'private' | 'group';
}

const mockConversations: Conversation[] = [
    {
        id: 1,
        contactName: 'Cynthia Hunter',
        contactAvatar: 'https://picsum.photos/seed/cynthia/48/48',
        onlineStatus: 'Online',
        lastMessage: "Of course! I'll get it ready for you.",
        lastMessageTime: '10:30 AM',
        unreadCount: 2,
        type: 'private',
        messages: [
            { id: 1, text: "Hey Cynthia, how's it going?", timestamp: '10:25 AM', sender: 'me' },
            { id: 2, text: "Hi Sarah! I'm doing well, thanks. How about you?", timestamp: '10:26 AM', sender: 'them' },
            { id: 3, text: "I'm good! Just wanted to check if you had a chance to look over my essay draft.", timestamp: '10:28 AM', sender: 'me' },
            { id: 4, text: "I did! I've added some comments. Would you like me to send it over?", timestamp: '10:29 AM', sender: 'them' },
            { id: 5, text: "Yes, please! That would be great.", timestamp: '10:29 AM', sender: 'me' },
            { id: 6, text: "Of course! I'll get it ready for you.", timestamp: '10:30 AM', sender: 'them' },
        ]
    },
    {
        id: 2,
        contactName: 'Steven Ford',
        contactAvatar: 'https://picsum.photos/seed/steven/48/48',
        onlineStatus: 'Offline',
        lastMessage: "Let's discuss it during our next session.",
        lastMessageTime: 'Yesterday',
        unreadCount: 0,
        type: 'private',
        messages: [
            { id: 1, text: "Hi Steven, I have a question about the physics problem from yesterday.", timestamp: 'Yesterday 3:15 PM', sender: 'me' },
            { id: 2, text: "Sure, what's on your mind?", timestamp: 'Yesterday 3:20 PM', sender: 'them' },
            { id: 3, text: "I'm stuck on the second part. Can we go over it?", timestamp: 'Yesterday 3:21 PM', sender: 'me' },
            { id: 4, text: "Let's discuss it during our next session.", timestamp: 'Yesterday 3:25 PM', sender: 'them' },
        ]
    },
    {
        id: 3,
        contactName: 'Antony Clara',
        contactAvatar: 'https://picsum.photos/seed/antonyC/48/48',
        onlineStatus: 'Online',
        lastMessage: "You're welcome!",
        lastMessageTime: 'Yesterday',
        unreadCount: 0,
        type: 'private',
        messages: [
            { id: 1, text: 'Thanks for the help with the project!', timestamp: 'Yesterday 1:00 PM', sender: 'me' },
            { id: 2, text: "You're welcome!", timestamp: 'Yesterday 1:02 PM', sender: 'them' },
        ]
    },
    {
        id: 4,
        contactName: 'Math Study Group',
        contactAvatar: 'https://picsum.photos/seed/mathgroup/48/48',
        onlineStatus: 'Online',
        lastMessage: "Don't forget about tomorrow's quiz!",
        lastMessageTime: '2 hours ago',
        unreadCount: 1,
        type: 'group',
        messages: [
            { id: 1, text: "Hey everyone! How's everyone preparing for the calculus exam?", timestamp: 'Yesterday 4:00 PM', sender: 'them', senderName: 'Sarah' },
            { id: 2, text: "I'm still struggling with integration by parts. Any tips?", timestamp: 'Yesterday 4:15 PM', sender: 'me' },
            { id: 3, text: "Try remembering the ILATE rule for integration by parts!", timestamp: 'Yesterday 4:20 PM', sender: 'them', senderName: 'Mike' },
            { id: 4, text: "ILATE stands for:", timestamp: 'Yesterday 4:21 PM', sender: 'them', senderName: 'Mike' },
            { id: 5, text: "Inverse, Logarithmic, Algebraic, Trigonometric, Exponential", timestamp: 'Yesterday 4:22 PM', sender: 'them', senderName: 'Mike' },
            { id: 6, text: "It helps you choose which function to differentiate first", timestamp: 'Yesterday 4:23 PM', sender: 'them', senderName: 'Mike' },
            { id: 7, text: "ILATE? What's that?", timestamp: 'Yesterday 4:25 PM', sender: 'them', senderName: 'Alex' },
            { id: 8, text: "Oh that makes sense! Thanks Mike!", timestamp: 'Yesterday 4:35 PM', sender: 'them', senderName: 'Alex' },
            { id: 9, text: "No problem! Does anyone want to do a quick review session tonight?", timestamp: 'Yesterday 4:40 PM', sender: 'them', senderName: 'Sarah' },
            { id: 10, text: "I'm in! What time works for everyone?", timestamp: 'Yesterday 4:45 PM', sender: 'me' },
            { id: 11, text: "How about 8 PM? I can share my screen with practice problems", timestamp: 'Yesterday 4:50 PM', sender: 'them', senderName: 'Mike' },
            { id: 12, text: "Perfect! See you all then 🎯", timestamp: 'Yesterday 4:55 PM', sender: 'them', senderName: 'Sarah' },
            { id: 13, text: "Hey guys, I found this great video explaining derivatives. Check it out: https://youtube.com/watch?v=...", timestamp: 'Today 10:00 AM', sender: 'them', senderName: 'Mike' },
            { id: 14, text: "Thanks Mike! That really helped clarify some concepts", timestamp: 'Today 10:15 AM', sender: 'me' },
            { id: 15, text: "Anyone have the practice exam answers? I want to check my work", timestamp: 'Today 11:30 AM', sender: 'them', senderName: 'Alex' },
            { id: 16, text: "I think Prof. Johnson posted them on the class portal", timestamp: 'Today 11:35 AM', sender: 'them', senderName: 'Sarah' },
            { id: 17, text: "Found them! For problem 3, I got 2x + C but the answer shows x² + C", timestamp: 'Today 12:00 PM', sender: 'them', senderName: 'Alex' },
            { id: 18, text: "Wait, that doesn't seem right. Let me double-check...", timestamp: 'Today 12:05 PM', sender: 'me' },
            { id: 19, text: "Oh I see! It's the integral of 2x dx, not x². My bad!", timestamp: 'Today 12:10 PM', sender: 'them', senderName: 'Alex' },
            { id: 20, text: "Phew! I thought I was losing my mind there 😂", timestamp: 'Today 12:15 PM', sender: 'them', senderName: 'Sarah' },
            { id: 21, text: "Don't forget about tomorrow's quiz! Good luck everyone! 📚", timestamp: '2 hours ago', sender: 'them', senderName: 'Mike' },
        ]
    },
    {
        id: 5,
        contactName: 'English Literature Club',
        contactAvatar: 'https://picsum.photos/seed/englishclub/48/48',
        onlineStatus: 'Offline',
        lastMessage: "The next meeting is on Friday at 3 PM.",
        lastMessageTime: '1 day ago',
        unreadCount: 0,
        type: 'group',
        messages: [
            { id: 1, text: "Hi everyone! Just a reminder about our next book discussion.", timestamp: '3 days ago 2:00 PM', sender: 'them', senderName: 'Emma' },
            { id: 2, text: "What book are we discussing this time?", timestamp: '3 days ago 2:05 PM', sender: 'me' },
            { id: 3, text: "We're doing 'To Kill a Mockingbird' by Harper Lee", timestamp: '3 days ago 2:10 PM', sender: 'them', senderName: 'David' },
            { id: 4, text: "Oh I love that book! The themes of racism and justice are so powerful", timestamp: '3 days ago 2:15 PM', sender: 'them', senderName: 'Lisa' },
            { id: 5, text: "I finished it last night. Atticus Finch is such an amazing character", timestamp: '3 days ago 2:20 PM', sender: 'them', senderName: 'Emma' },
            { id: 6, text: "Has anyone noticed how Scout's perspective changes throughout the story?", timestamp: '3 days ago 2:25 PM', sender: 'me' },
            { id: 7, text: "Definitely! Her innocence at the beginning vs her understanding at the end", timestamp: '3 days ago 2:30 PM', sender: 'them', senderName: 'David' },
            { id: 8, text: "The symbolism of the mockingbird is beautiful. 'Mockingbirds don't do one thing but make music for us to enjoy'", timestamp: '3 days ago 2:35 PM', sender: 'them', senderName: 'Lisa' },
            { id: 9, text: "I wonder if Boo Radley represents misunderstood people in society", timestamp: '3 days ago 2:40 PM', sender: 'them', senderName: 'Emma' },
            { id: 10, text: "Great point! He's feared but actually protective", timestamp: '3 days ago 2:45 PM', sender: 'me' },
            { id: 11, text: "Anyone bringing snacks for the meeting? 🍪", timestamp: '2 days ago 10:00 AM', sender: 'them', senderName: 'David' },
            { id: 12, text: "I'll bring some cookies! What time does the meeting start?", timestamp: '2 days ago 10:15 AM', sender: 'them', senderName: 'Lisa' },
            { id: 13, text: "3 PM in the library conference room", timestamp: '2 days ago 10:20 AM', sender: 'them', senderName: 'Emma' },
            { id: 14, text: "Should we prepare discussion questions in advance?", timestamp: '2 days ago 10:25 AM', sender: 'me' },
            { id: 15, text: "Good idea! I'll make a list and share it here", timestamp: '2 days ago 10:30 AM', sender: 'them', senderName: 'David' },
            { id: 16, text: "1. How does the novel address racial injustice?", timestamp: '2 days ago 11:00 AM', sender: 'them', senderName: 'David' },
            { id: 17, text: "2. What role does empathy play in the story?", timestamp: '2 days ago 11:05 AM', sender: 'them', senderName: 'David' },
            { id: 18, text: "3. How does Harper Lee use symbolism throughout the book?", timestamp: '2 days ago 11:10 AM', sender: 'them', senderName: 'David' },
            { id: 19, text: "4. What lessons can we learn from Atticus's parenting?", timestamp: '2 days ago 11:15 AM', sender: 'them', senderName: 'David' },
            { id: 20, text: "These are great questions! I'm excited for the discussion", timestamp: '2 days ago 11:20 AM', sender: 'me' },
            { id: 21, text: "Me too! See everyone tomorrow 📖", timestamp: '2 days ago 11:25 AM', sender: 'them', senderName: 'Lisa' },
            { id: 22, text: "Hi everyone! Just a reminder about our next book discussion.", timestamp: '1 day ago 2:00 PM', sender: 'them', senderName: 'Emma' },
            { id: 23, text: "The book is 'To Kill a Mockingbird' by Harper Lee", timestamp: '1 day ago 2:01 PM', sender: 'them', senderName: 'Emma' },
            { id: 24, text: "Meeting is at 3 PM in the library conference room", timestamp: '1 day ago 2:02 PM', sender: 'them', senderName: 'Emma' },
            { id: 25, text: "Don't forget to bring your discussion questions!", timestamp: '1 day ago 2:03 PM', sender: 'them', senderName: 'Emma' },
            { id: 26, text: "The next meeting is on Friday at 3 PM.", timestamp: '1 day ago 2:05 PM', sender: 'them', senderName: 'Emma' },
        ]
    }
];

const ContactListItem: React.FC<{ conv: Conversation; isActive: boolean; onClick: () => void; }> = ({ conv, isActive, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-start gap-4 p-3 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-[#F9F3EB]' : 'hover:bg-gray-50'}`}
    >
        <div className="relative flex-shrink-0">
            <img src={conv.contactAvatar} alt={conv.contactName} className="w-10 h-10 rounded-full" />
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

const ChatWindow: React.FC<{ conversation: Conversation | null }> = ({ conversation }) => {
    const { t } = useTranslation();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const attachmentRef = useRef<HTMLDivElement>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isAttachmentPanelOpen, setIsAttachmentPanelOpen] = useState(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation?.messages]);

    // Close attachment panel when clicking outside
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
                <h3 className="text-lg font-semibold">{t('dashboard.inbox.empty.title')}</h3>
                <p className="text-sm">{t('dashboard.inbox.empty.description')}</p>
            </div>
        );
    }

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;
        // This is where you would typically send the message to a backend.
        // For this mock, we'll just log it.
        console.log("Sending message:", newMessage);
        setNewMessage('');
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <img src={conversation.contactAvatar} alt={conversation.contactName} className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="font-bold text-gray-800">{conversation.contactName}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {conversation.onlineStatus === 'Online' ? t('dashboard.inbox.status.online') : t('dashboard.inbox.status.offline')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <HiCog className="w-5 h-5" />
                    </button>
                </div>
            </div>
            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-gray-50">
                <div className="">
                    {conversation.messages.map((msg, index) => {
                        const prevMsg = index > 0 ? conversation.messages[index - 1] : null;
                        const isSameSender = prevMsg && (
                            (msg.sender === 'me' && prevMsg.sender === 'me') ||
                            (msg.sender === 'them' && prevMsg.sender === 'them' &&
                                (conversation.type === 'private' || msg.senderName === prevMsg.senderName))
                        );

                        return (
                            <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} mb-1 ${!isSameSender && index > 0 ? 'mt-4' : ''}`}>
                                {msg.sender === 'them' && !isSameSender && <img src={conversation.contactAvatar} className="w-6 h-6 rounded-full" />}
                                {msg.sender === 'them' && isSameSender && <div className="w-6" />} {/* Spacer for alignment */}
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
                </div>
                <div ref={messagesEndRef} />
            </div>
            {/* Input */}
            <div className="p-3 border-t border-gray-200 relative" ref={attachmentRef}>
                {/* Attachment Panel */}
                {isAttachmentPanelOpen && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 w-40">
                        <div className="flex flex-col gap-1">
                            <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <HiPhotograph className="w-5 h-5 text-blue-500" />
                                <span className="text-sm text-gray-700">{t('dashboard.inbox.attachments.photo')}</span>
                            </button>
                            <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <HiVideoCamera className="w-5 h-5 text-red-500" />
                                <span className="text-sm text-gray-700">{t('dashboard.inbox.attachments.video')}</span>
                            </button>
                            <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <HiDocument className="w-5 h-5 text-green-500" />
                                <span className="text-sm text-gray-700">{t('dashboard.inbox.attachments.document')}</span>
                            </button>
                            <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <HiUser className="w-5 h-5 text-purple-500" />
                                <span className="text-sm text-gray-700">{t('dashboard.inbox.attachments.contact')}</span>
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
                        placeholder={t('dashboard.inbox.messagePlaceholder')}
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

interface InboxContentProps {
    initialSelectedStudentId?: number | null;
}

const InboxPage: React.FC<InboxContentProps> = ({ initialSelectedStudentId }) => {
    const { t } = useTranslation();
    const { setBreadcrumb } = useBreadcrumb();
    const [conversations, setConversations] = useState(mockConversations);
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(initialSelectedStudentId || (mockConversations.length > 0 ? mockConversations[0].id : null));
    const [searchTerm, setSearchTerm] = useState('');
    const [messageTypeFilter, setMessageTypeFilter] = useState<'all' | 'private' | 'group'>('all');
    const [isSettingsSidebarOpen, setIsSettingsSidebarOpen] = useState(false);

    useEffect(() => {
        const breadcrumbItems: BreadcrumbItem[] = [
            { label: t('dashboard.header.breadcrumb.dashboard'), path: '/dashboard' },
            { label: t('dashboard.inbox.title'), isActive: true }
        ];
        setBreadcrumb(breadcrumbItems);
    }, [setBreadcrumb, t]);

    useEffect(() => {
        if (initialSelectedStudentId && initialSelectedStudentId !== selectedConversationId) {
            // Check if a conversation with this student exists, if not, create a mock one.
            const conversationExists = conversations.some(c => c.id === initialSelectedStudentId);
            if (conversationExists) {
                setSelectedConversationId(initialSelectedStudentId);
            }
        }
    }, [initialSelectedStudentId, conversations, selectedConversationId]);

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

    return (
        <div className="flex flex-col h-full">
            <div className="flex bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Left Pane: Contact List */}
                <div className="w-full md:w-2/5 xl:w-1/3 max-w-sm border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">{t('dashboard.inbox.title')}</h2>
                        <div className="relative mt-4">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <HiSearch className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder={t('dashboard.inbox.searchPlaceholder')}
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
                                {t('dashboard.inbox.filters.all')}
                            </button>
                            <button
                                onClick={() => setMessageTypeFilter('private')}
                                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${messageTypeFilter === 'private'
                                    ? 'bg-[#0b6459] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {t('dashboard.inbox.filters.private')}
                            </button>
                            <button
                                onClick={() => setMessageTypeFilter('group')}
                                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${messageTypeFilter === 'group'
                                    ? 'bg-[#0b6459] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {t('dashboard.inbox.filters.group')}
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 p-2 overflow-y-auto custom-scrollbar">
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
                    </div>
                </div>

                {/* Right Pane: Chat Window */}
                <div className="hidden md:flex w-3/5 xl:w-2/3 flex-col relative">
                    <ChatWindow
                        conversation={selectedConversation}
                    />

                    {/* Settings Sidebar Overlay */}
                    {isSettingsSidebarOpen && (
                        <div
                            className="absolute inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300"
                            onClick={() => setIsSettingsSidebarOpen(false)}
                        />
                    )}

                    {/* Settings Sidebar */}
                    <div
                        className={`absolute top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-out z-50 ${isSettingsSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                            }`}
                    >
                        {selectedConversation && (
                            <div className="flex flex-col h-full">
                                {/* Sidebar Header */}
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-800">{t('dashboard.inbox.settings.title')}</h3>
                                        <button
                                            onClick={() => setIsSettingsSidebarOpen(false)}
                                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={selectedConversation.contactAvatar}
                                            alt={selectedConversation.contactName}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div>
                                            <p className="font-bold text-gray-800">{selectedConversation.contactName}</p>
                                            <p className="text-sm text-gray-500">{selectedConversation.onlineStatus === 'Online' ? t('dashboard.inbox.status.online') : t('dashboard.inbox.status.offline')}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Settings Options */}
                                <div className="flex-1 p-6 overflow-y-auto">
                                    <div className="space-y-6">
                                        {/* Notifications */}
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('dashboard.inbox.settings.notifications.title')}</h4>
                                            <div className="space-y-3">
                                                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                                                    <span className="text-sm text-gray-700">{t('dashboard.inbox.settings.notifications.enable')}</span>
                                                    <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0b6459] rounded focus:ring-[#0b6459]" />
                                                </label>
                                                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                                                    <span className="text-sm text-gray-700">{t('dashboard.inbox.settings.notifications.sound')}</span>
                                                    <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0b6459] rounded focus:ring-[#0b6459]" />
                                                </label>
                                            </div>
                                        </div>

                                        {/* Privacy */}
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('dashboard.inbox.settings.privacy.title')}</h4>
                                            <div className="space-y-3">
                                                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                                                    <span className="text-sm text-gray-700">{t('dashboard.inbox.settings.privacy.showStatus')}</span>
                                                    <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0b6459] rounded focus:ring-[#0b6459]" />
                                                </label>
                                                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                                                    <span className="text-sm text-gray-700">{t('dashboard.inbox.settings.privacy.readReceipts')}</span>
                                                    <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0b6459] rounded focus:ring-[#0b6459]" />
                                                </label>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('dashboard.inbox.settings.actions.title')}</h4>
                                            <div className="space-y-2">
                                                <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <span className="text-sm text-gray-700">{t('dashboard.inbox.settings.actions.mute')}</span>
                                                </button>
                                                <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <span className="text-sm text-gray-700">{t('dashboard.inbox.settings.actions.archive')}</span>
                                                </button>
                                                <button className="w-full text-left px-4 py-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                                                    <span className="text-sm text-red-600 font-medium">{t('dashboard.inbox.settings.actions.block')}</span>
                                                </button>
                                                <button className="w-full text-left px-4 py-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                                                    <span className="text-sm text-red-600 font-medium">{t('dashboard.inbox.settings.actions.clearHistory')}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InboxPage;