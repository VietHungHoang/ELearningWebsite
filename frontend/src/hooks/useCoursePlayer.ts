import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { courseApi } from '../services/courseApi'
import { lessonProgressApi } from '../services/lessonProgressApi'
// import { quizApi } from '../services/quizApi' // COMMENTED FOR TESTING
import type { CourseDto, LessonDto } from '../services/courseApi'

export const useCoursePlayer = () => {
  const { slug } = useParams<{ slug: string }>()
  const [courseData, setCourseData] = useState<CourseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentLesson, setCurrentLesson] = useState<LessonDto | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Helper function to find current lesson
  const findCurrentLesson = useCallback((course: CourseDto): LessonDto | null => {
    console.log('DEBUG: findCurrentLesson called, course sections:', course.sections.length)
    
    // First, try to find a lesson marked as current
    for (const section of course.sections) {
      console.log('DEBUG: Checking section:', section.id, 'lessons:', section.lessons.length)
      for (const lesson of section.lessons) {
        console.log('DEBUG: Checking lesson:', lesson.id, 'isCurrent:', lesson.isCurrent)
        if (lesson.isCurrent === true) {
          console.log('DEBUG: Found current lesson:', lesson.title, 'ID:', lesson.id)
          return lesson
        }
      }
    }
    
    // If no lesson is marked as current, find the first unlocked lesson
    console.log('DEBUG: No current lesson found, looking for first unlocked lesson')
    for (const section of course.sections) {
      // Check if section is unlocked (first section is always unlocked)
      const isFirstSection = section.id.includes('section-1')
      const isSectionUnlocked = isFirstSection || section.isUnlocked === true
      
      if (isSectionUnlocked) {
        for (const lesson of section.lessons) {
          if (lesson.isLocked !== true) {
            console.log('DEBUG: Found first unlocked lesson:', lesson.title, 'ID:', lesson.id)
            return lesson
          }
        }
      }
    }
    
    console.log('DEBUG: No suitable lesson found')
    return null
  }, [])

  // Helper function to find next lesson
  const findNextLesson = useCallback((course: CourseDto, currentLessonId: string): LessonDto | null => {
    let foundCurrent = false
    for (const section of course.sections) {
      // Check if section is unlocked (first section is always unlocked)
      const isFirstSection = section.id.includes('section-1')
      const isSectionUnlocked = isFirstSection || section.isUnlocked
      
      if (!isSectionUnlocked) {
        // Skip this section if it's locked
        continue
      }
      
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

  // Helper function to update lesson progress
  const updateLessonProgress = useCallback(async (lessonId: string, isCompleted: boolean) => {
    if (!courseData) return

    try {
      // Call API to update lesson progress in database
      await lessonProgressApi.updateLessonProgress(lessonId, {
        isCompleted,
        isCurrent: false, // We'll handle current lesson separately
        isLocked: false
      })
      console.log('DEBUG: Successfully updated lesson progress in database')
    } catch (error) {
      console.error('DEBUG: Failed to update lesson progress in database:', error)
      // Continue with local update even if API fails
    }

    // Find the section containing the lesson to update
    const targetSection = courseData.sections.find(section => 
      section.lessons.some(lesson => lesson.id === lessonId)
    )
    
    if (!targetSection) {
      console.log('DEBUG: No section found for lesson:', lessonId)
      return
    }

    console.log('DEBUG: Target section ID:', targetSection.id)

    const updatedSections = courseData.sections.map(section => {
      console.log('DEBUG: Processing section:', section.id)
      return {
        ...section,
        lessons: section.lessons.map(lesson => {
          console.log('DEBUG: Processing lesson:', lesson.id, 'in section:', section.id)
          // Update the lesson if it matches the lessonId
          if (lesson.id === lessonId) {
            console.log('DEBUG: Updating lesson:', lessonId, 'in section:', section.id, 'to completed:', isCompleted)
            return { ...lesson, isCompleted }
          }
          return lesson
        })
      }
    })

    // Calculate overall course progress
    const totalLessons = updatedSections.reduce((total, section) => total + section.lessons.length, 0)
    const completedLessons = updatedSections.reduce((completed, section) => 
      completed + section.lessons.filter(lesson => lesson.isCompleted).length, 0
    )
    const courseProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    // Update section progress for ALL sections
    const updatedSectionsWithProgress = updatedSections.map(section => {
      const sectionCompleted = section.lessons.filter(lesson => lesson.isCompleted).length
      const sectionTotal = section.lessons.length
      
      console.log('DEBUG: Updating progress for section:', section.id, 'completed:', sectionCompleted, 'total:', sectionTotal)
      
      return {
        ...section,
        progress: {
          ...section.progress,
          completed: sectionCompleted,
          total: sectionTotal,
          duration: `${section.lessons.reduce((total, lesson) => {
            const duration = parseInt(lesson.duration.replace(/\D/g, '')) || 0
            return total + duration
          }, 0)} min`
        }
      }
    })

    const updatedCourseData = {
      ...courseData,
      sections: [...updatedSectionsWithProgress], // Create new array
      progress: courseProgress
    }

    // Force re-render by creating a completely new object
    setCourseData(() => {
      const newData = { ...updatedCourseData }
      return newData
    })
    
    // Update currentLesson if it was the one being updated
    if (currentLesson && currentLesson.id === lessonId) {
      const updatedCurrentLesson = updatedSectionsWithProgress
        .flatMap(section => section.lessons)
        .find(lesson => lesson.id === lessonId)
      
      console.log('DEBUG: Updating currentLesson:', updatedCurrentLesson?.title, 'completed:', updatedCurrentLesson?.isCompleted)
      if (updatedCurrentLesson) {
        setCurrentLesson(() => ({ ...updatedCurrentLesson }))
      }
    }
  }, [courseData, currentLesson])

  // Note: handleQuizCompletion removed - logic moved to useQuizManagement for simplicity

  // Load course data
  const loadCourse = useCallback(async (slug: string) => {
    try {
      setLoading(true)
      setError(null)
      console.log('Loading course with slug:', slug)
      
      const course = await courseApi.getCourseBySlug(slug)
      console.log('Found course:', course)
      console.log('Raw course data:', JSON.stringify(course, null, 2))
      
      if (course) {
        console.log('DEBUG: Course data received:', {
          title: course.title,
          sections: course.sections.length,
          sectionsData: course.sections.map(section => ({
            id: section.id,
            title: section.title,
            isUnlocked: section.isUnlocked,
            lessons: section.lessons.map(lesson => ({
              id: lesson.id,
              title: lesson.title,
              isCurrent: lesson.isCurrent,
              isLocked: lesson.isLocked,
              isCompleted: lesson.isCompleted
            }))
          }))
        })
        
        // Debug: Check lesson completion status
        const allLessons = course.sections.flatMap(section => section.lessons)
        const completedLessons = allLessons.filter(lesson => lesson.isCompleted)
        console.log('DEBUG: Completed lessons from API:', completedLessons.map(l => ({ id: l.id, title: l.title, completed: l.isCompleted })))
        
        // Calculate progress from API data
        const totalLessons = allLessons.length
        const completedCount = completedLessons.length
        // MOCK: Set progress to 100% for final quiz testing
        const courseProgress = 100 // totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
        
        console.log('DEBUG: Calculating progress from API - total:', totalLessons, 'completed:', completedCount, 'progress:', courseProgress)
        
        // TODO: Load quiz completion status from database (COMMENTED FOR TESTING)
        // console.log('🎯 Loading quiz completion status from database...')
        // try {
        //   const completionStatus = await quizApi.getQuizCompletionStatus('student-001', course.id)
        //   console.log('🎯 Quiz completion status loaded:', completionStatus)
        //   
        //   // Update course with completion status
        //   if (completionStatus.sectionCompletionStatus) {
        //     const updatedSections = course.sections.map((section, index) => {
        //       const isQuizCompleted = completionStatus.sectionCompletionStatus[section.id] === true
        //       const isUnlocked = index === 0 || completionStatus.sectionCompletionStatus[course.sections[index - 1].id] === true
        //       
        //       return {
        //         ...section,
        //         quizCompleted: isQuizCompleted,
        //         isUnlocked: isUnlocked,
        //         lessons: section.lessons.map(lesson => ({
        //           ...lesson,
        //           isCompleted: isQuizCompleted // Mark all lessons as completed if quiz is passed
        //         }))
        //       }
        //     })
        //     
        //     course.sections = updatedSections
        //     console.log('🎯 Course sections updated with completion status')
        //   }
        // } catch (error) {
        //   console.error('🎯 Error loading quiz completion status:', error)
        //   // Continue without completion status
        // }
        
        // MOCK DATA: Unlock all sections and mark all lessons as completed for testing
        console.log('🎯 MOCK: Unlocking all sections for final quiz testing')
        const mockSections = course.sections.map((section) => ({
          ...section,
          quizCompleted: true, // Mark all quizzes as completed
          isUnlocked: true, // Unlock all sections
          lessons: section.lessons.map(lesson => ({
            ...lesson,
            isCompleted: true // Mark all lessons as completed
          }))
        }))
        
        course.sections = mockSections
        console.log('🎯 MOCK: All sections unlocked and lessons completed')
        
        // Update course with calculated progress
        const courseWithProgress = {
          ...course,
          progress: courseProgress
        }
        
        setCourseData(courseWithProgress)
        const current = findCurrentLesson(course)
        console.log('DEBUG: Setting currentLesson to:', current?.title, 'ID:', current?.id)
        setCurrentLesson(current)
      } else {
        setError('Course not found')
      }
    } catch (error) {
      console.error('Error loading course:', error)
      setError('Failed to load course')
    } finally {
      setLoading(false)
    }
  }, [findCurrentLesson])

  // Sync currentLesson with courseData when courseData changes
  useEffect(() => {
    if (courseData) {
      if (currentLesson) {
        const updatedCurrentLesson = courseData.sections
          .flatMap(section => section.lessons)
          .find(lesson => lesson.id === currentLesson.id)
        
        if (updatedCurrentLesson && updatedCurrentLesson !== currentLesson) {
          console.log('DEBUG: Syncing currentLesson with courseData')
          setCurrentLesson(updatedCurrentLesson)
        }
      } else {
        // If no currentLesson, try to find one
        console.log('DEBUG: No currentLesson, trying to find one')
        const foundLesson = findCurrentLesson(courseData)
        if (foundLesson) {
          console.log('DEBUG: Setting currentLesson from courseData:', foundLesson.title)
          setCurrentLesson(foundLesson)
        }
      }
    }
  }, [courseData, currentLesson, findCurrentLesson])

  // Debug log when courseData changes
  useEffect(() => {
    console.log('DEBUG: courseData changed, progress:', courseData?.progress)
  }, [courseData])

  // Load course when slug changes
  useEffect(() => {
    if (slug) {
      loadCourse(slug)
    } else {
      setLoading(false)
      setError('No course slug provided')
    }
  }, [slug, loadCourse])

  return {
    courseData,
    currentLesson,
    loading,
    error,
    setCourseData,
    setCurrentLesson,
    updateLessonProgress,
    findCurrentLesson,
    findNextLesson
  }
}
