import { useState, useCallback } from 'react'
import type { CourseDto } from '../services/courseApi'
import type { LessonQuiz as LessonQuizType, QuizResult } from '../../types/quiz'

export const useQuizManagement = (
  courseData: CourseDto | null,
  setCourseData: (data: CourseDto) => void,
  onLessonCompletion: () => void
) => {
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState<LessonQuizType | null>(null)
  const [currentSection, setCurrentSection] = useState<string | null>(null)

  const handleQuizComplete = useCallback((result: QuizResult) => {
    console.log('Quiz completed:', result, 'for section:', currentSection)
    
    // Mark the quiz as completed for the current section only if passed
    if (currentSection && courseData && result.attempt.passed) {
      const currentSectionIndex = courseData.sections.findIndex(section => section.id === currentSection)
      
      const updatedSections = courseData.sections.map((section, index) => {
        if (section.id === currentSection) {
          return { ...section, quizCompleted: true }
        }
        // Unlock the next section if this quiz is completed
        if (index === currentSectionIndex + 1) {
          return { ...section, isUnlocked: true }
        }
        return section
      })
      
      const updatedCourse = {
        ...courseData,
        sections: updatedSections
      }
      
      setCourseData(updatedCourse)
    }
    
    setShowQuiz(false)
    setCurrentQuiz(null)
    setCurrentSection(null)
  }, [currentSection, courseData, setCourseData])

  const handleQuizSkip = useCallback(() => {
    console.log('Skipping quiz')
    setShowQuiz(false)
    setCurrentQuiz(null)
    setCurrentSection(null)
    
    // Proceed to next lesson
    onLessonCompletion()
  }, [onLessonCompletion])

  const handleQuizSelect = useCallback((_quizId: string, sectionId: string) => {
    if (!courseData) return

    // Find the quiz in the section
    const section = courseData.sections.find(s => s.id === sectionId)
    if (!section?.quiz) return

    // Check if all lessons in the section are completed
    const allLessonsCompleted = section.lessons.every(lesson => lesson.isCompleted)
    if (!allLessonsCompleted) {
      alert('Bạn phải hoàn thành tất cả lessons trong section này trước khi có thể chơi quiz!')
      return
    }

    console.log('Selected quiz:', section.quiz.title, 'for section:', sectionId)
    setCurrentQuiz(section.quiz as LessonQuizType)
    setCurrentSection(sectionId)
    setShowQuiz(true)
  }, [courseData])

  return {
    showQuiz,
    currentQuiz,
    currentSection,
    handleQuizComplete,
    handleQuizSkip,
    handleQuizSelect
  }
}
