import React from 'react';
import { GrCircleQuestion } from 'react-icons/gr';

interface TooltipProps {
    text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text }) => {
    return (
        <div className="relative">
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/80 text-white text-sm rounded-lg opacity-0 peer-hover:opacity-100 transition-opacity duration-200 z-30 w-64">
                <div className="flex items-center gap-2">
                    <GrCircleQuestion className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    <span>{text}</span>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/80"></div>
            </div>
            <GrCircleQuestion className="w-4 h-4 text-gray-500 cursor-help peer" />
        </div>
    );
};

export default Tooltip;