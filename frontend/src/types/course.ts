// Course-related type definitions
import type { QuizQuestion } from './quiz'

export interface Lesson {
  id: string
  title: string
  duration: string
  isCompleted: boolean
  isCurrent: boolean
  isLocked?: boolean
  videoUrl?: string
  description?: string
}

export interface Section {
  id: string
  title: string
  isExpanded: boolean
  progress: { completed: number; total: number; duration: string }
  lessons: Lesson[]
  quiz?: {
    id: string
    title: string
    description?: string
    questions: QuizQuestion[]
    passingScore: number
    timeLimit?: number
    isActive: boolean
  }
  quizCompleted?: boolean
  isUnlocked?: boolean
}

export interface Course {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  progress: number
  thumbnail: string
  videoUrl?: string
  instructor: {
    name: string
    avatar: string
    title?: string
  }
  sections: Section[]
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  rating: number
  studentsCount: number
  price: number
  originalPrice?: number
  isEnrolled: boolean
  lastAccessed?: string
  completionPercentage: number
  totalLessons: number
  completedLessons: number
}
