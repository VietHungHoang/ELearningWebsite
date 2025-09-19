import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import UserControls from './UserControls';
// import { QuizProvider } from '../../contexts/QuizContext' // Removed - using new quiz system;

interface TutorLayoutProps {
  walletBalance?: number;
  onWithdraw?: () => void;
  onSignOut?: () => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchShortcut?: string;
  userControls?: any;
  mainItems?: any[];
  additionalItems?: any[];
  children?: React.ReactNode;
}

const TutorLayout: React.FC<TutorLayoutProps> = ({
  walletBalance = 0,
  onWithdraw,
  onSignOut,
  searchPlaceholder = "Search courses, tutors...",
  searchValue = "",
  onSearchChange,
  searchShortcut = "⌘K",
  userControls,
  mainItems = [],
  additionalItems = [],
  children
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Sidebar
          collapsed={isSidebarCollapsed}
          onToggle={handleToggleSidebar}
          walletBalance={walletBalance}
          onWithdraw={onWithdraw}
          onSignOut={onSignOut}
          mainItems={mainItems}
          additionalItems={additionalItems}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          searchPlaceholder={searchPlaceholder}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          searchShortcut={searchShortcut}
          userControls={userControls}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default TutorLayout;
