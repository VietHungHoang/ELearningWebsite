import React from 'react'
import { 
  Clock, 
  FileText, 
  Calendar, 
  Award,
  CheckCircle
} from 'lucide-react'

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

interface QuizCardProps {
  quiz: Quiz
  onClick?: (quiz: Quiz) => void
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onClick }) => {
  const getStatusBadge = () => {
    const baseClasses = "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1"
    
    switch (quiz.status) {
      case 'attempted':
        return (
          <div className={`${baseClasses} bg-black text-white`}>
            <CheckCircle className="w-3 h-3" />
            <span>Attempted</span>
          </div>
        )
      case 'completed':
        return (
          <div className={`${baseClasses} bg-green-100 text-green-800`}>
            <CheckCircle className="w-3 h-3" />
            <span>Completed</span>
          </div>
        )
      case 'upcoming':
        return (
          <div className={`${baseClasses} bg-blue-100 text-blue-800`}>
            <Clock className="w-3 h-3" />
            <span>Upcoming</span>
          </div>
        )
      default:
        return null
    }
  }

  const handleClick = () => {
    onClick?.(quiz)
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      {/* Quiz Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={quiz.image} 
          alt={quiz.title}
          className="w-full h-full object-cover"
        />
        {getStatusBadge()}
      </div>

      {/* Quiz Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
          {quiz.title}
        </h3>
        
        {/* Subtitle */}
        {quiz.subtitle && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-1">
            {quiz.subtitle}
          </p>
        )}

        {/* Quiz Stats */}
        <div className="space-y-3">
          {/* Questions and Marks Row */}
          <div className="flex justify-between text-sm">
            <div className="flex items-center space-x-1 text-gray-600">
              <FileText className="w-4 h-4" />
              <span>Total Questions</span>
            </div>
            <span className="font-medium text-gray-900">{quiz.totalQuestions}</span>
          </div>

          {/* Created Date Row */}
          <div className="flex justify-between text-sm">
            <div className="flex items-center space-x-1 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Created at</span>
            </div>
            <span className="font-medium text-gray-900">{quiz.createdAt}</span>
          </div>

          {/* Total Marks Row */}
          <div className="flex justify-between text-sm">
            <div className="flex items-center space-x-1 text-gray-600">
              <Award className="w-4 h-4" />
              <span>Total Marks</span>
            </div>
            <span className="font-medium text-gray-900">{quiz.totalMarks}</span>
          </div>

          {/* Duration Row */}
          <div className="flex justify-between text-sm">
            <div className="flex items-center space-x-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Duration</span>
            </div>
            <span className="font-medium text-gray-900">{quiz.duration}</span>
          </div>

          {/* Score (if attempted) */}
          {quiz.score !== undefined && (
            <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
              <span className="text-gray-600">Your Score</span>
              <span className="font-semibold text-green-600">
                {quiz.score}/{quiz.totalMarks}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizCard
