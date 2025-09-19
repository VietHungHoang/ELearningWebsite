// Course-related type definitions
export interface Lesson {
  id: string
  title: string
  duration: string
  isCompleted: boolean
  isCurrent: boolean
  isLocked?: boolean
  videoUrl?: string
  description?: string
  quiz?: {
    id: string
    title: string
    description?: string
    questions: any[]
    passingScore: number
    maxAttempts: number
    timeLimit?: number
    isRequired: boolean
    isActive: boolean
  }
}

export interface Section {
  id: string
  title: string
  isExpanded: boolean
  progress: { completed: number; total: number; duration: string }
  lessons: Lesson[]
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
