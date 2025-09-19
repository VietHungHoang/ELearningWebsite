import React from 'react'
import { useAppSelector } from '../../store/hooks'
import { UserInfo } from '../../components'

const StudentDashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserInfo />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* My Courses */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Courses</h3>
            <p className="text-gray-600">View and continue your enrolled courses</p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              View Courses
            </button>
          </div>

          {/* Find Tutors */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Find Tutors</h3>
            <p className="text-gray-600">Connect with expert tutors for personalized learning</p>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Browse Tutors
            </button>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
            <p className="text-gray-600">Track your learning achievements and milestones</p>
            <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
              View Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboardPage
