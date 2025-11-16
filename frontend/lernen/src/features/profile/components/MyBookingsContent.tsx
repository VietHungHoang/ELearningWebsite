import React, { useState } from 'react';
import SessionDetailModal from './SessionDetailModal';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiSearch, FiGrid } from 'react-icons/fi';

interface Booking {
  id: number;
  title: string;
  date: Date;
  durationHours: number; // Added duration
  color: string;
  tutorName: string;
  tutorAvatar: string;
}

const mockBookings: Booking[] = [
    { id: 1, title: 'Math Session', date: new Date('2025-10-20T10:00:00Z'), durationHours: 1, color: 'bg-blue-100 text-blue-800', tutorName: 'Cynthia Hunter', tutorAvatar: 'https://picsum.photos/seed/cynthia/48/48' },
    { id: 2, title: 'Physics Lab', date: new Date('2025-10-22T14:00:00Z'), durationHours: 2, color: 'bg-green-100 text-green-800', tutorName: 'Steven Ford', tutorAvatar: 'https://picsum.photos/seed/steven/48/48' },
    { id: 3, title: 'History Review', date: new Date('2025-10-22T16:00:00Z'), durationHours: 1, color: 'bg-yellow-100 text-yellow-800', tutorName: 'Antony Clara', tutorAvatar: 'https://picsum.photos/seed/antonyC/48/48' },
    { id: 4, title: 'Creative Writing', date: new Date('2025-10-24T11:00:00Z'), durationHours: 1, color: 'bg-purple-100 text-purple-800', tutorName: 'Arianne Kearns', tutorAvatar: 'https://picsum.photos/seed/arianne/48/48' },
    { id: 5, title: 'Calculus Prep', date: new Date('2025-10-28T09:00:00Z'), durationHours: 1, color: 'bg-blue-100 text-blue-800', tutorName: 'Cynthia Hunter', tutorAvatar: 'https://picsum.photos/seed/cynthia/48/48' },
];


