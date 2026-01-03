import React from 'react';
import { BsChatDotsFill } from 'react-icons/bs';

interface ChatIconButtonProps {
    totalUnread: number;
    onClick: () => void;
}

const ChatIconButton: React.FC<ChatIconButtonProps> = ({ totalUnread, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-[#0b6459] to-[#0d7a6c] text-white rounded-full p-3.5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-50 group"
            aria-label="Open chat"
        >
            <BsChatDotsFill className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm animate-pulse">
                    {totalUnread}
                </span>
            )}
        </button>
    );
};

export default ChatIconButton;