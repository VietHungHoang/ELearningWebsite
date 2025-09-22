import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { StudentLayout } from '../../components'
import CoursesContent from '../../components/student/courses/CoursesContent'
import { studentUserControls, getStudentSidebarItems } from '../../utils/studentConfig'
import { courseApi } from '../../services/courseApi'
import type { CourseDto } from '../../services/courseApi'

const StudentCoursesPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [courses, setCourses] = useState<CourseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSidebarItemClick = (path: string) => {
    navigate(path)
  }

  const sidebarItems = getStudentSidebarItems('/student/course-list')

  // Load courses on component mount
  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('📚 Loading student courses...')
      
      // For now, get all courses. In production, you'd get courses by student ID
      const allCourses = await courseApi.getAllCourses()
      console.log('✅ Courses loaded:', allCourses.length)
      
      setCourses(allCourses)
    } catch (err: any) {
      console.error('❌ Error loading courses:', err)
      setError(err.response?.data?.message || 'Failed to load courses. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleStartCourse = (course: CourseDto) => {
    console.log('🎯 Starting course:', course.title)
    // Navigate to course player page using slug
    navigate(`/student/course-player/${course.slug}`)
  }

  const handleToggleLike = (courseId: string) => {
    console.log('❤️ Toggling like for course:', courseId)
    // Update course like status in backend
    // You can implement API call here
  }

  const breadcrumbItems = [
    { label: 'My Learning' }
  ]

  return (
    <StudentLayout
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      sidebarItems={sidebarItems}
      onSidebarItemClick={handleSidebarItemClick}
      walletBalance={0}
      onWithdraw={() => console.log('Withdraw clicked')}
      onSignOut={() => console.log('Sign out clicked')}
      breadcrumbItems={breadcrumbItems}
      searchPlaceholder="Search courses..."
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      searchShortcut="Ctrl + K"
      userControls={studentUserControls}
    >
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Courses</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadCourses}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <CoursesContent 
          courses={courses}
          onStartCourse={handleStartCourse}
          onToggleLike={handleToggleLike}
        />
      )}
    </StudentLayout>
  )
}

export default StudentCoursesPage
