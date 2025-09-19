import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StudentLayout } from '../../components'
import CoursesContent from '../../components/student/courses/CoursesContent'
import { studentUserControls, getStudentSidebarItems } from '../../utils/studentConfig'

const StudentCoursesPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()

  const handleSidebarItemClick = (path: string) => {
    navigate(path)
  }

  const sidebarItems = getStudentSidebarItems('/student/course-list')

  const handleStartCourse = (course: any) => {
    // Navigate to course player page using slug
    navigate(`/student/course-player/${course.slug}`)
  }

  const handleToggleLike = (_courseId: string) => {
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
      <CoursesContent 
        onStartCourse={handleStartCourse}
        onToggleLike={handleToggleLike}
      />
    </StudentLayout>
  )
}

export default StudentCoursesPage
