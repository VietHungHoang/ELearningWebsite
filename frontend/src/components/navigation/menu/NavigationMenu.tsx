import { useState } from 'react'
import { Link } from 'react-router-dom'

const NavigationMenu = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
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
              to="/search-courses"
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
              to="/student-subscriptions"
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
  )
}

export default NavigationMenu
