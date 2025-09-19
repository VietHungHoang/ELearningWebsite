import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import SidebarItem from './SidebarItem'
import WalletSection from './WalletSection'

interface SidebarItemType {
  icon: React.ComponentType<{ className?: string }>
  label: string
  path: string
  active?: boolean
}

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  items?: SidebarItemType[]
  mainItems?: SidebarItemType[]
  additionalItems?: SidebarItemType[]
  onItemClick?: (path: string) => void
  walletBalance?: number
  onWithdraw?: () => void
  onSignOut?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  items,
  mainItems,
  additionalItems,
  onItemClick,
  walletBalance = 0,
  onWithdraw,
  onSignOut
}) => {
  return (
    <div className={`bg-white shadow-sm transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} flex flex-col h-full`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between h-20 flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center justify-start w-full">
            <Link to="/" className="block">
              <img 
                src="/media/homepage/logo-default.svg" 
                alt="Lernen Logo" 
                className="w-32 h-32 object-contain max-h-16 ml-2 hover:opacity-80 transition-opacity cursor-pointer"
              />
            </Link>
          </div>
        )}
        <button 
          onClick={onToggle}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors bg-gray-50 border border-gray-200"
        >
          {collapsed ? <Menu className="w-5 h-5 text-gray-600" /> : <X className="w-5 h-5 text-gray-600" />}
        </button>
      </div>

      {/* Sidebar Navigation - Scrollable */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto min-h-0">
        {/* Main Items */}
        {(mainItems || items || []).map((item, index) => (
          <SidebarItem
            key={index}
            icon={item.icon}
            label={item.label}
            path={item.path}
            active={item.active}
            collapsed={collapsed}
            onClick={() => onItemClick?.(item.path)}
          />
        ))}
        
        {/* Additional Items (scrollable) */}
        {additionalItems && additionalItems.length > 0 && (
          <div className="max-h-48 overflow-y-auto">
            {additionalItems.map((item, index) => (
              <SidebarItem
                key={`additional-${index}`}
                icon={item.icon}
                label={item.label}
                path={item.path}
                active={item.active}
                collapsed={collapsed}
                onClick={() => onItemClick?.(item.path)}
              />
            ))}
          </div>
        )}
      </nav>

      {/* Wallet Section - Fixed at bottom */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <WalletSection
            balance={walletBalance}
            onWithdraw={onWithdraw}
            onSignOut={onSignOut}
          />
        </div>
      )}
    </div>
  )
}

export default Sidebar
