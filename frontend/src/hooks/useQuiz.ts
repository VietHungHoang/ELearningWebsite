import { useState, useCallback } from 'react'
import type { LessonQuiz as LessonQuizType, QuizResult, QuizAttempt } from '../types/quiz'
import { quizApiService } from '../services/quizApi'

// Quiz service using real API
const quizService = {
  // Submit quiz attempt
  submitQuizAttempt: async (quizId: string, answers: Record<string, string | string[]>): Promise<QuizResult> => {
    try {
      // Start quiz attempt
      const attemptData = {
        quizId,
        sectionId: 'section-1', // This should come from context
        courseId: 'course-1', // This should come from context
        studentId: 'current-student', // This should come from auth context
        answers: answers as Record<string, string>,
        timeSpent: 0
      }
      
      const attempt = await quizApiService.startQuizAttempt(attemptData)
      
      // Update with answers and submit
      await quizApiService.updateQuizAttemptAnswers(attempt.id, answers as Record<string, string>, 0)
      const submittedAttempt = await quizApiService.submitQuizAttempt(attempt.id)
      
      // Get quiz details for questions
      const quiz = await quizApiService.getQuizById(quizId)
      
      const result: QuizResult = {
        attempt: submittedAttempt,
        questions: quiz.questions || [],
        feedback: submittedAttempt.passed 
          ? `Congratulations! You passed with ${submittedAttempt.percentage}%` 
          : `You scored ${submittedAttempt.percentage}%. You need ${quiz.passingScore}% to pass.`,
        recommendations: submittedAttempt.passed 
          ? ['Great job! You can proceed to the next lesson.']
          : ['Review the lesson content and try again.', 'Focus on the areas you missed.']
      }

      return result
    } catch (error) {
      console.error('Error submitting quiz attempt:', error)
      throw error
    }
  },

  // Get quiz attempts
  getQuizAttempts: async (quizId: string, studentId: string): Promise<QuizAttempt[]> => {
    try {
      return await quizApiService.getQuizAttemptsByStudentAndQuiz(studentId, quizId)
    } catch (error) {
      console.error('Error getting quiz attempts:', error)
      return []
    }
  }
}

export const useQuiz = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentQuiz, setCurrentQuiz] = useState<LessonQuizType | null>(null)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])

  // Generic API call handler
  const handleApiCall = useCallback(async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      console.error('API call failed:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Start quiz
  const startQuiz = useCallback((quiz: LessonQuizType) => {
    setCurrentQuiz(quiz)
    setAnswers({})
    setQuizResult(null)
    setError(null)
  }, [])

  // Submit quiz
  const submitQuiz = useCallback(async (): Promise<QuizResult | null> => {
    if (!currentQuiz) return null

    const result = await handleApiCall(() => 
      quizService.submitQuizAttempt(currentQuiz.id, answers)
    )

    if (result) {
      setQuizResult(result)
      // Load attempts after submission
      loadQuizAttempts()
    }

    return result
  }, [currentQuiz, answers, handleApiCall])

  // Load quiz attempts
  const loadQuizAttempts = useCallback(async () => {
    if (!currentQuiz) return

    const result = await handleApiCall(() => 
      quizService.getQuizAttempts(currentQuiz.id, 'current-user')
    )

    if (result) {
      setAttempts(result)
    }
  }, [currentQuiz, handleApiCall])

  // Update answer
  const updateAnswer = useCallback((questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }, [])

  // Clear quiz
  const clearQuiz = useCallback(() => {
    setCurrentQuiz(null)
    setQuizResult(null)
    setAnswers({})
    setAttempts([])
    setError(null)
  }, [])

  // Retake quiz
  const retakeQuiz = useCallback(() => {
    if (currentQuiz) {
      setAnswers({})
      setQuizResult(null)
      setError(null)
    }
  }, [currentQuiz])

  // Check if can retake
  const canRetake = useCallback((): boolean => {
    if (!currentQuiz) return false
    
    const remainingAttempts = currentQuiz.maxAttempts - attempts.length
    return remainingAttempts > 0
  }, [currentQuiz, attempts])

  // Get remaining attempts
  const getRemainingAttempts = useCallback((): number => {
    if (!currentQuiz) return 0
    
    return Math.max(0, currentQuiz.maxAttempts - attempts.length)
  }, [currentQuiz, attempts])

  // Check if all questions answered
  const isAllQuestionsAnswered = useCallback((): boolean => {
    if (!currentQuiz || !currentQuiz.questions) return false
    
    return currentQuiz.questions.every(question => 
      answers[question.id] !== undefined && answers[question.id] !== ''
    )
  }, [currentQuiz, answers])

  return {
    // State
    loading,
    error,
    currentQuiz,
    answers,
    quizResult,
    attempts,
    
    // Actions
    startQuiz,
    submitQuiz,
    loadQuizAttempts,
    updateAnswer,
    clearQuiz,
    retakeQuiz,
    
    // Computed
    canRetake,
    getRemainingAttempts,
    isAllQuestionsAnswered
  }
}