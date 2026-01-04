import React from 'react';

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ children }) => {
  return (
        <div className="min-h-screen flex items-start justify-center py-4 overflow-auto bg-[#F8F7F4]">
      <div className="relative w-full max-w-5xl mx-auto my-8 bg-white rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default OnboardingLayout;

