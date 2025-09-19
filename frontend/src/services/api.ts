// API Service for course operations
import type { Course, Lesson } from '../types/course'
import { sampleCourses } from '../data/course-sample-data'

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  message?: string
  error?: string
}

// API Error class
export class ApiError extends Error {
  public status: number
  public code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Random chance of error (for testing)
const shouldSimulateError = () => {
  // Disable error simulation for debugging
  if (typeof window !== 'undefined' && (window as any).disableApiErrors) {
    return false
  }
  return Math.random() < 0.05 // 5% chance of error (reduced for debugging)
}

// Mock API Service
export class CourseApiService {
  private static instance: CourseApiService
  // private baseUrl = '/api/courses' // Reserved for future use
  private delayMs = 800 // Simulate network delay

  static getInstance(): CourseApiService {
    if (!CourseApiService.instance) {
      CourseApiService.instance = new CourseApiService()
    }
    return CourseApiService.instance
  }

  // Get all courses with pagination
  async getCourses(page = 1, limit = 10, filters?: {
    level?: string
    category?: string
    search?: string
  }): Promise<PaginatedResponse<Course>> {
    await delay(this.delayMs)
    
    if (shouldSimulateError()) {
      throw new ApiError('Failed to fetch courses', 500, 'NETWORK_ERROR')
    }

    let courses = Object.values(sampleCourses)

    // Apply filters
    if (filters) {
      if (filters.level) {
        courses = courses.filter(course => course.level === filters.level)
      }
      if (filters.category) {
        // Mock category filtering
        courses = courses.filter(course => 
          course.title.toLowerCase().includes(filters.category!.toLowerCase())
        )
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        courses = courses.filter(course => 
          course.title.toLowerCase().includes(searchTerm) ||
          course.description.toLowerCase().includes(searchTerm) ||
          course.instructor.name.toLowerCase().includes(searchTerm)
        )
      }
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCourses = courses.slice(startIndex, endIndex)

    return {
      success: true,
      data: paginatedCourses,
      pagination: {
        page,
        limit,
        total: courses.length,
        totalPages: Math.ceil(courses.length / limit)
      }
    }
  }

  // Get course by slug
  async getCourseBySlug(slug: string): Promise<ApiResponse<Course>> {
    console.log('🔍 API: Looking for course with slug:', slug)
    console.log('📚 Available slugs:', Object.keys(sampleCourses))
    
    await delay(this.delayMs)
    
    if (shouldSimulateError()) {
      console.log('❌ API: Simulated error occurred')
      throw new ApiError('Failed to fetch course', 500, 'NETWORK_ERROR')
    }

    const course = sampleCourses[slug]
    console.log('🎯 API: Course found:', course ? course.title : 'NOT FOUND')
    
    if (!course) {
      console.log('❌ API: Course not found for slug:', slug)
      console.log('Available courses:', Object.keys(sampleCourses).map(key => ({
        slug: key,
        title: sampleCourses[key].title
      })))
      throw new ApiError('Course not found', 404, 'COURSE_NOT_FOUND')
    }

    console.log('✅ API: Successfully returning course:', course.title)
    return {
      success: true,
      data: course
    }
  }

  // Get course by ID
  async getCourseById(id: string): Promise<ApiResponse<Course>> {
    await delay(this.delayMs)
    
    if (shouldSimulateError()) {
      throw new ApiError('Failed to fetch course', 500, 'NETWORK_ERROR')
    }

    const course = Object.values(sampleCourses).find(c => c.id === id)
    
    if (!course) {
      throw new ApiError('Course not found', 404, 'COURSE_NOT_FOUND')
    }

    return {
      success: true,
      data: course
    }
  }

  // Update course progress
  async updateCourseProgress(courseId: string, progress: number): Promise<ApiResponse<Course>> {
    await delay(this.delayMs)
    
    if (shouldSimulateError()) {
      throw new ApiError('Failed to update progress', 500, 'NETWORK_ERROR')
    }

    const course = Object.values(sampleCourses).find(c => c.id === courseId)
    
    if (!course) {
      throw new ApiError('Course not found', 404, 'COURSE_NOT_FOUND')
    }

    // Simulate updating progress
    const updatedCourse = {
      ...course,
      progress,
      completionPercentage: progress
    }

    return {
      success: true,
      data: updatedCourse,
      message: 'Progress updated successfully'
    }
  }

  // Mark lesson as completed
  async completeLesson(courseId: string, lessonId: string): Promise<ApiResponse<Course>> {
    await delay(this.delayMs)
    
    if (shouldSimulateError()) {
      throw new ApiError('Failed to complete lesson', 500, 'NETWORK_ERROR')
    }

    const course = Object.values(sampleCourses).find(c => c.id === courseId)
    
    if (!course) {
      throw new ApiError('Course not found', 404, 'COURSE_NOT_FOUND')
    }

    // Find and update the lesson
    const updatedSections = course.sections.map(section => ({
      ...section,
      lessons: section.lessons.map(lesson => 
        lesson.id === lessonId 
          ? { ...lesson, isCompleted: true, isCurrent: false }
          : lesson
      )
    }))

    // Calculate new progress
    const totalLessons = updatedSections.reduce((total, section) => total + section.lessons.length, 0)
    const completedLessons = updatedSections.reduce((completed, section) => 
      completed + section.lessons.filter(lesson => lesson.isCompleted).length, 0
    )
    const newProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    const updatedCourse = {
      ...course,
      sections: updatedSections,
      progress: newProgress,
      completionPercentage: newProgress,
      completedLessons
    }

    return {
      success: true,
      data: updatedCourse,
      message: 'Lesson completed successfully'
    }
  }

  // Set current lesson
  async setCurrentLesson(courseId: string, lessonId: string): Promise<ApiResponse<Course>> {
    await delay(this.delayMs)
    
    if (shouldSimulateError()) {
      throw new ApiError('Failed to set current lesson', 500, 'NETWORK_ERROR')
    }

    const course = Object.values(sampleCourses).find(c => c.id === courseId)
    
    if (!course) {
      throw new ApiError('Course not found', 404, 'COURSE_NOT_FOUND')
    }

    // Update all lessons to set the selected one as current
    const updatedSections = course.sections.map(section => ({
      ...section,
      lessons: section.lessons.map(lesson => ({
        ...lesson,
        isCurrent: lesson.id === lessonId
      }))
    }))

    const updatedCourse = {
      ...course,
      sections: updatedSections
    }

    return {
      success: true,
      data: updatedCourse,
      message: 'Current lesson updated successfully'
    }
  }

  // Get lesson by ID
  async getLesson(courseId: string, lessonId: string): Promise<ApiResponse<Lesson>> {
    await delay(this.delayMs)
    
    if (shouldSimulateError()) {
      throw new ApiError('Failed to fetch lesson', 500, 'NETWORK_ERROR')
    }

    const course = Object.values(sampleCourses).find(c => c.id === courseId)
    
    if (!course) {
      throw new ApiError('Course not found', 404, 'COURSE_NOT_FOUND')
    }

    let foundLesson: Lesson | null = null
    for (const section of course.sections) {
      const lesson = section.lessons.find(l => l.id === lessonId)
      if (lesson) {
        foundLesson = lesson
        break
      }
    }

    if (!foundLesson) {
      throw new ApiError('Lesson not found', 404, 'LESSON_NOT_FOUND')
    }

    return {
      success: true,
      data: foundLesson
    }
  }

  // Get user's enrolled courses
  async getEnrolledCourses(_userId: string): Promise<ApiResponse<Course[]>> {
    await delay(this.delayMs)
    
    if (shouldSimulateError()) {
      throw new ApiError('Failed to fetch enrolled courses', 500, 'NETWORK_ERROR')
    }

    const enrolledCourses = Object.values(sampleCourses).filter(course => course.isEnrolled)

    return {
      success: true,
      data: enrolledCourses
    }
  }

  // Enroll in course
  async enrollInCourse(courseId: string, _userId: string): Promise<ApiResponse<Course>> {
    await delay(this.delayMs)
    
    if (shouldSimulateError()) {
      throw new ApiError('Failed to enroll in course', 500, 'NETWORK_ERROR')
    }

    const course = Object.values(sampleCourses).find(c => c.id === courseId)
    
    if (!course) {
      throw new ApiError('Course not found', 404, 'COURSE_NOT_FOUND')
    }

    if (course.isEnrolled) {
      throw new ApiError('Already enrolled in this course', 400, 'ALREADY_ENROLLED')
    }

    const updatedCourse = {
      ...course,
      isEnrolled: true,
      lastAccessed: new Date().toISOString().split('T')[0]
    }

    return {
      success: true,
      data: updatedCourse,
      message: 'Successfully enrolled in course'
    }
  }

  // Search courses
  async searchCourses(query: string, filters?: {
    level?: string
    category?: string
  }): Promise<ApiResponse<Course[]>> {
    await delay(this.delayMs)
    
    if (shouldSimulateError()) {
      throw new ApiError('Failed to search courses', 500, 'NETWORK_ERROR')
    }

    let courses = Object.values(sampleCourses)
    const searchTerm = query.toLowerCase()

    // Filter by search term
    courses = courses.filter(course => 
      course.title.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm) ||
      course.instructor.name.toLowerCase().includes(searchTerm)
    )

    // Apply additional filters
    if (filters) {
      if (filters.level) {
        courses = courses.filter(course => course.level === filters.level)
      }
      if (filters.category) {
        courses = courses.filter(course => 
          course.title.toLowerCase().includes(filters.category!.toLowerCase())
        )
      }
    }

    return {
      success: true,
      data: courses
    }
  }
}

// Export singleton instance
export const courseApi = CourseApiService.getInstance()
