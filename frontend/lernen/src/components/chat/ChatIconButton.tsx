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
            className="fixed bottom-6 right-6 bg-[#0b6459] text-white rounded-full p-4 shadow-lg hover:bg-[#084c43] transition-all duration-300 hover:scale-110 z-50"
            aria-label="Open chat"
        >
            <BsChatDotsFill className="w-6 h-6" />
            {totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {totalUnread}
                </span>
            )}
        </button>
    );
};

export default ChatIconButton;