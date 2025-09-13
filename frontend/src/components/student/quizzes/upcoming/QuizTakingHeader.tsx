import React, { useState, useEffect } from 'react'
import { Clock, BookOpen, Award, AlertTriangle } from 'lucide-react'

interface QuizTakingHeaderProps {
  title: string
  currentQuestion: number
  totalQuestions: number
  timeRemaining: number // in seconds
  totalMarks: number
  onTimeUp?: () => void
  onExitQuiz?: () => void
}

const QuizTakingHeader: React.FC<QuizTakingHeaderProps> = ({
  title,
  currentQuestion,
  totalQuestions,
  timeRemaining,
  totalMarks,
  onTimeUp,
  onExitQuiz
}) => {
  const [timeLeft, setTimeLeft] = useState(timeRemaining)

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp?.()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onTimeUp])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getTimeColor = () => {
    const percentage = (timeLeft / timeRemaining) * 100
    if (percentage > 50) return 'text-green-600'
    if (percentage > 20) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProgressWidth = () => {
    return ((currentQuestion - 1) / totalQuestions) * 100
  }

  return (
    <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto">
        {/* Top Row - Title and Exit */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900 truncate max-w-2xl">
            {title}
          </h1>
          <button
            onClick={onExitQuiz}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Exit Quiz</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4">
          {/* Progress */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">
                Question {currentQuestion} of {totalQuestions}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span className="text-gray-600">Total Marks: {totalMarks}</span>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center space-x-2">
            <Clock className={`w-5 h-5 ${getTimeColor()}`} />
            <span className={`font-mono text-lg font-semibold ${getTimeColor()}`}>
              {formatTime(timeLeft)}
            </span>
            <span className="text-gray-500">remaining</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-900">
              {Math.round(getProgressWidth())}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressWidth()}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizTakingHeader
