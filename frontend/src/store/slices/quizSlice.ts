import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  QuizTopic,
  QuizSession,
  QuizResult,
  QuizProgress,
  QuizAttempt
} from '../../types/quiz'
import quizService from '../../services/quizService'

// Async Thunks
export const fetchQuizzes = createAsyncThunk(
  'quiz/fetchQuizzes',
  async (params?: {
    page?: number
    limit?: number
    category?: string
    difficulty?: string
    search?: string
  }) => {
    const response = await quizService.getQuizzes(params)
    return response.data
  }
)

export const fetchQuizById = createAsyncThunk(
  'quiz/fetchQuizById',
  async (quizId: string) => {
    const response = await quizService.getQuizById(quizId)
    return response.data
  }
)

export const startQuizSession = createAsyncThunk(
  'quiz/startQuizSession',
  async (quizId: string) => {
    const response = await quizService.startQuizSession(quizId)
    return response.data
  }
)

export const saveAnswer = createAsyncThunk(
  'quiz/saveAnswer',
  async (params: {
    sessionId: string
    questionId: string
    answer: string | string[]
  }) => {
    const response = await quizService.saveAnswer(
      params.sessionId,
      params.questionId,
      params.answer
    )
    return response.data
  }
)

export const navigateToQuestion = createAsyncThunk(
  'quiz/navigateToQuestion',
  async (params: {
    sessionId: string
    questionIndex: number
  }) => {
    const response = await quizService.navigateToQuestion(
      params.sessionId,
      params.questionIndex
    )
    return response.data
  }
)

export const submitQuiz = createAsyncThunk(
  'quiz/submitQuiz',
  async (sessionId: string) => {
    const response = await quizService.submitQuiz(sessionId)
    return response.data
  }
)

