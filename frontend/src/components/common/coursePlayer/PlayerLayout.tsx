// Layout for Course Player page. Swap slots when adapting to different templates.
import React from 'react';

type Props = {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
};

const PlayerLayout: React.FC<Props> = ({ left, center, right }) => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_320px] gap-6 items-start">
        {/* Left outline - sticky on desktop */}
        <aside className="lg:sticky lg:top-20 self-start">{left}</aside>

        {/* Center content */}
        <main>{center}</main>

        {/* Right sidebar - sticky on desktop; stacks below on small screens */}
        <aside className="lg:sticky lg:top-20 self-start">{right}</aside>
      </div>
    </div>
  );
};

export default PlayerLayout;


