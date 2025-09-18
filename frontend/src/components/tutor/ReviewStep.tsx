import React from 'react'

interface ReviewStepProps {
  formData: {
    title: string
    category: string
    level: string
    price: string
    currency: string
    learningObjectives: string[]
    detailedDescription: string
    courseDuration: string
    totalLectures: string
  }
  checklist: {
    [key: string]: {
      completed: boolean
      required: boolean
      label: string
      description: string
    }
  }
  onChecklistToggle: (key: string) => void
}

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const ExclamationIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
)

const ReviewStep: React.FC<ReviewStepProps> = ({ formData, checklist, onChecklistToggle }) => {
  const requiredItems = Object.entries(checklist).filter(([_, item]) => item.required)
  const optionalItems = Object.entries(checklist).filter(([_, item]) => !item.required)
  
  const completedRequired = requiredItems.filter(([_, item]) => item.completed).length
  const completedOptional = optionalItems.filter(([_, item]) => item.completed).length
  
  const canPublish = requiredItems.every(([_, item]) => item.completed)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Review & Publish</h2>
        <p className="mt-2 text-gray-600">
          Complete the checklist below to publish your course and make it available to students.
        </p>
      </div>

      {/* Course Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Title:</span>
            <p className="text-gray-600 mt-1">{formData.title || 'Not set'}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Category:</span>
            <p className="text-gray-600 mt-1">{formData.category || 'Not set'}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Level:</span>
            <p className="text-gray-600 mt-1">{formData.level || 'Not set'}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Price:</span>
            <p className="text-gray-600 mt-1">
              {formData.price && formData.currency 
                ? `${formData.currency === 'VND' ? '₫' : '$'}${formData.price}` 
                : 'Not set'}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Learning Objectives:</span>
            <p className="text-gray-600 mt-1">{formData.learningObjectives?.length || 0} objectives</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Estimated Duration:</span>
            <p className="text-gray-600 mt-1">
              {formData.courseDuration ? `${formData.courseDuration} hours` : 'Not set'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Completion Progress</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(((completedRequired + completedOptional) / Object.keys(checklist).length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${canPublish ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-sm font-medium">
              Required: {completedRequired}/{requiredItems.length}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium">
              Optional: {completedOptional}/{optionalItems.length}
            </span>
          </div>
        </div>
        
        {!canPublish && (
          <div className="mt-4 p-3 bg-yellow-100 rounded-md flex items-start space-x-2">
            <ExclamationIcon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Complete all required items to publish your course
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                You still need to complete {requiredItems.length - completedRequired} required item(s).
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Required Items */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          Required Items
        </h3>
        <div className="space-y-3">
          {requiredItems.map(([key, item]) => (
            <div
              key={key}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                item.completed 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
              onClick={() => onChecklistToggle(key)}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                  item.completed 
                    ? 'border-green-500 bg-green-500' 
                    : 'border-gray-300'
                }`}>
                  {item.completed && <CheckIcon className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${item.completed ? 'text-green-900' : 'text-gray-900'}`}>
                    {item.label}
                  </h4>
                  <p className={`text-sm mt-1 ${item.completed ? 'text-green-700' : 'text-gray-600'}`}>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Items */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          Optional Items
          <span className="text-sm font-normal text-gray-500 ml-2">
            (Recommended for better course quality)
          </span>
        </h3>
        <div className="space-y-3">
          {optionalItems.map(([key, item]) => (
            <div
              key={key}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                item.completed 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
              onClick={() => onChecklistToggle(key)}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                  item.completed 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                }`}>
                  {item.completed && <CheckIcon className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${item.completed ? 'text-blue-900' : 'text-gray-900'}`}>
                    {item.label}
                  </h4>
                  <p className={`text-sm mt-1 ${item.completed ? 'text-blue-700' : 'text-gray-600'}`}>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Notice */}
      {canPublish && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <CheckIcon className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-900">Ready to Publish!</h3>
              <p className="text-green-700 mt-1">
                Your course meets all requirements and is ready to be published. 
                Once published, students will be able to discover and enroll in your course.
              </p>
              <p className="text-sm text-green-600 mt-2">
                💡 You can continue to edit your course content even after publishing.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewStep