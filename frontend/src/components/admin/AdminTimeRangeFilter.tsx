import React from 'react'

type Range = '7d' | '30d' | '90d' | '1y'

interface AdminTimeRangeFilterProps {
  value: Range
  onChange: (value: Range) => void
}

const ranges: { value: Range; label: string }[] = [
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
  { value: '1y', label: '1Y' },
]

const AdminTimeRangeFilter: React.FC<AdminTimeRangeFilterProps> = ({ value, onChange }) => {
  return (
    <div className="inline-flex bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm">
      {ranges.map(r => (
        <button
          key={r.value}
          className={`px-4 py-2 text-sm font-semibold transition-all duration-300 ${
            value === r.value 
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105' 
              : 'text-slate-700 hover:bg-white/60 hover:text-slate-900 hover:shadow-md'
          }`}
          onClick={() => onChange(r.value)}
        >
          {r.label}
        </button>
      ))}
    </div>
  )
}

export default AdminTimeRangeFilter


