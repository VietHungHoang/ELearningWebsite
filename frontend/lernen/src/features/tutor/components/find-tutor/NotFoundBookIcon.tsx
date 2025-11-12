import React from 'react';

export const NotFoundBookIcon: React.FC = () => (
    <div className="relative w-32 h-32 flex items-center justify-center mb-4">
        {/* Decorative elements from the image */}
        <div className="absolute top-12 left-0 w-2.5 h-2.5 rounded-full bg-purple-300 opacity-80"></div>
        <div className="absolute top-4 left-8 w-3 h-3 rounded-full border border-gray-400 opacity-80"></div>
        <div className="absolute top-8 right-0 text-2xl text-yellow-400 opacity-90">&#10022;</div> {/* Star */}
        <div className="absolute bottom-12 right-2 w-3 h-3 rounded-full bg-teal-200 opacity-80"></div>
        <div className="absolute bottom-8 left-2 text-2xl text-yellow-400 opacity-90 transform -rotate-12">&#10022;</div> {/* Star */}
        
        {/* The book SVG */}
        <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M51.2 53.3333H12.8C11.0327 53.3333 9.6 51.8973 9.6 50.1333V13.8667C9.6 12.1027 11.0327 10.6667 12.8 10.6667H32H51.2C52.9673 10.6667 54.4 12.1027 54.4 13.8667V50.1333C54.4 51.8973 52.9673 53.3333 51.2 53.3333Z" fill="#6EE7B7"/>
            <path d="M32 10.6667V53.3333L9.6 50.1333V13.8667L32 10.6667Z" fill="#34D399"/>
        </svg>
    </div>
);