export const startNewAttempt = createAsyncThunk(
  'quiz/startNewAttempt',
  async (quizId: string) => {
    // Create a new attempt for the quiz
    const attemptId = `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newAttempt: QuizAttempt = {
      id: attemptId,
      quizId,
      attemptNumber: 1, // Will be calculated based on existing attempts
      status: 'in_progress',
      totalMarks: 0, // Will be set from quiz data
      answers: {},
      startedAt: new Date().toISOString(),
      timeSpent: 0,
      passed: false
    }
    return newAttempt
  }
)

export const fetchQuizResult = createAsyncThunk(
  'quiz/fetchQuizResult',
  async (sessionId: string) => {
    const response = await quizService.getQuizResult(sessionId)
    return response.data
  }
)

export const fetchQuizHistory = createAsyncThunk(
  'quiz/fetchQuizHistory',
  async (params?: {
    page?: number
    limit?: number
    status?: string
  }) => {
    const response = await quizService.getQuizHistory(params)
    return response.data
  }
)

// Initial State
interface QuizState {
  // Quiz List
  quizzes: QuizTopic[]
  currentQuiz: QuizTopic | null
  quizListLoading: boolean
  quizListError: string | null
  
  // Quiz Session
  currentSession: QuizSession | null
  sessionLoading: boolean
  sessionError: string | null
  
  // Quiz Result
  currentResult: QuizResult | null
  resultLoading: boolean
  resultError: string | null
  
  // Quiz History
  quizHistory: QuizTopic[]
  historyLoading: boolean
  historyError: string | null
  
  // Current Attempt
  currentAttempt: QuizAttempt | null
  attemptLoading: boolean
  attemptError: string | null
  
  // UI State
  currentQuestionIndex: number
  answers: Record<string, string | string[]>
  timeRemaining: number
  isQuizActive: boolean
  
  // Progress
  progress: QuizProgress | null
  
  // Pagination
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  
  // Filters
  filters: {
    categories: string[]
    difficulties: string[]
    tags: string[]
  }
}

const initialState: QuizState = {
  quizzes: [],
  currentQuiz: null,
  quizListLoading: false,
  quizListError: null,
  
  currentSession: null,
  sessionLoading: false,
  sessionError: null,
  
  currentResult: null,
  resultLoading: false,
  resultError: null,
  
  quizHistory: [],
  historyLoading: false,
  historyError: null,
  
  currentAttempt: null,
  attemptLoading: false,
  attemptError: null,
  
  currentQuestionIndex: 0,
  answers: {},
  timeRemaining: 0,
  isQuizActive: false,
  
  progress: null,
  
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  
  filters: {
    categories: [],
    difficulties: [],
    tags: []
  }
}

// Quiz Slice
const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    // Quiz List Actions
    setCurrentQuiz: (state, action: PayloadAction<QuizTopic | null>) => {
      state.currentQuiz = action.payload
    },
    
    clearQuizList: (state) => {
      state.quizzes = []
      state.quizListError = null
    },
    
    // Quiz Session Actions
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload
    },
    
    updateAnswer: (state, action: PayloadAction<{
      questionId: string
      answer: string | string[]
    }>) => {
      const { questionId, answer } = action.payload
      state.answers[questionId] = answer
    },
    
    clearAnswers: (state) => {
      state.answers = {}
    },
    
    setTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload
    },
    
    setIsQuizActive: (state, action: PayloadAction<boolean>) => {
      state.isQuizActive = action.payload
    },
    
    // Progress Actions
    updateProgress: (state) => {
      if (state.currentSession) {
        const answeredQuestions = Object.keys(state.answers).length
        const totalQuestions = state.currentSession.totalQuestions
        const progressPercentage = (answeredQuestions / totalQuestions) * 100
        
        state.progress = {
          currentQuestion: state.currentQuestionIndex + 1,
          totalQuestions,
          answeredQuestions,
          remainingQuestions: totalQuestions - answeredQuestions,
          progressPercentage,
          timeRemaining: state.timeRemaining,
          timeElapsed: state.currentSession.timeLimit - state.timeRemaining
        }
      }
    },
    
    // Clear Actions
    clearCurrentSession: (state) => {
      state.currentSession = null
      state.currentQuestionIndex = 0
      state.answers = {}
      state.timeRemaining = 0
      state.isQuizActive = false
      state.progress = null
    },
    
    clearCurrentResult: (state) => {
      state.currentResult = null
    },
    
    clearAll: (state) => {
      state.currentQuiz = null
      state.currentSession = null
      state.currentResult = null
      state.currentQuestionIndex = 0
      state.answers = {}
      state.timeRemaining = 0
      state.isQuizActive = false
      state.progress = null
    },
    
    // Refresh quiz data after completion
    refreshQuizData: () => {
      // This will trigger a re-fetch of quiz data
      // The component will call fetchQuizzes and fetchQuizHistory again
    }
  },
  extraReducers: (builder) => {
    // Fetch Quizzes
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.quizListLoading = true
        state.quizListError = null
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.quizListLoading = false
        state.quizzes = action.payload.quizzes
        state.pagination = action.payload.pagination
        state.filters = action.payload.filters
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.quizListLoading = false
        state.quizListError = action.error.message || 'Failed to fetch quizzes'
      })
    
    // Fetch Quiz By ID
    builder
      .addCase(fetchQuizById.pending, (state) => {
        state.quizListLoading = true
        state.quizListError = null
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.quizListLoading = false
        state.currentQuiz = action.payload
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.quizListLoading = false
        state.quizListError = action.error.message || 'Failed to fetch quiz'
      })
    
    // Start Quiz Session
    builder
      .addCase(startQuizSession.pending, (state) => {
        state.sessionLoading = true
        state.sessionError = null
      })
      .addCase(startQuizSession.fulfilled, (state, action) => {
        state.sessionLoading = false
        state.currentSession = action.payload
        state.currentQuestionIndex = action.payload.currentQuestionIndex
        state.timeRemaining = action.payload.timeRemaining
        state.isQuizActive = true
        state.answers = action.payload.answers as unknown as Record<string, string | string[]>
      })
      .addCase(startQuizSession.rejected, (state, action) => {
        state.sessionLoading = false
        state.sessionError = action.error.message || 'Failed to start quiz session'
      })
    
    // Save Answer
    builder
      .addCase(saveAnswer.pending, (state) => {
        state.sessionLoading = true
        state.sessionError = null
      })
      .addCase(saveAnswer.fulfilled, (state, action) => {
        state.sessionLoading = false
        state.currentSession = action.payload
        state.answers = action.payload.answers as unknown as Record<string, string | string[]>
      })
      .addCase(saveAnswer.rejected, (state, action) => {
        state.sessionLoading = false
        state.sessionError = action.error.message || 'Failed to save answer'
      })
    
    // Navigate To Question
    builder
      .addCase(navigateToQuestion.pending, (state) => {
        state.sessionLoading = true
        state.sessionError = null
      })
      .addCase(navigateToQuestion.fulfilled, (state, action) => {
        state.sessionLoading = false
        state.currentSession = action.payload
        state.currentQuestionIndex = action.payload.currentQuestionIndex
      })
      .addCase(navigateToQuestion.rejected, (state, action) => {
        state.sessionLoading = false
        state.sessionError = action.error.message || 'Failed to navigate to question'
      })
    
    // Submit Quiz
    builder
      .addCase(submitQuiz.pending, (state) => {
        state.sessionLoading = true
        state.sessionError = null
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.sessionLoading = false
        state.currentResult = action.payload
        state.isQuizActive = false
        
        // Complete the current attempt
        if (state.currentAttempt) {
          state.currentAttempt.status = 'completed'
          state.currentAttempt.completedAt = new Date().toISOString()
          state.currentAttempt.score = action.payload.earnedMarks
          state.currentAttempt.earnedMarks = action.payload.earnedMarks
          state.currentAttempt.answers = state.answers
          state.currentAttempt.timeSpent = (state.currentQuiz?.timeLimit || 0) * 60 - state.timeRemaining
          state.currentAttempt.passed = action.payload.earnedMarks >= (action.payload.totalMarks * 0.6) // 60% to pass
        }
        
        // Update quiz status and add attempt to quiz
        if (state.currentQuiz && state.currentAttempt) {
          const quizIndex = state.quizzes.findIndex(quiz => quiz.id === state.currentQuiz?.id)
          if (quizIndex !== -1) {
            const existingAttempts = state.quizzes[quizIndex].attempts || []
            const updatedAttempts = [...existingAttempts, state.currentAttempt]
            
            // Determine new status based on pass/fail
            const newStatus = state.currentAttempt.passed ? 'completed' : 'attempted'
            
            state.quizzes[quizIndex] = {
              ...state.quizzes[quizIndex],
              status: newStatus,
              score: action.payload.earnedMarks,
              attempts: updatedAttempts
            }
          }
          
          // Also update in quiz history
          const historyIndex = state.quizHistory.findIndex(quiz => quiz.id === state.currentQuiz?.id)
          if (historyIndex !== -1) {
            const existingAttempts = state.quizHistory[historyIndex].attempts || []
            const updatedAttempts = [...existingAttempts, state.currentAttempt]
            
            const newStatus = state.currentAttempt.passed ? 'completed' : 'attempted'
            
            state.quizHistory[historyIndex] = {
              ...state.quizHistory[historyIndex],
              status: newStatus,
              score: action.payload.earnedMarks,
              attempts: updatedAttempts
            }
          }
        }
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.sessionLoading = false
        state.sessionError = action.error.message || 'Failed to submit quiz'
      })
    
    // Fetch Quiz Result
    builder
      .addCase(fetchQuizResult.pending, (state) => {
        state.resultLoading = true
        state.resultError = null
      })
      .addCase(fetchQuizResult.fulfilled, (state, action) => {
        state.resultLoading = false
        state.currentResult = action.payload
      })
      .addCase(fetchQuizResult.rejected, (state, action) => {
        state.resultLoading = false
        state.resultError = action.error.message || 'Failed to fetch quiz result'
      })
    
    // Start New Attempt
    builder
      .addCase(startNewAttempt.pending, (state) => {
        state.attemptLoading = true
        state.attemptError = null
      })
      .addCase(startNewAttempt.fulfilled, (state, action) => {
        state.attemptLoading = false
        state.currentAttempt = action.payload
        
        // Calculate attempt number based on existing attempts
        if (state.currentQuiz) {
          const existingAttempts = state.currentQuiz.attempts || []
          state.currentAttempt.attemptNumber = existingAttempts.length + 1
          state.currentAttempt.totalMarks = state.currentQuiz.totalMarks
        }
        
        // Reset quiz state for new attempt
        state.currentQuestionIndex = 0
        state.answers = {}
        state.timeRemaining = state.currentQuiz?.timeLimit ? state.currentQuiz.timeLimit * 60 : 0
        state.isQuizActive = true
      })
      .addCase(startNewAttempt.rejected, (state, action) => {
        state.attemptLoading = false
        state.attemptError = action.error.message || 'Failed to start new attempt'
      })
    
    // Fetch Quiz History
    builder
      .addCase(fetchQuizHistory.pending, (state) => {
        state.historyLoading = true
        state.historyError = null
      })
      .addCase(fetchQuizHistory.fulfilled, (state, action) => {
        state.historyLoading = false
        state.quizHistory = action.payload.quizzes
        state.pagination = action.payload.pagination
      })
      .addCase(fetchQuizHistory.rejected, (state, action) => {
        state.historyLoading = false
        state.historyError = action.error.message || 'Failed to fetch quiz history'
      })
  }
})

export const {
  setCurrentQuiz,
  clearQuizList,
  setCurrentQuestionIndex,
  updateAnswer,
  clearAnswers,
  setTimeRemaining,
  setIsQuizActive,
  updateProgress,
  clearCurrentSession,
  clearCurrentResult,
  clearAll,
  refreshQuizData
} = quizSlice.actions

export default quizSlice.reducer
