import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, Calendar, BookOpen, Users, FileText, GraduationCap, Mail, MessageCircle, Award } from 'lucide-react'
import { StudentLayout } from '../../components'
import QuizContent from '../../components/student/QuizContent'

interface Quiz {
  id: string
  title: string
  subtitle?: string
  image: string
  status: 'attempted' | 'upcoming' | 'completed'
  totalQuestions: number
  totalMarks: number
  duration: string
  createdAt: string
  score?: number
  progress?: number
}

const StudentQuizzesPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const navigate = useNavigate()

  const handleQuizClick = (quiz: Quiz) => {
    console.log('Quiz clicked:', quiz)
    // Navigate to quiz detail or quiz taking page
    // You can implement navigation logic here
  }

  const handleSidebarItemClick = (path: string) => {
    navigate(path)
  }

  const sidebarItems = [
    { icon: Settings, label: 'Profile Settings', path: '/student/profile' },
    { icon: Calendar, label: 'My Bookings', path: '/student/bookings' },
    { icon: BookOpen, label: 'My Learning', path: '/student/learning' },
    { icon: Users, label: 'Find Tutors', path: '/student/find-tutors' },
    { icon: FileText, label: 'My Quizzes', path: '/student/quizzes', active: true },
    { icon: GraduationCap, label: 'Find Courses', path: '/student/courses' },
    { icon: BookOpen, label: 'Find Course Bundles', path: '/student/bundles' },
    { icon: FileText, label: 'Assignments', path: '/student/assignments' },
    { icon: Mail, label: 'Inbox', path: '/student/inbox' },
    { icon: MessageCircle, label: 'Community', path: '/student/community' },
    { icon: Award, label: 'My Certificates', path: '/student/certificates' },
  ]

  const breadcrumbItems = [
    { label: 'Profile Settings', path: '/student/profile' },
    { label: 'Quizzes' }
  ]

  const userControls = {
    currency: 'USD $',
    language: 'En',
    languageFlag: 'https://flagcdn.com/w20/us.png',
    cartCount: 1,
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  }

  return (
    <StudentLayout
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      sidebarItems={sidebarItems}
      onSidebarItemClick={handleSidebarItemClick}
      breadcrumbItems={breadcrumbItems}
      searchPlaceholder="Quick search here"
      searchShortcut="Ctrl + K"
      userControls={userControls}
    >
      <QuizContent onQuizClick={handleQuizClick} />
    </StudentLayout>
  )
}

export default StudentQuizzesPage
