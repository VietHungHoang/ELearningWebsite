import React from 'react'
import { 
  ChevronDown, 
  ShoppingCart, 
  Bell, 
  MessageCircle 
} from 'lucide-react'

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
  return (
    <div className="flex items-center space-x-4">
      {/* Currency */}
      <button 
        onClick={onCurrencyChange}
        className="flex items-center space-x-1 text-sm text-gray-700 hover:text-gray-900 transition-colors"
      >
        <span>{currency}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {/* Language */}
      <button 
        onClick={onLanguageChange}
        className="flex items-center space-x-1 text-sm text-gray-700 hover:text-gray-900 transition-colors"
      >
        <img src={languageFlag} alt={language} className="w-4 h-3" />
        <span>{language}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {/* Cart */}
      <button 
        onClick={onCartClick}
        className="relative p-1 hover:bg-gray-100 rounded-md transition-colors"
      >
        <ShoppingCart className="w-5 h-5 text-gray-600" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      {/* Notifications */}
      <button 
        onClick={onNotificationClick}
        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600" />
      </button>

      {/* Messages */}
      <button 
        onClick={onMessageClick}
        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
      >
        <MessageCircle className="w-5 h-5 text-gray-600" />
      </button>

      {/* User Avatar */}
      <button 
        onClick={onUserClick}
        className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden hover:ring-2 hover:ring-green-500 transition-all"
      >
        <img 
          src={userAvatar} 
          alt="User" 
          className="w-full h-full object-cover" 
        />
      </button>
    </div>
  )
}

export default UserControls
