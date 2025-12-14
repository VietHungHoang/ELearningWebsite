import React, { useState } from 'react';
import SessionDetailModal from '../components/SessionDetailModal';
import DailyView from '../components/DailyView';
import WeeklyView from '../components/WeeklyView';
import MonthlyView from '../components/MonthlyView';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import type { Booking } from '../types';
import DatePicker from '../../components/DatePicker';

const mockBookings: Booking[] = [
    { id: 1, title: 'Math Session', date: new Date('2025-10-20T10:00:00Z'), durationHours: 1, color: 'bg-blue-100 text-blue-800', tutorName: 'Cynthia Hunter', tutorAvatar: 'https://picsum.photos/seed/cynthia/48/48', status: 'Confirmed' },
    { id: 2, title: 'Physics Lab', date: new Date('2025-10-22T14:00:00Z'), durationHours: 2, color: 'bg-green-100 text-green-800', tutorName: 'Steven Ford', tutorAvatar: 'https://picsum.photos/seed/steven/48/48', status: 'Confirmed' },
    { id: 3, title: 'History Review', date: new Date('2025-10-22T16:00:00Z'), durationHours: 1, color: 'bg-yellow-100 text-yellow-800', tutorName: 'Antony Clara', tutorAvatar: 'https://picsum.photos/seed/antonyC/48/48', status: 'Pending' },
    { id: 4, title: 'Creative Writing', date: new Date('2025-10-24T11:00:00Z'), durationHours: 1, color: 'bg-purple-100 text-purple-800', tutorName: 'Arianne Kearns', tutorAvatar: 'https://picsum.photos/seed/arianne/48/48', status: 'Confirmed' },
    { id: 5, title: 'Calculus Prep', date: new Date('2025-10-28T09:00:00Z'), durationHours: 1, color: 'bg-blue-100 text-blue-800', tutorName: 'Cynthia Hunter', tutorAvatar: 'https://picsum.photos/seed/cynthia/48/48', status: 'Completed' },
];

const MyBookingsPage: React.FC = () => {
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

    // --- Navigation Handlers ---
    const handleNavigation = (direction: 'prev' | 'next' | 'today') => {
        setCurrentDate(prevDate => {
            if (direction === 'today') {
                const now = new Date();
                if (view === 'Daily') {
                    return now;
                } else if (view === 'Weekly') {
                    // Ngày đầu tuần (Chủ nhật)
                    const startOfWeek = new Date(now);
                    startOfWeek.setHours(0, 0, 0, 0);
                    startOfWeek.setDate(now.getDate() - now.getDay());
                    return startOfWeek;
                } else if (view === 'Monthly') {
                    // Ngày đầu tháng
                    return new Date(now.getFullYear(), now.getMonth(), 1);
                }
                return now;
            }

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

    const getTodayButtonText = () => {
        switch (view) {
            case 'Daily': return 'Today';
            case 'Weekly': return 'This Week';
            case 'Monthly': return 'This Month';
            default: return 'Today';
        }
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

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            {/* Header Controls */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                        <button onClick={() => handleNavigation('prev')} className="p-2 hover:bg-gray-100 rounded-l-md"><FiChevronLeft /></button>
                        <button onClick={() => handleNavigation('today')} className="px-4 py-1.5 text-sm font-semibold text-gray-700 border-x border-gray-200 hover:bg-gray-100">{getTodayButtonText()}</button>
                        <button onClick={() => handleNavigation('next')} className="p-2 hover:bg-gray-100 rounded-r-md"><FiChevronRight /></button>
                    </div>
                    <DatePicker
                        value={currentDate}
                        onChange={setCurrentDate}
                        mode={view}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                        <ViewButton label="Daily" />
                        <ViewButton label="Weekly" />
                        <ViewButton label="Monthly" />
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="mt-6">
                {view === 'Daily' && (
                    <DailyView
                        currentDate={currentDate}
                        bookings={mockBookings}
                        onSessionClick={handleSessionClick}
                    />
                )}
                {view === 'Weekly' && (
                    <WeeklyView
                        currentDate={currentDate}
                        bookings={mockBookings}
                        onSessionClick={handleSessionClick}
                    />
                )}
                {view === 'Monthly' && (
                    <MonthlyView
                        currentDate={currentDate}
                        bookings={mockBookings}
                        onSessionClick={handleSessionClick}
                    />
                )}
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

export default MyBookingsPage;

