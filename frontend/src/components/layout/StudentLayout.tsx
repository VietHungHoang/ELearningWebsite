import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

interface SidebarItemType {
  icon: React.ComponentType<{ className?: string }>
  label: string
  path: string
  active?: boolean
}

interface BreadcrumbItem {
  label: string
  path?: string
  active?: boolean
}

interface StudentLayoutProps {
  children: React.ReactNode
  sidebarCollapsed: boolean
  onSidebarToggle: () => void
  sidebarItems: SidebarItemType[]
  onSidebarItemClick?: (path: string) => void
  walletBalance?: number
  onWithdraw?: () => void
  onSignOut?: () => void
  breadcrumbItems: BreadcrumbItem[]
  breadcrumbIcon?: React.ComponentType<{ className?: string }>
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  onSearchSubmit?: (value: string) => void
  showSearch?: boolean
  searchShortcut?: string
  userControls?: React.ComponentProps<typeof Header>['userControls']
}

const StudentLayout: React.FC<StudentLayoutProps> = ({
  children,
  sidebarCollapsed,
  onSidebarToggle,
  sidebarItems,
  onSidebarItemClick,
  walletBalance = 0,
  onWithdraw,
  onSignOut,
  breadcrumbItems,
  breadcrumbIcon,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  showSearch = true,
  searchShortcut,
  userControls
}) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={onSidebarToggle}
          items={sidebarItems}
          onItemClick={onSidebarItemClick}
          walletBalance={walletBalance}
          onWithdraw={onWithdraw}
          onSignOut={onSignOut}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <Header
          breadcrumbItems={breadcrumbItems}
          breadcrumbIcon={breadcrumbIcon}
          searchPlaceholder={searchPlaceholder}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          onSearchSubmit={onSearchSubmit}
          showSearch={showSearch}
          searchShortcut={searchShortcut}
          userControls={userControls}
        />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
          {children}
        </div>
      </div>
    </div>
  )
}

export default StudentLayout
