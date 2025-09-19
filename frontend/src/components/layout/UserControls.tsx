import React, { useState, useRef, useEffect } from 'react'
import { 
  ChevronDown, 
  ShoppingCart, 
  Bell, 
  MessageCircle 
} from 'lucide-react'
import UserProfileDropdown from '../navigation/user-actions/UserProfileDropdown'

interface UserControlsProps {
  currency?: string
  language?: string
  languageFlag?: string
  cartCount?: number
  userAvatar?: string
  onCurrencyChange?: () => void
  onLanguageChange?: () => void
  onCartClick?: () => void
  onNotificationClick?: () => void
  onMessageClick?: () => void
  onUserClick?: () => void
}

const UserControls: React.FC<UserControlsProps> = ({
  currency = 'USD $',
  language = 'En',
  languageFlag = 'https://flagcdn.com/w20/us.png',
  cartCount = 0,
  userAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
  onCurrencyChange,
  onLanguageChange,
  onCartClick,
  onNotificationClick,
  onMessageClick,
  onUserClick
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleToggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const handleCloseUserMenu = () => {
    setIsUserMenuOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  return (
    <div className="flex items-center space-x-4">
      {/* Currency */}
      <button 
        onClick={onCurrencyChange}
        className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900"
      >
        {currency}
        <svg viewBox="0 0 20 20" className="w-4 h-4 ml-1 text-gray-400">
          <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Language */}
      <button 
        onClick={onLanguageChange}
        className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900"
      >
        <span className="inline-flex items-center justify-center w-6 h-4 mr-1">
          <img src={languageFlag} alt={language} className="w-5 h-3.5" />
        </span>
        {language}
        <svg viewBox="0 0 20 20" className="w-4 h-4 ml-1 text-gray-400">
          <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Shopping Cart */}
      <button 
        onClick={onCartClick}
        className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      {/* Notifications */}
      <button 
        onClick={onNotificationClick}
        className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          0
        </span>
      </button>

      {/* Chat */}
      <button 
        onClick={onMessageClick}
        className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
      </button>

      {/* User Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleToggleUserMenu}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
        >
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src={userAvatar} 
              alt="User"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                if (nextElement) {
                  nextElement.style.display = 'flex'
                }
              }}
            />
            <div className="w-full h-full bg-emerald-100 rounded-full flex items-center justify-center" style={{display: 'none'}}>
              <span className="text-emerald-600 font-semibold text-sm">
                U
              </span>
            </div>
          </div>
          <svg viewBox="0 0 20 20" className="w-4 h-4 text-gray-400">
            <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <UserProfileDropdown 
          isOpen={isUserMenuOpen} 
          onClose={handleCloseUserMenu} 
        />
      </div>
    </div>
  )
}

export default UserControls
