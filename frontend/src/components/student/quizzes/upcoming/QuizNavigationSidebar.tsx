import React from 'react'
import { CheckCircle, Circle, Clock } from 'lucide-react'

interface QuestionStatus {
  questionNumber: number
  status: 'answered' | 'unanswered' | 'flagged'
}

interface QuizNavigationSidebarProps {
  questions: QuestionStatus[]
  currentQuestion: number
  onQuestionSelect: (questionNumber: number) => void
  onPrevious?: () => void
  onNext?: () => void
  onSubmit?: () => void
  canPrevious?: boolean
  canNext?: boolean
  className?: string
}

const QuizNavigationSidebar: React.FC<QuizNavigationSidebarProps> = ({
  questions,
  currentQuestion,
  onQuestionSelect,
  onPrevious,
  onNext,
  onSubmit,
  canPrevious = true,
  canNext = true,
  className = ''
}) => {
  const getQuestionIcon = (status: QuestionStatus['status'], isCurrent: boolean) => {
    if (isCurrent) {
      return <Clock className="w-4 h-4 text-blue-600" />
    }
    
    switch (status) {
      case 'answered':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'flagged':
        return <Circle className="w-4 h-4 text-yellow-600 fill-yellow-100" />
      default:
        return <Circle className="w-4 h-4 text-gray-400" />
    }
  }

  const getQuestionButtonClass = (status: QuestionStatus['status'], isCurrent: boolean) => {
    let baseClass = "flex items-center space-x-3 w-full p-3 rounded-lg text-left transition-colors duration-200"
    
    if (isCurrent) {
      return `${baseClass} bg-blue-100 text-blue-900 border-2 border-blue-500`
    }
    
    switch (status) {
      case 'answered':
        return `${baseClass} bg-green-50 text-green-900 hover:bg-green-100 border border-green-200`
      case 'flagged':
        return `${baseClass} bg-yellow-50 text-yellow-900 hover:bg-yellow-100 border border-yellow-200`
      default:
        return `${baseClass} bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-200`
    }
  }

  const answeredCount = questions.filter(q => q.status === 'answered').length
  const totalQuestions = questions.length

  return (
    <div className={`bg-white border-l border-gray-200 p-6 ${className}`}>
      {/* Progress Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Progress</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Answered:</span>
            <span className="font-medium text-green-600">
              {answeredCount}/{totalQuestions}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress: {Math.round((answeredCount / totalQuestions) * 100)}%</span>
            <span>{totalQuestions - answeredCount} remaining</span>
          </div>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Questions</h4>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {questions.map((question) => {
            const isCurrent = question.questionNumber === currentQuestion
            
            return (
              <button
                key={question.questionNumber}
                onClick={() => onQuestionSelect(question.questionNumber)}
                className={getQuestionButtonClass(question.status, isCurrent)}
              >
                {getQuestionIcon(question.status, isCurrent)}
                <span className="font-medium">
                  Question {question.questionNumber}
                </span>
                {question.status === 'answered' && !isCurrent && (
                  <span className="ml-auto text-xs text-green-600">✓</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="space-y-3">
        <div className="flex space-x-2">
          <button
            onClick={onPrevious}
            disabled={!canPrevious}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              canPrevious
                ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={onNext}
            disabled={!canNext}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              canNext
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>

        <button
          onClick={onSubmit}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition-colors"
        >
          Submit Quiz
        </button>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span>Answered</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3 text-blue-600" />
              <span>Current</span>
            </div>
            <div className="flex items-center space-x-2">
              <Circle className="w-3 h-3 text-gray-400" />
              <span>Unanswered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizNavigationSidebar
