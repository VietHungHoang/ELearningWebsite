import React from 'react'
import { Search } from 'lucide-react'
import Breadcrumb from './Breadcrumb'
import UserControls from './UserControls'

interface BreadcrumbItem {
  label: string
  path?: string
  active?: boolean
}

interface HeaderProps {
  breadcrumbItems: BreadcrumbItem[]
  breadcrumbIcon?: React.ComponentType<{ className?: string }>
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  onSearchSubmit?: (value: string) => void
  showSearch?: boolean
  searchShortcut?: string
  userControls?: React.ComponentProps<typeof UserControls>
}

const Header: React.FC<HeaderProps> = ({
  breadcrumbItems,
  breadcrumbIcon,
  searchPlaceholder = 'Quick search here',
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
  showSearch = true,
  searchShortcut = 'Ctrl + K',
  userControls
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchSubmit?.(searchValue)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side - Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} icon={breadcrumbIcon} />

        {/* Center - Search */}
        {showSearch && (
          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                {searchShortcut}
              </span>
            </form>
          </div>
        )}

        {/* Right Side - Controls */}
        {userControls && <UserControls {...userControls} />}
      </div>
    </header>
  )
}

export default Header
