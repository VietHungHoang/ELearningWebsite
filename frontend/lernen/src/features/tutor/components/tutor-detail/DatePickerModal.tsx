import React, { useState, useEffect } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (date: Date) => void;
  selectedDate: Date;
  position?: 'top' | 'bottom';
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({ isOpen, onClose, onApply, selectedDate, position = 'bottom' }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  const [hoveredWeek, setHoveredWeek] = useState<{ start: Date; end: Date } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
  }, [selectedDate, isOpen]);

  if (!isOpen) return null;

  const getWeekRangeForDate = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0); // Normalize time
    const day = d.getDay(); // 0 = Sunday
    const diff = d.getDate() - day;
    const start = new Date(d.setDate(diff));
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start, end };
  };

  const selectedWeek = getWeekRangeForDate(selectedDate);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const blanks = Array(firstDayOfMonth).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(year, month, day);
    const weekStart = getWeekRangeForDate(clickedDate).start;
    onApply(weekStart);
  };

  return (
    <div
      className={`absolute left-0 z-[70] bg-white rounded-2xl ${position == 'bottom' ? 'shadow-xl' : ' '} w-[320px] p-6 border border-gray-100 animate-dropdown-in ${position === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'
        }`}
      style={{ transformOrigin: position === 'bottom' ? 'top left' : 'bottom left' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="datepicker-title"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 id="datepicker-title" className="text-lg font-bold text-gray-800">Select Week</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close modal">
          <FiX />
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100"><FiChevronLeft /></button>
        <span className="font-semibold text-gray-700">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100"><FiChevronRight /></button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
        {daysOfWeek.map(day => <div key={day} className="h-8 flex items-center justify-center">{day}</div>)}
      </div>

      <div className="grid grid-cols-7" onMouseLeave={() => setHoveredWeek(null)}>
        {blanks.map((_, i) => <div key={`blank-${i}`}></div>)}
        {days.map(day => {
          const dayDate = new Date(year, month, day);
          dayDate.setHours(0, 0, 0, 0); // Normalize time
          const dayTime = dayDate.getTime();

          const isSelected = dayTime >= selectedWeek.start.getTime() && dayTime <= selectedWeek.end.getTime();
          const isHovered = !isSelected && hoveredWeek && dayTime >= hoveredWeek.start.getTime() && dayTime <= hoveredWeek.end.getTime();

          const range = isSelected ? selectedWeek : (isHovered ? hoveredWeek : null);
          let containerClasses = 'h-10 transition-colors';

          if (range) {
            containerClasses += isSelected ? ' bg-[#0b6459]' : ' bg-green-100';
            const isStartOfRange = dayTime === range.start.getTime();
            const isEndOfRange = dayTime === range.end.getTime();
            const isStartOfWeek = dayDate.getDay() === 0;
            const isEndOfWeek = dayDate.getDay() === 6;

            if (isStartOfRange || isStartOfWeek) {
              containerClasses += ' rounded-l-lg';
            }
            if (isEndOfRange || isEndOfWeek) {
              containerClasses += ' rounded-r-lg';
            }
          }

          return (
            <div
              key={day}
              onMouseEnter={() => setHoveredWeek(getWeekRangeForDate(dayDate))}
              onClick={() => handleDayClick(day)}
              className={`flex justify-center items-center cursor-pointer ${containerClasses}`}
            >
              <span
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${isSelected ? 'text-white' :
                    isHovered ? 'text-gray-800' :
                      'text-gray-700'
                  }`}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DatePickerModal;