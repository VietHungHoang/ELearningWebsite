import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import { Home, Search, AlertCircle } from 'lucide-react'

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)

  const handleGoHome = () => {
    // Redirect based on user role
    if (user) {
      switch (user.role) {
        case 'student':
          navigate('/student/bookings')
          break
        case 'instructor':
          navigate('/tutor/dashboard')
          break
        case 'admin':
          navigate('/admin/insights')
          break
        default:
          navigate('/')
      }
    } else {
      navigate('/')
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'student':
        return 'Student'
      case 'instructor':
        return 'Tutor'
      case 'admin':
        return 'Admin'
      default:
        return role
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          {/* Error Code */}
          <div className="mb-4">
            <h1 className="text-6xl font-bold text-blue-600 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Oops! Something Went Wrong
            </h2>
            <p className="text-gray-600">
              This page either doesn't exist or has been removed. We recommend returning to the home.
            </p>
          </div>

          {/* User Info */}
          {user && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <AlertCircle className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Current User</span>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">{user.name}</span> ({getRoleDisplayName(user.role)})
              </p>
            </div>
          )}

          {/* Description */}
          <div className="mb-8">
            <p className="text-gray-600 text-sm leading-relaxed">
              The page you're looking for might have been moved, deleted, or you might have entered the wrong URL. 
              Don't worry, we'll help you get back on track.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Go to Home</span>
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Go Back
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Still having trouble? Try searching for what you need.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
