import { useState, useEffect, useRef } from 'react'
import { Logo } from './logo'
import { NavigationMenu } from './menu'
import { UserActions } from './user-actions'
import { MobileMenu, MobileMenuButton } from './mobile'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleCloseMenu = () => {
    setIsMenuOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="bg-[#faf8f5] sticky top-0 z-40 border-b border-gray-200 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <Logo />

          {/* Center: Navigation Menu */}
          <NavigationMenu />

          {/* Right: User Actions */}
          <UserActions 
            isMenuOpen={isMenuOpen}
            onToggleMenu={handleToggleMenu}
            onCloseMenu={handleCloseMenu}
          />

          {/* Mobile menu button */}
          <MobileMenuButton 
            isOpen={isMenuOpen}
            onToggle={handleToggleMenu}
          />
        </div>

        {/* Mobile menu */}
        <MobileMenu 
          isOpen={isMenuOpen}
          onClose={handleCloseMenu}
        />
      </div>
    </header>
  )
}

export default Header