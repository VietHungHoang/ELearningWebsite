import { CheckCircle } from 'lucide-react'

interface PrerequisitesProps {
  prerequisites: string[]
}

const Prerequisites = ({ prerequisites }: PrerequisitesProps) => {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Prerequisites</h2>
      <div className="space-y-3">
        {prerequisites.map((prerequisite, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#134E4A] mt-0.5 flex-shrink-0" />
            <p className="text-gray-700">{prerequisite}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Prerequisites
