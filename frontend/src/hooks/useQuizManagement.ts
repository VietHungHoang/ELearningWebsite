import { useState, useCallback } from 'react'
import type { CourseDto } from '../services/courseApi'
import type { LessonQuiz as LessonQuizType, QuizResult } from '../types/quiz'

export const useQuizManagement = (
  courseData: CourseDto | null,
  setCourseData: (data: CourseDto) => void,
  onLessonCompletion: () => void,
  handleQuizCompletion: (sectionId: string) => void
) => {
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState<LessonQuizType | null>(null)
  const [currentSection, setCurrentSection] = useState<string | null>(null)

  const handleQuizComplete = useCallback((result: QuizResult) => {
    console.log('🎯 Quiz completed:', result.attempt.passed ? 'PASSED' : 'FAILED', 'for section:', currentSection)
    
    // Mark the quiz as completed for the current section only if passed
    if (currentSection && courseData && result.attempt.passed) {
      console.log('🎯 ✅ Processing quiz completion for section:', currentSection)
      
      // Use the centralized quiz completion handler
      handleQuizCompletion(currentSection)
      
      // Call lesson completion callback to trigger next lesson logic
      onLessonCompletion()
    }
    
    setShowQuiz(false)
    setCurrentQuiz(null)
    setCurrentSection(null)
  }, [currentSection, courseData, setCourseData, onLessonCompletion, handleQuizCompletion])

  const handleQuizSkip = useCallback(() => {
    console.log('Skipping quiz')
    setShowQuiz(false)
    setCurrentQuiz(null)
    setCurrentSection(null)
    
    // Proceed to next lesson
    onLessonCompletion()
  }, [onLessonCompletion])

  const handleQuizSelect = useCallback((_quizId: string, sectionId: string) => {
    console.log('🎯 Quiz select called for section:', sectionId)
    if (!courseData) {
      console.log('🎯 No courseData available')
      return
    }

    // Find the quiz in the section
    const section = courseData.sections.find(s => s.id === sectionId)
    console.log('🎯 Found section:', section?.id, 'quiz exists:', !!section?.quiz)
    if (!section?.quiz) {
      console.log('🎯 No quiz found in section:', sectionId)
      return
    }

    // Check if all lessons in the section are completed
    const allLessonsCompleted = section.lessons.every(lesson => lesson.isCompleted)
    console.log('🎯 Section lessons status:', {
      sectionId,
      totalLessons: section.lessons.length,
      completedLessons: section.lessons.filter(l => l.isCompleted).length,
      allCompleted: allLessonsCompleted,
      lessons: section.lessons.map(l => ({ id: l.id, title: l.title, completed: l.isCompleted }))
    })
    
    if (!allLessonsCompleted) {
      console.log('🎯 Not all lessons completed, showing alert')
      alert('Bạn phải hoàn thành tất cả lessons trong section này trước khi có thể chơi quiz!')
      return
    }

    console.log('🎯 Starting quiz:', section.quiz.title, 'for section:', sectionId)
    setCurrentQuiz(section.quiz as LessonQuizType)
    setCurrentSection(sectionId)
    setShowQuiz(true)
  }, [courseData])

  return {
    showQuiz,
    currentQuiz,
    currentSection,
    setCurrentQuiz,
    setShowQuiz,
    handleQuizComplete,
    handleQuizSkip,
    handleQuizSelect
  }
}
