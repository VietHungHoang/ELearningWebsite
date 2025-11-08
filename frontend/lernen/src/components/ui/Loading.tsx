import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface LoadingProps {
  size?: number;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 32, className = '' }) => {
  return (
    <div className={`flex items-center justify-center mt-12 ${className}`}>
      <AiOutlineLoading3Quarters size={size} className="animate-spin text-[#0b6459]" />
    </div>
  );
};

export default Loading;