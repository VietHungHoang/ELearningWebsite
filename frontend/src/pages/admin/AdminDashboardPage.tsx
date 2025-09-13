import React from 'react'
import { useAppSelector } from '../../store/hooks'
import UserInfo from '../../components/UserInfo'

const AdminDashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserInfo />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
            <p className="text-gray-600">Manage students, tutors, and admin accounts</p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Manage Users
            </button>
          </div>

          {/* Course Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Management</h3>
            <p className="text-gray-600">Review and approve courses from tutors</p>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Manage Courses
            </button>
          </div>

          {/* Analytics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h3>
            <p className="text-gray-600">View platform statistics and reports</p>
            <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
              View Analytics
            </button>
          </div>

          {/* System Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
            <p className="text-gray-600">Configure platform settings and preferences</p>
            <button className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
              Settings
            </button>
          </div>

          {/* Reports */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports</h3>
            <p className="text-gray-600">Generate and download system reports</p>
            <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
              Generate Reports
            </button>
          </div>

          {/* Support */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Support</h3>
            <p className="text-gray-600">Handle user support tickets and inquiries</p>
            <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Support Center
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
