import React from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import type { DashboardLayoutProps } from '../config/dashboardConfigs';
import type { BreadcrumbItem } from './Breadcrumb';
import { useFullscreen } from '../../../context/FullscreenContext';
import { useSidebar } from '../../../context/SidebarContext';

interface ExtendedDashboardLayoutProps extends DashboardLayoutProps {
  breadcrumb?: BreadcrumbItem[];
}

const DashboardLayout: React.FC<ExtendedDashboardLayoutProps> = ({ children, sidebarOptions, headerProps, breadcrumb }) => {
  const { isFullscreen } = useFullscreen();
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // If fullscreen mode, hide sidebar and header
  if (isFullscreen) {
    return (
      <div className="h-screen w-full bg-white">
        <main className="h-full w-full overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-white">
      <DashboardHeader userInfo={headerProps.userInfo} onToggleSidebar={handleToggleSidebar} breadcrumb={breadcrumb} isSidebarOpen={isSidebarOpen} />
      <div className="flex h-[calc(100vh-3.5rem)]">
        <DashboardSidebar options={sidebarOptions} isOpen={isSidebarOpen} />
        <div className="flex-1 overflow-visible py-2 pr-4 pl-8 bg-[#f7f7f8]">
          <main className="h-full overflow-y-auto custom-scrollbar-main bg-white rounded-2xl shadow-2xl border border-gray-100 -ml-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;