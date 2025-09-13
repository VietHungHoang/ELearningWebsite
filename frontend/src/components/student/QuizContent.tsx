import React, { useState } from 'react'
import { Search } from 'lucide-react'
import QuizCard from './QuizCard'

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

interface QuizContentProps {
  quizzes?: Quiz[]
  onQuizClick?: (quiz: Quiz) => void
}

const QuizContent: React.FC<QuizContentProps> = ({ 
  quizzes = [], 
  onQuizClick 
}) => {
  const [activeFilter, setActiveFilter] = useState<'upcoming' | 'attempted'>('attempted')
  const [searchQuery, setSearchQuery] = useState('')

  // Sample quiz data
  const sampleQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'Continuous Learning: Embrace Lifelong...',
      subtitle: 'Continuous Learning: Embrace Lifelong Education',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
      status: 'attempted',
      totalQuestions: 5,
      totalMarks: 14,
      duration: '02:30 hrs.',
      createdAt: 'Jan 31, 2025',
      score: 12
    },
    {
      id: '2',
      title: 'Medium Level General Knowledge Quiz',
      subtitle: 'Test your general knowledge across various subjects',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      status: 'attempted',
      totalQuestions: 15,
      totalMarks: 15,
      duration: '03:30 hrs.',
      createdAt: 'Feb 06, 2025',
      score: 13
    },
    {
      id: '3',
      title: 'Advanced Mathematics Quiz',
      subtitle: 'Calculus and advanced mathematical concepts',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
      status: 'upcoming',
      totalQuestions: 20,
      totalMarks: 25,
      duration: '04:00 hrs.',
      createdAt: 'Feb 15, 2025'
    },
    {
      id: '4',
      title: 'English Literature Basics',
      subtitle: 'Classic literature and comprehension skills',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      status: 'upcoming',
      totalQuestions: 12,
      totalMarks: 18,
      duration: '02:00 hrs.',
      createdAt: 'Feb 20, 2025'
    }
  ]

  const allQuizzes = quizzes.length > 0 ? quizzes : sampleQuizzes

  // Filter quizzes based on active filter and search query
  const filteredQuizzes = allQuizzes.filter(quiz => {
    const matchesFilter = quiz.status === activeFilter
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleQuizClick = (quiz: Quiz) => {
    onQuizClick?.(quiz)
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Quizzes</h1>
        <p className="text-gray-600">
          Browse and manage all your Quizzes conveniently in one place.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex items-center justify-between mb-6">
        {/* Filter Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveFilter('upcoming')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeFilter === 'upcoming'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveFilter('attempted')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeFilter === 'attempted'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Attempted
          </button>
        </div>

        {/* Search Box */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by keyword"
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Quiz Grid */}
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onClick={handleQuizClick}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No quizzes found
          </h3>
          <p className="text-gray-600">
            {searchQuery 
              ? `No quizzes match "${searchQuery}" in the ${activeFilter} category.`
              : `No ${activeFilter} quizzes available.`
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default QuizContent
