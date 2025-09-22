import { useCallback } from 'react'
import type { CourseDto, LessonDto } from '../services/courseApi'

export const useLessonNavigation = (
  courseData: CourseDto | null,
  currentLesson: LessonDto | null,
  setCourseData: (data: CourseDto) => void,
  setCurrentLesson: (lesson: LessonDto) => void
) => {
  // Helper function to check if previous/next lesson exists
  const hasPreviousLesson = useCallback(() => {
    if (!courseData || !currentLesson) return false

    let currentSectionIndex = -1
    let currentLessonIndex = -1

    for (let i = 0; i < courseData.sections.length; i++) {
      const lessonIndex = courseData.sections[i].lessons.findIndex(
        lesson => lesson.id === currentLesson.id
      )
      if (lessonIndex !== -1) {
        currentSectionIndex = i
        currentLessonIndex = lessonIndex
        break
      }
    }

    if (currentSectionIndex === -1 || currentLessonIndex === -1) return false

    // Check if previous lesson exists
    if (currentLessonIndex > 0) return true
    if (currentSectionIndex > 0) {
      return courseData.sections[currentSectionIndex - 1].lessons.length > 0
    }
    return false
  }, [courseData, currentLesson])

  const hasNextLesson = useCallback(() => {
    if (!courseData || !currentLesson) return false

    let currentSectionIndex = -1
    let currentLessonIndex = -1

    for (let i = 0; i < courseData.sections.length; i++) {
      const lessonIndex = courseData.sections[i].lessons.findIndex(
        lesson => lesson.id === currentLesson.id
      )
      if (lessonIndex !== -1) {
        currentSectionIndex = i
        currentLessonIndex = lessonIndex
        break
      }
    }

    if (currentSectionIndex === -1 || currentLessonIndex === -1) return false

    // Check if next lesson exists
    if (currentLessonIndex < courseData.sections[currentSectionIndex].lessons.length - 1) return true
    if (currentSectionIndex < courseData.sections.length - 1) {
      return courseData.sections[currentSectionIndex + 1].lessons.length > 0
    }
    return false
  }, [courseData, currentLesson])

  const handleLessonSelect = useCallback((lessonId: string, sectionId: string) => {
    if (!courseData) return
    console.log('DEBUG: handleLessonSelect called for lesson:', lessonId, 'section:', sectionId)

    // Find the section containing the lesson
    const targetSection = courseData.sections.find(section => section.id === sectionId)
    if (!targetSection) return

    // Check if this section is unlocked (first section is always unlocked)
    const currentSectionIndex = courseData.sections.findIndex(section => section.id === sectionId)
    const isFirstSection = currentSectionIndex === 0
    if (!isFirstSection && !targetSection.isUnlocked) {
      alert('Bạn phải hoàn thành quiz của section trước đó trước khi có thể xem section này!')
      return
    }

    // Update all lessons to set the selected one as current
    const updatedSections = courseData.sections.map(section => ({
      ...section,
      lessons: section.lessons.map(lesson => ({
        ...lesson,
        isCurrent: false // Reset all lessons first
      }))
    }))
    
    // Then set the selected lesson as current
    const targetSectionIndex = updatedSections.findIndex(section => section.id === sectionId)
    if (targetSectionIndex !== -1) {
      updatedSections[targetSectionIndex] = {
        ...updatedSections[targetSectionIndex],
        lessons: updatedSections[targetSectionIndex].lessons.map(lesson => ({
          ...lesson,
          isCurrent: lesson.id === lessonId
        }))
      }
    }

    const updatedCourse = {
      ...courseData,
      sections: updatedSections
    }

    setCourseData(updatedCourse)
    
    // Find and set the new current lesson
    const newCurrentLesson = updatedSections
      .flatMap(section => section.lessons)
      .find(lesson => lesson.isCurrent)
    
    if (newCurrentLesson) {
      console.log('DEBUG: Setting new currentLesson to:', newCurrentLesson.title, 'ID:', newCurrentLesson.id)
      setCurrentLesson(newCurrentLesson)
    }
  }, [courseData, setCourseData, setCurrentLesson])

  const handlePreviousLesson = useCallback(() => {
    if (!courseData || !currentLesson) return

    // Find current lesson index
    let currentSectionIndex = -1
    let currentLessonIndex = -1

    for (let i = 0; i < courseData.sections.length; i++) {
      const lessonIndex = courseData.sections[i].lessons.findIndex(
        lesson => lesson.id === currentLesson.id
      )
      if (lessonIndex !== -1) {
        currentSectionIndex = i
        currentLessonIndex = lessonIndex
        break
      }
    }

    if (currentSectionIndex === -1 || currentLessonIndex === -1) return

    // Find previous lesson
    let prevLesson = null
    let prevSectionIndex = currentSectionIndex
    let prevLessonIndex = currentLessonIndex - 1

    // Check if we need to go to previous section
    if (prevLessonIndex < 0) {
      prevSectionIndex = currentSectionIndex - 1
      if (prevSectionIndex >= 0) {
        prevLessonIndex = courseData.sections[prevSectionIndex].lessons.length - 1
      }
    }

    if (prevSectionIndex >= 0 && prevLessonIndex >= 0) {
      prevLesson = courseData.sections[prevSectionIndex].lessons[prevLessonIndex]
    }

    if (prevLesson) {
      // Update sections to set previous lesson as current
      const updatedSections = courseData.sections.map((section, sIndex) => ({
        ...section,
        lessons: section.lessons.map((lesson, lIndex) => ({
          ...lesson,
          isCurrent: sIndex === prevSectionIndex && lIndex === prevLessonIndex
        }))
      }))

      setCourseData({
        ...courseData,
        sections: updatedSections
      })

      setCurrentLesson(prevLesson)
    }
  }, [courseData, currentLesson, setCourseData, setCurrentLesson])

  const handleNextLesson = useCallback(() => {
    if (!courseData || !currentLesson) return

    // Find current lesson index
    let currentSectionIndex = -1
    let currentLessonIndex = -1

    for (let i = 0; i < courseData.sections.length; i++) {
      const lessonIndex = courseData.sections[i].lessons.findIndex(
        lesson => lesson.id === currentLesson.id
      )
      if (lessonIndex !== -1) {
        currentSectionIndex = i
        currentLessonIndex = lessonIndex
        break
      }
    }

    if (currentSectionIndex === -1 || currentLessonIndex === -1) return

    // Find next lesson
    let nextLesson = null
    let nextSectionIndex = currentSectionIndex
    let nextLessonIndex = currentLessonIndex + 1

    // Check if we need to go to next section
    if (nextLessonIndex >= courseData.sections[currentSectionIndex].lessons.length) {
      nextSectionIndex = currentSectionIndex + 1
      nextLessonIndex = 0
    }

    if (nextSectionIndex < courseData.sections.length && nextLessonIndex < courseData.sections[nextSectionIndex].lessons.length) {
      // Check if the next section is unlocked
      const nextSection = courseData.sections[nextSectionIndex]
      const isFirstSection = nextSection.id.includes('section-1')
      const isSectionUnlocked = isFirstSection || nextSection.isUnlocked
      
      if (isSectionUnlocked) {
        nextLesson = nextSection.lessons[nextLessonIndex]
      }
    }

    if (nextLesson) {
      // Update sections to set next lesson as current
      const updatedSections = courseData.sections.map((section, sIndex) => ({
        ...section,
        lessons: section.lessons.map((lesson, lIndex) => ({
          ...lesson,
          isCurrent: sIndex === nextSectionIndex && lIndex === nextLessonIndex
        }))
      }))

      setCourseData({
        ...courseData,
        sections: updatedSections
      })

      setCurrentLesson(nextLesson)
    }
  }, [courseData, currentLesson, setCourseData, setCurrentLesson])

  return {
    hasPreviousLesson,
    hasNextLesson,
    handleLessonSelect,
    handlePreviousLesson,
    handleNextLesson
  }
}
