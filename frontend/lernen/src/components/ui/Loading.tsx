import React from 'react';
import { FiLoader } from 'react-icons/fi';

interface LoadingProps {
  size?: number;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 24, className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <FiLoader size={size} className="animate-spin text-[#0b6459]" />
    </div>
  );
};

export default Loading;