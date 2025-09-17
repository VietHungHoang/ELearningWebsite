// Quiz Types and Interfaces for Standardized Data Flow

export interface QuizTopic {
  id: string
  title: string
  description: string
  image: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedDuration: number // in minutes
  totalQuestions: number
  totalMarks: number
  timeLimit: number // in minutes
  status: 'upcoming' | 'attempted' | 'completed'
  score?: number // for attempted/completed quizzes
  prerequisites?: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
  instructor: {
    id: string
    name: string
    avatar: string
    rating: number
  }
  questions?: QuizQuestion[]
  attempts?: QuizAttempt[] // Track multiple attempts
}

export interface QuizAttempt {
  id: string
  quizId: string
  attemptNumber: number
  status: 'in_progress' | 'completed' | 'abandoned'
  score?: number
  earnedMarks?: number
  totalMarks: number
  answers: Record<string, string | string[]>
  startedAt: string
  completedAt?: string
  timeSpent: number // in seconds
  passed: boolean
}

export interface QuizQuestion {
  id: string
  questionNumber: number
  question: string
  type: 'Multiple Choice' | 'True/False' | 'Fill in the Blanks' | 'Short Answer'
  points: number
  options?: QuizOption[]
  correctAnswer?: string | string[]
  explanation?: string
  timeLimit?: number // in seconds, optional
  media?: {
    type: 'image' | 'video' | 'audio'
    url: string
    alt?: string
  }
}

export interface QuizOption {
  id: string
  text: string
  isCorrect?: boolean
}

export interface QuizSession {
  id: string
  quizId: string
  userId: string
  status: 'not_started' | 'in_progress' | 'completed' | 'abandoned'
  startedAt?: string
  completedAt?: string
  timeLimit: number // in seconds
  timeRemaining: number // in seconds
  currentQuestionIndex: number
  answers: Record<string, QuizAnswer>
  totalQuestions: number
  totalMarks: number
  earnedMarks: number
  accuracy: number
  createdAt: string
  updatedAt: string
}

export interface QuizAnswer {
  questionId: string
  answer: string | string[]
  isCorrect: boolean
  pointsEarned: number
  timeSpent: number // in seconds
  submittedAt: string
}

export interface QuizResult {
  id: string
  sessionId: string
  quizId: string
  userId: string
  title: string
  completedAt: string
  totalQuestions: number
  totalMarks: number
  earnedMarks: number
  accuracy: number
  correctAnswers: number
  timeSpent: number // total time in seconds
  passed: boolean
  passingGrade: number // percentage
  questions: QuizQuestionResult[]
  summary: {
    totalTime: number
    averageTimePerQuestion: number
    fastestQuestion: number
    slowestQuestion: number
    difficultyBreakdown: Record<string, number>
  }
  recommendations?: string[]
  nextSteps?: string[]
}

export interface QuizQuestionResult {
  questionId: string
  questionNumber: number
  question: string
  type: string
  status: 'Correct' | 'Incorrect' | 'Partial'
  points: {
    earned: number
    total: number
  }
  userAnswer: string | string[]
  correctAnswer: string | string[]
  explanation?: string
  timeSpent: number
  options?: QuizOptionResult[]
}

export interface QuizOptionResult {
  id: string
  text: string
  isCorrect: boolean
  isSelected: boolean
}

export interface QuizProgress {
  currentQuestion: number
  totalQuestions: number
  answeredQuestions: number
  remainingQuestions: number
  progressPercentage: number
  timeRemaining: number
  timeElapsed: number
}

// API Response Types
export interface QuizListResponse {
  success: boolean
  data: {
    quizzes: QuizTopic[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    filters: {
      categories: string[]
      difficulties: string[]
      tags: string[]
    }
  }
  message?: string
}

export interface QuizDetailResponse {
  success: boolean
  data: QuizTopic
  message?: string
}

export interface QuizSessionResponse {
  success: boolean
  data: QuizSession
  message?: string
}

export interface QuizSubmitResponse {
  success: boolean
  data: QuizResult
  message?: string
}

export interface QuizResultResponse {
  success: boolean
  data: QuizResult
  message?: string
}

// Error Types
export interface QuizError {
  code: string
  message: string
  details?: any
}

export interface QuizApiError {
  success: false
  error: QuizError
}
