import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Calendar, 
  Settings, 
  BookOpen, 
  Users, 
  GraduationCap, 
  FileText, 
  Mail, 
  MessageCircle, 
  Award
} from 'lucide-react'
import { StudentLayout } from '../../components'
import CoursesContent from '../../components/student/courses/CoursesContent'

const StudentCoursesPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const navigate = useNavigate()

  const handleSidebarItemClick = (path: string) => {
    navigate(path)
  }

  const sidebarItems = [
    { icon: Settings, label: 'Profile Settings', path: '/student/profile' },
    { icon: Calendar, label: 'My Bookings', path: '/student/bookings' },
    { icon: BookOpen, label: 'My Learning', path: '/student/course-list', active: true },
    { icon: Users, label: 'Find Tutors', path: '/find-tutors' },
    { icon: FileText, label: 'My Quizzes', path: '/student/quizzes' },
    { icon: GraduationCap, label: 'Find Courses', path: '/courses' },
    { icon: BookOpen, label: 'Find Course Bundles', path: '/course-bundles' },
    { icon: FileText, label: 'Assignments', path: '/student/assignments' },
    { icon: Mail, label: 'Inbox', path: '/student/inbox' },
    { icon: MessageCircle, label: 'Community', path: '/student/community' },
    { icon: Award, label: 'My Certificates', path: '/student/certificates' },
  ]

  const handleStartCourse = (course: any) => {
    // Navigate to course player page using slug
    navigate(`/student/course-player/${course.slug}`)
  }

  const handleToggleLike = (_courseId: string) => {
    // Update course like status in backend
    // You can implement API call here
  }

  const breadcrumbItems = [
    { label: 'Profile Settings', path: '/student/profile' },
    { label: 'My Learning' }
  ]

  return (
    <StudentLayout
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      sidebarItems={sidebarItems}
      onSidebarItemClick={handleSidebarItemClick}
      breadcrumbItems={breadcrumbItems}
      searchPlaceholder="Search courses..."
      showSearch={true}
    >
      <CoursesContent 
        onStartCourse={handleStartCourse}
        onToggleLike={handleToggleLike}
      />
    </StudentLayout>
  )
}

export default StudentCoursesPage
