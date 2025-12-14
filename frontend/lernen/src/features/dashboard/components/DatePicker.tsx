import React, { useState, useRef, useEffect } from 'react';
import { FiCalendar } from 'react-icons/fi';
import { HiChevronLeft, HiChevronRight, HiX } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';

interface DatePickerProps {
    value: Date;
    onChange: (date: Date) => void;
    mode: 'Daily' | 'Weekly' | 'Monthly';
    displayFormat?: (date: Date, mode: 'Daily' | 'Weekly' | 'Monthly') => string;
    className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ 
    value, 
    onChange, 
    mode, 
    displayFormat,
    className = ''
}) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [displayDate, setDisplayDate] = useState(new Date(value.getFullYear(), value.getMonth(), 1));
    const [hoveredWeek, setHoveredWeek] = useState<{ start: Date; end: Date } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setDisplayDate(new Date(value.getFullYear(), value.getMonth(), 1));
        }
    }, [value, isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const getWeekDays = (baseDate: Date) => {
        const startOfWeek = new Date(baseDate);
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(baseDate.getDate() - baseDate.getDay());
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

    const defaultDisplayFormat = (date: Date, mode: 'Daily' | 'Weekly' | 'Monthly') => {
        if (mode === 'Daily') {
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } else if (mode === 'Weekly') {
            return getWeekRangeDisplay(date);
        } else {
            return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }
    };

    const getWeekRangeForDate = (date: Date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        const day = d.getDay();
        const diff = d.getDate() - day;
        const start = new Date(d.setDate(diff));
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return { start, end };
    };

    const renderDayAndWeekPicker = () => {
        const year = displayDate.getFullYear();
        const month = displayDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const blanks = Array(firstDayOfMonth).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const handleDayClick = (day: number) => {
            const clickedDate = new Date(year, month, day);
            if (mode === 'Daily') {
                onChange(clickedDate);
                setIsOpen(false);
            } else if (mode === 'Weekly') {
                const weekStart = getWeekRangeForDate(clickedDate).start;
                onChange(weekStart);
                setIsOpen(false);
            }
        };

        const handlePrevMonth = () => setDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
        const handleNextMonth = () => setDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

        return (
            <>
                <div className="flex items-center justify-between mb-4">
                    <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100"><HiChevronLeft className="w-5 h-5" /></button>
                    <span className="font-semibold text-gray-700">{displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100"><HiChevronRight className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
                    {daysOfWeek.map(day => <div key={day} className="h-8 flex items-center justify-center">{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1" onMouseLeave={mode === 'Weekly' ? () => setHoveredWeek(null) : undefined}>
                    {blanks.map((_, i) => <div key={`blank-${i}`}></div>)}
                    {days.map(day => {
                        const dayDate = new Date(year, month, day);
                        let isSelected = false;
                        if (mode === 'Daily') {
                            isSelected = value.getDate() === day && value.getMonth() === month && value.getFullYear() === year;
                        } else if (mode === 'Weekly') {
                            const weekRange = getWeekRangeForDate(value);
                            dayDate.setHours(0, 0, 0, 0);
                            const dayTime = dayDate.getTime();
                            isSelected = dayTime >= weekRange.start.getTime() && dayTime <= weekRange.end.getTime();
                        }

                        let isInHoveredWeek = false;
                        if (mode === 'Weekly' && hoveredWeek) {
                            dayDate.setHours(0, 0, 0, 0);
                            const dayTime = dayDate.getTime();
                            isInHoveredWeek = dayTime >= hoveredWeek.start.getTime() && dayTime <= hoveredWeek.end.getTime();
                        }

                        return (
                            <div 
                                key={day} 
                                className="flex justify-center items-center" 
                                onMouseEnter={mode === 'Weekly' ? () => setHoveredWeek(getWeekRangeForDate(new Date(year, month, day))) : undefined}
                            >
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
        const year = displayDate.getFullYear();
        const months = Array.from({ length: 12 }, (_, i) => 
            new Date(year, i, 1).toLocaleString('en-US', { month: 'short' })
        );

        const handlePrevYear = () => setDisplayDate(prev => new Date(prev.getFullYear() - 1, 0, 1));
        const handleNextYear = () => setDisplayDate(prev => new Date(prev.getFullYear() + 1, 0, 1));

        return (
            <>
                <div className="flex items-center justify-between mb-4">
                    <button onClick={handlePrevYear} className="p-2 rounded-full hover:bg-gray-100"><HiChevronLeft className="w-5 h-5" /></button>
                    <span className="font-semibold text-gray-700">{year}</span>
                    <button onClick={handleNextYear} className="p-2 rounded-full hover:bg-gray-100"><HiChevronRight className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {months.map((monthName, index) => {
                        const isSelected = value.getMonth() === index && value.getFullYear() === year;
                        return (
                            <button
                                key={monthName}
                                onClick={() => {
                                    onChange(new Date(year, index, 1));
                                    setIsOpen(false);
                                }}
                                className={`py-4 rounded-lg font-semibold text-sm transition-colors ${
                                    isSelected ? 'bg-[#0b6459] text-white' : 'hover:bg-gray-100'
                                }`}
                            >
                                {monthName}
                            </button>
                        );
                    })}
                </div>
            </>
        );
    };

    const modalTitle = mode === 'Daily' ? t('dashboard.common.selectDay') : mode === 'Weekly' ? t('dashboard.common.selectWeek') : t('dashboard.common.selectMonth');

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <input
                type="text"
                readOnly
                value={displayFormat ? displayFormat(value, mode) : defaultDisplayFormat(value, mode)}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-100 border border-transparent rounded-lg pl-4 pr-10 py-2 text-sm font-medium text-gray-800 w-60 cursor-pointer focus:outline-none hover:bg-gray-200 transition-colors"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-600" />
            </div>

            {isOpen && (
                <div 
                    className="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-xl w-[320px] p-6 border border-gray-100 animate-dropdown-in"
                    style={{ transformOrigin: 'top left' }}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800">{modalTitle}</h2>
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <HiX className="w-5 h-5" />
                        </button>
                    </div>

                    {mode === 'Monthly' ? renderMonthPicker() : renderDayAndWeekPicker()}
                </div>
            )}

            <style>{`
                @keyframes dropdown-in {
                    from { 
                        transform: translateY(-10px); 
                        opacity: 0; 
                    }
                    to { 
                        transform: translateY(0); 
                        opacity: 1; 
                    }
                }
                .animate-dropdown-in {
                    animation: dropdown-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default DatePicker;
