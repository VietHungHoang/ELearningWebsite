import React from 'react'
import { AlertTriangle } from 'lucide-react'

interface QuizResultHeaderProps {
  title: string
  completedAt: string
  accuracy: number
  totalMarks: number
  correctAnswers: number
  totalQuestions: number
  onGoToQuizzes?: () => void
}

const QuizResultHeader: React.FC<QuizResultHeaderProps> = ({
  title,
  completedAt,
  accuracy,
  totalMarks,
  correctAnswers,
  totalQuestions,
  onGoToQuizzes
}) => {
  const passed = accuracy >= 60 // Assuming 60% is passing grade

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Quiz Title and Completion Info */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">{title}</h1>
        <p className="text-sm text-gray-600">Finished {completedAt}</p>
      </div>

      {/* Statistics Bar */}
      <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <span className="text-2xl font-bold text-gray-900">{accuracy.toFixed(2)}%</span>
            <div className="ml-2 w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-sm text-gray-600">Accuracy</span>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <span className="text-2xl font-bold text-gray-900">{totalMarks}</span>
            <div className="ml-2 w-3 h-3 bg-orange-500 rounded-full"></div>
          </div>
          <span className="text-sm text-gray-600">Marks</span>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <span className="text-2xl font-bold text-gray-900">
              {correctAnswers}/{totalQuestions}
            </span>
            <div className="ml-2 w-3 h-3 bg-gray-400 rounded-full"></div>
          </div>
          <span className="text-sm text-gray-600">Correct Answer</span>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="text-center py-8">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {passed ? "Congratulations! Well Done!" : "Don't Give Up! Keep Learning!"}
        </h2>
        
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {passed 
            ? "Great job! You passed this quiz. Keep up the excellent work!"
            : "Almost there! You didn't pass this time, but every challenge leads to success."
          }
        </p>

        <button 
          onClick={onGoToQuizzes}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors font-medium"
        >
          Go to My Quizzes
        </button>
      </div>
    </div>
  )
}

export default QuizResultHeader
