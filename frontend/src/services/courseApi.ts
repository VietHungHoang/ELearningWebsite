import api from './api'

export interface InstructorDto {
  id: string
  name: string
  avatar: string
  title: string
  bio?: string
  rating: number
  totalStudents: number
  totalCourses: number
}

export interface ProgressDto {
  completed: number
  total: number
  duration: string
}

export interface LessonDto {
  id: string
  sectionId: string
  courseId: string
  title: string
  description: string
  duration: string
  isCompleted: boolean
  isCurrent: boolean
  isLocked: boolean
  videoUrl: string
  thumbnail: string
  orderIndex: number
}

export interface SectionDto {
  id: string
  courseId: string
  title: string
  isExpanded: boolean
  progress: ProgressDto
  quiz?: any // QuizDto
  quizCompleted: boolean
  isUnlocked: boolean
  lessons: LessonDto[]
}

export interface CourseDto {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  progress: number
  thumbnail: string
  videoUrl: string
  instructor: InstructorDto
  duration: string
  level: string
  rating: number
  studentsCount: number
  price: number
  originalPrice: number
  isEnrolled: boolean
  lastAccessed: string
  completionPercentage: number
  totalLessons: number
  completedLessons: number
  sections: SectionDto[]
  createdAt?: string
  updatedAt?: string
}

export const courseApi = {
  // Get all courses
  getAllCourses: async (): Promise<CourseDto[]> => {
    console.log('📚 API: Fetching all courses')
    try {
      const response = await api.get('/courses')
      console.log('✅ API: Courses received:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ API: Error fetching courses:', error)
      throw error
    }
  },

  // Get course by ID
  getCourseById: async (id: string): Promise<CourseDto> => {
    console.log('🔍 API: Fetching course by ID:', id)
    try {
      const response = await api.get(`/courses/${id}`)
      console.log('✅ API: Course received:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ API: Error fetching course by ID:', error)
      throw error
    }
  },

  // Get course by slug
  getCourseBySlug: async (slug: string): Promise<CourseDto> => {
    console.log('🔍 API: Fetching course by slug:', slug)
    try {
      const response = await api.get(`/courses/slug/${slug}`)
      console.log('✅ API: Course received:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ API: Error fetching course by slug:', error)
      throw error
    }
  },

  // Get courses enrolled by student
  getCoursesByStudentId: async (studentId: string): Promise<CourseDto[]> => {
    console.log('👨‍🎓 API: Fetching courses for student:', studentId)
    try {
      const response = await api.get(`/courses/student/${studentId}`)
      console.log('✅ API: Student courses received:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ API: Error fetching student courses:', error)
      throw error
    }
  },

  // Get courses by instructor
  getCoursesByInstructorId: async (instructorId: string): Promise<CourseDto[]> => {
    console.log('👨‍🏫 API: Fetching courses for instructor:', instructorId)
    try {
      const response = await api.get(`/courses/instructor/${instructorId}`)
      console.log('✅ API: Instructor courses received:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ API: Error fetching instructor courses:', error)
      throw error
    }
  },

  // Search courses
  searchCourses: async (query: string): Promise<CourseDto[]> => {
    console.log('🔍 API: Searching courses with query:', query)
    try {
      const response = await api.get(`/courses/search?query=${encodeURIComponent(query)}`)
      console.log('✅ API: Search results received:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ API: Error searching courses:', error)
      throw error
    }
  },

  // Get courses by category
  getCoursesByCategory: async (category: string): Promise<CourseDto[]> => {
    console.log('📂 API: Fetching courses by category:', category)
    try {
      const response = await api.get(`/courses/category/${encodeURIComponent(category)}`)
      console.log('✅ API: Category courses received:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ API: Error fetching courses by category:', error)
      throw error
    }
  },

  // Get courses by level
  getCoursesByLevel: async (level: string): Promise<CourseDto[]> => {
    console.log('📊 API: Fetching courses by level:', level)
    try {
      const response = await api.get(`/courses/level/${encodeURIComponent(level)}`)
      console.log('✅ API: Level courses received:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ API: Error fetching courses by level:', error)
      throw error
    }
  }
}
