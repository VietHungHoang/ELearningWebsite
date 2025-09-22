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
    console.log('DEBUG: handleLessonCompletion called for lesson:', currentLesson.title, 'ID:', currentLesson.id)

    // Mark current lesson as completed
    console.log('DEBUG: About to call updateLessonProgress for lesson:', currentLesson.id)
    console.log('DEBUG: Current lesson details:', {
      id: currentLesson.id,
      title: currentLesson.title,
      sectionId: currentLesson.sectionId,
      courseId: currentLesson.courseId
    })
    try {
      await updateLessonProgress(currentLesson.id, true)
      console.log('DEBUG: updateLessonProgress completed for lesson:', currentLesson.id)
    } catch (error) {
      console.error('DEBUG: Error in updateLessonProgress:', error)
    }
    console.log('Marked lesson as completed:', currentLesson.title)

    // Find next lesson
    const next = findNextLesson(courseData, currentLesson.id)
    console.log('Next lesson found:', next?.title)
    if (next) {
      setNextLesson(next)
      setShowNextLessonModal(true)
    }
  }, [currentLesson, courseData, updateLessonProgress, findNextLesson])

  const handleVideoEnd = useCallback(async () => {
    console.log('DEBUG: handleVideoEnd called for lesson:', currentLesson?.title, 'ID:', currentLesson?.id)
    console.log('DEBUG: courseData exists:', !!courseData)
    if (!currentLesson || !courseData) {
      console.log('DEBUG: Missing currentLesson or courseData, cannot complete lesson')
      return
    }

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
