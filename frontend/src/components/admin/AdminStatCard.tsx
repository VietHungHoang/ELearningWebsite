import React from 'react'

interface AdminStatCardProps {
  label: string
  value: string | number
  trend?: string
  icon?: React.ReactNode
}

const AdminStatCard: React.FC<AdminStatCardProps> = ({ label, value, trend, icon }) => {
  const getGradientClass = () => {
    const gradients = [
      'from-blue-500 to-cyan-500',
      'from-emerald-500 to-teal-500', 
      'from-violet-500 to-purple-500',
      'from-orange-500 to-red-500',
      'from-pink-500 to-rose-500',
      'from-indigo-500 to-blue-500',
      'from-green-500 to-emerald-500',
      'from-yellow-500 to-orange-500'
    ]
    return gradients[Math.floor(Math.random() * gradients.length)]
  }

  return (
    <div className="group relative bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${getGradientClass()} opacity-5 rounded-full -translate-y-10 translate-x-10 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      <div className="relative z-10 flex items-center gap-4">
        {icon && (
          <div className={`p-3 rounded-xl bg-gradient-to-br ${getGradientClass()} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
            {icon}
          </div>
        )}
        <div className="flex-1">
          <div className="text-sm font-medium text-slate-600 mb-1">{label}</div>
          <div className="text-2xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors duration-300">{value}</div>
          {trend && (
            <div className={`text-xs font-semibold mt-1 px-2 py-1 rounded-full inline-block ${
              trend.includes('▲') 
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {trend}
            </div>
          )}
        </div>
      </div>
      
      {/* Hover effect border */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${getGradientClass()} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}></div>
    </div>
  )
}

export default AdminStatCard


