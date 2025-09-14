import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StudentLayout, CalendarView } from '../../components'
import { studentUserControls, getStudentSidebarItems } from '../../utils/studentConfig'

const StudentBookingsPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentDate] = useState('September 13, 2025')
  const [activeView] = useState('Daily')
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()

  const handleSidebarItemClick = (path: string) => {
    navigate(path)
  }

  const sidebarItems = getStudentSidebarItems('/student/bookings')

  const breadcrumbItems = [
    { label: 'My Bookings' }
  ]

  const timeSlots = [
    '12:00 am', '01:00 am', '02:00 am', '03:00 am', '04:00 am', '05:00 am',
    '06:00 am', '07:00 am', '08:00 am', '09:00 am', '10:00 am', '11:00 am',
    '12:00 pm', '01:00 pm', '02:00 pm', '03:00 pm', '04:00 pm', '05:00 pm',
    '06:00 pm', '07:00 pm', '08:00 pm', '09:00 pm', '10:00 pm', '11:00 pm'
  ]

  const handlePreviousDate = () => {
    console.log('Previous date')
  }

  const handleNextDate = () => {
    console.log('Next date')
  }

  const handleToday = () => {
    console.log('Today')
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }

  const handleSearchSubmit = (value: string) => {
    console.log('Search submitted:', value)
  }

  const handleFilterClick = () => {
    console.log('Filter clicked')
  }

  const handleViewChange = (view: string) => {
    console.log('View changed:', view)
  }

  return (
    <StudentLayout
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      sidebarItems={sidebarItems}
      onSidebarItemClick={handleSidebarItemClick}
      breadcrumbItems={breadcrumbItems}
      searchPlaceholder="Quick search here"
      searchShortcut="Ctrl + K"
      userControls={studentUserControls}
    >
      <div className="flex-1 flex flex-col min-h-0">
        <CalendarView
          currentDate={currentDate}
          timeSlots={timeSlots}
          onPreviousDate={handlePreviousDate}
          onNextDate={handleNextDate}
          onToday={handleToday}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          onFilterClick={handleFilterClick}
          activeView={activeView}
          onViewChange={handleViewChange}
          viewOptions={['Daily', 'Weekly', 'Monthly']}
        >
          {/* Booking slots will go here */}
          <div className="text-gray-500 text-sm">
            No bookings scheduled for this time slot
          </div>
        </CalendarView>
      </div>
    </StudentLayout>
  )
}

export default StudentBookingsPage
