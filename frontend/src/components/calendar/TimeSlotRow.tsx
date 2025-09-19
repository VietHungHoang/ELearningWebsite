import React from 'react'

interface TimeSlotRowProps {
  time: string
  children?: React.ReactNode
  className?: string
}

const TimeSlotRow: React.FC<TimeSlotRowProps> = ({
  time,
  children,
  className = ''
}) => {
  return (
    <div className={`flex hover:bg-gray-50 transition-colors min-h-[60px] ${className}`}>
      <div className="w-20 p-4 border-r border-gray-200 text-sm text-gray-600">
        {time}
      </div>
      <div className="flex-1 p-4 min-h-[60px]">
        {children}
      </div>
    </div>
  )
}

export default TimeSlotRow
