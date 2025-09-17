import React from 'react'
import { ChevronLeft, ChevronRight, Calendar, Search, Filter } from 'lucide-react'

interface CalendarHeaderProps {
  currentDate: string
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
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPreviousDate,
  onNextDate,
  onToday,
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
  onFilterClick,
  activeView,
  onViewChange,
  viewOptions = ['Daily', 'Weekly', 'Monthly']
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchSubmit?.(searchValue)
  }

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Left Side - Date Navigation */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={onToday}
          className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Today</span>
          <ChevronRight className="w-4 h-4" />
        </button>
        
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-900">{currentDate}</span>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Right Side - Search, Filter, View Toggles */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search here"
            value={searchValue}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </form>

        {/* Filter */}
        <button 
          onClick={onFilterClick}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-4 h-4 text-gray-600" />
        </button>

        {/* View Toggles */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {viewOptions.map((view) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeView === view
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CalendarHeader
