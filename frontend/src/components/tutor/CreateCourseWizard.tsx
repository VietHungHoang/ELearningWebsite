import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Step {
  id: number
  name: string
  status: 'current' | 'complete' | 'upcoming'
}

interface CreateCourseWizardProps {
  children: React.ReactNode
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
  onSave: () => void
  isNextDisabled?: boolean
  isLastStep?: boolean
}

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const CreateCourseWizard: React.FC<CreateCourseWizardProps> = ({
  children,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSave,
  isNextDisabled = false,
  isLastStep = false
}) => {
  const navigate = useNavigate()

  const steps: Step[] = [
    { id: 1, name: 'Basic Information', status: currentStep > 1 ? 'complete' : currentStep === 1 ? 'current' : 'upcoming' },
    { id: 2, name: 'Course Details', status: currentStep > 2 ? 'complete' : currentStep === 2 ? 'current' : 'upcoming' },
    { id: 3, name: 'Review & Publish', status: currentStep > 3 ? 'complete' : currentStep === 3 ? 'current' : 'upcoming' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/tutor/dashboard')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
            </div>
            <button
              onClick={onSave}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Save Draft
            </button>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-center py-6">
              {steps.map((step, stepIdx) => (
                <li key={step.name} className={stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}>
                  <div className="flex items-center">
                    <div className="flex items-center text-sm font-medium">
                      <div
                        className={`flex-shrink-0 w-8 h-8 border-2 rounded-full flex items-center justify-center ${
                          step.status === 'complete'
                            ? 'bg-blue-600 border-blue-600'
                            : step.status === 'current'
                            ? 'border-blue-600 bg-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {step.status === 'complete' ? (
                          <CheckIcon className="w-4 h-4 text-white" />
                        ) : (
                          <span
                            className={`${
                              step.status === 'current' ? 'text-blue-600' : 'text-gray-500'
                            }`}
                          >
                            {step.id}
                          </span>
                        )}
                      </div>
                      <span
                        className={`ml-2 ${
                          step.status === 'current' ? 'text-blue-600' : 'text-gray-500'
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                    {stepIdx !== steps.length - 1 && (
                      <div className="hidden sm:block ml-8 w-12 h-0.5 bg-gray-300" />
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 sm:p-8">
            {children}
          </div>

          {/* Navigation Buttons */}
          <div className="px-6 sm:px-8 py-4 bg-gray-50 rounded-b-lg">
            <div className="flex justify-between">
              <button
                onClick={onPrevious}
                disabled={currentStep === 1}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <ChevronLeftIcon className="w-4 h-4 mr-2" />
                Previous
              </button>

              <div className="flex space-x-3">
                {!isLastStep ? (
                  <button
                    onClick={onNext}
                    disabled={isNextDisabled}
                    className={`flex items-center px-6 py-2 text-sm font-medium rounded-md ${
                      isNextDisabled
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Continue
                    <ChevronRightIcon className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={onNext}
                    disabled={isNextDisabled}
                    className={`px-6 py-2 text-sm font-medium rounded-md ${
                      isNextDisabled
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Create Course
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateCourseWizard