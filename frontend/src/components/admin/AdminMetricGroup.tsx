import React from 'react'

interface AdminMetricGroupProps {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}

const AdminMetricGroup: React.FC<AdminMetricGroupProps> = ({ title, action, children }) => {
  return (
    <section className="group relative bg-gradient-to-br from-white via-slate-50 to-white rounded-2xl shadow-xl border border-slate-200 p-6 hover:shadow-2xl transition-all duration-500 overflow-hidden mb-6">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-400/10 to-teal-400/10 rounded-full translate-y-12 -translate-x-12 group-hover:scale-110 transition-transform duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
            {title}
          </h2>
          {action && (
            <div className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors duration-300">
              {action}
            </div>
          )}
        </div>
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </section>
  )
}

export default AdminMetricGroup


