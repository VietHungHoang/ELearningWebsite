import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, RotateCcw, ArrowRight } from 'lucide-react'
import type { LessonQuiz as LessonQuizType, QuizQuestion, QuizAttempt, QuizResult } from '../../../types/quiz'

interface LessonQuizProps {
  quiz: LessonQuizType
  onComplete: (result: QuizResult) => void
  onSkip: () => void
  isRequired: boolean
}

interface QuizState {
  currentQuestionIndex: number
  answers: Record<string, string>
  timeRemaining: number
  isSubmitted: boolean
  showResults: boolean
  result?: QuizResult
}

const LessonQuizComponent: React.FC<LessonQuizProps> = ({
  quiz,
  onComplete,
  onSkip,
  isRequired
}) => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    timeRemaining: quiz.timeLimit ? quiz.timeLimit * 60 : 0,
    isSubmitted: false,
    showResults: false
  })

  const [startTime] = useState(Date.now())

  // Function to restart quiz
  const restartQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      answers: {},
      timeRemaining: quiz.timeLimit ? quiz.timeLimit * 60 : 600, // Default 10 minutes if no time limit
      isSubmitted: false,
      showResults: false
    })
  }

  // Timer effect
  useEffect(() => {
    if (quizState.timeRemaining > 0 && !quizState.isSubmitted) {
      const timer = setInterval(() => {
        setQuizState(prev => ({
          ...prev,
          timeRemaining: Math.max(0, prev.timeRemaining - 1)
        }))
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [quizState.timeRemaining, quizState.isSubmitted])

  // Auto-submit when time runs out
  useEffect(() => {
    if (quizState.timeRemaining === 0 && !quizState.isSubmitted) {
      handleSubmit()
    }
  }, [quizState.timeRemaining, quizState.isSubmitted])

  const handleAnswerChange = (questionId: string, answer: string) => {
    setQuizState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
      }
    }))
  }

  const calculateScore = (): QuizResult => {
    let correctAnswers = 0

    quiz.questions.forEach(question => {
      const userAnswer = quizState.answers[question.id]
      
      if (userAnswer) {
        // All questions are now multiple choice
        const isCorrect = userAnswer === question.correctAnswer
        
        if (isCorrect) {
          correctAnswers++
        }
      }
    })

    const percentage = quiz.questions.length > 0 ? Math.round((correctAnswers / quiz.questions.length) * 100) : 0
    const passed = percentage >= quiz.passingScore
    const timeSpent = Math.round((Date.now() - startTime) / 1000)

    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      quizId: quiz.id,
      sectionId: 'section-1', // Updated for new schema
      courseId: 'course-1', // Updated for new schema
      studentId: 'current-student', // This would come from auth context
      answers: quizState.answers,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      percentage,
      passed,
      timeSpent,
      completedAt: new Date(),
      createdAt: new Date()
    }

    return {
      attempt,
      questions: quiz.questions,
      feedback: passed 
        ? `Congratulations! You passed with ${percentage}%` 
        : `You scored ${percentage}%. You need ${quiz.passingScore}% to pass.`,
      recommendations: passed 
        ? ['Great job! You can proceed to the next lesson.']
        : ['Review the lesson content and try again.', 'Focus on the areas you missed.']
    }
  }

  const handleSubmit = () => {
    if (quizState.isSubmitted) return

    const result = calculateScore()
    
    setQuizState(prev => ({
      ...prev,
      isSubmitted: true,
      showResults: true,
      result
    }))

    // Call onComplete after a short delay to show the result
    setTimeout(() => {
      onComplete(result)
    }, 2000)
  }

  const handleNextQuestion = () => {
    if (quizState.currentQuestionIndex < quiz.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }))
    }
  }

  const handlePreviousQuestion = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }))
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const renderQuestion = (question: QuizQuestion) => {
    const userAnswer = quizState.answers[question.id]

    return (
      <div key={question.id} className="space-y-4">
        <div className="flex items-start space-x-3">
          <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
            {question.order}
          </span>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {question.questionText}
            </h3>
            
            {question.options && (
              <div className="space-y-3">
                {question.options.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      userAnswer === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.id}
                      checked={userAnswer === option.id}
                      onChange={() => handleAnswerChange(question.id, option.id)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="flex-1 text-gray-900">{option.text}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderResults = () => {
    if (!quizState.result) return null

    const { attempt, feedback, recommendations } = quizState.result

    return (
      <div className="space-y-6">
        {/* Result Header */}
        <div className="text-center">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
            attempt.passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {attempt.passed ? (
              <CheckCircle className="w-10 h-10 text-green-600" />
            ) : (
              <XCircle className="w-10 h-10 text-red-600" />
            )}
          </div>
          <h3 className={`text-2xl font-bold ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>
            {attempt.passed ? 'Congratulations!' : 'Try Again'}
          </h3>
          <p className="text-gray-600 mt-2">{feedback}</p>
        </div>

        {/* Score Details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{attempt.correctAnswers}/{attempt.totalQuestions}</div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{attempt.percentage}%</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Recommendations:</h4>
            <ul className="space-y-1">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          {!attempt.passed && (
            <button
              onClick={restartQuiz}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          )}
          
          {attempt.passed && (
            <button
              onClick={() => onComplete(quizState.result!)}
              className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Continue</span>
            </button>
          )}
          
          {!isRequired && (
            <button
              onClick={onSkip}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Skip Quiz
            </button>
          )}
        </div>
      </div>
    )
  }

  if (quizState.showResults) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        {renderResults()}
      </div>
    )
  }

  const currentQuestion = quiz.questions[quizState.currentQuestionIndex]
  const isLastQuestion = quizState.currentQuestionIndex === quiz.questions.length - 1
  const allQuestionsAnswered = quiz.questions.every(q => quizState.answers[q.id])

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Quiz Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{quiz.title}</h2>
          {quiz.timeLimit && (
            <div className="flex items-center space-x-2 text-red-600">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">{formatTime(quizState.timeRemaining)}</span>
            </div>
          )}
        </div>
        
        {quiz.description && (
          <p className="text-gray-600">{quiz.description}</p>
        )}
        
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>Question {quizState.currentQuestionIndex + 1} of {quiz.questions.length}</span>
          <span>{quiz.passingScore}% required to pass</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((quizState.currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Question */}
      <div className="mb-8">
        {renderQuestion(currentQuestion)}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePreviousQuestion}
          disabled={quizState.currentQuestionIndex === 0}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Previous</span>
        </button>

        <div className="flex space-x-4">
          {!isRequired && (
            <button
              onClick={onSkip}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Skip Quiz
            </button>
          )}
          
          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered || quizState.isSubmitted}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{quizState.isSubmitted ? 'Submitting...' : 'Submit Quiz'}</span>
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default LessonQuizComponent
