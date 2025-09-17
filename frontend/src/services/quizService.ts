import type {
  QuizListResponse,
  QuizDetailResponse,
  QuizSessionResponse,
  QuizSubmitResponse,
  QuizResultResponse,
  QuizApiError
} from '../types/quiz'
import { mockQuizTopics, mockQuizHistory } from '../data/mockQuizData'

// Mock API Base URL - Replace with actual API endpoint
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

class QuizService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, defaultOptions)
      
      if (!response.ok) {
        const errorData: QuizApiError = await response.json()
        throw new Error(errorData.error.message || 'API request failed')
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Get list of available quizzes
  async getQuizzes(params?: {
    page?: number
    limit?: number
    category?: string
    difficulty?: string
    search?: string
  }): Promise<QuizListResponse> {
    // For now, return mock data
    // In production, this would make an actual API call
    let filteredQuizzes = [...mockQuizTopics]
    
    if (params?.category) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.category === params.category)
    }
    
    if (params?.difficulty) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.difficulty === params.difficulty)
    }
    
    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      filteredQuizzes = filteredQuizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(searchLower) ||
        quiz.description.toLowerCase().includes(searchLower)
      )
    }
    
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedQuizzes = filteredQuizzes.slice(startIndex, endIndex)
    
    return {
      success: true,
      data: {
        quizzes: paginatedQuizzes,
        pagination: {
          page,
          limit,
          total: filteredQuizzes.length,
          totalPages: Math.ceil(filteredQuizzes.length / limit)
        },
        filters: {
          categories: [...new Set(mockQuizTopics.map(q => q.category))],
          difficulties: [...new Set(mockQuizTopics.map(q => q.difficulty))],
          tags: [...new Set(mockQuizTopics.flatMap(q => q.tags))]
        }
      }
    }
  }

  // Get quiz details by ID
  async getQuizById(quizId: string): Promise<QuizDetailResponse> {
    // Use mock data instead of API call - search in both topics and history
    let quiz = mockQuizTopics.find(q => q.id === quizId)
    
    if (!quiz) {
      quiz = mockQuizHistory.find(q => q.id === quizId)
    }
    
    if (!quiz) {
      throw new Error(`Quiz with ID ${quizId} not found`)
    }

    return {
      success: true,
      data: quiz
    }
  }

  // Start a new quiz session
  async startQuizSession(quizId: string): Promise<QuizSessionResponse> {
    return this.makeRequest<QuizSessionResponse>(`/quizzes/${quizId}/start`, {
      method: 'POST',
    })
  }

  // Save answer for a question
  async saveAnswer(
    sessionId: string,
    questionId: string,
    answer: string | string[]
  ): Promise<QuizSessionResponse> {
    return this.makeRequest<QuizSessionResponse>(
      `/quiz-sessions/${sessionId}/answers`,
      {
        method: 'POST',
        body: JSON.stringify({
          questionId,
          answer,
        }),
      }
    )
  }

  // Navigate to a specific question
  async navigateToQuestion(
    sessionId: string,
    questionIndex: number
  ): Promise<QuizSessionResponse> {
    return this.makeRequest<QuizSessionResponse>(
      `/quiz-sessions/${sessionId}/navigate`,
      {
        method: 'POST',
        body: JSON.stringify({
          questionIndex,
        }),
      }
    )
  }

  // Submit quiz for grading
  async submitQuiz(sessionId: string): Promise<QuizSubmitResponse> {
    return this.makeRequest<QuizSubmitResponse>(
      `/quiz-sessions/${sessionId}/submit`,
      {
        method: 'POST',
      }
    )
  }

  // Get quiz result
  async getQuizResult(sessionId: string): Promise<QuizResultResponse> {
    return this.makeRequest<QuizResultResponse>(`/quiz-sessions/${sessionId}/result`)
  }

  // Get user's quiz history
  async getQuizHistory(params?: {
    page?: number
    limit?: number
    status?: string
  }): Promise<QuizListResponse> {
    // For now, return mock data
    // In production, this would make an actual API call
    let filteredQuizzes = [...mockQuizHistory]
    
    if (params?.status) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.status === params.status)
    }
    
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedQuizzes = filteredQuizzes.slice(startIndex, endIndex)
    
    return {
      success: true,
      data: {
        quizzes: paginatedQuizzes,
        pagination: {
          page,
          limit,
          total: filteredQuizzes.length,
          totalPages: Math.ceil(filteredQuizzes.length / limit)
        },
        filters: {
          categories: [...new Set(mockQuizHistory.map(q => q.category))],
          difficulties: [...new Set(mockQuizHistory.map(q => q.difficulty))],
          tags: [...new Set(mockQuizHistory.flatMap(q => q.tags))]
        }
      }
    }
  }

  // Abandon quiz session
  async abandonQuiz(sessionId: string): Promise<QuizSessionResponse> {
    return this.makeRequest<QuizSessionResponse>(
      `/quiz-sessions/${sessionId}/abandon`,
      {
        method: 'POST',
      }
    )
  }

  // Get quiz session status
  async getQuizSession(sessionId: string): Promise<QuizSessionResponse> {
    return this.makeRequest<QuizSessionResponse>(`/quiz-sessions/${sessionId}`)
  }
}

// Export singleton instance
export const quizService = new QuizService()
export default quizService
