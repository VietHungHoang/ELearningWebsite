import { useState, useCallback } from 'react'
import type { CourseDto } from '../services/courseApi'
import type { LessonQuiz as LessonQuizType, QuizResult } from '../types/quiz'
// import { quizApi } from '../services/quizApi' // COMMENTED FOR TESTING

export const useQuizManagement = (
  courseData: CourseDto | null,
  setCourseData: (data: CourseDto) => void,
  onLessonCompletion: () => void
) => {
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState<LessonQuizType | null>(null)
  const [currentSection, setCurrentSection] = useState<string | null>(null)

  const handleQuizComplete = useCallback(async (result: QuizResult) => {
    console.log('🎯 🚀 handleQuizComplete called!', result.attempt.passed ? 'PASSED' : 'FAILED', 'for section:', currentSection)
    
    // Mark the quiz as completed for the current section only if passed
    if (currentSection && courseData && result.attempt.passed) {
      console.log('🎯 ✅ Processing quiz completion for section:', currentSection)
      
      // TODO: Call API to save quiz completion to database (COMMENTED FOR TESTING)
      // try {
      //   // Call API to save quiz completion to database
      //   if (currentQuiz?.id) {
      //     console.log('🎯 📡 Calling API to save quiz completion...')
      //     await quizApi.completeQuiz(currentQuiz.id, {
      //       studentId: 'student-001', // TODO: Get from auth context
      //       score: result.attempt.percentage,
      //       passed: result.attempt.passed,
      //       sectionId: currentSection,
      //       courseId: courseData.id
      //     })
      //     console.log('🎯 ✅ Quiz completion saved to database')
      //   }
      // } catch (error) {
      //   console.error('🎯 ❌ Error saving quiz completion:', error)
      //   // Continue with UI update even if API fails
      // }
      
      console.log('🎯 MOCK: Skipping API call for quiz completion (testing mode)')
      
      // Find current section index
      const currentSectionIndex = courseData.sections.findIndex(section => section.id === currentSection)
      
      // Update sections: mark quiz completed and unlock next section (like code cũ)
      const updatedSections = courseData.sections.map((section, index) => {
        if (section.id === currentSection) {
          // Mark ALL lessons in current section as completed
          return {
            ...section,
            lessons: section.lessons.map(lesson => ({ ...lesson, isCompleted: true })),
            quizCompleted: true
          }
        }
        // Unlock the next section if this quiz is completed
        if (index === currentSectionIndex + 1) {
          return { ...section, isUnlocked: true }
        }
        return section
      })
      
      // Update course data directly (like code cũ)
      setCourseData({
        ...courseData,
        sections: updatedSections
      })
      
      console.log('🎯 Section unlocked:', currentSectionIndex + 1)
    }
    
    setShowQuiz(false)
    setCurrentQuiz(null)
    setCurrentSection(null)
  }, [currentSection, courseData, setCourseData, currentQuiz])

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
