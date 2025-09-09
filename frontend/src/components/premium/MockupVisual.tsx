// Hero visual image. Replaces mock blocks with a static banner image.
import React from 'react';

const MockupVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-lg border">
      <img
        src="/media/student-subscriptions/student-banner.png"
        alt="Premium student packages banner"
        className="w-full h-auto"
        loading="lazy"
      />
    </div>
  );
};

export default MockupVisual;


