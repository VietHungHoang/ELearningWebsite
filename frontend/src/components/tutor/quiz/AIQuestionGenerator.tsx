import React, { useState } from 'react'
import { Bot, Sparkles, Settings, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { quizApi } from '../../../services/quizApi'

interface AIQuestionGeneratorProps {
  quizId: string
  onQuestionsGenerated: (questions: any[]) => void
  onClose: () => void
}

interface GenerateRequest {
  topic: string
  content: string
  numberOfQuestions: number
  questionTypes: string[]
  difficultyLevel: number
  language: string
}

const AIQuestionGenerator: React.FC<AIQuestionGeneratorProps> = ({
  quizId,
  onQuestionsGenerated,
  onClose
}) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  
  const [request, setRequest] = useState<GenerateRequest>({
    topic: '',
    content: '',
    numberOfQuestions: 5,
    questionTypes: ['MULTIPLE_CHOICE'],
    difficultyLevel: 3,
    language: 'Vietnamese'
  })

  const questionTypeOptions = [
    { value: 'MULTIPLE_CHOICE', label: 'Trắc nghiệm' },
    { value: 'TRUE_FALSE', label: 'Đúng/Sai' },
    { value: 'FILL_IN_BLANK', label: 'Điền vào chỗ trống' },
    { value: 'SHORT_ANSWER', label: 'Trả lời ngắn' }
  ]

  const difficultyOptions = [
    { value: 1, label: 'Dễ', color: 'text-green-600' },
    { value: 2, label: 'Trung bình', color: 'text-yellow-600' },
    { value: 3, label: 'Khá', color: 'text-orange-600' },
    { value: 4, label: 'Khó', color: 'text-red-600' },
    { value: 5, label: 'Rất khó', color: 'text-purple-600' }
  ]

  const handleGenerate = async () => {
    if (!request.topic.trim() || !request.content.trim()) {
      setError('Vui lòng nhập chủ đề và nội dung')
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedQuestions([])

    try {
      console.log('🤖 Generating questions with request:', request)
      const questions = await quizApi.generateQuestions(quizId, request)
      console.log('✅ Generated questions:', questions)
      
      setGeneratedQuestions(questions)
    } catch (err: any) {
      console.error('❌ Error generating questions:', err)
      setError('Không thể tạo câu hỏi. Vui lòng thử lại.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAcceptQuestions = () => {
    onQuestionsGenerated(generatedQuestions)
    onClose()
  }

  const handleQuestionTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setRequest(prev => ({
        ...prev,
        questionTypes: [...prev.questionTypes, type]
      }))
    } else {
      setRequest(prev => ({
        ...prev,
        questionTypes: prev.questionTypes.filter(t => t !== type)
      }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bot className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">AI Question Generator</h2>
                <p className="text-purple-100">Tạo câu hỏi tự động bằng AI</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-colors"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!generatedQuestions.length ? (
            <div className="space-y-6">
              {/* Topic Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chủ đề câu hỏi *
                </label>
                <input
                  type="text"
                  value={request.topic}
                  onChange={(e) => setRequest(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="Ví dụ: Goal Setting, Focus Techniques, Time Management..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Content Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nội dung chi tiết *
                </label>
                <textarea
                  value={request.content}
                  onChange={(e) => setRequest(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Mô tả chi tiết về nội dung cần tạo câu hỏi..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Number of Questions */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số lượng câu hỏi
                  </label>
                  <select
                    value={request.numberOfQuestions}
                    onChange={(e) => setRequest(prev => ({ ...prev, numberOfQuestions: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {[3, 5, 8, 10, 15, 20].map(num => (
                      <option key={num} value={num}>{num} câu hỏi</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mức độ khó
                  </label>
                  <div className="flex space-x-2">
                    {difficultyOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => setRequest(prev => ({ ...prev, difficultyLevel: option.value }))}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          request.difficultyLevel === option.value
                            ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Question Types */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Loại câu hỏi
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {questionTypeOptions.map(option => (
                    <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={request.questionTypes.includes(option.value)}
                        onChange={(e) => handleQuestionTypeChange(option.value, e.target.checked)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !request.topic.trim() || !request.content.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Đang tạo câu hỏi...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Tạo câu hỏi với AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Generated Questions Preview */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Câu hỏi đã tạo ({generatedQuestions.length})
                </h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setGeneratedQuestions([])}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Tạo lại
                  </button>
                  <button
                    onClick={handleAcceptQuestions}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Chấp nhận</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {generatedQuestions.map((question, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm font-semibold">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-3">{question.questionText}</p>
                        <div className="space-y-2">
                          {question.options?.map((option: any, optIndex: number) => (
                            <div key={optIndex} className="flex items-center space-x-2">
                              <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold">
                                {String.fromCharCode(65 + optIndex)}
                              </span>
                              <span className={`text-sm ${option.isCorrect ? 'text-green-700 font-semibold' : 'text-gray-700'}`}>
                                {option.text}
                                {option.isCorrect && <span className="ml-2 text-green-600">✓</span>}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AIQuestionGenerator
