import React, { useState, useCallback } from 'react'
import { courseApi, ApiError } from '../services/api'
import type { Course, Lesson } from '../types/course'

// Hook for course operations
export const useCourseApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>
  ): Promise<T | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await apiCall()
      return result
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getCourseBySlug = useCallback(async (slug: string): Promise<Course | null> => {
    console.log('🎣 Hook: Getting course by slug:', slug)
    const response = await handleApiCall(() => courseApi.getCourseBySlug(slug))
    console.log('🎣 Hook: Response received:', response ? 'SUCCESS' : 'FAILED')
    return response?.data || null
  }, [handleApiCall])

  const getCourseById = useCallback(async (id: string): Promise<Course | null> => {
    const response = await handleApiCall(() => courseApi.getCourseById(id))
    return response?.data || null
  }, [handleApiCall])

  const completeLesson = useCallback(async (courseId: string, lessonId: string): Promise<Course | null> => {
    const response = await handleApiCall(() => courseApi.completeLesson(courseId, lessonId))
    return response?.data || null
  }, [handleApiCall])

  const setCurrentLesson = useCallback(async (courseId: string, lessonId: string): Promise<Course | null> => {
    const response = await handleApiCall(() => courseApi.setCurrentLesson(courseId, lessonId))
    return response?.data || null
  }, [handleApiCall])

  const getLesson = useCallback(async (courseId: string, lessonId: string): Promise<Lesson | null> => {
    const response = await handleApiCall(() => courseApi.getLesson(courseId, lessonId))
    return response?.data || null
  }, [handleApiCall])

  const updateCourseProgress = useCallback(async (courseId: string, progress: number): Promise<Course | null> => {
    const response = await handleApiCall(() => courseApi.updateCourseProgress(courseId, progress))
    return response?.data || null
  }, [handleApiCall])

  const enrollInCourse = useCallback(async (courseId: string, userId: string): Promise<Course | null> => {
    const response = await handleApiCall(() => courseApi.enrollInCourse(courseId, userId))
    return response?.data || null
  }, [handleApiCall])

  const searchCourses = useCallback(async (query: string, filters?: {
    level?: string
    category?: string
  }): Promise<Course[] | null> => {
    const response = await handleApiCall(() => courseApi.searchCourses(query, filters))
    return response?.data || null
  }, [handleApiCall])

  const getEnrolledCourses = useCallback(async (userId: string): Promise<Course[] | null> => {
    const response = await handleApiCall(() => courseApi.getEnrolledCourses(userId))
    return response?.data || null
  }, [handleApiCall])

  return {
    loading,
    error,
    getCourseBySlug,
    getCourseById,
    completeLesson,
    setCurrentLesson,
    getLesson,
    updateCourseProgress,
    enrollInCourse,
    searchCourses,
    getEnrolledCourses,
    clearError: () => setError(null)
  }
}

// Hook for course state management
export const useCourse = (slug?: string) => {
  const [course, setCourse] = useState<Course | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  
  const {
    loading,
    error,
    getCourseBySlug,
    completeLesson: apiCompleteLesson,
    setCurrentLesson: apiSetCurrentLesson,
    clearError
  } = useCourseApi()

  // Helper function to find current lesson
  const findCurrentLesson = useCallback((courseData: Course): Lesson | null => {
    for (const section of courseData.sections) {
      for (const lesson of section.lessons) {
        if (lesson.isCurrent) {
          return lesson
        }
      }
    }
    return null
  }, [])

  // Helper function to find next lesson
  const findNextLesson = useCallback((courseData: Course, currentLessonId: string): Lesson | null => {
    let foundCurrent = false
    for (const section of courseData.sections) {
      for (const lesson of section.lessons) {
        if (foundCurrent && !lesson.isLocked) {
          return lesson
        }
        if (lesson.id === currentLessonId) {
          foundCurrent = true
        }
      }
    }
    return null
  }, [])

  // Load course by slug
  const loadCourse = useCallback(async (courseSlug: string) => {
    if (!courseSlug) return

    const courseData = await getCourseBySlug(courseSlug)
    if (courseData) {
      setCourse(courseData)
      const current = findCurrentLesson(courseData)
      setCurrentLesson(current)
      setIsInitialized(true)
    }
  }, [getCourseBySlug, findCurrentLesson])

  // Complete lesson
  const completeLesson = useCallback(async (lessonId: string) => {
    if (!course) return null

    const updatedCourse = await apiCompleteLesson(course.id, lessonId)
    if (updatedCourse) {
      setCourse(updatedCourse)
      const current = findCurrentLesson(updatedCourse)
      setCurrentLesson(current)
      return updatedCourse
    }
    return null
  }, [course, apiCompleteLesson, findCurrentLesson])

  // Set current lesson
  const selectLesson = useCallback(async (lessonId: string) => {
    if (!course) return

    const updatedCourse = await apiSetCurrentLesson(course.id, lessonId)
    if (updatedCourse) {
      setCourse(updatedCourse)
      const current = findCurrentLesson(updatedCourse)
      setCurrentLesson(current)
    }
  }, [course, apiSetCurrentLesson, findCurrentLesson])

  // Get next lesson
  const getNextLesson = useCallback((): Lesson | null => {
    if (!course || !currentLesson) return null
    return findNextLesson(course, currentLesson.id)
  }, [course, currentLesson, findNextLesson])

  // Initialize course if slug is provided
  React.useEffect(() => {
    if (slug && !isInitialized) {
      loadCourse(slug)
    }
  }, [slug, isInitialized, loadCourse])

  return {
    course,
    currentLesson,
    loading,
    error,
    isInitialized,
    loadCourse,
    completeLesson,
    selectLesson,
    getNextLesson,
    clearError
  }
}
