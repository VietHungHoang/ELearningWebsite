import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  fetchQuizById,
  startQuizSession,
  saveAnswer,
  navigateToQuestion,
  submitQuiz,
  fetchQuizResult,
  setCurrentQuestionIndex,
  updateAnswer,
  setTimeRemaining,
  updateProgress,
  clearCurrentSession,
  clearCurrentResult
} from '../store/slices/quizSlice'
import type { QuizQuestion } from '../types/quiz'

export const useQuizFlow = () => {
  const dispatch = useAppDispatch()
  const {
    currentQuiz,
    currentSession,
    currentResult,
    currentQuestionIndex,
    answers,
    timeRemaining,
    isQuizActive,
    progress,
    sessionLoading,
    resultLoading
  } = useAppSelector((state) => state.quiz)

  // Timer effect
  useEffect(() => {
    let interval: number | null = null

    if (isQuizActive && timeRemaining > 0) {
      interval = setInterval(() => {
        dispatch(setTimeRemaining(timeRemaining - 1))
        dispatch(updateProgress())
      }, 1000)
    } else if (timeRemaining === 0 && isQuizActive) {
      // Auto-submit when time runs out
      handleSubmitQuiz()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isQuizActive, timeRemaining, dispatch])

  // Start quiz flow
  const startQuiz = useCallback(async (quizId: string) => {
    try {
      // Fetch quiz details
      await dispatch(fetchQuizById(quizId)).unwrap()
      
      // Start quiz session
      await dispatch(startQuizSession(quizId)).unwrap()
      
      return true
    } catch (error) {
      console.error('Failed to start quiz:', error)
      return false
    }
  }, [dispatch])

  // Navigate to specific question
  const goToQuestion = useCallback(async (questionIndex: number) => {
    if (!currentSession) return false

    try {
      await dispatch(navigateToQuestion({
        sessionId: currentSession.id,
        questionIndex
      })).unwrap()
      
      dispatch(setCurrentQuestionIndex(questionIndex))
      return true
    } catch (error) {
      console.error('Failed to navigate to question:', error)
      return false
    }
  }, [dispatch, currentSession])

  // Save answer
  const saveQuestionAnswer = useCallback(async (
    questionId: string,
    answer: string | string[]
  ) => {
    if (!currentSession) return false

    try {
      // Update local state immediately for better UX
      dispatch(updateAnswer({ questionId, answer }))
      
      // Save to server
      await dispatch(saveAnswer({
        sessionId: currentSession.id,
        questionId,
        answer
      })).unwrap()
      
      dispatch(updateProgress())
      return true
    } catch (error) {
      console.error('Failed to save answer:', error)
      return false
    }
  }, [dispatch, currentSession])

  // Submit quiz
  const handleSubmitQuiz = useCallback(async () => {
    if (!currentSession) return false

    try {
      const result = await dispatch(submitQuiz(currentSession.id)).unwrap()
      dispatch(clearCurrentSession())
      return result
    } catch (error) {
      console.error('Failed to submit quiz:', error)
      return false
    }
  }, [dispatch, currentSession])

  // Get quiz result
  const getQuizResult = useCallback(async (sessionId: string) => {
    try {
      const result = await dispatch(fetchQuizResult(sessionId)).unwrap()
      return result
    } catch (error) {
      console.error('Failed to get quiz result:', error)
      return null
    }
  }, [dispatch])

  // Exit quiz
  const exitQuiz = useCallback(() => {
    dispatch(clearCurrentSession())
    dispatch(clearCurrentResult())
  }, [dispatch])

  // Get current question
  const getCurrentQuestion = useCallback((): QuizQuestion | null => {
    if (!currentQuiz || !currentQuiz.questions) return null
    return currentQuiz.questions[currentQuestionIndex] || null
  }, [currentQuiz, currentQuestionIndex])

  // Get question status
  const getQuestionStatus = useCallback((questionIndex: number) => {
    if (!currentQuiz || !currentQuiz.questions) return 'unanswered'
    
    const question = currentQuiz.questions[questionIndex]
    if (!question) return 'unanswered'
    
    return answers[question.id] ? 'answered' : 'unanswered'
  }, [currentQuiz, answers])

  // Check if quiz is completed
  const isQuizCompleted = useCallback(() => {
    if (!currentQuiz || !currentQuiz.questions) return false
    
    const totalQuestions = currentQuiz.questions.length
    const answeredQuestions = Object.keys(answers).length
    
    return answeredQuestions === totalQuestions
  }, [currentQuiz, answers])

  // Get completion percentage
  const getCompletionPercentage = useCallback(() => {
    if (!currentQuiz || !currentQuiz.questions) return 0
    
    const totalQuestions = currentQuiz.questions.length
    const answeredQuestions = Object.keys(answers).length
    
    return Math.round((answeredQuestions / totalQuestions) * 100)
  }, [currentQuiz, answers])

  // Format time remaining
  const formatTimeRemaining = useCallback(() => {
    const hours = Math.floor(timeRemaining / 3600)
    const minutes = Math.floor((timeRemaining % 3600) / 60)
    const seconds = timeRemaining % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }, [timeRemaining])

  // Get time color based on remaining time
  const getTimeColor = useCallback(() => {
    if (!currentSession) return 'text-gray-600'
    
    const percentage = (timeRemaining / currentSession.timeLimit) * 100
    if (percentage > 50) return 'text-green-600'
    if (percentage > 20) return 'text-yellow-600'
    return 'text-red-600'
  }, [timeRemaining, currentSession])

  return {
    // State
    currentQuiz,
    currentSession,
    currentResult,
    currentQuestionIndex,
    answers,
    timeRemaining,
    isQuizActive,
    progress,
    sessionLoading,
    resultLoading,
    
    // Actions
    startQuiz,
    goToQuestion,
    saveQuestionAnswer,
    handleSubmitQuiz,
    getQuizResult,
    exitQuiz,
    
    // Helpers
    getCurrentQuestion,
    getQuestionStatus,
    isQuizCompleted,
    getCompletionPercentage,
    formatTimeRemaining,
    getTimeColor
  }
}

export default useQuizFlow
