import { useState, useEffect } from 'react'
import { 
  Share, 
  Bell,
  ShoppingCart,
  MessageCircle
} from 'lucide-react'
import UserProfileDropdown from '../../navigation/user-actions/UserProfileDropdown'

interface CoursePlayerHeaderProps {
  courseProgress: number
  isSidebarCollapsed: boolean
}

const CoursePlayerHeader = ({ courseProgress, isSidebarCollapsed }: CoursePlayerHeaderProps) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  
  // Debug log to check if component receives updated progress
  console.log('DEBUG: CoursePlayerHeader rendered with progress:', courseProgress)

  const handleToggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const handleCloseUserMenu = () => {
    setIsUserMenuOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isUserMenuOpen && !target.closest('.user-dropdown-container')) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  return (
    <header className={`fixed top-0 right-0 bg-gray-900 text-white px-6 py-4 z-20 transition-all duration-300 ease-in-out ${
      isSidebarCollapsed ? 'left-16' : 'left-80'
    }`}>
      <div className="flex items-center justify-between">
        {/* Left Side - Course Progress */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h2 className="text-lg font-semibold text-white tracking-wide">
              COURSE PROGRESS
            </h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-64 bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-300"
                style={{ width: `${courseProgress}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-white">{courseProgress}%</span>
          </div>
        </div>

        {/* Right Side - Controls */}
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md transition-colors">
            <Share className="w-4 h-4" />
            <span className="text-sm">Share</span>
          </button>

          {/* Currency */}
          <button className="inline-flex items-center text-sm text-gray-300 hover:text-white">
            USD $
            <svg viewBox="0 0 20 20" className="w-4 h-4 ml-1 text-gray-400">
              <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* Language */}
          <button className="inline-flex items-center text-sm text-gray-300 hover:text-white">
            <span className="inline-flex items-center justify-center w-6 h-4 mr-1">
              <img src="https://flagcdn.com/w20/gb.png" alt="EN" className="w-5 h-3.5" />
            </span>
            En
            <svg viewBox="0 0 20 20" className="w-4 h-4 ml-1 text-gray-400">
              <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* Shopping Cart */}
          <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              2
            </span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </button>

          {/* Chat */}
          <button className="p-2 text-gray-300 hover:text-white transition-colors">
            <MessageCircle className="w-5 h-5" />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative user-dropdown-container">
            <button
              onClick={handleToggleUserMenu}
              className="flex items-center space-x-2 text-gray-300 hover:text-white"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src="/media/students/sarah-chapman.jpg" 
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
      </div>
    </header>
  )
}

export default CoursePlayerHeader
