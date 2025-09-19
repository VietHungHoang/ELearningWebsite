import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../../store/hooks'
import { ShoppingCart, Bell, MessageCircle } from 'lucide-react'
import UserProfileDropdown from './UserProfileDropdown'

interface UserActionsProps {
  isMenuOpen: boolean
  onToggleMenu: () => void
  onCloseMenu: () => void
}

const UserActions = ({ isMenuOpen, onToggleMenu, onCloseMenu }: UserActionsProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const dropdownRef = useRef<HTMLDivElement>(null)

  return (
    <div className="hidden md:flex items-center space-x-4">
      <button className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900">
        USD $
        <svg viewBox="0 0 20 20" className="w-4 h-4 ml-1 text-gray-400">
          <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <button className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900">
        <span className="inline-flex items-center justify-center w-6 h-4 mr-1">
          <svg className="w-5 h-3.5" viewBox="0 0 640 480">
            <rect width="640" height="480" fill="#012169"/>
            <path d="M75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301L81 480H0v-60l239-178L0 64V0h75z" fill="#FFF"/>
            <path d="M424 281l216 159v40L369 281h55zm-184 20l6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z" fill="#C8102E"/>
            <path d="M241 0v480h160V0H241zM0 160v160h640V160H0z" fill="#FFF"/>
            <path d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" fill="#C8102E"/>
          </svg>
        </span>
        En
        <svg viewBox="0 0 20 20" className="w-4 h-4 ml-1 text-gray-400">
          <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {isAuthenticated ? (
        <>
          {/* Shopping Cart */}
          <button className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              2
            </span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </button>

          {/* Chat */}
          <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors">
            <MessageCircle className="w-5 h-5" />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={onToggleMenu}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src="/media/students/sarah-chapman.jpg" 
                  alt={user?.name || 'User'}
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
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              <svg viewBox="0 0 20 20" className="w-4 h-4 text-gray-400">
                <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <UserProfileDropdown 
              isOpen={isMenuOpen} 
              onClose={onCloseMenu} 
            />
          </div>
        </>
      ) : (
        <>
          <Link
            to="/auth/login"
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/get-started"
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900 text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Get Started
          </Link>
        </>
      )}
    </div>
  )
}

export default UserActions
