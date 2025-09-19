import { useState, useCallback } from 'react'
import type { LessonQuiz as LessonQuizType, QuizResult, QuizAttempt } from '../types/quiz'

// Mock quiz service
const mockQuizService = {
  // Submit quiz attempt
  submitQuizAttempt: async (quizId: string, answers: Record<string, string | string[]>): Promise<QuizResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock scoring logic
    const totalQuestions = Object.keys(answers).length
    const correctAnswers = Math.floor(Math.random() * totalQuestions) + 1 // Random score for demo
    const score = Math.round((correctAnswers / totalQuestions) * 100)
    
    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      quizId,
      lessonId: '', // Will be set by caller
      studentId: 'current-user',
      answers,
      score: correctAnswers,
      totalPoints: totalQuestions,
      percentage: score,
      passed: score >= 70,
      timeSpent: Math.floor(Math.random() * 300) + 60, // 1-5 minutes
      completedAt: new Date(),
      createdAt: new Date()
    }

    const result: QuizResult = {
      attempt,
      questions: [], // Would be populated with actual questions
      correctAnswers,
      totalQuestions,
      feedback: score >= 70 
        ? 'Congratulations! You passed the quiz.' 
        : 'Keep studying! You can retake this quiz.',
      recommendations: score < 70 
        ? ['Review the lesson materials', 'Take notes on key concepts', 'Practice with similar questions']
        : ['Great job! Move on to the next lesson', 'Consider helping other students in discussions']
    }

    return result
  },

  // Get quiz attempts for a student
  getQuizAttempts: async (quizId: string, studentId: string): Promise<QuizAttempt[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock previous attempts
    return [
      {
        id: 'attempt-1',
        quizId,
        lessonId: 'lesson-1',
        studentId,
        answers: {},
        score: 6,
        totalPoints: 10,
        percentage: 60,
        passed: false,
        timeSpent: 180,
        completedAt: new Date(Date.now() - 86400000), // 1 day ago
        createdAt: new Date(Date.now() - 86400000)
      }
    ]
  }
}

export const useQuiz = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentQuiz, setCurrentQuiz] = useState<LessonQuizType | null>(null)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})

  const handleApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>
  ): Promise<T | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await apiCall()
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
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
      mockQuizService.submitQuizAttempt(currentQuiz.id, answers)
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
      mockQuizService.getQuizAttempts(currentQuiz.id, 'current-user')
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
    if (!currentQuiz) return false
    
    return currentQuiz.questions.every(question => 
      answers[question.id] !== undefined && answers[question.id] !== ''
    )
  }, [currentQuiz, answers])

  return {
    // State
    loading,
    error,
    currentQuiz,
    quizResult,
    attempts,
    answers,
    
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
    isAllQuestionsAnswered,
    
    // Utils
    clearError: () => setError(null)
  }
}
