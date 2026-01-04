import React, { useRef, useState, useLayoutEffect } from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    const updateScale = () => {
      if (!contentRef.current) return;

      const viewportHeight = window.innerHeight;
      const padding = 32; // 16px top + 16px bottom
      const availableHeight = viewportHeight - padding;

      // Temporarily show at scale 1 to measure
      contentRef.current.style.transform = 'scale(1)';
      contentRef.current.style.visibility = 'hidden';

      const contentHeight = contentRef.current.getBoundingClientRect().height;
      const newScale = Math.min(1, availableHeight / contentHeight);

      setScale(newScale);
      contentRef.current.style.transform = `scale(${newScale})`;
      contentRef.current.style.visibility = 'visible';
      setIsReady(true);
    };

    updateScale();
    window.addEventListener('resize', updateScale);

    return () => {
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  return (
    <div className="h-screen flex items-center justify-center py-4 overflow-hidden">
      <div
        ref={contentRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          opacity: isReady ? 1 : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;