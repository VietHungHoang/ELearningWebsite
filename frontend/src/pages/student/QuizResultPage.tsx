import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Settings, Calendar, BookOpen, Users, FileText, GraduationCap, Mail, MessageCircle, Award } from 'lucide-react'
import { StudentLayout } from '../../components'
import { QuizResultHeader, QuestionResult } from '../../components/student/quizzes/attempted'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { fetchQuizById } from '../../store/slices/quizSlice'

const QuizResultPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Get quiz data from Redux store
  const { currentQuiz, quizListLoading, quizListError } = useAppSelector((state) => state.quiz)

  useEffect(() => {
    if (id) {
      dispatch(fetchQuizById(id))
    }
  }, [dispatch, id])

  // Show loading state
  if (quizListLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz result...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (quizListError || !currentQuiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading quiz result: {quizListError || 'Quiz not found'}</p>
          <button
            onClick={() => navigate('/student/quizzes')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    )
  }

  // Mock quiz result data based on the current quiz
  const quizResult = {
    id: currentQuiz.id,
    title: currentQuiz.title,
    completedAt: new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }),
    accuracy: currentQuiz.score ? (currentQuiz.score / currentQuiz.totalMarks) * 100 : 0,
    totalMarks: currentQuiz.totalMarks,
    earnedMarks: currentQuiz.score || 0,
    correctAnswers: currentQuiz.score ? Math.round((currentQuiz.score / currentQuiz.totalMarks) * currentQuiz.totalQuestions) : 0,
    totalQuestions: currentQuiz.totalQuestions,
    questions: currentQuiz.questions?.map((question) => ({
      questionNumber: question.questionNumber,
      question: question.question,
      type: question.type,
      status: (Math.random() > 0.5 ? 'Correct' : 'Incorrect') as 'Correct' | 'Incorrect', // Mock status
      points: { 
        earned: Math.random() > 0.5 ? question.points : Math.floor(question.points * 0.5), 
        total: question.points 
      },
      userAnswer: 'Sample answer', // Mock user answer
      correctAnswer: typeof question.correctAnswer === 'string' ? question.correctAnswer : 'Sample correct answer',
      options: question.options
    })) || []
  }

  const handleGoToQuizzes = () => {
    navigate('/student/quizzes')
  }

  const handleSidebarItemClick = (path: string) => {
    navigate(path)
  }

  const sidebarItems = [
    { icon: Settings, label: 'Profile Settings', path: '/student/profile' },
    { icon: Calendar, label: 'My Bookings', path: '/student/bookings' },
    { icon: BookOpen, label: 'My Learning', path: '/student/course-list' },
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
    { label: 'My Quizzes', path: '/student/quizzes' },
    { label: 'Quiz Result' }
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
      <div className="flex-1 overflow-y-auto p-6 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Quiz Result Header */}
          <QuizResultHeader
            title={quizResult.title}
            completedAt={quizResult.completedAt}
            accuracy={quizResult.accuracy}
            totalMarks={quizResult.totalMarks}
            correctAnswers={quizResult.correctAnswers}
            totalQuestions={quizResult.totalQuestions}
            onGoToQuizzes={handleGoToQuizzes}
          />

          {/* Quiz Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quiz Summary:</h2>
            
            <div className="space-y-4">
              {quizResult.questions.map((question, index) => (
                <QuestionResult
                  key={index}
                  questionNumber={question.questionNumber}
                  question={question.question}
                  type={question.type}
                  status={question.status}
                  points={question.points}
                  options={question.options}
                  userAnswer={question.userAnswer}
                  correctAnswer={question.correctAnswer}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}

export default QuizResultPage
