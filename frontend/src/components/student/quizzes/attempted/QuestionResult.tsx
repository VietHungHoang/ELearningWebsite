import React, { useState } from 'react'
import { 
  ChevronUp, 
  ChevronDown, 
  CheckCircle, 
  XCircle, 
  X
} from 'lucide-react'

interface QuestionOption {
  id: string
  text: string
  isCorrect?: boolean
  isSelected?: boolean
}

interface QuestionResultProps {
  questionNumber: number
  question: string
  type: 'Multiple Choice' | 'Fill in the Blanks' | 'Short Answer' | 'True/False'
  status: 'Correct' | 'Incorrect'
  points: {
    earned: number
    total: number
  }
  options?: QuestionOption[]
  userAnswer?: string
  correctAnswer?: string
  explanation?: string
}

const QuestionResult: React.FC<QuestionResultProps> = ({
  questionNumber,
  question,
  type,
  status,
  points,
  options = [],
  userAnswer,
  correctAnswer,
  explanation: _explanation
}) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const getStatusIcon = () => {
    return status === 'Correct' ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    )
  }

  const getStatusColor = () => {
    return status === 'Correct' ? 'text-green-600' : 'text-red-600'
  }

  const getTypeColor = () => {
    switch (type) {
      case 'Multiple Choice':
        return 'bg-blue-100 text-blue-800'
      case 'Fill in the Blanks':
        return 'bg-purple-100 text-purple-800'
      case 'Short Answer':
        return 'bg-orange-100 text-orange-800'
      case 'True/False':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderQuestionContent = () => {
    if (type === 'Fill in the Blanks') {
      return (
        <div className="mt-4">
          <p className="text-gray-700 leading-relaxed">
            {question.replace(/\[([^\]]+)\]/g, (_, content) => {
              return `[${content}]`
            })}
          </p>
        </div>
      )
    }

    if (type === 'Short Answer') {
      return (
        <div className="mt-4 space-y-3">
          <div>
            <span className="text-sm font-medium text-gray-700">Your Answer:</span>
            <div className="mt-1 p-3 bg-gray-50 rounded-md">
              <span className="text-gray-900">{userAnswer || 'No answer provided'}</span>
            </div>
          </div>
          {correctAnswer && (
            <div>
              <span className="text-sm font-medium text-green-700">Sample Answer:</span>
              <div className="mt-1 p-3 bg-green-50 rounded-md">
                <span className="text-green-900">{correctAnswer}</span>
              </div>
            </div>
          )}
        </div>
      )
    }

    if (type === 'Multiple Choice' || type === 'True/False') {
      return (
        <div className="mt-4 space-y-2">
          {options.map((option) => {
            let optionClass = "p-3 rounded-md border flex items-center justify-between"
            let iconElement: React.ReactNode = null
            let labelElement: React.ReactNode = null

            if (option.isCorrect && option.isSelected) {
              // Correct answer that user selected
              optionClass += " bg-green-50 border-green-200"
              iconElement = <CheckCircle className="w-5 h-5 text-green-600" />
              labelElement = <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Correct Answer</span>
            } else if (option.isCorrect && !option.isSelected) {
              // Correct answer that user didn't select
              optionClass += " bg-green-50 border-green-200"
              iconElement = <CheckCircle className="w-5 h-5 text-green-600" />
              labelElement = <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Correct Answer</span>
            } else if (!option.isCorrect && option.isSelected) {
              // Wrong answer that user selected
              optionClass += " bg-red-50 border-red-200"
              iconElement = <XCircle className="w-5 h-5 text-red-600" />
              labelElement = <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full flex items-center">
                Wrong Answer (You) <X className="w-3 h-3 ml-1" />
              </span>
            } else {
              // Regular option
              optionClass += " bg-gray-50 border-gray-200"
            }

            return (
              <div key={option.id} className={optionClass}>
                <div className="flex items-center space-x-3">
                  {iconElement}
                  <span className="text-gray-900">{option.text}</span>
                </div>
                {labelElement}
              </div>
            )
          })}
        </div>
      )
    }

    return null
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-4">
      {/* Question Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="font-medium text-gray-900">
              Q{questionNumber}. {question}
            </h3>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Question Meta Info */}
        <div className="flex items-center space-x-4 mt-2">
          <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor()}`}>
            Type {type}
          </span>
          <div className="flex items-center space-x-1">
            {getStatusIcon()}
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {status}
            </span>
          </div>
          <span className="text-sm text-gray-600">
            Points {points.earned} / {points.total}
          </span>
        </div>
      </div>

      {/* Question Content */}
      {isExpanded && (
        <div className="p-4">
          {renderQuestionContent()}
        </div>
      )}
    </div>
  )
}

export default QuestionResult
