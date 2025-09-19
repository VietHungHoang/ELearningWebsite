import React from 'react'
import TimeSlotRow from './TimeSlotRow'

interface CalendarViewProps {
  currentDate: string
  timeSlots: string[]
  onPreviousDate: () => void
  onNextDate: () => void
  onToday: () => void
  searchValue?: string
  onSearchChange?: (value: string) => void
  onSearchSubmit?: (value: string) => void
  onFilterClick?: () => void
  activeView: string
  onViewChange: (view: string) => void
  viewOptions?: string[]
  children?: React.ReactNode
}

const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  timeSlots,
  onPreviousDate,
  onNextDate,
  onToday,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onFilterClick,
  activeView,
  onViewChange,
  viewOptions,
  children
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 overflow-hidden flex flex-col mb-2">
      {/* Calendar Header */}
      <div className="flex border-b border-gray-200 flex-shrink-0">
        <div className="w-20 p-4 border-r border-gray-200">
          <span className="text-sm font-medium text-gray-700">Time</span>
        </div>
        <div className="flex-1 p-4">
          <span className="text-sm font-medium text-gray-700">{currentDate} GMT +00:00</span>
        </div>
      </div>

      {/* Time Slots - Scrollable */}
      <div className="divide-y divide-gray-100 overflow-y-auto flex-1 min-h-0 pb-2">
        {timeSlots.map((time, index) => (
          <TimeSlotRow key={index} time={time}>
            {children}
          </TimeSlotRow>
        ))}
      </div>
    </div>
  )
}

export default CalendarView
