import React, { useState, useEffect } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (date: Date) => void;
  selectedDate: Date;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({ isOpen, onClose, onApply, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth()));

  useEffect(() => {
    if (isOpen) {
      setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth()));
    }
  }, [selectedDate, isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
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
    onApply(new Date(year, month, day));
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="datepicker-title"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative transform transition-all animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
            <h2 id="datepicker-title" className="text-lg font-bold text-gray-800">Select Date</h2>
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

        <div className="grid grid-cols-7 gap-1">
            {blanks.map((_, i) => <div key={`blank-${i}`}></div>)}
            {days.map(day => {
                const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
                const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

                return (
                    <div key={day} className="flex justify-center items-center">
                        <button 
                            onClick={() => handleDayClick(day)}
                            className={`w-10 h-10 rounded-full transition-colors font-medium
                                ${isSelected ? 'bg-[#0b6459] text-white shadow' : ''}
                                ${!isSelected && isToday ? 'bg-gray-100 text-gray-800' : ''}
                                ${!isSelected && !isToday ? 'hover:bg-gray-100 text-gray-700' : ''}
                            `}
                        >
                            {day}
                        </button>
                    </div>
                );
            })}
        </div>
        
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

export default DatePickerModal;