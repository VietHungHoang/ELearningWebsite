import React, { useState, useRef, useEffect } from "react";
import { HiChevronLeft, HiChevronRight, HiX } from "react-icons/hi";

interface DateRangePickerProps {
    startDate: Date;
    endDate: Date;
    onStartDateSelect: (date: Date) => void;
    onEndDateSelect: (date: Date) => void;
    isOpen: boolean;
    onClose: () => void;
    disabled?: boolean;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
    startDate,
    endDate,
    onStartDateSelect,
    onEndDateSelect,
    isOpen,
    onClose,
    disabled = false
}) => {
    const [activeTab, setActiveTab] = useState<'start' | 'end'>('start');
    const [displayDate, setDisplayDate] = useState(
        new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), 1))
    );
    const [hoveredWeek, setHoveredWeek] = useState<{ start: Date; end: Date } | null>(null);
    const datePickerRef = useRef<HTMLDivElement>(null);

    const currentDate = activeTab === 'start' ? startDate : endDate;
    const onDateSelect = activeTab === 'start' ? onStartDateSelect : onEndDateSelect;

    useEffect(() => {
        if (isOpen) {
            setDisplayDate(new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1)));
        }
    }, [currentDate, isOpen]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

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

    const handleDateApply = (date: Date) => {
        const newCurrentDate = new Date(
            Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12, 0, 0)
        );
        onDateSelect(newCurrentDate);
        // Don't close automatically, let user switch tabs or close manually
    };

    const handleDayClick = (day: number) => {
        const year = displayDate.getUTCFullYear();
        const month = displayDate.getUTCMonth();
        const clickedDate = new Date(Date.UTC(year, month, day, 12, 0, 0));
        handleDateApply(clickedDate);
    };

    const handlePrevMonth = () =>
        setDisplayDate((prev) => new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() - 1, 1)));
    const handleNextMonth = () =>
        setDisplayDate((prev) => new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() + 1, 1)));

    const renderDayPicker = () => {
        const year = displayDate.getUTCFullYear();
        const month = displayDate.getUTCMonth();
        const firstDayOfMonth = new Date(Date.UTC(year, month, 1)).getUTCDay();
        const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
        const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
        const blanks = Array(adjustedFirstDay).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        return (
            <>
                <div className="grid grid-cols-7 gap-0.5 text-center text-sm text-gray-500 mb-1">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="h-8 flex items-center justify-center">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-0.5">
                    {blanks.map((_, i) => (
                        <div key={`blank-${i}`}></div>
                    ))}
                    {days.map((day) => {
                        const dayDate = new Date(Date.UTC(year, month, day));
                        const isSelected =
                            currentDate.getUTCDate() === day &&
                            currentDate.getUTCMonth() === month &&
                            currentDate.getUTCFullYear() === year;

                        return (
                            <div key={day} className="flex justify-center items-center">
                                <button
                                    onClick={disabled ? undefined : () => handleDayClick(day)}
                                    disabled={disabled}
                                    className={`w-9 h-9 rounded-full transition-colors font-medium ${
                                        isSelected
                                            ? "bg-[#0b6459] text-white"
                                            : disabled
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "hover:bg-gray-100 text-gray-700"
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

    if (!isOpen) return null;

    return (
        <div
            ref={datePickerRef}
            className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl w-80 pt-2 px-6 pb-4 z-20"
        >
            {/* Tabs */}
            <div className="flex justify-between items-center border-b border-gray-200 mb-3">
                <div className="flex flex-1">
                    <button
                        onClick={() => setActiveTab('start')}
                        className={`flex-1 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'start'
                                ? 'text-[#0b6459] border-b-2 border-[#0b6459]'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Start Date
                    </button>
                    <button
                        onClick={() => setActiveTab('end')}
                        className={`flex-1 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'end'
                                ? 'text-[#0b6459] border-b-2 border-[#0b6459]'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        End Date
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                    <HiX className="w-5 h-5" />
                </button>
            </div>            {/* Header with navigation */}
            <div className="flex items-center justify-between mb-2">
                <button
                    onClick={handlePrevMonth}
                    disabled={disabled}
                    className={`p-1 rounded-full hover:bg-gray-100 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <HiChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-gray-600 flex-1 text-center">
                    {displayDate.toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })}
                </span>
                <button
                    onClick={handleNextMonth}
                    disabled={disabled}
                    className={`p-1 rounded-full hover:bg-gray-100 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <HiChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Date picker content */}
            {renderDayPicker()}
        </div>
    );
};

export default DateRangePicker;