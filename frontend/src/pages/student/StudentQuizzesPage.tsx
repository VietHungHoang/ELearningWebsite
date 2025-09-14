import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StudentLayout } from '../../components'
import { QuizContent } from '../../components/student'
import { studentUserControls, getStudentSidebarItems } from '../../utils/studentConfig'
import type { QuizTopic } from '../../types/quiz'

const StudentQuizzesPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const navigate = useNavigate()

  const handleQuizClick = (quiz: QuizTopic) => {
    // Navigate based on quiz status
    if (quiz.status === 'upcoming' || quiz.status === 'attempted') {
      // Play quiz (new or retry)
      navigate(`/student/quiz-taking/${quiz.id}`)
    } else if (quiz.status === 'completed') {
      // Show quiz result
      navigate(`/student/quiz-result/${quiz.id}`)
    }
  }

  const handleSidebarItemClick = (path: string) => {
    navigate(path)
  }

  const sidebarItems = getStudentSidebarItems('/student/quizzes')

  const breadcrumbItems = [
    { label: 'My Quizzes' }
  ]

  return (
    <StudentLayout
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      sidebarItems={sidebarItems}
      onSidebarItemClick={handleSidebarItemClick}
      breadcrumbItems={breadcrumbItems}
      searchPlaceholder="Quick search here"
      searchShortcut="Ctrl + K"
      userControls={studentUserControls}
    >
      <QuizContent onQuizClick={handleQuizClick} />
    </StudentLayout>
  )
}

export default StudentQuizzesPage
