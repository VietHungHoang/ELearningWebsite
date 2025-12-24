import React, { createContext, useContext, useState } from 'react';

interface FullscreenContextType {
    isFullscreen: boolean;
    toggleFullscreen: () => void;
}

const FullscreenContext = createContext<FullscreenContextType | undefined>(undefined);

export const FullscreenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        setIsFullscreen(prev => !prev);
    };

    return (
        <FullscreenContext.Provider value={{ isFullscreen, toggleFullscreen }}>
            {children}
        </FullscreenContext.Provider>
    );
};

export const useFullscreen = () => {
    const context = useContext(FullscreenContext);
    if (!context) {
        throw new Error('useFullscreen must be used within FullscreenProvider');
    }
    return context;
};
