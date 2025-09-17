import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../../store/hooks'
import { logout } from '../../../store/slices/authSlice'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(logout())
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="md:hidden py-4 border-t border-gray-100">
      <div className="flex flex-col space-y-4">
        <Link
          to="/"
          className="text-[15px] text-gray-700 hover:text-gray-900 transition-colors"
          onClick={onClose}
        >
          Home
        </Link>
        <Link
          to="/find-tutors"
          className="text-[15px] text-gray-700 hover:text-gray-900 transition-colors"
          onClick={onClose}
        >
          Find Tutors
        </Link>
        <Link
          to="/courses"
          className="text-[15px] text-gray-700 hover:text-gray-900 transition-colors"
          onClick={onClose}
        >
          Courses
        </Link>
        <Link
          to="/subscriptions"
          className="text-[15px] text-gray-700 hover:text-gray-900 transition-colors"
          onClick={onClose}
        >
          Subscriptions
        </Link>
        <Link
          to="/more"
          className="text-[15px] text-gray-700 hover:text-gray-900 transition-colors"
          onClick={onClose}
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
                  onClick={onClose}
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
                  onClick={onClose}
                >
                  Sign in
                </Link>
                <Link
                  to="/get-started"
                  className="block w-full text-center px-4 py-2 rounded-lg bg-gray-100 text-gray-900 text-sm font-medium hover:bg-gray-200 transition-colors"
                  onClick={onClose}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
