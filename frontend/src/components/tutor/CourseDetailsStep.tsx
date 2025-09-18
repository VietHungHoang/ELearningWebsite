import React from 'react'

interface CourseDetailsStepProps {
  formData: {
    learningObjectives: string[]
    requirements: string[]
    targetAudience: string[]
    detailedDescription: string
    courseStructure: string
    courseDuration: string
    totalLectures: string
  }
  onFormDataChange: (field: string, value: string | string[]) => void
  errors: Record<string, string>
}

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
)

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

const CourseDetailsStep: React.FC<CourseDetailsStepProps> = ({ formData, onFormDataChange, errors }) => {
  const addListItem = (field: 'learningObjectives' | 'requirements' | 'targetAudience') => {
    const currentArray = formData[field] || []
    onFormDataChange(field, [...currentArray, ''])
  }

  const updateListItem = (field: 'learningObjectives' | 'requirements' | 'targetAudience', index: number, value: string) => {
    const currentArray = formData[field] || []
    const newArray = [...currentArray]
    newArray[index] = value
    onFormDataChange(field, newArray)
  }

  const removeListItem = (field: 'learningObjectives' | 'requirements' | 'targetAudience', index: number) => {
    const currentArray = formData[field] || []
    const newArray = currentArray.filter((_, i) => i !== index)
    onFormDataChange(field, newArray)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Course Details</h2>
        <p className="mt-2 text-gray-600">
          Help students understand what they'll learn and what they need to get started.
        </p>
      </div>

      {/* Learning Objectives */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What will students learn? *
        </label>
        <p className="text-sm text-gray-500 mb-4">
          List 4-8 key learning outcomes. Use action verbs like \"Build\", \"Learn\", \"Understand\".
        </p>
        
        <div className="space-y-3">
          {(formData.learningObjectives || []).map((objective, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => updateListItem('learningObjectives', index, e.target.value)}
                  placeholder={`e.g., Build a complete web application using React`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={120}
                />
              </div>
              <button
                type="button"
                onClick={() => removeListItem('learningObjectives', index)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addListItem('learningObjectives')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            disabled={(formData.learningObjectives || []).length >= 8}
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add learning objective</span>
          </button>
        </div>
        {errors.learningObjectives && <p className="text-sm text-red-600 mt-1">{errors.learningObjectives}</p>}
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Requirements or Prerequisites
        </label>
        <p className="text-sm text-gray-500 mb-4">
          What do students need to know or have before taking this course?
        </p>
        
        <div className="space-y-3">
          {(formData.requirements || []).map((requirement, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => updateListItem('requirements', index, e.target.value)}
                  placeholder={`e.g., Basic knowledge of HTML and CSS`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={120}
                />
              </div>
              <button
                type="button"
                onClick={() => removeListItem('requirements', index)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addListItem('requirements')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add requirement</span>
          </button>
        </div>
      </div>

      {/* Target Audience */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Who is this course for?
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Describe your ideal students and their goals.
        </p>
        
        <div className="space-y-3">
          {(formData.targetAudience || []).map((audience, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => updateListItem('targetAudience', index, e.target.value)}
                  placeholder={`e.g., Beginners who want to start web development`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={120}
                />
              </div>
              <button
                type="button"
                onClick={() => removeListItem('targetAudience', index)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addListItem('targetAudience')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add target audience</span>
          </button>
        </div>
      </div>

      {/* Detailed Description */}
      <div>
        <label htmlFor="detailedDescription" className="block text-sm font-medium text-gray-700 mb-2">
          Detailed Course Description
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Provide a comprehensive description of your course. This will be displayed on your course landing page.
        </p>
        <textarea
          id="detailedDescription"
          rows={6}
          value={formData.detailedDescription}
          onChange={(e) => onFormDataChange('detailedDescription', e.target.value)}
          placeholder="Describe your course in detail. What makes it unique? What projects will students build? How is it structured?"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          maxLength={1000}
        />
        <p className="text-sm text-gray-500 mt-1">{formData.detailedDescription.length}/1000</p>
      </div>

      {/* Course Structure */}
      <div>
        <label htmlFor="courseStructure" className="block text-sm font-medium text-gray-700 mb-2">
          Course Structure
        </label>
        <p className="text-sm text-gray-500 mb-4">
          How is your course organized? Describe the flow and progression.
        </p>
        <textarea
          id="courseStructure"
          rows={4}
          value={formData.courseStructure}
          onChange={(e) => onFormDataChange('courseStructure', e.target.value)}
          placeholder="e.g., The course is divided into 8 sections, starting with fundamentals and progressing to advanced topics with hands-on projects."
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          maxLength={500}
        />
        <p className="text-sm text-gray-500 mt-1">{formData.courseStructure.length}/500</p>
      </div>

      {/* Course Stats */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Course Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="courseDuration" className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Duration (Hours)
            </label>
            <input
              type="number"
              id="courseDuration"
              value={formData.courseDuration}
              onChange={(e) => onFormDataChange('courseDuration', e.target.value)}
              placeholder="e.g., 12"
              min="1"
              max="100"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="totalLectures" className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Number of Lectures
            </label>
            <input
              type="number"
              id="totalLectures"
              value={formData.totalLectures}
              onChange={(e) => onFormDataChange('totalLectures', e.target.value)}
              placeholder="e.g., 45"
              min="1"
              max="500"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          💡 These are estimates to help students understand the course scope. You can adjust them as you add content.
        </p>
      </div>
    </div>
  )
}

export default CourseDetailsStep