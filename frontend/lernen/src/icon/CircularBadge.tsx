import React from 'react';

export const CircularBadge: React.FC = () => (
  <svg viewBox="0 0 100 100" className="animate-spin-slow">
    <defs>
      <path id="circlePath" d="M 10, 50 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
    </defs>
    <circle cx="50" cy="50" r="48" fill="none" stroke="#fff" strokeWidth="1" />
    <g>
      <use href="#circlePath" fill="none" />
      <text fill="#fff" fontSize="9" fontWeight="bold" letterSpacing="2">
        <textPath href="#circlePath" startOffset="0%">
          EXPLORE & FIND THE BEST TUTOR • EXPLORE & FIND THE BEST TUTOR •
        </textPath>
      </text>
    </g>
    <circle cx="50" cy="50" r="30" fill="white" />
    <g transform="translate(38, 40)">
      <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.96491 14.1593L12.0003 19.3407L21.0356 14.1593M2.96491 5.8407L12.0003 0.659341L21.0356 5.8407L12.0003 11L2.96491 5.8407Z" stroke="#0b6459" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </g>
    {/* Fix: Removed the non-standard 'jsx' prop from the <style> tag to resolve the TypeScript error. */}
    <style>{`
      .animate-spin-slow {
        animation: spin 20s linear infinite;
      }
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </svg>
);
