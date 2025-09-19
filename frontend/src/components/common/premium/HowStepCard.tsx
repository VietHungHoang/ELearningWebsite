// A single step card inside the How It Works section.
import React from 'react';

const HowStepCard: React.FC<{ step: string; title: string; description: string; children?: React.ReactNode }> = ({ step, title, description, children }) => {
  return (
    <div className="bg-[#f6fbf9] rounded-xl p-6 shadow-sm">
      <div className="text-[10px] uppercase tracking-wider text-gray-500">{step}</div>
      <h3 className="mt-1 font-semibold">{title}</h3>
      <div className="mt-3">{children}</div>
      <p className="mt-3 text-sm text-gray-700">{description}</p>
    </div>
  );
};

export default HowStepCard;


