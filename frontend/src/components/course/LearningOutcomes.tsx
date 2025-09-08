import { Check } from 'lucide-react'

interface LearningOutcomesProps {
  outcomes: string[]
}

const LearningOutcomes = ({ outcomes }: LearningOutcomesProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">What You'll Learn</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {outcomes.map((outcome, index) => (
          <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100">
            <div className="flex-shrink-0 mt-0.5">
              <Check className="w-5 h-5 text-[#134E4A]" />
            </div>
            <p className="text-gray-700 font-medium">{outcome}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LearningOutcomes
