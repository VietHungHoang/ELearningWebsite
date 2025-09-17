import React from 'react'

interface SidebarItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  path: string
  active?: boolean
  collapsed: boolean
  onClick?: () => void
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  path,
  active = false,
  collapsed,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active 
          ? 'bg-green-100 text-green-700 border-r-2 border-green-700' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  )
}

export default SidebarItem
