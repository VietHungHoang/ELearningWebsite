import React, { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { QuizTakingHeader, QuestionDisplay, QuizNavigationSidebar } from '../../components/student/quizzes/upcoming'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { fetchQuizById, startNewAttempt } from '../../store/slices/quizSlice'

const QuizTakingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [showSubmitModal, setShowSubmitModal] = useState(false)

  // Get quiz data from Redux store
  const { currentQuiz, quizListLoading, quizListError } = useAppSelector((state) => state.quiz)

  useEffect(() => {
    if (id) {
      dispatch(fetchQuizById(id))
    }
  }, [dispatch, id])

  // Start new attempt when quiz is loaded and status is attempted
  useEffect(() => {
    if (currentQuiz && currentQuiz.status === 'attempted') {
      dispatch(startNewAttempt(id!))
    }
  }, [dispatch, id, currentQuiz])

  // All hooks must be called before any conditional returns
  const quiz = currentQuiz
  const currentQuestion = quiz?.questions?.[currentQuestionIndex]
  const totalQuestions = quiz?.questions?.length || 0

  const getQuestionStatus = () => {
    return quiz?.questions?.map(q => ({
      questionNumber: q.questionNumber,
      status: (answers[q.id] ? 'answered' : 'unanswered') as 'answered' | 'unanswered' | 'flagged'
    })) || []
  }

  const handleAnswerChange = useCallback((questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }, [])

  const handleQuestionSelect = (questionNumber: number) => {
    setCurrentQuestionIndex(questionNumber - 1)
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleSubmitQuiz = () => {
    // Navigate to quiz result page
    navigate(`/student/quiz-result/${quiz?.id}`)
  }

  const handleExitQuiz = () => {
    if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
      navigate('/student/quizzes')
    }
  }

  const handleTimeUp = () => {
    alert('Time is up! Your quiz will be submitted automatically.')
    handleSubmitQuiz()
  }

  const answeredCount = Object.keys(answers).length

  // Show loading state
  if (quizListLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (quizListError || !currentQuiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading quiz: {quizListError || 'Quiz not found'}</p>
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

  // If no questions, show error
  if (totalQuestions === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">This quiz has no questions available.</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <QuizTakingHeader
        title={quiz?.title || ''}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        timeRemaining={(quiz?.timeLimit || 0) * 60} // Convert minutes to seconds
        totalMarks={quiz?.totalMarks || 0}
        onTimeUp={handleTimeUp}
        onExitQuiz={handleExitQuiz}
      />

      <div className="max-w-7xl mx-auto flex">
        <div className="flex-1 p-6 pr-0">
          {currentQuestion && (
            <QuestionDisplay
              question={currentQuestion}
              selectedAnswer={answers[currentQuestion.id]}
              onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
            />
          )}
        </div>

        <div className="w-80">
          <QuizNavigationSidebar
            questions={getQuestionStatus()}
            currentQuestion={currentQuestionIndex + 1}
            onQuestionSelect={handleQuestionSelect}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={() => setShowSubmitModal(true)}
            canPrevious={currentQuestionIndex > 0}
            canNext={currentQuestionIndex < totalQuestions - 1}
          />
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <h3 className="text-lg font-semibold text-gray-900">Submit Quiz?</h3>
            </div>
            
            <div className="mb-6 space-y-3">
              <p className="text-gray-600">
                Are you sure you want to submit your quiz? You won't be able to make changes after submission.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Questions answered:</span>
                    <span className="font-medium">{answeredCount}/{totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion:</span>
                    <span className="font-medium">{Math.round((answeredCount / totalQuestions) * 100)}%</span>
                  </div>
                </div>
              </div>

              {answeredCount < totalQuestions && (
                <div className="flex items-start space-x-2 text-amber-700 bg-amber-50 p-3 rounded-md">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    You have {totalQuestions - answeredCount} unanswered question(s). 
                    These will be marked as incorrect.
                  </span>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Continue Quiz
              </button>
              <button
                onClick={handleSubmitQuiz}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Submit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuizTakingPage
