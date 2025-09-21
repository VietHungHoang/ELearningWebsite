import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Save, Eye, CheckCircle, BookOpen, Bot } from 'lucide-react'
import type { SectionQuiz, QuizQuestion, QuizQuestionOption } from '../../../types/quiz'
import { quizApi } from '../../../services/quizApi'
import AIQuestionGenerator from './AIQuestionGenerator'

interface Course {
  id: string
  title: string
  sections: Array<{
    id: string
    title: string
  }>
}

interface QuizBuilderProps {
  courses: Course[]
  initialQuiz?: SectionQuiz
  onSave: (quiz: SectionQuiz) => void
  onPreview: (quiz: SectionQuiz) => void
  onCancel: () => void
}

const QuizBuilder: React.FC<QuizBuilderProps> = ({
  courses,
  initialQuiz,
  onSave,
  onPreview,
  onCancel
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialQuiz?.courseId || '')
  const [selectedSectionId, setSelectedSectionId] = useState<string>(initialQuiz?.sectionId || '')
  
  const selectedCourse = courses.find(course => course.id === selectedCourseId)
  const availableSections = selectedCourse?.sections || []

  const [quiz, setQuiz] = useState<SectionQuiz>(initialQuiz || {
    id: '', // Will be set when quiz is created
    sectionId: selectedSectionId,
    courseId: selectedCourseId,
    tutorId: 'tutor-1', // Use consistent tutor ID
    title: '',
    description: '',
    questions: [],
    passingScore: 70,
    timeLimit: undefined,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  // Load questions when editing existing quiz
  useEffect(() => {
    if (initialQuiz && initialQuiz.id && !initialQuiz.id.startsWith('quiz-')) {
      loadQuestions(initialQuiz.id)
    }
  }, [initialQuiz])

  const loadQuestions = async (quizId: string) => {
    try {
      console.log('🔍 Loading questions for quiz:', quizId)
      const questions = await quizApi.getQuestionsByQuizId(quizId)
      console.log('📚 Questions loaded:', questions)
      
      // Convert API questions to SectionQuiz format
      const convertedQuestions: QuizQuestion[] = questions.map(q => ({
        id: q.id || '',
        quizId: q.quizId || '',
        questionText: q.questionText,
        options: q.options?.map(opt => ({
          id: opt.id || '',
          questionId: opt.questionId || '',
          text: opt.text,
          isCorrect: opt.isCorrect,
          order: opt.order
        })) || [],
        correctAnswer: q.correctAnswer,
        order: q.order
      }))
      
      setQuiz(prev => ({
        ...prev,
        questions: convertedQuestions
      }))
    } catch (error) {
      console.error('❌ Error loading questions:', error)
    }
  }

  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null)
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [showAIGenerator, setShowAIGenerator] = useState(false)

  // Update quiz when course or section changes
  React.useEffect(() => {
    setQuiz(prev => ({
      ...prev,
      courseId: selectedCourseId,
      sectionId: selectedSectionId
    }))
  }, [selectedCourseId, selectedSectionId])

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q-${Date.now()}`,
      quizId: quiz.id,
      questionText: '',
      options: [
        { id: 'a', text: '', isCorrect: false, order: 1 },
        { id: 'b', text: '', isCorrect: false, order: 2 },
        { id: 'c', text: '', isCorrect: false, order: 3 },
        { id: 'd', text: '', isCorrect: false, order: 4 }
      ],
      correctAnswer: '',
      order: quiz.questions.length + 1
    }

    setEditingQuestion(newQuestion)
    setShowQuestionForm(true)
  }

  const editQuestion = (question: QuizQuestion) => {
    setEditingQuestion({ ...question })
    setShowQuestionForm(true)
  }

  const saveQuestion = async (question: QuizQuestion) => {
    try {
      console.log('💾 Saving question:', question)
      
      // Check if quiz has valid ID
      if (!quiz.id || quiz.id.startsWith('quiz-')) {
        console.error('❌ Cannot save question: Quiz not saved yet')
        alert('Please save the quiz first before adding questions')
        return
      }
      
      // Convert to API format
      const questionData = {
        id: question.id,
        quizId: quiz.id,
        questionText: question.questionText,
        correctAnswer: question.correctAnswer,
        order: question.order, // Changed from questionOrder to order
        options: question.options?.map(opt => ({
          id: opt.id,
          questionId: question.id,
          text: opt.text, // Changed from optionText to text
          isCorrect: opt.isCorrect,
          order: opt.order // Changed from optionOrder to order
        })) || []
      }

      let savedQuestion: QuizQuestion
      
      if (editingQuestion?.id && quiz.questions.find(q => q.id === editingQuestion.id)) {
        // Update existing question
        console.log('🔄 Updating existing question')
        const updatedQuestionDto = await quizApi.updateQuestion(quiz.id, question.id, questionData)
        
        // Convert back to SectionQuiz format
        savedQuestion = {
          id: updatedQuestionDto.id || question.id,
          quizId: updatedQuestionDto.quizId || quiz.id,
          questionText: updatedQuestionDto.questionText,
          options: updatedQuestionDto.options?.map(opt => ({
            id: opt.id || '',
            questionId: opt.questionId || '',
            text: opt.text,
            isCorrect: opt.isCorrect,
            order: opt.order
          })) || [],
          correctAnswer: updatedQuestionDto.correctAnswer,
          order: updatedQuestionDto.order
        }
      } else {
        // Create new question
        console.log('➕ Creating new question')
        const createdQuestionDto = await quizApi.createQuestion(quiz.id, questionData)
        
        // Convert back to SectionQuiz format
        savedQuestion = {
          id: createdQuestionDto.id || '',
          quizId: createdQuestionDto.quizId || quiz.id,
          questionText: createdQuestionDto.questionText,
          options: createdQuestionDto.options?.map(opt => ({
            id: opt.id || '',
            questionId: opt.questionId || '',
            text: opt.text,
            isCorrect: opt.isCorrect,
            order: opt.order
          })) || [],
          correctAnswer: createdQuestionDto.correctAnswer,
          order: createdQuestionDto.order
        }
      }

      // Update local state
      const updatedQuestions = editingQuestion?.id && quiz.questions.find(q => q.id === editingQuestion.id)
        ? quiz.questions.map(q => q.id === editingQuestion.id ? savedQuestion : q)
        : [...quiz.questions, savedQuestion]

      setQuiz(prev => ({
        ...prev,
        questions: updatedQuestions,
        updatedAt: new Date()
      }))

      setEditingQuestion(null)
      setShowQuestionForm(false)
      
      console.log('✅ Question saved successfully')
    } catch (error) {
      console.error('❌ Error saving question:', error)
      alert('Failed to save question. Please try again.')
    }
  }

  const deleteQuestion = async (questionId: string) => {
    try {
      console.log('🗑️ Deleting question:', questionId)
      await quizApi.deleteQuestion(quiz.id, questionId)
      
      setQuiz(prev => ({
        ...prev,
        questions: prev.questions.filter(q => q.id !== questionId).map((q, index) => ({
          ...q,
          order: index + 1
        })),
        updatedAt: new Date()
      }))
      
      console.log('✅ Question deleted successfully')
    } catch (error) {
      console.error('❌ Error deleting question:', error)
      alert('Failed to delete question. Please try again.')
    }
  }

  const updateQuizField = (field: keyof SectionQuiz, value: any) => {
    setQuiz(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date()
    }))
  }

  const canSave = selectedCourseId && selectedSectionId && quiz.title.trim()
  const canAddQuestions = quiz.id && !quiz.id.startsWith('quiz-') && quiz.id.trim() !== ''

  const handleAIGeneratedQuestions = (questions: any[]) => {
    console.log('🤖 AI Generated questions:', questions)
    
    // Convert AI questions to SectionQuiz format
    const convertedQuestions: QuizQuestion[] = questions.map((q, index) => ({
      id: `ai-q-${Date.now()}-${index}`,
      quizId: quiz.id,
      questionText: q.questionText,
      options: q.options?.map((opt: any, optIndex: number) => ({
        id: `ai-opt-${Date.now()}-${index}-${optIndex}`,
        questionId: `ai-q-${Date.now()}-${index}`,
        text: opt.text,
        isCorrect: opt.isCorrect,
        order: opt.order || optIndex + 1
      })) || [],
      correctAnswer: q.correctAnswer,
      order: q.order || index + 1
    }))

    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, ...convertedQuestions],
      updatedAt: new Date()
    }))

    setShowAIGenerator(false)
  }

  if (showQuestionForm && editingQuestion) {
    return (
      <QuestionForm
        question={editingQuestion}
        onSave={saveQuestion}
        onCancel={() => {
          setEditingQuestion(null)
          setShowQuestionForm(false)
        }}
      />
    )
  }

  if (showAIGenerator) {
    return (
      <AIQuestionGenerator
        quizId={quiz.id}
        onQuestionsGenerated={handleAIGeneratedQuestions}
        onClose={() => setShowAIGenerator(false)}
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Section Quiz Builder</h2>
        </div>
        <p className="text-gray-800">Create a quiz for this section to test student understanding of the entire section content</p>
      </div>

      {/* Quiz Settings */}
      <div className="space-y-6 mb-8">
        {/* Course and Section Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Select Course *
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="">Choose a course...</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Select Section *
            </label>
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              disabled={!selectedCourseId}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 bg-white"
            >
              <option value="">Choose a section...</option>
              {availableSections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Quiz Title *
            </label>
            <input
              type="text"
              value={quiz.title}
              onChange={(e) => updateQuizField('title', e.target.value)}
              placeholder="Enter quiz title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Passing Score (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={quiz.passingScore}
              onChange={(e) => updateQuizField('passingScore', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Time Limit (minutes) - Optional
            </label>
            <input
              type="number"
              min="1"
              value={quiz.timeLimit || ''}
              onChange={(e) => updateQuizField('timeLimit', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="No time limit"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={quiz.description || ''}
            onChange={(e) => updateQuizField('description', e.target.value)}
            placeholder="Enter quiz description..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 bg-white"
          />
        </div>

        <div className="flex items-center space-x-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={quiz.isActive}
              onChange={(e) => updateQuizField('isActive', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-900">Active</span>
          </label>
        </div>
      </div>

      {/* Questions Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Questions ({quiz.questions.length})
            </h3>
            {!canAddQuestions && (
              <p className="text-sm text-amber-600 mt-1">
                💡 Save the quiz first, then come back to add questions
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={addQuestion}
              disabled={!canAddQuestions}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                canAddQuestions 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{canAddQuestions ? 'Add Question' : 'Save Quiz First'}</span>
            </button>
            
            <button
              onClick={() => setShowAIGenerator(true)}
              disabled={!canAddQuestions}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                canAddQuestions 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>AI Generate</span>
            </button>
          </div>
        </div>

        {quiz.questions.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-800 mb-4">
              {canAddQuestions ? 'No questions added yet' : 'Save the quiz first to add questions'}
            </p>
            {canAddQuestions && (
              <button
                onClick={addQuestion}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Add your first question
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {quiz.questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        Multiple Choice
                      </span>
                    </div>
                    <p className="text-gray-900 mb-2">{question.questionText}</p>
                    {question.options && (
                      <div className="space-y-1">
                        {question.options.map((option) => (
                          <div key={option.id} className="flex items-center space-x-2 text-sm">
                            <span className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">
                              {option.id}
                            </span>
                            <span className={option.isCorrect ? 'text-green-600 font-medium' : 'text-gray-800'}>
                              {option.text}
                            </span>
                            {option.isCorrect && <CheckCircle className="w-4 h-4 text-green-600" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => editQuestion(question)}
                      className="text-blue-600 hover:text-blue-700 p-1"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-gray-800 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => onPreview(quiz)}
            disabled={!canSave}
            className="flex items-center space-x-2 px-6 py-2 text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>

          <button
            onClick={() => onSave(quiz)}
            disabled={!canSave}
            className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>Save Quiz</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Question Form Component
interface QuestionFormProps {
  question: QuizQuestion
  onSave: (question: QuizQuestion) => void
  onCancel: () => void
}

const QuestionForm: React.FC<QuestionFormProps> = ({ question, onSave, onCancel }) => {
  const [formData, setFormData] = useState<QuizQuestion>(question)

  const updateField = (field: keyof QuizQuestion, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateOption = (optionId: string, field: keyof QuizQuestionOption, value: any) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options?.map(opt => 
        opt.id === optionId ? { ...opt, [field]: value } : opt
      )
    }))
  }

  const addOption = () => {
    if (!formData.options) return
    
    const newOption: QuizQuestionOption = {
      id: String.fromCharCode(97 + formData.options.length), // a, b, c, d...
      text: '',
      isCorrect: false,
      order: formData.options.length + 1
    }

    setFormData(prev => ({
      ...prev,
      options: [...(prev.options || []), newOption]
    }))
  }

  const removeOption = (optionId: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options?.filter(opt => opt.id !== optionId)
    }))
  }

  const handleSave = () => {
    // Validate form
    if (!formData.questionText.trim()) {
      alert('Please enter a question')
      return
    }

      if (!formData.options || formData.options.length < 2) {
        alert('Please add at least 2 options')
        return
      }

      const hasCorrectAnswer = formData.options.some(opt => opt.isCorrect)
      if (!hasCorrectAnswer) {
        alert('Please select at least one correct answer')
        return
      }

      // Set correct answer
      const correctOption = formData.options.find(opt => opt.isCorrect)
      if (correctOption) {
        formData.correctAnswer = correctOption.id
    }

    onSave(formData)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {question.id.startsWith('q-') ? 'Add Question' : 'Edit Question'}
        </h3>
      </div>

      <div className="space-y-6">
        {/* Question Text */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Question Text *
          </label>
           <textarea
             value={formData.questionText}
             onChange={(e) => updateField('questionText', e.target.value)}
             placeholder="Enter your question..."
             rows={3}
             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 bg-white"
           />
        </div>

        {/* Answer Options */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-900">
                Answer Options
              </label>
                <button
                  onClick={addOption}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Option
                </button>
            </div>

            <div className="space-y-3">
            {formData.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-sm font-semibold">
                    {option.id}
                  </span>
                   <input
                     type="text"
                     value={option.text}
                     onChange={(e) => updateOption(option.id, 'text', e.target.value)}
                     placeholder={`Option ${option.id}`}
                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                   />
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={option.isCorrect}
                      onChange={() => {
                        // Uncheck all other options
                        formData.options?.forEach(opt => {
                          if (opt.id !== option.id) {
                            updateOption(opt.id, 'isCorrect', false)
                          }
                        })
                        updateOption(option.id, 'isCorrect', true)
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-900">Correct</span>
                  </label>
                {formData.options.length > 2 && (
                    <button
                      onClick={() => removeOption(option.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>


      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-gray-800 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Save Question
        </button>
      </div>
    </div>
  )
}

export default QuizBuilder
