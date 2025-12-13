import React, { useState, useEffect } from 'react';
import { HiChevronLeft, HiChevronRight, HiX } from 'react-icons/hi';

interface ScheduleDatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (date: Date) => void;
  selectedDate: Date;
  view: 'Daily' | 'Weekly' | 'Monthly';
}

const ScheduleDatePickerModal: React.FC<ScheduleDatePickerModalProps> = ({ isOpen, onClose, onApply, selectedDate, view }) => {
    const [displayDate, setDisplayDate] = useState(new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), 1)));
    const [hoveredWeek, setHoveredWeek] = useState<{ start: Date; end: Date } | null>(null);

    useEffect(() => {
        if (isOpen) {
            setDisplayDate(new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), 1)));
        }
    }, [selectedDate, isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    const getWeekRangeForDate = (date: Date) => {
        const d = new Date(date.getTime());
        d.setUTCHours(0, 0, 0, 0);
        const day = d.getUTCDay();
        const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
        const start = new Date(d.setUTCDate(diff));
        const end = new Date(start.getTime());
        end.setUTCDate(start.getUTCDate() + 6);
        return { start, end };
    };

    const renderDayAndWeekPicker = () => {
        const year = displayDate.getUTCFullYear();
        const month = displayDate.getUTCMonth();
        const firstDayOfMonth = new Date(Date.UTC(year, month, 1)).getUTCDay();
        const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
        const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
        const blanks = Array(adjustedFirstDay).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        const handleDayClick = (day: number) => {
            const clickedDate = new Date(Date.UTC(year, month, day, 12, 0, 0));
            if (view === 'Daily') {
                onApply(clickedDate);
            } else {
                const weekStart = getWeekRangeForDate(clickedDate).start;
                onApply(weekStart);
            }
        };
        
        const handlePrevMonth = () => setDisplayDate(prev => new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() - 1, 1)));
        const handleNextMonth = () => setDisplayDate(prev => new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() + 1, 1)));

        return (
            <>
                <div className="flex items-center justify-between mb-4">
                    <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100"><HiChevronLeft className="w-5 h-5" /></button>
                    <span className="font-semibold text-gray-700">{displayDate.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}</span>
                    <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100"><HiChevronRight className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
                    {daysOfWeek.map(day => <div key={day} className="h-8 flex items-center justify-center">{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1" onMouseLeave={view === 'Weekly' ? () => setHoveredWeek(null) : undefined}>
                    {blanks.map((_, i) => <div key={`blank-${i}`}></div>)}
                    {days.map(day => {
                        const dayDate = new Date(Date.UTC(year, month, day));
                        let isSelected = false;
                        if (view === 'Daily') {
                           isSelected = selectedDate.getUTCDate() === day && selectedDate.getUTCMonth() === month && selectedDate.getUTCFullYear() === year;
                        } else {
                           const weekRange = getWeekRangeForDate(selectedDate);
                           const dayTime = new Date(Date.UTC(dayDate.getUTCFullYear(), dayDate.getUTCMonth(), dayDate.getUTCDate())).getTime();
                           isSelected = dayTime >= weekRange.start.getTime() && dayTime <= weekRange.end.getTime();
                        }

                        let isInHoveredWeek = false;
                        if (view === 'Weekly' && hoveredWeek) {
                            const dayTime = dayDate.getTime();
                            isInHoveredWeek = dayTime >= hoveredWeek.start.getTime() && dayTime <= hoveredWeek.end.getTime();
                        }

                        return (
                            <div key={day} className="flex justify-center items-center" onMouseEnter={view === 'Weekly' ? () => setHoveredWeek(getWeekRangeForDate(dayDate)) : undefined}>
                                <button
                                    onClick={() => handleDayClick(day)}
                                    className={`w-10 h-10 rounded-lg transition-colors font-medium ${
                                        isSelected ? 'bg-[#0b6459] text-white' :
                                        isInHoveredWeek ? 'bg-green-100' :
                                        'hover:bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {day}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    const renderMonthPicker = () => {
        const year = displayDate.getUTCFullYear();
        const months = Array.from({ length: 12 }, (_, i) => new Date(Date.UTC(year, i, 1)).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }));
        
        const handlePrevYear = () => setDisplayDate(prev => new Date(Date.UTC(prev.getUTCFullYear() - 1, 0, 1)));
        const handleNextYear = () => setDisplayDate(prev => new Date(Date.UTC(prev.getUTCFullYear() + 1, 0, 1)));

        return (
            <>
                <div className="flex items-center justify-between mb-4">
                    <button onClick={handlePrevYear} className="p-2 rounded-full hover:bg-gray-100"><HiChevronLeft className="w-5 h-5" /></button>
                    <span className="font-semibold text-gray-700">{year}</span>
                    <button onClick={handleNextYear} className="p-2 rounded-full hover:bg-gray-100"><HiChevronRight className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {months.map((monthName, index) => {
                        const isSelected = selectedDate.getUTCMonth() === index && selectedDate.getUTCFullYear() === year;
                        return (
                            <button
                                key={monthName}
                                onClick={() => onApply(new Date(Date.UTC(year, index, 1, 12, 0, 0)))}
                                className={`py-4 rounded-lg font-semibold text-sm transition-colors ${isSelected ? 'bg-[#0b6459] text-white' : 'hover:bg-gray-100'}`}
                            >
                                {monthName}
                            </button>
                        );
                    })}
                </div>
            </>
        );
    };

    const modalTitle = `Select a ${view === 'Daily' ? 'Day' : view === 'Weekly' ? 'Week' : 'Month'}`;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="datepicker-title"
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative transform transition-all animate-fade-in-up">
                <div className="flex justify-between items-center mb-4">
                    <h2 id="datepicker-title" className="text-lg font-bold text-gray-800">{modalTitle}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close modal">
                        <HiX className="w-5 h-5" />
                    </button>
                </div>

                {view === 'Monthly' ? renderMonthPicker() : renderDayAndWeekPicker()}
                
                <style>{`
                    @keyframes fadeInUp {
                        from { transform: translateY(20px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    .animate-fade-in-up {
                        animation: fadeInUp 0.3s ease-out forwards;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default ScheduleDatePickerModal;