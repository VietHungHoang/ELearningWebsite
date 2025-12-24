import React from 'react';

interface LoadingProps {
  size?: number;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 32, className = '' }) => {
  return (
    <div className={`flex items-center justify-center mt-12 ${className}`}>
      <div
        className="animate-spin rounded-full border-b-2 border-[#0b6459] mx-auto"
        style={{ width: size, height: size }}
      ></div>
    </div>
  );
};

export default Loading;