import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../../store/hooks'
import { logout } from '../../../store/slices/authSlice'
import { 
  User, 
  Calendar, 
  BookOpen, 
  FileText, 
  Heart, 
  DollarSign, 
  LogOut,
  ArrowRightLeft,
  MessageCircle
} from 'lucide-react'

interface UserProfileDropdownProps {
  isOpen: boolean
  onClose: () => void
}

const UserProfileDropdown = ({ isOpen, onClose }: UserProfileDropdownProps) => {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(logout())
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 py-4 z-50">
      {/* User Info */}
      <div className="px-4 pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
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
              <span className="text-emerald-600 font-semibold text-lg">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user?.name || 'Sarah Chapman'}</h3>
            <p className="text-sm text-gray-500">{user?.email || 'student@amentotech.com'}</p>
          </div>
        </div>
      </div>

      {/* Role Switch */}
      <div className="px-4 py-3 bg-gray-50 mx-4 my-3 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-1">Switch to tutor account</h4>
        <p className="text-xs text-gray-500 mb-3">You can switch back to student account anytime with one click</p>
        <button className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
          <ArrowRightLeft className="w-4 h-4" />
          <span>Switch user role</span>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="px-2">
        <Link
          to="/student/profile/personal-details"
          className="flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
          onClick={onClose}
        >
          <User className="w-4 h-4" />
          <span>Profile Settings</span>
        </Link>
        <Link
          to="/student/bookings"
          className="flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
          onClick={onClose}
        >
          <Calendar className="w-4 h-4" />
          <span>My Bookings</span>
        </Link>
        <Link
          to="/student/course-list"
          className="flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
          onClick={onClose}
        >
          <BookOpen className="w-4 h-4" />
          <span>My Learning</span>
        </Link>
        <Link
          to="/student/billing-detail"
          className="flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
          onClick={onClose}
        >
          <FileText className="w-4 h-4" />
          <span>Billing Details</span>
        </Link>
        <Link
          to="/student/favourites"
          className="flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
          onClick={onClose}
        >
          <Heart className="w-4 h-4" />
          <span>Favourites</span>
        </Link>
        <Link
          to="/find-tutors"
          className="flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
          onClick={onClose}
        >
          <User className="w-4 h-4" />
          <span>Find Tutors</span>
        </Link>
        <Link
          to="/courses"
          className="flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
          onClick={onClose}
        >
          <BookOpen className="w-4 h-4" />
          <span>Find Courses</span>
        </Link>
        <Link
          to="/student/inbox"
          className="flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
          onClick={onClose}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Inbox</span>
        </Link>
        <Link
          to="/student-subscriptions"
          className="flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
          onClick={onClose}
        >
          <DollarSign className="w-4 h-4" />
          <span>Subscriptions</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  )
}

export default UserProfileDropdown
