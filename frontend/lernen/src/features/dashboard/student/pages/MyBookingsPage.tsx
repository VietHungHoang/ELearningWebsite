import React, { useState, useEffect } from 'react';
import SessionDetailModal from '../my-session/components/SessionDetailModal';
import DailyView from '../components/DailyView';
import WeeklyView from '../components/WeeklyView';
import MonthlyView from '../components/MonthlyView';
import CalendarSkeleton from '../my-session/components/CalendarSkeleton';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import type { Session } from '../../../../types/class';
import DatePicker from '../../components/DatePicker';
import { classService } from '../../../../services/classService';
import { useAuth } from '../../../../context/AuthContext';
import { useBreadcrumb } from '../../context/BreadcrumbContext';

const MyBookingsPage: React.FC = () => {
    const { t } = useTranslation();
    const { state } = useAuth();
    const [view, setView] = useState<'Daily' | 'Weekly' | 'Monthly'>('Monthly');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedBooking, setSelectedBooking] = useState<Session | null>(null);
    const [modalPosition, setModalPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [bookings, setBookings] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            { label: t('dashboard.header.breadcrumb.dashboard'), path: '/dashboard' },
            { label: t('footer.myBookings') }
        ]);
    }, [setBreadcrumb, t]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setIsLoading(true);
                const studentId = state.user?.id || 'current-student-id';
                const response = await classService.getStudentSessions(studentId);
                console.log('API Response:', response);
                console.log('Response data:', response.data);
                console.log('Response data type:', typeof response.data);
                console.log('Is array:', Array.isArray(response.data));
                
                if (response.success && response.data) {
                    // API returns data as Session[] directly
                    const sessions = response.data;
                    console.log('Sessions to set:', sessions);
                    console.log('Sessions length:', sessions.length);
                    setBookings(sessions);
                }
            } catch (error) {
                console.error('Failed to fetch bookings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (state.user) {
            fetchBookings();
        }
    }, [state.user]);

    const handleSessionClick = (session: Session, event: React.MouseEvent) => {
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
        setSelectedBooking(session);
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
            case 'Daily': return t('dashboard.tutor.today');
            case 'Weekly': return t('dashboard.tutor.thisWeek');
            case 'Monthly': return t('dashboard.tutor.thisMonth');
            default: return t('dashboard.tutor.today');
        }
    };

    const ViewButton: React.FC<{ label: 'Daily' | 'Weekly' | 'Monthly' }> = ({ label }) => {
        const getLabelKey = () => {
            switch (label) {
                case 'Daily': return 'dashboard.tutor.today';
                case 'Weekly': return 'dashboard.tutor.thisWeek';
                case 'Monthly': return 'dashboard.tutor.thisMonth';
                default: return 'bookings.daily';
            }
        };

        return (
            <button
                onClick={() => setView(label)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                    view === label ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:bg-white/50'
                }`}
            >
                {t(getLabelKey())}
            </button>
        );
    };

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
                {isLoading ? (
                    <CalendarSkeleton view={view} />
                ) : (
                    <>
                        {view === 'Daily' && (
                            <DailyView
                                currentDate={currentDate}
                                bookings={bookings}
                                onSessionClick={handleSessionClick}
                            />
                        )}
                        {view === 'Weekly' && (
                            <WeeklyView
                                currentDate={currentDate}
                                bookings={bookings}
                                onSessionClick={handleSessionClick}
                            />
                        )}
                        {view === 'Monthly' && (
                            <MonthlyView
                                currentDate={currentDate}
                                bookings={bookings}
                                onSessionClick={handleSessionClick}
                            />
                        )}
                    </>
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

