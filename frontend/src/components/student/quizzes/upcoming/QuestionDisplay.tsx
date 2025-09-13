import React, { useState, useEffect } from 'react'
import { CheckCircle, Circle } from 'lucide-react'

interface QuestionOption {
  id: string
  text: string
}

interface Question {
  id: string
  questionNumber: number
  question: string
  type: 'Multiple Choice' | 'True/False' | 'Fill in the Blanks' | 'Short Answer'
  options?: QuestionOption[]
  points: number
  explanation?: string
}

interface QuestionDisplayProps {
  question: Question
  selectedAnswer?: string | string[]
  onAnswerChange: (answer: string | string[]) => void
  showExplanation?: boolean
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedAnswer,
  onAnswerChange,
  showExplanation = false
}) => {
  const [localAnswer, setLocalAnswer] = useState<string | string[]>(selectedAnswer || '')

  useEffect(() => {
    setLocalAnswer(selectedAnswer || '')
  }, [selectedAnswer])

  const handleOptionSelect = (optionId: string) => {
    if (question.type === 'Multiple Choice' || question.type === 'True/False') {
      setLocalAnswer(optionId)
      onAnswerChange(optionId)
    }
  }

  const handleTextChange = (value: string) => {
    setLocalAnswer(value)
    onAnswerChange(value)
  }

  const renderMultipleChoice = () => (
    <div className="space-y-3">
      {question.options?.map((option) => (
        <div
          key={option.id}
          onClick={() => handleOptionSelect(option.id)}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:border-blue-300 ${
            localAnswer === option.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            {localAnswer === option.id ? (
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <span className="text-gray-900 font-medium">{option.text}</span>
          </div>
        </div>
      ))}
    </div>
  )

  const renderTrueFalse = () => (
    <div className="space-y-3">
      {['True', 'False'].map((option) => (
        <div
          key={option.toLowerCase()}
          onClick={() => handleOptionSelect(option.toLowerCase())}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:border-blue-300 ${
            localAnswer === option.toLowerCase()
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            {localAnswer === option.toLowerCase() ? (
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <span className="text-gray-900 font-medium">{option}</span>
          </div>
        </div>
      ))}
    </div>
  )

  const renderFillInBlanks = () => {
    const questionParts = question.question.split('_____')
    
    return (
      <div className="space-y-4">
        <div className="text-lg text-gray-900 leading-relaxed">
          {questionParts.map((part, index) => (
            <React.Fragment key={index}>
              {part}
              {index < questionParts.length - 1 && (
                <input
                  type="text"
                  value={localAnswer as string}
                  onChange={(e) => handleTextChange(e.target.value)}
                  className="mx-2 px-3 py-1 border-b-2 border-blue-500 focus:outline-none focus:border-blue-600 bg-blue-50 min-w-32 text-center font-medium"
                  placeholder="Your answer..."
                />
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Alternative input if no blanks in question */}
        {!question.question.includes('_____') && (
          <div>
            <input
              type="text"
              value={localAnswer as string}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Type your answer here..."
            />
          </div>
        )}
      </div>
    )
  }

  const renderShortAnswer = () => (
    <div className="space-y-4">
      <textarea
        value={localAnswer as string}
        onChange={(e) => handleTextChange(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-vertical min-h-32"
        placeholder="Type your detailed answer here..."
        rows={4}
      />
      <div className="text-sm text-gray-500">
        Provide a detailed answer. Your response will be evaluated based on relevance and accuracy.
      </div>
    </div>
  )

  const getTypeColor = () => {
    switch (question.type) {
      case 'Multiple Choice':
        return 'bg-blue-100 text-blue-800'
      case 'True/False':
        return 'bg-green-100 text-green-800'
      case 'Fill in the Blanks':
        return 'bg-purple-100 text-purple-800'
      case 'Short Answer':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-gray-900">
              Q{question.questionNumber}.
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor()}`}>
              {question.type}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">{question.points}</span> points
          </div>
        </div>

        <h2 className="text-xl text-gray-900 leading-relaxed mb-6">
          {question.question}
        </h2>
      </div>

      {/* Answer Area */}
      <div className="mb-6">
        {question.type === 'Multiple Choice' && renderMultipleChoice()}
        {question.type === 'True/False' && renderTrueFalse()}
        {question.type === 'Fill in the Blanks' && renderFillInBlanks()}
        {question.type === 'Short Answer' && renderShortAnswer()}
      </div>

      {/* Explanation (if shown) */}
      {showExplanation && question.explanation && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Explanation:</h3>
          <p className="text-sm text-blue-800">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}

export default QuestionDisplay
