import React, { useState, useEffect, useMemo } from 'react'
import { Search } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { fetchQuizzes, fetchQuizHistory } from '../../../../store/slices/quizSlice'
import type { QuizTopic } from '../../../../types/quiz'
import QuizCard from './QuizCard'

interface QuizContentProps {
  onQuizClick?: (quiz: QuizTopic) => void
}

const QuizContent: React.FC<QuizContentProps> = ({ 
  onQuizClick 
}) => {
  const dispatch = useAppDispatch()
  const { quizzes, quizHistory, quizListLoading, historyLoading } = useAppSelector(state => state.quiz)
  
  const [activeFilter, setActiveFilter] = useState<'upcoming' | 'attempted' | 'completed'>('attempted')
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch quizzes on component mount only once
  useEffect(() => {
    dispatch(fetchQuizzes())
    dispatch(fetchQuizHistory())
  }, [dispatch])

  // Memoize filtered quizzes to prevent unnecessary re-computations
  const upcomingQuizzes = useMemo(() => {
    return quizzes.filter(quiz => quiz.status === 'upcoming')
  }, [quizzes])

  const attemptedQuizzes = useMemo(() => {
    return quizHistory.filter(quiz => quiz.status === 'attempted')
  }, [quizHistory])

  const completedQuizzes = useMemo(() => {
    return quizHistory.filter(quiz => quiz.status === 'completed')
  }, [quizHistory])

  // Memoize the current quiz list based on active filter
  const allQuizzes = useMemo(() => {
    if (activeFilter === 'upcoming') {
      return upcomingQuizzes
    } else if (activeFilter === 'attempted') {
      return attemptedQuizzes
    } else {
      return completedQuizzes
    }
  }, [activeFilter, upcomingQuizzes, attemptedQuizzes, completedQuizzes])

  // Memoize filtered quizzes based on search query
  const filteredQuizzes = useMemo(() => {
    if (!searchQuery.trim()) {
      return allQuizzes
    }
    
    const searchLower = searchQuery.toLowerCase()
    return allQuizzes.filter(quiz => {
      return quiz.title.toLowerCase().includes(searchLower) ||
             quiz.description?.toLowerCase().includes(searchLower)
    })
  }, [allQuizzes, searchQuery])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleQuizClick = (quiz: QuizTopic) => {
    onQuizClick?.(quiz)
  }

  // Show loading state
  if (quizListLoading || historyLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quizzes</h1>
          <p className="text-gray-600">Loading quizzes...</p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    )
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
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeFilter === 'completed'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Completed
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

      {/* Loading State */}
      {quizListLoading || historyLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quizzes...</p>
        </div>
      ) : filteredQuizzes.length > 0 ? (
        /* Quiz Grid */
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
