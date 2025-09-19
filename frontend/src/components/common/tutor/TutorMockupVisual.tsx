// Hero visual image for tutor subscription. Uses tutor-specific banner image.
import React from 'react';

const TutorMockupVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-lg border">
      <img
        src="/media/student-subscriptions/tutor-banner.png"
        alt="Premium tutor packages banner"
        className="w-full h-auto"
        loading="lazy"
      />
    </div>
  );
};

export default TutorMockupVisual;
