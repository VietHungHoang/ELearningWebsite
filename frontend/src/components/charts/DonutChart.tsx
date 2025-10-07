import React from 'react'

export interface DonutChartSlice {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  title?: string
  data: DonutChartSlice[]
}

const DonutChart: React.FC<DonutChartProps> = ({ title, data }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1
  const size = 220
  const stroke = 24
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius

  let cumulative = 0

  return (
    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl shadow-lg border border-violet-100 p-6 hover:shadow-xl transition-all duration-300">
      {title && <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
        {title}
      </h3>}
      <svg width={size} height={size} className="mx-auto block">
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {data.map((slice) => {
            const ratio = slice.value / total
            const dash = ratio * circumference
            const gap = circumference - dash
            const circle = (
              <circle
                key={slice.label}
                r={radius}
                cx={size / 2}
                cy={size / 2}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={cumulative}
                className="drop-shadow-sm"
              />
            )
            cumulative -= dash
            return circle
          })}
        </g>
      </svg>
      <div className="mt-4 flex flex-wrap gap-3 justify-center text-xs text-slate-600 font-medium">
        {data.map(s => (
          <div key={s.label} className="flex items-center gap-2 bg-white/60 px-3 py-1 rounded-full">
            <span className="inline-block w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: s.color }} />
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DonutChart


