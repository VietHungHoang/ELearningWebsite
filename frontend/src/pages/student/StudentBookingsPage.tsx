import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Calendar, 
  Settings, 
  BookOpen, 
  Users, 
  GraduationCap, 
  FileText, 
  Mail, 
  MessageCircle, 
  Award, 
  CreditCard, 
  LogOut,
  ShoppingCart,
  Bell,
  MessageCircle as MessageIcon
} from 'lucide-react'
import { StudentLayout, CalendarView } from '../../components'

const StudentBookingsPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentDate, setCurrentDate] = useState('September 13, 2025')
  const [activeView, setActiveView] = useState('Daily')
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()

  const handleSidebarItemClick = (path: string) => {
    navigate(path)
  }

  const sidebarItems = [
    { icon: Settings, label: 'Profile Settings', path: '/student/profile' },
    { icon: Calendar, label: 'My Bookings', path: '/student/bookings', active: true },
    { icon: BookOpen, label: 'My Learning', path: '/student/course-list' },
    { icon: Users, label: 'Find Tutors', path: '/student/find-tutors' },
    { icon: FileText, label: 'My Quizzes', path: '/student/quizzes' },
    { icon: GraduationCap, label: 'Find Courses', path: '/student/courses' },
    { icon: BookOpen, label: 'Find Course Bundles', path: '/student/bundles' },
    { icon: FileText, label: 'Assignments', path: '/student/assignments' },
    { icon: Mail, label: 'Inbox', path: '/student/inbox' },
    { icon: MessageCircle, label: 'Community', path: '/student/community' },
    { icon: Award, label: 'My Certificates', path: '/student/certificates' },
  ]

  const breadcrumbItems = [
    { label: 'Profile Settings', path: '/student/profile' },
    { label: 'My Bookings' }
  ]

  const userControls = {
    currency: 'USD $',
    language: 'En',
    languageFlag: 'https://flagcdn.com/w20/us.png',
    cartCount: 1,
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  }

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
      userControls={userControls}
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
