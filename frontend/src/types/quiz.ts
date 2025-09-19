// Updated quiz schema for section-based quizzes
export interface SectionQuiz {
  id: string
  sectionId: string
  courseId: string
  tutorId: string
  title: string
  description?: string
  questions: QuizQuestion[]
  passingScore: number // percentage (0-100)
  timeLimit?: number // minutes, optional
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Legacy - keeping for backward compatibility
export interface LessonQuiz {
  id: string
  lessonId: string
  tutorId: string
  title: string
  description?: string
  questions: QuizQuestion[]
  passingScore: number // percentage (0-100)
  maxAttempts: number
  timeLimit?: number // minutes, optional
  isRequired: boolean // whether student must complete to proceed
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface QuizQuestion {
  id: string
  quizId: string
  questionText: string
  options: QuizQuestionOption[]
  correctAnswer: string
  explanation?: string
  order: number
}

export interface QuizQuestionOption {
  id: string
  text: string
  isCorrect: boolean
  order: number
}

// Student quiz attempt tracking
export interface QuizAttempt {
  id: string
  quizId: string
  sectionId: string
  courseId: string
  studentId: string
  answers: Record<string, string> // questionId -> answer
  correctAnswers: number
  totalQuestions: number
  percentage: number
  passed: boolean
  timeSpent: number // seconds
  completedAt: Date
  createdAt: Date
}

// Quiz result for display
export interface QuizResult {
  attempt: QuizAttempt
  questions: QuizQuestion[]
  feedback: string
  recommendations?: string[]
}

// Legacy types - keeping for backward compatibility during migration
// These will be removed after migration is complete
export interface QuizTopic {
  id: string
  title: string
  description: string
  image: string
  category: string
  difficulty: string
  estimatedDuration: number
  totalQuestions: number
  totalMarks: number
  timeLimit: number
  status: string
  score?: number
  prerequisites: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
  instructor: {
    id: string
    name: string
    avatar: string
    rating: number
  }
  questions: QuizQuestion[]
}