import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { logout } from '../store/slices/authSlice'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-[#faf8f5] sticky top-0 z-40 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center mr-8">
            <img 
              src="/media/homepage/logo-default.svg" 
              alt="Lernen Logo" 
              className="w-30 h-30"
            />
          </Link>

          {/* Center: Nav */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-[15px] font-semibold text-gray-800 hover:text-gray-900 transition-colors flex items-center"
            >
              Home
              <svg viewBox="0 0 20 20" className="w-4 h-4 ml-1 text-gray-500">
                <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Link>
            <Link
              to="/find-tutors"
              className="text-[15px] font-semibold text-gray-800 hover:text-gray-900 transition-colors"
            >
              Find Tutors
            </Link>
            
            {/* Courses Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('courses')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`text-[15px] font-semibold transition-colors flex items-center px-2 py-1 rounded-t-lg ${
                  activeDropdown === 'courses' 
                    ? 'text-gray-900 bg-[#FAF8F6]' 
                    : 'text-gray-800 hover:text-gray-900'
                }`}
              >
                Courses
                <svg viewBox="0 0 20 20" className="w-4 h-4 ml-1 text-gray-500">
                  <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              {activeDropdown === 'courses' && (
                <div className="absolute top-full left-0 bg-white rounded-b-lg shadow-lg border border-gray-100 py-1 z-50 min-w-[200px]">
                  <Link
                    to="/courses/search"
                    className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    Search Courses
                  </Link>
                  <Link
                    to="/courses/bundles"
                    className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    Search Course Bundles
                  </Link>
                </div>
              )}
            </div>

            {/* Subscriptions Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('subscriptions')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`text-[15px] font-semibold transition-colors flex items-center px-2 py-1 rounded-t-lg ${
                  activeDropdown === 'subscriptions' 
                    ? 'text-gray-900 bg-[#FAF8F6]' 
                    : 'text-gray-800 hover:text-gray-900'
                }`}
              >
                Subscriptions
                <svg viewBox="0 0 20 20" className="w-4 h-4 ml-1 text-gray-500">
                  <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              {activeDropdown === 'subscriptions' && (
                <div className="absolute top-full left-0 bg-white rounded-b-lg shadow-lg border border-gray-100 py-1 z-50 min-w-[200px]">
                  <Link
                    to="/subscriptions/student"
                    className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    Student Subscriptions
                  </Link>
                  <Link
                    to="/subscriptions/tutor"
                    className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    Tutor Subscriptions
                  </Link>
                </div>
              )}
            </div>

            {/* More Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('more')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`text-[15px] font-semibold transition-colors flex items-center px-2 py-1 rounded-t-lg ${
                  activeDropdown === 'more' 
                    ? 'text-gray-900 bg-[#FAF8F6]' 
                    : 'text-gray-800 hover:text-gray-900'
                }`}
              >
                More
                <svg viewBox="0 0 20 20" className="w-4 h-4 ml-1 text-gray-500">
                  <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              {activeDropdown === 'more' && (
                <div className="absolute top-full left-0 bg-white rounded-b-lg shadow-lg border border-gray-100 py-1 z-50 min-w-[200px]">
                  <Link
                    to="/about"
                    className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    About
                  </Link>
                  <Link
                    to="/how-it-works"
                    className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    How it Works
                  </Link>
                  <Link
                    to="/faq"
                    className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    Common FAQs
                  </Link>
                  <Link
                    to="/blogs"
                    className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    Blogs
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right: selectors + buttons */}
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
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-semibold text-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{user?.name}</span>
                  <svg viewBox="0 0 20 20" className="w-4 h-4 text-gray-400">
                    <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
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

          {/* Mobile menu button */}
          <button
            aria-label="Toggle menu"
            className="md:hidden p-2 -mr-2"
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            <div className="w-6 h-6 relative">
              <span
                className={`absolute left-0 top-[7px] w-6 h-0.5 bg-gray-700 transition-transform ${
                  isMenuOpen ? 'rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] w-6 h-0.5 bg-gray-700 transition-transform ${
                  isMenuOpen ? '-rotate-45' : 'translate-y-2'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-[15px] text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/find-tutors"
                className="text-[15px] text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Tutors
              </Link>
              <Link
                to="/courses"
                className="text-[15px] text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>
              <Link
                to="/subscriptions"
                className="text-[15px] text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Subscriptions
              </Link>
              <Link
                to="/more"
                className="text-[15px] text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                More
              </Link>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
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
                </div>
                <div className="mt-4 space-y-2">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="block w-full text-center px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-center px-4 py-2 rounded-lg bg-gray-100 text-gray-900 text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/auth/login"
                        className="block w-full text-center px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/get-started"
                        className="block w-full text-center px-4 py-2 rounded-lg bg-gray-100 text-gray-900 text-sm font-medium hover:bg-gray-200 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header