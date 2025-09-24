import { useState, useCallback } from 'react'
import type { CourseDto, LessonDto } from '../services/courseApi'

export const useLessonCompletion = (
  courseData: CourseDto | null,
  currentLesson: LessonDto | null,
  updateLessonProgress: (lessonId: string, isCompleted: boolean) => void,
  findNextLesson: (course: CourseDto, currentLessonId: string) => LessonDto | null,
  setCourseData: (data: CourseDto) => void,
  setCurrentLesson: (lesson: LessonDto) => void
) => {
  const [showNextLessonModal, setShowNextLessonModal] = useState(false)
  const [nextLesson, setNextLesson] = useState<LessonDto | null>(null)

  const handleLessonCompletion = useCallback(async () => {
    if (!currentLesson || !courseData) return
    console.log('🎯 Completing lesson:', currentLesson.title)

    // Mark current lesson as completed
    try {
      await updateLessonProgress(currentLesson.id, true)
      console.log('🎯 ✅ Lesson completed:', currentLesson.title)
    } catch (error) {
      console.error('🎯 ❌ Error completing lesson:', error)
    }

    // Find next lesson
    const next = findNextLesson(courseData, currentLesson.id)
    if (next) {
      console.log('🎯 Next lesson:', next.title)
      setNextLesson(next)
      setShowNextLessonModal(true)
    }
  }, [currentLesson, courseData, updateLessonProgress, findNextLesson])

  const handleVideoEnd = useCallback(async () => {
    console.log('🎯 Video ended:', currentLesson?.title)
    if (!currentLesson || !courseData) return

    // Complete the lesson
    await handleLessonCompletion()
  }, [currentLesson, courseData, handleLessonCompletion])

  const handleContinueToNextLesson = useCallback(() => {
    if (!nextLesson || !courseData) return

    // Set next lesson as current
    const updatedSections = courseData.sections.map(section => ({
      ...section,
      lessons: section.lessons.map(lesson => ({
        ...lesson,
        isCurrent: false // Reset all lessons first
      }))
    }))
    
    // Then set the next lesson as current
    const targetSectionIndex = updatedSections.findIndex(section => 
      section.lessons.some(lesson => lesson.id === nextLesson.id)
    )
    if (targetSectionIndex !== -1) {
      updatedSections[targetSectionIndex] = {
        ...updatedSections[targetSectionIndex],
        lessons: updatedSections[targetSectionIndex].lessons.map(lesson => ({
          ...lesson,
          isCurrent: lesson.id === nextLesson.id
        }))
      }
    }

    setCourseData({
      ...courseData,
      sections: updatedSections
    })

    setCurrentLesson(nextLesson)
    setShowNextLessonModal(false)
    setNextLesson(null)
  }, [nextLesson, courseData, setCourseData, setCurrentLesson])

  const handleSkipNextLesson = useCallback(() => {
    setShowNextLessonModal(false)
    setNextLesson(null)
  }, [])

  const handleRewatchCurrentLesson = useCallback(() => {
    if (!currentLesson || !courseData) return

    // Reset current lesson progress and restart video
    const updatedSections = courseData.sections.map(section => ({
      ...section,
      lessons: section.lessons.map(lesson => ({
        ...lesson,
        isCompleted: lesson.id === currentLesson.id ? false : lesson.isCompleted,
        isCurrent: lesson.id === currentLesson.id
      }))
    }))

    setCourseData({
      ...courseData,
      sections: updatedSections
    })

    // Close modal
    setShowNextLessonModal(false)
    setNextLesson(null)

    // Restart video from beginning after a short delay
    setTimeout(() => {
      const videoElement = document.querySelector('video')
      if (videoElement) {
        videoElement.currentTime = 0
        videoElement.play().catch(error => {
          console.error('Error restarting video:', error)
        })
      }
    }, 100)
  }, [currentLesson, courseData, setCourseData])

  return {
    showNextLessonModal,
    nextLesson,
    handleVideoEnd,
    handleLessonCompletion,
    handleContinueToNextLesson,
    handleSkipNextLesson,
    handleRewatchCurrentLesson
  }
}
