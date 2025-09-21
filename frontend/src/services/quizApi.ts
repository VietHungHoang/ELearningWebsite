import { api } from './api'

export interface QuizDto {
  id?: string
  sectionId: string
  courseId: string
  tutorId: string
  title: string
  description?: string
  passingScore: number
  timeLimit?: number
  isActive: boolean
  createdAt?: string
  updatedAt?: string
  questions?: QuizQuestionDto[]
}

export interface QuizQuestionDto {
  id?: string
  quizId?: string
  questionText: string
  correctAnswer: string
  order: number
  options?: QuizQuestionOptionDto[]
}

export interface QuizQuestionOptionDto {
  id?: string
  questionId?: string
  text: string
  isCorrect: boolean
  order: number
}

export interface CreateQuizRequest {
  sectionId: string
  courseId: string
  tutorId: string
  title: string
  description?: string
  passingScore: number
  timeLimit?: number
  isActive?: boolean
}

export interface UpdateQuizRequest {
  title?: string
  description?: string
  passingScore?: number
  timeLimit?: number
  isActive?: boolean
}

export const quizApi = {
  // Create a new quiz
  createQuiz: async (quizData: CreateQuizRequest): Promise<QuizDto> => {
    const response = await api.post('/quizzes', quizData)
    return response.data
  },

  // Get quiz by ID
  getQuizById: async (id: string): Promise<QuizDto> => {
    const response = await api.get(`/quizzes/${id}`)
    return response.data
  },

  // Get quizzes by tutor ID
  getQuizzesByTutorId: async (tutorId: string): Promise<QuizDto[]> => {
    console.log('🔍 API: Fetching quizzes for tutor:', tutorId)
    console.log('🔍 API: Request URL:', `http://localhost:8081/api/quizzes/tutor/${tutorId}`)
    
    try {
      const response = await api.get(`/quizzes/tutor/${tutorId}`)
      console.log('✅ API: Response received:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ API: Error fetching quizzes:', error)
      throw error
    }
  },

  // Get quizzes by course ID
  getQuizzesByCourseId: async (courseId: string): Promise<QuizDto[]> => {
    const response = await api.get(`/quizzes/course/${courseId}`)
    return response.data
  },

  // Get quiz by section ID
  getQuizBySectionId: async (sectionId: string): Promise<QuizDto | null> => {
    try {
      const response = await api.get(`/quizzes/section/${sectionId}`)
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  // Update quiz
  updateQuiz: async (id: string, quizData: UpdateQuizRequest): Promise<QuizDto> => {
    const response = await api.put(`/quizzes/${id}`, quizData)
    return response.data
  },

  // Delete quiz
  deleteQuiz: async (id: string): Promise<void> => {
    await api.delete(`/quizzes/${id}`)
  },

  // Search quizzes by title
  searchQuizzes: async (title: string): Promise<QuizDto[]> => {
    const response = await api.get(`/quizzes/search?title=${encodeURIComponent(title)}`)
    return response.data
  },

  // Get all active quizzes
  getAllActiveQuizzes: async (): Promise<QuizDto[]> => {
    const response = await api.get('/quizzes')
    return response.data
  },

  // Get quiz count by tutor
  getQuizCountByTutorId: async (tutorId: string): Promise<number> => {
    const response = await api.get(`/quizzes/tutor/${tutorId}/count`)
    return response.data
  },

  // Question Management APIs
  // Create question for quiz
  createQuestion: async (quizId: string, questionData: QuizQuestionDto): Promise<QuizQuestionDto> => {
    console.log('🔍 API: Creating question for quiz:', quizId)
    const response = await api.post(`/quizzes/${quizId}/questions`, questionData)
    console.log('✅ API: Question created:', response.data)
    return response.data
  },

  // Get questions for quiz
  getQuestionsByQuizId: async (quizId: string): Promise<QuizQuestionDto[]> => {
    console.log('🔍 API: Fetching questions for quiz:', quizId)
    const response = await api.get(`/quizzes/${quizId}/questions`)
    console.log('✅ API: Questions received:', response.data)
    return response.data
  },

  // Update question
  updateQuestion: async (quizId: string, questionId: string, questionData: QuizQuestionDto): Promise<QuizQuestionDto> => {
    console.log('🔍 API: Updating question:', questionId)
    const response = await api.put(`/quizzes/${quizId}/questions/${questionId}`, questionData)
    console.log('✅ API: Question updated:', response.data)
    return response.data
  },

  // Delete question
  deleteQuestion: async (quizId: string, questionId: string): Promise<void> => {
    console.log('🔍 API: Deleting question:', questionId)
    await api.delete(`/quizzes/${quizId}/questions/${questionId}`)
    console.log('✅ API: Question deleted')
  },

  // Reorder questions
  reorderQuestions: async (quizId: string, questions: QuizQuestionDto[]): Promise<void> => {
    console.log('🔍 API: Reordering questions for quiz:', quizId)
    await api.patch(`/quizzes/${quizId}/questions/reorder`, questions)
    console.log('✅ API: Questions reordered')
  },

  // AI Question Generation APIs
  generateQuestions: async (quizId: string, request: any): Promise<QuizQuestionDto[]> => {
    console.log('🤖 API: Generating questions for quiz:', quizId)
    console.log('📝 Request data:', request)
    try {
      const response = await api.post(`/quizzes/${quizId}/questions/generate`, request)
      console.log('✅ API: Questions generated:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ API: Error generating questions:', error)
      throw error
    }
  }
}