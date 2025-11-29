import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import type { DashboardLayoutProps } from '../config/dashboardConfigs';

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, sidebarOptions, headerProps }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex h-screen w-full bg-white">
      <DashboardSidebar options={sidebarOptions} isOpen={isSidebarOpen} onToggleSidebar={handleToggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader userInfo={headerProps.userInfo} />
        <main className="flex-1 overflow-y-auto bg-[#F8F7F4] p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;