const MyBookingsContent: React.FC = () => {
    const [view, setView] = useState<'Daily' | 'Weekly' | 'Monthly'>('Monthly');
    const [currentDate, setCurrentDate] = useState(new Date('2025-10-20T12:00:00Z'));
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [modalPosition, setModalPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    const handleSessionClick = (booking: Booking, event: React.MouseEvent) => {
        const targetElement = event.currentTarget as HTMLElement;
        const rect = targetElement.getBoundingClientRect();
        
        // Check if there is enough space on the right, otherwise open to the left
        const spaceOnRight = window.innerWidth - rect.right;
        const modalWidth = 320; // width of the modal (w-80)
        let leftPosition = rect.right + window.scrollX + 10; // 10px offset
        if (spaceOnRight < modalWidth + 20) { // +20 for some margin
            leftPosition = rect.left + window.scrollX - modalWidth - 10;
        }

        setModalPosition({
            top: rect.top + window.scrollY,
            left: leftPosition
        });
        setSelectedBooking(booking);
    };

    // --- Date Helpers ---
    const getWeekDays = (baseDate: Date) => {
        const startOfWeek = new Date(baseDate);
        startOfWeek.setHours(0,0,0,0);
        startOfWeek.setDate(baseDate.getDate() - baseDate.getDay()); // Go back to Sunday
        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            return day;
        });
    };

    const getWeekRangeDisplay = (baseDate: Date) => {
        const weekDays = getWeekDays(baseDate);
        const startDate = weekDays[0];
        const endDate = weekDays[6];

        const startFormat: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
        const endFormat: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };

        return `${startDate.toLocaleDateString('en-US', startFormat)} - ${endDate.toLocaleDateString('en-US', endFormat)}`;
    };

    // --- Navigation Handlers ---
    const handleNavigation = (direction: 'prev' | 'next' | 'today') => {
        setCurrentDate(prevDate => {
            if (direction === 'today') return new Date();
            
            const newDate = new Date(prevDate);
            const increment = direction === 'prev' ? -1 : 1;
            
            if (view === 'Daily') {
                newDate.setDate(newDate.getDate() + increment);
            } else if (view === 'Weekly') {
                newDate.setDate(newDate.getDate() + (7 * increment));
            } else if (view === 'Monthly') {
                newDate.setMonth(newDate.getMonth() + increment);
            }
            return newDate;
        });
    };

    const ViewButton: React.FC<{ label: 'Daily' | 'Weekly' | 'Monthly' }> = ({ label }) => (
        <button
            onClick={() => setView(label)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                view === label ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:bg-white/50'
            }`}
        >
            {label}
        </button>
    );

    const renderDailyView = () => {
        const times = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM to 11 PM (23:00)
        const bookingsForDay = mockBookings.filter(b => b.date.toDateString() === currentDate.toDateString());
        const rowHeight = 48; // h-12 is 3rem = 48px

        return (
             <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-[auto,1fr] text-sm font-semibold text-gray-600 bg-gray-50">
                    <div className="p-3 border-r border-gray-200 w-28 text-left">Time</div>
                    <div className="p-3">{currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} GMT +13:00</div>
                </div>
                <div className="relative">
                    <div className="divide-y divide-gray-200">
                        {times.map(hour => (
                            <div key={hour} className="grid grid-cols-[auto,1fr]" style={{ height: `${rowHeight}px` }}>
                                <div className="w-28 px-3 py-2 border-r border-gray-200 text-xs text-gray-500 font-medium text-right flex items-center justify-end">
                                    <span>{`${String(hour % 12 === 0 ? 12 : hour % 12).padStart(2, '0')}:00 ${hour < 12 ? 'am' : 'pm'}`}</span>
                                </div>
                                <div className="flex-1"></div>
                            </div>
                        ))}
                    </div>
                     <div className="absolute top-0 left-28 right-0 bottom-0">
                        {bookingsForDay.map(booking => {
                            const startHour = booking.date.getUTCHours();
                            const top = (startHour - 6) * rowHeight;
                            const height = booking.durationHours * rowHeight;
                            return (
                                <div
                                    key={booking.id}
                                    onClick={(e) => handleSessionClick(booking, e)}
                                    className={`absolute w-full px-3 py-1 rounded-lg cursor-pointer ${booking.color}`}
                                    style={{ top: `${top}px`, height: `${height - 4}px`, left: '2px', right: '2px', width: 'calc(100% - 4px)' }}
                                >
                                    <p className="font-bold text-sm">{booking.title}</p>
                                    <p className="text-xs">{booking.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderWeeklyView = () => {
        const weekDays = getWeekDays(currentDate);
        return (
            <div className="border border-gray-200 rounded-lg overflow-x-auto">
                <div className="grid grid-cols-7 min-w-[800px]">
                    {/* Header */}
                    {weekDays.map((day, index) => (
                        <div key={index} className={`p-3 text-center border-b border-gray-200 bg-gray-50 ${index < 6 ? 'border-r' : ''}`}>
                            <p className="font-bold text-gray-800 text-sm">
                                {day.toLocaleDateString('en-US', { day: 'numeric' })} {day.toLocaleDateString('en-US', { month: 'long' })}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {day.toLocaleDateString('en-US', { weekday: 'short' })}
                            </p>
                        </div>
                    ))}
                    {/* Body */}
                    {weekDays.map((day, index) => {
                        const sessionsForDay = mockBookings.filter(b => b.date.toDateString() === day.toDateString());
                        return (
                             <div key={index} className={`h-[400px] p-2 space-y-1 ${index < 6 ? 'border-r' : ''} border-gray-200`}>
                                {sessionsForDay.length > 0 ? (
                                    sessionsForDay.map(session => (
                                         <div 
                                            key={session.id} 
                                            onClick={(e) => handleSessionClick(session, e)}
                                            className={`text-xs font-semibold py-1 px-1.5 rounded-md text-left truncate cursor-pointer ${session.color}`}
                                        >
                                            <p className="font-bold">{session.title}</p>
                                            <p>{session.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-[#FBF6EE] text-[#B58A3F] text-xs font-semibold py-1.5 px-2 rounded-lg text-center">
                                        No sessions
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    };
    
    const renderMonthlyView = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const daysInMonth = lastDayOfMonth.getDate();
        const startDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday

        const calendarDays = [];
        
        // Days from previous month
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            calendarDays.push({ day: prevMonthLastDay - i, isCurrentMonth: false });
        }
        
        // Days of current month
        for (let i = 1; i <= daysInMonth; i++) {
            calendarDays.push({ day: i, isCurrentMonth: true });
        }
        
        // Days from next month
        const remainingCells = 42 - calendarDays.length; // 6 weeks * 7 days
        for (let i = 1; i <= remainingCells; i++) {
            calendarDays.push({ day: i, isCurrentMonth: false });
        }

        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return (
             <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                    {weekDays.map(day => (
                        <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 grid-rows-6">
                    {calendarDays.map((d, index) => {
                        const dayDate = d.isCurrentMonth ? new Date(year, month, d.day) : null;
                        const sessionsForDay = dayDate 
                            ? mockBookings.filter(booking => booking.date.toDateString() === dayDate.toDateString())
                            : [];

                        return (
                            <div key={index} className={`calendar-day-cell h-28 p-2 border-r border-b border-gray-200 ${!d.isCurrentMonth ? 'bg-gray-50' : ''}`}>
                                <p className={`text-sm font-semibold ${d.isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}`}>{d.day}</p>
                                {d.isCurrentMonth && sessionsForDay.length > 0 && (
                                    <div className="mt-1 space-y-1 overflow-y-auto max-h-20 custom-scrollbar">
                                        {sessionsForDay.map(session => (
                                            <div 
                                                key={session.id} 
                                                onClick={(e) => handleSessionClick(session, e)}
                                                className={`text-xs font-semibold py-1 px-1.5 rounded-md text-left truncate cursor-pointer ${session.color}`}
                                            >
                                                {session.title}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    };


    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            {/* Header Controls */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                        <button onClick={() => handleNavigation('prev')} className="p-2 hover:bg-gray-100 rounded-l-md"><FiChevronLeft /></button>
                        <button onClick={() => handleNavigation('today')} className="px-4 py-1.5 text-sm font-semibold text-gray-700 border-x border-gray-200 hover:bg-gray-100">Today</button>
                        <button onClick={() => handleNavigation('next')} className="p-2 hover:bg-gray-100 rounded-r-md"><FiChevronRight /></button>
                    </div>
                    <div className="relative">
                        <input 
                            type="text" 
                            readOnly 
                            value={
                                view === 'Daily' ? currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) :
                                view === 'Weekly' ? getWeekRangeDisplay(currentDate) :
                                currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                            }
                            className="bg-gray-100 border border-transparent rounded-lg pl-4 pr-10 py-2 text-sm font-medium text-gray-800 w-60 cursor-pointer focus:outline-none"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <FiCalendar />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <input type="text" placeholder="Search here" className="bg-gray-100 rounded-lg pl-10 pr-4 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-[#0b6459]" />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch />
                        </div>
                    </div>
                    <button className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200">
                        <FiGrid />
                    </button>
                    <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                        <ViewButton label="Daily" />
                        <ViewButton label="Weekly" />
                        <ViewButton label="Monthly" />
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="mt-6">
                {view === 'Daily' && renderDailyView()}
                {view === 'Weekly' && renderWeeklyView()}
                {view === 'Monthly' && renderMonthlyView()}
            </div>
            
            {selectedBooking && (
                <SessionDetailModal 
                    booking={selectedBooking} 
                    position={modalPosition} 
                    onClose={() => setSelectedBooking(null)} 
                />
            )}
        </div>
    );
};

export default MyBookingsContent;