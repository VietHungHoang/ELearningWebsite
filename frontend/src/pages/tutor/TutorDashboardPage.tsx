import React from 'react';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  Calendar,
  Star,
  MessageCircle,
  Award
} from 'lucide-react';

const TutorDashboardPage: React.FC = () => {

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Tutor Dashboard', path: '/tutor/dashboard' }
  ];

  // Mock data for dashboard stats
  const stats = [
    {
      title: 'Total Students',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Courses',
      value: '28',
      change: '+3',
      changeType: 'positive',
      icon: BookOpen,
      color: 'bg-green-500'
    },
    {
      title: 'Monthly Earnings',
      value: '$8,450',
      change: '+18%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-yellow-500'
    },
    {
      title: 'Rating',
      value: '4.9',
      change: '+0.2',
      changeType: 'positive',
      icon: Star,
      color: 'bg-purple-500'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'booking',
      title: 'New booking from Sarah Johnson',
      time: '2 minutes ago',
      icon: Calendar
    },
    {
      id: 2,
      type: 'course',
      title: 'Course "Advanced React" approved',
      time: '1 hour ago',
      icon: BookOpen
    },
    {
      id: 3,
      type: 'message',
      title: 'New message from John Smith',
      time: '3 hours ago',
      icon: MessageCircle
    },
    {
      id: 4,
      type: 'achievement',
      title: 'Earned "Top Tutor" badge',
      time: '1 day ago',
      icon: Award
    }
  ];

  return (
    <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {breadcrumbItems.map((item, index) => (
              <li key={index} className="inline-flex items-center">
                {index > 0 && (
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <a
                  href={item.path}
                  className={`ml-1 text-sm font-medium ${
                    index === breadcrumbItems.length - 1
                      ? 'text-gray-500'
                      : 'text-gray-700 hover:text-blue-600'
                  } md:ml-2`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tutor Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, Dr. Sarah Johnson! Here's what's happening with your teaching.</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Create Course
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                View Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="p-2 bg-gray-100 rounded-full">
                  <activity.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Create New Course</span>
                </div>
              </button>
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Schedule Session</span>
                </div>
              </button>
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">View Messages</span>
                </div>
            </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">React Fundamentals</p>
                  <p className="text-xs text-gray-600">with Sarah Johnson</p>
                </div>
                <span className="text-xs text-blue-600 font-medium">Today, 2:00 PM</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">JavaScript Advanced</p>
                  <p className="text-xs text-gray-600">with Mike Davis</p>
                </div>
                <span className="text-xs text-gray-600 font-medium">Tomorrow, 10:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default TutorDashboardPage;