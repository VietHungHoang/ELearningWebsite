import React from 'react'
import { Calendar, Clock, User, MapPin } from 'lucide-react'

interface Booking {
  id: string
  title: string
  tutor: string
  date: string
  time: string
  duration: string
  location: string
  status: 'upcoming' | 'completed' | 'cancelled'
}

interface BookingCardProps {
  booking: Booking
  onClick?: (booking: Booking) => void
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onClick }) => {
  const getStatusColor = () => {
    switch (booking.status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick?.(booking)}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900">{booking.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {booking.status}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>{booking.tutor}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{booking.date}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{booking.time} ({booking.duration})</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{booking.location}</span>
        </div>
      </div>
    </div>
  )
}

export default BookingCard
