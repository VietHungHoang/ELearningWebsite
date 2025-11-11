import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  pageColor?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, pageColor }) => {

  const style = {
    '--page-bg-color': pageColor || '##F8F7F4',
  } as React.CSSProperties;

  return (
    <div className="w-full mx-auto" style={style}>
      <Header />
      <main className="bg-[var(--page-bg-color)]">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;