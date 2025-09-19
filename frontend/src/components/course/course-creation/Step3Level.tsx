import React, { useState } from 'react'
import StepCard from './StepCard'
import type { BasicCreationCourse } from '../../../types'
import BackButton from './BackButton'
import NextButton from './NextButton'

// Component cho Step 3: Course Level
const Step3Level: React.FC<{
  data: BasicCreationCourse
  onUpdate: (data: Partial<BasicCreationCourse>) => void
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
      <StepCard 
        step={3} 
        title="What's the level of your course?" 
        description="Choose the level that best describes your course content." 
      />

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
          <BackButton onBack={onBack} label="Back" />
          <NextButton 
            onNext={handleSubmit} 
            disabled={!level} 
            label="Create Course"
          />
        </div>
      </div>
    </div>
  )
}

export default Step3Level