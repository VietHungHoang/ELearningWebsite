import React, { useState, useRef, useEffect, useMemo } from 'react';
import CustomDropdown from '../../../../components/ui/CustomDropdown';
import { FiCalendar, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import FilterSessionPopover from './FilterSessionPopover';
import DatePickerModal from './DatePickerModal';
import type { TimezoneResponse, Tutor } from '../../../../types/api';

interface BookASessionProps {
    onOpenModal: () => void;
    onOpenTrialModal?: () => void;
    tutor: Tutor;
}

const BookASession: React.FC<BookASessionProps> = ({ onOpenModal, onOpenTrialModal, tutor }) => {
    console.log('tutor in BookASession:', tutor);
    const [selectedDate, setSelectedDate] = useState(new Date()); // Today
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
    const [timezones, setTimezones] = useState<TimezoneResponse[]>([]);
    const filterRef = useRef<HTMLDivElement>(null);
    const datePickerRef = useRef<HTMLDivElement>(null);
    const datePickerButtonRef = useRef<HTMLButtonElement>(null);
    const [popoverPosition, setPopoverPosition] = useState<'top' | 'bottom'>('bottom');
    
    const timezonePlaceholder = '(GMT+07:00) Asia/Ho_Chi_Minh';
    const [selectedTimezone, setSelectedTimezone] = useState(timezonePlaceholder);

        const timezoneOptions = timezones.map(tz => `(GMT${tz.utcOffset}) ${tz.name}`);
    
    const buttonText = tutor.hasTrialSession ? 'Đăng ký học' : 'Đăng ký học thử';

    const sessions = useMemo(() => {
        if (!tutor.availability) return [];
        console.log('tutor.availability:', tutor.availability);
                    const result = tutor.availability.map((avail) => {
            const parts = avail.split(' ');
            const day = parts[0];
            const timeRange = parts.slice(1).join(' ');
            const [start, end] = timeRange.split(' - ');

            const parseTime = (timeStr: string) => {
                const [time, period] = timeStr.split(' ');
                let [hours, minutes] = time.split(':').map(Number);
                if (period === 'PM' && hours !== 12) hours += 12;
                if (period === 'AM' && hours === 12) hours = 0;
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            };

            const start24 = parseTime(start);
            const end24 = parseTime(end);

            const timeSlots = [];
            let current = new Date(`1970-01-01T${start24}`);
            const endTime = new Date(`1970-01-01T${end24}`);
            while (current < endTime) {
                timeSlots.push(current.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
                current.setHours(current.getHours() + 1);
            }

            const dayMap = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 0 };
            const today = new Date();
            const mondayOfWeek = new Date(today);
            mondayOfWeek.setDate(today.getDate() - today.getDay());
            const targetDay = dayMap[day as keyof typeof dayMap] || 0;
            const sessionDate = new Date(mondayOfWeek);
            sessionDate.setDate(mondayOfWeek.getDate() + (targetDay - 1));
            return { date: sessionDate, timeSlots };
        });
        console.log('sessions:', result);
        return result;
    }, [tutor.availability]);

    const getWeekRange = (date: Date) => {
        const startDate = new Date(date);
        const dayOfWeek = startDate.getDay(); // 0 = Sunday
        const diff = startDate.getDate() - dayOfWeek;
        startDate.setDate(diff);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        return { start: startDate, end: endDate };
    };

    const formatDate = (date: Date, options: Intl.DateTimeFormatOptions): string => {
        return date.toLocaleDateString('en-US', options);
    };

    const [weekRange, setWeekRange] = useState(getWeekRange(selectedDate));

    const displayedDateRange = `${formatDate(weekRange.start, { month: 'long', day: 'numeric' })} - ${formatDate(weekRange.end, { month: 'long', day: 'numeric', year: 'numeric' })}`;
    
    const weekDays = Array.from({ length: 7 }).map((_, i) => {
        const day = new Date(weekRange.start);
        day.setDate(day.getDate() + i);
        return {
            fullDate: day,
            day: formatDate(day, { weekday: 'short' }),
            date: formatDate(day, { day: 'numeric', month: 'short' }),
        };
    });

    const handleDateApply = (date: Date) => {
        setSelectedDate(date);
        setWeekRange(getWeekRange(date));
        setIsDatePickerOpen(false);
    };

    const handleToggleDatePicker = () => {
        if (!isDatePickerOpen && datePickerButtonRef.current) {
            const buttonRect = datePickerButtonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - buttonRect.bottom;
            const modalHeight = 420; // Estimated height of the date picker modal
            // If not enough space below AND there is enough space above, position top. Otherwise, default to bottom.
            setPopoverPosition(spaceBelow < modalHeight && buttonRect.top > modalHeight ? 'top' : 'bottom');
        }
        setIsDatePickerOpen(prev => !prev);
    };

    const handleSelectDay = (date: Date) => {
        setSelectedDate(date);
    };

    const handlePrevWeek = () => {
        const newStartDate = new Date(weekRange.start);
        newStartDate.setDate(newStartDate.getDate() - 7);
        const newWeekRange = getWeekRange(newStartDate);
        setWeekRange(newWeekRange);
        if (selectedDate < newWeekRange.start || selectedDate > newWeekRange.end) {
            setSelectedDate(newStartDate);
        }
    };
    
    const handleNextWeek = () => {
        const newStartDate = new Date(weekRange.start);
        newStartDate.setDate(newStartDate.getDate() + 7);
        const newWeekRange = getWeekRange(newStartDate);
        setWeekRange(newWeekRange);
        if (selectedDate < newWeekRange.start || selectedDate > newWeekRange.end) {
            setSelectedDate(newStartDate);
        }
    };
    
    const handleTodayClick = () => {
        const today = new Date();
        setSelectedDate(today);
        setWeekRange(getWeekRange(today));
    };

    const handleRequestSessionClick = () => {
        if (selectedTime) {
            if (true || tutor.hasTrialSession) {
                onOpenModal();
            } else {
                onOpenTrialModal?.();
            }
        } else {
            alert('Please select a time slot before requesting a session.');
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">Book a session</h2>
                <button 
                    onClick={handleRequestSessionClick}
                    className="bg-[#FF5A1F] text-white font-medium text-sm py-2.5 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                >
                    {buttonText}
                </button>
            </div>

            {/* Controls */}
            <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleTodayClick}
                        className="bg-[#F9F3EB] text-gray-700 text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-[#e9e0d4]">
                        Today
                    </button>
                    <div ref={datePickerRef} className="relative">
                        <button 
                          ref={datePickerButtonRef} 
                          onClick={handleToggleDatePicker}
                          className="flex items-center gap-16.5 bg-[#F9F3EB] px-4 py-2.5 rounded-lg hover:bg-[#e9e0d4]">
                            <span className="text-sm font-normal text-sm text-gray-700">{displayedDateRange}</span>
                            <FiCalendar />
                        </button>
                         <DatePickerModal 
                            isOpen={isDatePickerOpen}
                            onClose={() => setIsDatePickerOpen(false)}
                            onApply={handleDateApply}
                            selectedDate={selectedDate}
                            position={popoverPosition}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-70">
                       <CustomDropdown
                            options={timezoneOptions}
                            selectedValue={selectedTimezone}
                            placeholder={timezonePlaceholder}
                            onSelect={(value) => setSelectedTimezone(value)}
                            dropdownId="timezone"
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            hasSearch={true}
                            searchPlaceholder="Search timezone..."
                        />
                    </div>
                     <div ref={filterRef} className="relative">
                        <button 
                            onClick={() => setIsFilterPopoverOpen(!isFilterPopoverOpen)}
                            className="p-2.75 border border-gray-300 rounded-lg hover:bg-gray-100"
                            aria-haspopup="true"
                            aria-expanded={isFilterPopoverOpen}
                        >
                            <FiFilter />
                        </button>
                        {isFilterPopoverOpen && <FilterSessionPopover onClose={() => setIsFilterPopoverOpen(false)} />}
                    </div>
                </div>
            </div>

            {/* Calendar */}
            <div className="mt-7 flex items-center justify-between">
                <button onClick={handlePrevWeek} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><FiChevronLeft /></button>
                <div className="grid grid-cols-7 gap-x-2 flex-grow mx-1">
                    {weekDays.map((d, index) => {
                        const isSelected = selectedDate.toDateString() === d.fullDate.toDateString();
                        const daySessions = sessions.find(session => session.date.toDateString() === d.fullDate.toDateString());
                        console.log('daySessions for', d.fullDate.toDateString(), daySessions);
                        return (
                            <div key={index} className="text-center">
                                <button
                                    onClick={() => handleSelectDay(d.fullDate)}
                                    className={`w-full p-3 rounded-lg transition-colors ${isSelected ? 'bg-[#F9F3EB]' : 'hover:bg-gray-50'}`}
                                >
                                    <p className="text-sm font-semibold">{d.date}</p>
                                    <p className="text-xs text-gray-500 mt-1">{d.day}</p>
                                </button>
                                <div className="mt-3 space-y-2">
                                    {daySessions && daySessions.timeSlots.length > 0 ? (
                                        daySessions.timeSlots.map(time => (
                                            <button 
                                                key={time}
                                                onClick={() => setSelectedTime(`${d.fullDate.toDateString()}-${time}`)}
                                                className={`w-full text-xs py-2.5 rounded-md font-semibold transition-colors ${
                                                    selectedTime === `${d.fullDate.toDateString()}-${time}` 
                                                    ? 'bg-[#0b6459] text-white' 
                                                    : 'bg-[#F9F3EB] text-gray-700 hover:bg-[#e9e0d4]'
                                                }`}
                                            >
                                                {time}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="bg-gray-100 text-gray-400 text-xs py-2.5 rounded-md">
                                            No sessions
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <button onClick={handleNextWeek} className="p-2 rounded-lg bg-[#F9F3EB] text-gray-500 hover:bg-opacity-80"><FiChevronRight /></button>
            </div>
        </div>
    );
};

export default BookASession;