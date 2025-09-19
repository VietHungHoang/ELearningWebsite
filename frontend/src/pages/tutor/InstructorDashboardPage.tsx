import React from 'react'
import { useNavigate } from 'react-router-dom'

const InstructorDashboardPage: React.FC = () => {
  // const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()

  const handleCreateCourse = () => {
    navigate('/tutor/courses/create')
  }

  const handleViewStudents = () => {
    navigate('/tutor/students')
  }

  const handleViewEarnings = () => {
    navigate('/tutor/earnings')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* <UserInfo />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tutor Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* My Students */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Students</h3>
            <p className="text-gray-600">Manage your student relationships and sessions</p>
            <button 
              onClick={handleViewStudents}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              View Students
            </button>
          </div>

          {/* Create Course */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Course</h3>
            <p className="text-gray-600">Design and publish new courses for students</p>
            <button 
              onClick={handleCreateCourse}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Create Course
            </button>
          </div>

          {/* Earnings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings</h3>
            <p className="text-gray-600">Track your teaching income and payments</p>
            <button 
              onClick={handleViewEarnings}
              className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
            >
              View Earnings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructorDashboardPage
