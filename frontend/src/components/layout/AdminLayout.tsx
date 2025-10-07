import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import UserControls from './UserControls'

interface AdminLayoutProps {
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchShortcut?: string
  userControls?: any
  mainItems?: any[]
  additionalItems?: any[]
  children?: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  searchPlaceholder = 'Search users, courses...'
  , searchValue = ''
  , onSearchChange
  , searchShortcut = '⌘K'
  , userControls
  , mainItems = []
  , additionalItems = []
  , children
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-shrink-0">
        <Sidebar
          collapsed={isSidebarCollapsed}
          onToggle={handleToggleSidebar}
          walletBalance={undefined}
          onWithdraw={undefined}
          onSignOut={undefined}
          mainItems={mainItems}
          additionalItems={additionalItems}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          searchPlaceholder={searchPlaceholder}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          searchShortcut={searchShortcut}
          userControls={userControls || <UserControls />}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout


