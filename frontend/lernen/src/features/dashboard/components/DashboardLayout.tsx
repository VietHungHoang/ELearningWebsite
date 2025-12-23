import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import type { DashboardLayoutProps } from '../config/dashboardConfigs';
import type { BreadcrumbItem } from './Breadcrumb';

interface ExtendedDashboardLayoutProps extends DashboardLayoutProps {
    breadcrumb?: BreadcrumbItem[];
}

const DashboardLayout: React.FC<ExtendedDashboardLayoutProps> = ({ children, sidebarOptions, headerProps, breadcrumb }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="h-screen w-full bg-white">
      <DashboardHeader userInfo={headerProps.userInfo} onToggleSidebar={handleToggleSidebar} breadcrumb={breadcrumb} isSidebarOpen={isSidebarOpen} />
      <div className="flex h-[calc(100vh-3.5rem)]">
        <DashboardSidebar options={sidebarOptions} isOpen={isSidebarOpen} />
        <div className="flex-1 overflow-visible py-2 pr-4 pl-8 bg-[#f7f7f8]">
          <main className="h-full overflow-y-auto custom-scrollbar-main bg-white rounded-2xl shadow-2xl border border-gray-100 lg:p-1.5 -ml-8">
              {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;