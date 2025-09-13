import React from 'react'
import { Menu, X, CreditCard, LogOut } from 'lucide-react'
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
  items: SidebarItemType[]
  onItemClick?: (path: string) => void
  walletBalance?: number
  onWithdraw?: () => void
  onSignOut?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  items,
  onItemClick,
  walletBalance = 0,
  onWithdraw,
  onSignOut
}) => {
  return (
    <div className={`bg-white shadow-sm transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} flex flex-col`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-semibold text-gray-900">Lernen</span>
          </div>
        )}
        <button 
          onClick={onToggle}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item, index) => (
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
      </nav>

      {/* Wallet Section */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
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
