import { useState } from 'react'
import type { CourseDto } from '../../services/courseApi'

interface CoursePlayerTabsProps {
  courseData: CourseDto
  isSidebarCollapsed: boolean
}

const CoursePlayerTabs = ({ courseData, isSidebarCollapsed }: CoursePlayerTabsProps) => {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'prerequisites', label: 'Prerequisites & FAQs' },
    { id: 'noticeboard', label: 'Noticeboard' },
    { id: 'course-info', label: 'Course Info' }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Overview</h3>
            <p className="text-gray-600 mb-4">{courseData.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-900">Duration:</span>
                <p className="text-gray-600">{courseData.duration}</p>
              </div>
              <div>
                <span className="font-medium text-gray-900">Level:</span>
                <p className="text-gray-600">{courseData.level}</p>
              </div>
              <div>
                <span className="font-medium text-gray-900">Lessons:</span>
                <p className="text-gray-600">{courseData.totalLessons}</p>
              </div>
              <div>
                <span className="font-medium text-gray-900">Students:</span>
                <p className="text-gray-600">{courseData.studentsCount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )
      
      case 'prerequisites':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Prerequisites & FAQs</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Prerequisites</h4>
                <p className="text-gray-600">No prior experience required. Just bring your ambition and willingness to learn!</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Frequently Asked Questions</h4>
                <div className="space-y-2">
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="font-medium text-gray-900">How long do I have access to the course?</p>
                    <p className="text-gray-600 text-sm">You have lifetime access to this course once enrolled.</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="font-medium text-gray-900">Can I get a refund if I'm not satisfied?</p>
                    <p className="text-gray-600 text-sm">Yes, we offer a 30-day money-back guarantee.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'noticeboard':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Noticeboard</h3>
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-blue-900">New Content Added</span>
                </div>
                <p className="text-blue-800 text-sm">We've added new lessons to Section 2. Check them out!</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-green-900">Course Update</span>
                </div>
                <p className="text-green-800 text-sm">The course has been updated with the latest best practices.</p>
              </div>
            </div>
          </div>
        )

      case 'course-info':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-900">Instructor:</span>
                  <p className="text-gray-600">{courseData.instructor.name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Rating:</span>
                  <p className="text-gray-600">{courseData.rating}/5.0 ⭐</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Duration:</span>
                  <p className="text-gray-600">{courseData.duration}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Level:</span>
                  <p className="text-gray-600">{courseData.level}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Total Lessons:</span>
                  <p className="text-gray-600">{courseData.totalLessons}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Students Enrolled:</span>
                  <p className="text-gray-600">{courseData.studentsCount.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-900">Instructor Bio:</span>
                <p className="text-gray-600 mt-1">{courseData.instructor.title}</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      {/* Navigation Tabs */}
      <div className="bg-white border-t border-gray-200">
        <div className={`transition-all duration-300 ${
          isSidebarCollapsed ? 'px-4' : 'px-6'
        }`}>
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className={`bg-white min-h-32 transition-all duration-300 ${
        isSidebarCollapsed ? 'p-4' : 'p-6'
      }`}>
        {renderTabContent()}
      </div>
    </>
  )
}

export default CoursePlayerTabs
