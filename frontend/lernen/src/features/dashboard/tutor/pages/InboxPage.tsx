import React, { useState, useMemo, useRef, useEffect } from 'react';
import { HiSearch, HiPhone, HiVideoCamera, HiPaperAirplane } from 'react-icons/hi';

interface Message {
  id: number;
  text: string;
  timestamp: string;
  sender: 'me' | 'them';
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
        messages: [
            { id: 1, text: 'Thanks for the help with the project!', timestamp: 'Yesterday 1:00 PM', sender: 'me' },
            { id: 2, text: "You're welcome!", timestamp: 'Yesterday 1:02 PM', sender: 'them' },
        ]
    }
];

const ContactListItem: React.FC<{ conv: Conversation; isActive: boolean; onClick: () => void; }> = ({ conv, isActive, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-start gap-4 p-3 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-[#F9F3EB]' : 'hover:bg-gray-50'}`}
    >
        <div className="relative flex-shrink-0">
            <img src={conv.contactAvatar} alt={conv.contactName} className="w-12 h-12 rounded-full" />
            {conv.onlineStatus === 'Online' && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
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
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation?.messages]);

    if (!conversation) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                <h3 className="text-lg font-semibold">Select a conversation</h3>
                <p className="text-sm">Start by choosing a contact from the list on the left.</p>
            </div>
        );
    }

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if(newMessage.trim() === '') return;
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
                        <p className="text-xs text-gray-500">{conversation.onlineStatus}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><HiPhone className="w-5 h-5" /></button>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><HiVideoCamera className="w-5 h-5" /></button>
                </div>
            </div>
            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                <div className="space-y-6">
                    {conversation.messages.map(msg => (
                        <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'them' && <img src={conversation.contactAvatar} className="w-6 h-6 rounded-full" />}
                            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${msg.sender === 'me' ? 'bg-[#0b6459] text-white rounded-br-lg' : 'bg-gray-100 text-gray-800 rounded-bl-lg'}`}>
                                <p className="text-sm">{msg.text}</p>
                                <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-gray-200' : 'text-gray-500'} text-right`}>{msg.timestamp}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div ref={messagesEndRef} />
            </div>
            {/* Input */}
            <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="relative">
                    <input 
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-gray-100 border-transparent rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b6459]"
                    />
                    <button type="submit" className="absolute inset-y-0 right-0 px-4 text-gray-500 hover:text-[#0b6459]">
                        <HiPaperAirplane className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

interface InboxContentProps {
    initialSelectedStudentId?: number | null;
}

const InboxContent: React.FC<InboxContentProps> = ({ initialSelectedStudentId }) => {
    const [conversations, setConversations] = useState(mockConversations);
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(initialSelectedStudentId || (mockConversations.length > 0 ? mockConversations[0].id : null));
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (initialSelectedStudentId && initialSelectedStudentId !== selectedConversationId) {
            // Check if a conversation with this student exists, if not, create a mock one.
            const conversationExists = conversations.some(c => c.id === initialSelectedStudentId);
            if(conversationExists) {
                setSelectedConversationId(initialSelectedStudentId);
            }
        }
    }, [initialSelectedStudentId, conversations, selectedConversationId]);

    const filteredConversations = useMemo(() => {
        return conversations.filter(conv =>
            conv.contactName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [conversations, searchTerm]);

    const selectedConversation = useMemo(() => {
        return conversations.find(c => c.id === selectedConversationId) || null;
    }, [conversations, selectedConversationId]);

    return (
        <div className="flex h-[calc(100vh-120px)] bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Left Pane: Contact List */}
            <div className="w-full md:w-1/3 xl:w-1/4 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Inbox</h2>
                    <div className="relative mt-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <HiSearch className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b6459]"
                        />
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
            <div className="hidden md:flex w-2/3 xl:w-3/4 flex-col">
                <ChatWindow conversation={selectedConversation} />
            </div>
        </div>
    );
};

export default InboxContent;