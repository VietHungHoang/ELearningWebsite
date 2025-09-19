import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import type { BasicCreationCourse } from '../../types'
import Step1Title from '../../components/course/course-creation/Step1Title'
import Step2Category from '../../components/course/course-creation/Step2Category'
import Step3Level from '../../components/course/course-creation/Step3Level'

// Main CreateCoursePage component
const CreateCoursePage: React.FC = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [courseData, setCourseData] = useState<BasicCreationCourse>({
    title: '',
    category: '',
    level: ''
  })

  const updateCourseData = (newData: Partial<BasicCreationCourse>) => {
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
            onClick={() => navigate('/instructor/dashboard')}
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
          <Step1Title
            data={courseData}
            onUpdate={updateCourseData}
            onNext={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 2 && (
          <Step2Category
            data={courseData}
            onUpdate={updateCourseData}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <Step3Level
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