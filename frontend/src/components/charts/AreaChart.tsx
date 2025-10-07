import React from 'react'

export interface AreaChartPoint {
  label: string
  value: number
}

interface AreaChartProps {
  title?: string
  data: AreaChartPoint[]
}

const AreaChart: React.FC<AreaChartProps> = ({ title, data }) => {
  // Simple SVG area chart (no external deps) for lightweight dashboards
  const width = 520
  const height = 200
  const padding = 32
  const maxValue = Math.max(...data.map(d => d.value), 1)
  const stepX = (width - padding * 2) / Math.max(data.length - 1, 1)
  const points = data.map((d, i) => [padding + i * stepX, height - padding - (d.value / maxValue) * (height - padding * 2)])

  const pathD = points.reduce((acc, [x, y], i) => {
    return acc + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`)
  }, '')

  const areaD = `${pathD} L ${padding + (data.length - 1) * stepX} ${height - padding} L ${padding} ${height - padding} Z`

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-300">
      {title && <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        {title}
      </h3>}
      <svg width={width} height={height} className="w-full h-auto">
        <defs>
          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#area)" />
        <path d={pathD} fill="none" stroke="url(#line)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={4} fill="url(#line)" className="drop-shadow-sm" />
        ))}
      </svg>
      <div className="flex justify-between text-xs text-slate-600 mt-3 font-medium">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  )
}

export default AreaChart


