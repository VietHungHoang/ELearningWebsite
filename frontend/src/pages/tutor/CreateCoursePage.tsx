import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { useCategories } from '../../hooks/useCategories'
import { getCategoryIcon } from '../../utils/iconMapping'
import type { BasicCourseData } from '../../types/api'

// Component cho Step 1: Course Title
const Step1: React.FC<{
  data: BasicCourseData
  onUpdate: (data: Partial<BasicCourseData>) => void
  onNext: () => void
}> = ({ data, onUpdate, onNext }) => {
  const [title, setTitle] = useState(data.title)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleNext = () => {
    if (title.trim()) {
      onUpdate({ title })
      onNext()
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="h-px w-12 bg-gray-300"></div>
          <span className="mx-4 text-sm font-semibold text-[#065A46] tracking-wide uppercase">
            Step 1 of 3
          </span>
          <div className="h-px w-12 bg-gray-300"></div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Tên khóa học của bạn là gì?
        </h1>
        <p className="text-gray-600 text-lg">
          Đừng lo lắng, bạn có thể thay đổi sau này.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề khóa học
            </label>
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && title.trim()) {
                  handleNext()
                }
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-[#065A46] focus:shadow-[0_0_0_3px_rgba(6,90,70,0.1)] hover:border-gray-300 transition-all duration-300 text-lg text-gray-900 placeholder-gray-500"
              maxLength={120}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">
                Tạo một tiêu đề hấp dẫn để thu hút học viên
              </p>
              <span className="text-sm text-gray-400">
                {title.length}/120
              </span>
            </div>
          </div>

          <div className="flex justify-between">
            <div></div>
            <button
              onClick={handleNext}
              disabled={!title.trim()}
              className="px-8 py-3 bg-[#065A46] text-white rounded-xl font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#054A3A] transition-colors flex items-center cursor-pointer"
            >
              Tiếp theo
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Component cho Step 2: Category with API integration
const Step2: React.FC<{
  data: BasicCourseData
  onUpdate: (data: Partial<BasicCourseData>) => void
  onNext: () => void
  onBack: () => void
}> = ({ data, onUpdate, onNext, onBack }) => {
  const [category, setCategory] = useState(data.category)
  const { categories, loading, error, refetch } = useCategories()

  const handleNext = () => {
    if (category) {
      onUpdate({ category })
      onNext()
    }
  }

  const handleRetry = () => {
    refetch()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="h-px w-12 bg-gray-300"></div>
          <span className="mx-4 text-sm font-semibold text-[#065A46] tracking-wide uppercase">
            Step 2 of 3
          </span>
          <div className="h-px w-12 bg-gray-300"></div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Khóa học của bạn thuộc danh mục nào?
        </h1>
        <p className="text-gray-600 text-lg">
          Chọn danh mục phù hợp nhất với nội dung khóa học.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#065A46] border-t-transparent"></div>
            <span className="ml-3 text-gray-600">Đang tải danh mục...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">Không thể tải danh mục</p>
              <p className="text-sm text-gray-500 mt-2">{error}</p>
            </div>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-[#065A46] text-white rounded-xl font-medium hover:bg-[#054A3A] transition-colors cursor-pointer"
            >
              Thử lại
            </button>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id.toString())}
                className={`p-4 text-left border rounded-xl transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer ${
                  category === cat.id.toString()
                    ? 'border-[#065A46] bg-[#065A46]/5 text-[#065A46] shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{getCategoryIcon(cat.icon)}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{cat.name}</h3>
                    <p className="text-sm text-gray-500">{cat.description || 'Không có mô tả'}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium">Không có danh mục nào</p>
              <p className="text-sm text-gray-400 mt-2">Vui lòng liên hệ quản trị viên</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center cursor-pointer"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>
          <button
            onClick={handleNext}
            disabled={!category || loading}
            className="px-8 py-3 bg-[#065A46] text-white rounded-xl font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#054A3A] transition-colors flex items-center cursor-pointer"
          >
            Tiếp theo
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// Component cho Step 3: Course Level
const Step3: React.FC<{
  data: BasicCourseData
  onUpdate: (data: Partial<BasicCourseData>) => void
  onSubmit: () => void
  onBack: () => void
}> = ({ data, onUpdate, onSubmit, onBack }) => {
  const [level, setLevel] = useState(data.level || '')

  const levels = [
    { value: 'beginner', label: 'Beginner Level', icon: '🌱', desc: 'No experience necessary' },
    { value: 'intermediate', label: 'Intermediate Level', icon: '📈', desc: 'Some experience required' },
    { value: 'advanced', label: 'Advanced Level', icon: '🚀', desc: 'Significant experience needed' },
    { value: 'all-levels', label: 'All Levels', icon: '⭐', desc: 'Suitable for all skill levels' }
  ]

  const handleSubmit = () => {
    if (level) {
      onUpdate({ level })
      onSubmit()
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="h-px w-12 bg-gray-300"></div>
          <span className="mx-4 text-sm font-semibold text-[#065A46] tracking-wide uppercase">
            Step 3 of 3
          </span>
          <div className="h-px w-12 bg-gray-300"></div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          What's the level of your course?
        </h1>
        <p className="text-gray-600 text-lg">
          Choose the level that best describes your course content.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {levels.map((lvl) => (
            <button
              key={lvl.value}
              onClick={() => setLevel(lvl.value)}
              className={`p-6 text-left border rounded-xl transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer ${
                level === lvl.value
                  ? 'border-[#065A46] bg-[#065A46]/5 text-[#065A46] shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-start space-x-4">
                <span className="text-3xl">{lvl.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl mb-2">{lvl.label}</h3>
                  <p className="text-gray-500">{lvl.desc}</p>
                </div>
                {level === lvl.value && (
                  <div className="text-[#065A46]">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center cursor-pointer"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={!level}
            className="px-8 py-3 bg-[#065A46] text-white rounded-xl font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#054A3A] transition-colors flex items-center cursor-pointer"
          >
            Create Course
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// Main CreateCoursePage component
const CreateCoursePage: React.FC = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [courseData, setCourseData] = useState<BasicCourseData>({
    title: '',
    category: '',
    level: ''
  })

  const updateCourseData = (newData: Partial<BasicCourseData>) => {
    setCourseData(prev => ({ ...prev, ...newData }))
  }

  const handleCreateCourse = async () => {
    try {
      // TODO: Call API to create draft course
      console.log('Creating course draft:', courseData)
      
      // Simulate API call to create draft course
      const response = await fetch('/api/courses/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header here
        },
        body: JSON.stringify(courseData)
      })
      
      if (response.ok) {
        const createdCourse = await response.json()
        console.log('Course draft created successfully:', createdCourse)
        
        // Navigate to course management page with the real course ID
        navigate(`/tutor/courses/manage/${createdCourse.id}`)
      } else {
        throw new Error('Failed to create course draft')
      }
    } catch (error) {
      console.error('Error creating course:', error)
      // For now, simulate success for demo purposes
      const mockCourseId = Date.now().toString()
      navigate(`/tutor/courses/manage/${mockCourseId}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] py-4">
      {/* Logo and Exit Button */}
      <div className="w-full mx-auto mb-6 px-8">
        <div className="flex items-center justify-between">
          {/* Logo - Left */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#065A46] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">ELearning</span>
          </div>

          {/* Exit Button - Right */}
          <button
            onClick={() => navigate('/tutor/dashboard')}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors border border-gray-200 hover:border-gray-300 cursor-pointer"
          >
            <X className="w-5 h-5" />
            <span className="text-sm font-medium">Exit</span>
          </button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="w-full mx-auto mb-6 px-8">
        <div className="flex items-center justify-center">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                  step < currentStep
                    ? 'bg-[#065A46] text-white border-[#065A46]'
                    : step === currentStep
                    ? 'bg-white text-[#065A46] border-[#065A46] shadow-lg'
                    : 'bg-gray-100 text-gray-400 border-gray-200'
                }`}
              >
                {step < currentStep ? '✓' : step}
              </div>
              {step < 3 && (
                <div
                  className={`w-20 h-1 mx-4 rounded-full transition-all ${
                    step < currentStep ? 'bg-[#065A46]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="px-4">
        {currentStep === 1 && (
          <Step1
            data={courseData}
            onUpdate={updateCourseData}
            onNext={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 2 && (
          <Step2
            data={courseData}
            onUpdate={updateCourseData}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <Step3
            data={courseData}
            onUpdate={updateCourseData}
            onSubmit={handleCreateCourse}
            onBack={() => setCurrentStep(2)}
          />
        )}
      </div>
    </div>
  )
}

export default CreateCoursePage