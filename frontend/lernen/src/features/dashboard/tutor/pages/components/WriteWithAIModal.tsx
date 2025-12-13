import React, { useState, useEffect } from 'react';
import { HiX, HiSparkles, HiPaperAirplane } from 'react-icons/hi';

interface WriteWithAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WriteWithAIModal: React.FC<WriteWithAIModalProps> = ({ isOpen, onClose }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = 'auto';
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'bg-black/60 opacity-100' : 'opacity-0'}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <style>{`
        @keyframes modal-in {
          from { transform: translateY(20px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-modal-in { animation: modal-in 0.3s ease-out forwards; }
        
        @keyframes modal-out {
          from { transform: translateY(0) scale(1); opacity: 1; }
          to { transform: translateY(20px) scale(0.95); opacity: 0; }
        }
        .animate-modal-out { animation: modal-out 0.3s ease-out forwards; }
      `}</style>
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-2xl m-4 ${isOpen ? 'animate-modal-in' : 'animate-modal-out'}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <HiSparkles className="w-5 h-5 text-purple-600" />
            <h2 className="font-semibold text-gray-800">Write with AI</h2>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 sm:p-12 text-center">
            <div className="inline-block p-3 bg-gray-100 rounded-full">
                <HiSparkles className="w-10 h-10 text-purple-600" />
            </div>
            <p className="mt-4 text-lg font-medium text-gray-700">Write with AI</p>

            <div className="mt-8 relative p-[1.5px] rounded-xl bg-gradient-to-r from-[#8A2BE2] via-[#FF00FF] to-[#00BFFF] focus-within:ring-2 focus-within:ring-purple-400 focus-within:ring-offset-2">
                <div className="relative bg-white rounded-[11px] flex items-center">
                    <input
                        type="text"
                        placeholder="What would you like AI to write about?"
                        className="w-full bg-transparent px-4 py-3 text-gray-800 placeholder-gray-400 border-none focus:outline-none focus:ring-0"
                    />
                    <button className="flex-shrink-0 mr-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        <HiPaperAirplane className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WriteWithAIModal;
