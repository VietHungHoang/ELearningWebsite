import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    type: 'error' | 'success';
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Auto-close after 3 seconds

        return () => {
            clearTimeout(timer);
        };
    }, [onClose]);

    const typeStyles = {
        error: {
            container: 'bg-red-100 border-red-400 text-red-700',
            icon: <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>,
            buttonHover: 'hover:bg-red-200'
        },
        success: {
            container: 'bg-green-100 border-green-400 text-green-700',
            icon: <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>,
            buttonHover: 'hover:bg-green-200'
        },
    };
    
    const currentStyle = typeStyles[type];

    return (
        <>
        <style>{`
            @keyframes slide-in {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .animate-slide-in {
                animation: slide-in 0.5s ease-out forwards;
            }
        `}</style>
        <div className={`fixed top-20 right-5 z-[100] px-4 py-3 rounded-lg shadow-lg flex items-center border transition-transform transform animate-slide-in ${currentStyle.container}`}>
            {currentStyle.icon}
            <span className="font-medium">{message}</span>
            <button onClick={onClose} className={`ml-4 -mr-1 p-1 rounded-full text-xl font-semibold leading-none transition-colors duration-150 ${currentStyle.buttonHover}`}>&times;</button>
        </div>
        </>
    );
};

export default Toast;
