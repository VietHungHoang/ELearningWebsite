import React, { useState, useRef, useEffect } from 'react';
import CustomDropdown from '../../../../components/ui/CustomDropdown';
import { FiCalendar, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import FilterSessionPopover from './FilterSessionPopover';
import DatePickerModal from './DatePickerModal';

interface BookASessionProps {
    onOpenModal: () => void;
}

const mockSessions = [
    {
        date: new Date('2025-10-20T00:00:00'), // Monday
        timeSlots: ['09:00 AM', '11:00 AM', '02:00 PM']
    },
    {
        date: new Date('2025-10-21T00:00:00'), // Tuesday
        timeSlots: ['10:00 AM', '01:00 PM']
    },
    {
        date: new Date('2025-10-23T00:00:00'), // Thursday
        timeSlots: ['08:00 AM', '10:00 AM', '03:00 PM', '05:00 PM']
    },
    {
        date: new Date('2025-10-24T00:00:00'), // Friday
        timeSlots: ['09:30 AM']
    },
     {
        date: new Date('2025-10-27T00:00:00'), // Next Monday
        timeSlots: ['10:30 AM', '04:00 PM']
    }
];

const BookASession: React.FC<BookASessionProps> = ({ onOpenModal }) => {
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 9, 20)); // Oct 20, 2025
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);
    
    const timezonePlaceholder = '(GMT+07:00) Asia/Ho_Chi_Minh';
    const [selectedTimezone, setSelectedTimezone] = useState(timezonePlaceholder);

    const timezoneOptions = [
        '(GMT-11:00) Pacific/Midway',
        '(GMT-10:00) Pacific/Honolulu',
        '(GMT-09:00) America/Anchorage',
        '(GMT-08:00) America/Los_Angeles',
        '(GMT-07:00) America/Denver',
        '(GMT-06:00) America/Chicago',
        '(GMT-05:00) America/New_York',
        '(GMT-04:00) America/Caracas',
        '(GMT-03:00) America/Sao_Paulo',
        '(GMT-01:00) Atlantic/Azores',
        '(GMT+00:00) Europe/London',
        '(GMT+01:00) Europe/Paris',
        '(GMT+02:00) Europe/Helsinki',
        '(GMT+03:00) Europe/Moscow',
        '(GMT+04:00) Asia/Dubai',
        '(GMT+05:00) Asia/Karachi',
        '(GMT+06:00) Asia/Dhaka',
        '(GMT+07:00) Asia/Bangkok',
        '(GMT+07:00) Asia/Ho_Chi_Minh',
        '(GMT+08:00) Asia/Singapore',
        '(GMT+09:00) Asia/Tokyo',
        '(GMT+10:00) Australia/Sydney',
        '(GMT+11:00) Pacific/Guadalcanal',
        '(GMT+12:00) Pacific/Auckland'
    ];
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterPopoverOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [filterRef]);

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

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">Book a session</h2>
                <button 
                    onClick={onOpenModal}
                    className="bg-[#FF5A1F] text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                >
                    Request a Session
                </button>
            </div>

            {/* Controls */}
            <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <button onClick={handleTodayClick} className="bg-[#F9F3EB] text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-opacity-80">Today</button>
                    <button onClick={() => setIsDatePickerOpen(true)} className="flex items-center gap-2 bg-[#F9F3EB] p-2 rounded-lg hover:bg-opacity-80">
                        <span className="text-sm font-medium text-gray-700">{displayedDateRange}</span>
                        <FiCalendar />
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-56">
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
                            className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-100"
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
            <div className="mt-6 flex items-center justify-between">
                <button onClick={handlePrevWeek} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><FiChevronLeft /></button>
                <div className="grid grid-cols-7 gap-x-2 flex-grow mx-1">
                    {weekDays.map((d, index) => {
                        const isSelected = selectedDate.toDateString() === d.fullDate.toDateString();
                        const daySessions = mockSessions.find(session => session.date.toDateString() === d.fullDate.toDateString());
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
                                                className={`w-full text-xs py-2 rounded-md font-semibold transition-colors ${
                                                    selectedTime === `${d.fullDate.toDateString()}-${time}` 
                                                    ? 'bg-[#0b6459] text-white' 
                                                    : 'bg-[#F9F3EB] text-gray-700 hover:bg-[#e9e0d4]'
                                                }`}
                                            >
                                                {time}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="bg-gray-100 text-gray-400 text-xs py-2 rounded-md">
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

            <DatePickerModal 
                isOpen={isDatePickerOpen}
                onClose={() => setIsDatePickerOpen(false)}
                onApply={handleDateApply}
                selectedDate={selectedDate}
            />
        </div>
    );
};

export default BookASession;