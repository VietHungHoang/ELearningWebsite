import React, { useState, useRef, useEffect } from "react";
import { HiChevronLeft, HiChevronRight, HiX } from "react-icons/hi";

interface DatePickerProps {
    view: "Daily" | "Weekly" | "Monthly";
    currentDate: Date;
    onDateSelect: (date: Date) => void;
    isOpen: boolean;
    onClose: () => void;
    disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
    view,
    currentDate,
    onDateSelect,
    isOpen,
    onClose,
    disabled = false
}) => {
    const [displayDate, setDisplayDate] = useState(
        new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1))
    );
    const [hoveredWeek, setHoveredWeek] = useState<{ start: Date; end: Date } | null>(null);
    const datePickerRef = useRef<HTMLDivElement>(null);

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
        onClose();
    };

    const handleDayClick = (day: number) => {
        const year = displayDate.getUTCFullYear();
        const month = displayDate.getUTCMonth();
        const clickedDate = new Date(Date.UTC(year, month, day, 12, 0, 0));
        if (view === "Daily") {
            handleDateApply(clickedDate);
        } else {
            const weekStart = getWeekRangeForDate(clickedDate).start;
            handleDateApply(weekStart);
        }
    };

    const handleMonthClick = (index: number) => {
        const year = displayDate.getUTCFullYear();
        handleDateApply(new Date(Date.UTC(year, index, 1, 12, 0, 0)));
    };

    const handlePrevMonth = () =>
        setDisplayDate((prev) => new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() - 1, 1)));
    const handleNextMonth = () =>
        setDisplayDate((prev) => new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() + 1, 1)));
    const handlePrevYear = () => setDisplayDate((prev) => new Date(Date.UTC(prev.getUTCFullYear() - 1, 0, 1)));
    const handleNextYear = () => setDisplayDate((prev) => new Date(Date.UTC(prev.getUTCFullYear() + 1, 0, 1)));

    const renderDayAndWeekPicker = () => {
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
                <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="h-8 flex items-center justify-center">
                            {day}
                        </div>
                    ))}
                </div>
                <div
                    className="grid grid-cols-7 gap-1"
                    onMouseLeave={view === "Weekly" ? () => setHoveredWeek(null) : undefined}
                >
                    {blanks.map((_, i) => (
                        <div key={`blank-${i}`}></div>
                    ))}
                    {days.map((day) => {
                        const dayDate = new Date(Date.UTC(year, month, day));
                        let isSelected = false;
                        if (view === "Daily") {
                            isSelected =
                                currentDate.getUTCDate() === day &&
                                currentDate.getUTCMonth() === month &&
                                currentDate.getUTCFullYear() === year;
                        } else {
                            const weekRange = getWeekRangeForDate(currentDate);
                            const dayTime = new Date(
                                Date.UTC(dayDate.getUTCFullYear(), dayDate.getUTCMonth(), dayDate.getUTCDate())
                            ).getTime();
                            isSelected = dayTime >= weekRange.start.getTime() && dayTime <= weekRange.end.getTime();
                        }

                        let isInHoveredWeek = false;
                        if (view === "Weekly" && hoveredWeek) {
                            const dayTime = dayDate.getTime();
                            isInHoveredWeek =
                                dayTime >= hoveredWeek.start.getTime() && dayTime <= hoveredWeek.end.getTime();
                        }

                        return (
                            <div
                                key={day}
                                className="flex justify-center items-center"
                                onMouseEnter={
                                    view === "Weekly" && !disabled ? () => setHoveredWeek(getWeekRangeForDate(dayDate)) : undefined
                                }
                            >
                                <button
                                    onClick={disabled ? undefined : () => handleDayClick(day)}
                                    disabled={disabled}
                                    className={`w-10 h-10 rounded-lg transition-colors font-medium ${
                                        isSelected
                                            ? "bg-[#0b6459] text-white"
                                            : isInHoveredWeek
                                            ? "bg-green-100"
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

    const renderMonthPicker = () => {
        const year = displayDate.getUTCFullYear();
        const months = Array.from({ length: 12 }, (_, i) =>
            new Date(Date.UTC(year, i, 1)).toLocaleString("en-US", { month: "short", timeZone: "UTC" })
        );

        return (
            <>
                <div className="grid grid-cols-3 gap-2">
                    {months.map((monthName, index) => {
                        const isSelected = currentDate.getUTCMonth() === index && currentDate.getUTCFullYear() === year;
                        return (
                            <button
                                key={monthName}
                                onClick={() => handleMonthClick(index)}
                                className={`py-4 rounded-lg font-semibold text-sm transition-colors ${
                                    isSelected ? "bg-[#0b6459] text-white" : "hover:bg-gray-100"
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

    if (!isOpen) return null;

    return (
        <div
            ref={datePickerRef}
            className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl w-80 p-6 z-20"
        >
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={view === "Monthly" ? handlePrevYear : handlePrevMonth}
                        disabled={disabled}
                        className={`p-1 rounded-full hover:bg-gray-100 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <HiChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium text-gray-600">
                        {view === "Monthly"
                            ? displayDate.getUTCFullYear()
                            : displayDate.toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })
                        }
                    </span>
                    <button
                        onClick={view === "Monthly" ? handleNextYear : handleNextMonth}
                        disabled={disabled}
                        className={`p-1 rounded-full hover:bg-gray-100 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <HiChevronRight className="w-4 h-4" />
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <HiX className="w-5 h-5" />
                </button>
            </div>
            {view === "Monthly" ? renderMonthPicker() : renderDayAndWeekPicker()}
        </div>
    );
};

export default DatePicker;