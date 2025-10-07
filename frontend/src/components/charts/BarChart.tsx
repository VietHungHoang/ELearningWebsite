import React from 'react'

export interface BarChartDatum {
  label: string
  value: number
}

interface BarChartProps {
  title?: string
  data: BarChartDatum[]
}

const BarChart: React.FC<BarChartProps> = ({ title, data }) => {
  const width = 520
  const height = 200
  const padding = 32
  const maxValue = Math.max(...data.map(d => d.value), 1)
  const barWidth = (width - padding * 2) / data.length - 8

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-lg border border-emerald-100 p-6 hover:shadow-xl transition-all duration-300">
      {title && <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
        {title}
      </h3>}
      <svg width={width} height={height} className="w-full h-auto">
        <defs>
          <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        {data.map((d, i) => {
          const x = padding + i * (barWidth + 8)
          const h = (d.value / maxValue) * (height - padding * 2)
          const y = height - padding - h
          return (
            <g key={d.label}>
              <rect x={x} y={y} width={barWidth} height={h} fill="url(#bar)" rx={6} className="drop-shadow-sm hover:drop-shadow-md transition-all duration-200" />
            </g>
          )
        })}
      </svg>
      <div className="flex justify-between text-xs text-slate-600 mt-3 font-medium">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  )
}

export default BarChart


