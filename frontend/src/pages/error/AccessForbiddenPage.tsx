import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import { Home, Shield, AlertTriangle } from 'lucide-react'

const AccessForbiddenPage: React.FC = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-10 h-10 text-red-600" />
            </div>
          </div>

          {/* Error Code */}
          <div className="mb-4">
            <h1 className="text-6xl font-bold text-red-600 mb-2">403</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Access Forbidden
            </h2>
            <p className="text-gray-600">
              User does not have the right roles.
            </p>
          </div>

          {/* User Info */}
          {user && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
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
              You don't have permission to access this page. Please contact your administrator 
              if you believe this is an error.
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
            Need help? Contact our support team.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AccessForbiddenPage
