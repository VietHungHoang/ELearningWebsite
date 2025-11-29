import React, { useState, useEffect, useRef } from 'react';
import { HiChevronLeft, HiChevronRight, HiCalendar, HiPencil } from 'react-icons/hi';
import Toast from '../../../../components/ui/Toast';
import TutorSessionDetailModal from '../components/TutorSessionDetailModal';
import ScheduleDatePickerModal from '../components/ScheduleDatePickerModal';

// --- MOCK DATA ---
interface Booking {
  id: number;
  title: string;
  date: Date;
  durationHours: number;
  color: string;
  studentName: string;
  studentAvatar: string;
}

const mockBookings: Booking[] = [
    { id: 1, title: 'Math Session', date: new Date('2025-10-20T10:00:00Z'), durationHours: 1, color: 'bg-blue-100 text-blue-800 border-blue-200', studentName: 'Sarah Chapman', studentAvatar: 'https://picsum.photos/seed/sarah/48/48' },
    { id: 2, title: 'Physics Lab', date: new Date('2025-10-22T14:00:00Z'), durationHours: 2, color: 'bg-green-100 text-green-800 border-green-200', studentName: 'Ann Coleman', studentAvatar: 'https://picsum.photos/seed/ann/48/48' },
    { id: 3, title: 'History Review', date: new Date('2025-10-22T16:00:00Z'), durationHours: 1, color: 'bg-yellow-100 text-yellow-800 border-yellow-200', studentName: 'Judy Dixon', studentAvatar: 'https://picsum.photos/seed/judy/48/48' },
];

// --- COMPONENT ---
const ScheduleManagementContent: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [view, setView] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
    const [currentDate, setCurrentDate] = useState(new Date('2025-10-20T12:00:00Z'));
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [availability, setAvailability] = useState<string[]>(['2025-10-20T09:00:00.000Z', '2025-10-20T11:00:00.000Z']);
    const [selectedSession, setSelectedSession] = useState<Booking | null>(null);
    const [modalPosition, setModalPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    
    // Edit Mode State
    const [isEditMode, setIsEditMode] = useState(false);
    const [tempAvailability, setTempAvailability] = useState<string[]>(availability);
    
    // Marquee Selection State
    const [isDragging, setIsDragging] = useState(false);
    const [selectionMode, setSelectionMode] = useState<'adding' | 'removing' | null>(null);
    const [dragStartCoords, setDragStartCoords] = useState<{ x: number; y: number } | null>(null);
    const [selectionRect, setSelectionRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
    const [initialAvailabilityOnDrag, setInitialAvailabilityOnDrag] = useState<string[]>([]);
    const gridRef = useRef<HTMLDivElement>(null);

    // Save Popover State
    const [isSavePopoverOpen, setIsSavePopoverOpen] = useState(false);
    const saveButtonRef = useRef<HTMLDivElement>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // --- HANDLERS ---
    const handleSessionClick = (booking: Booking, event: React.MouseEvent) => {
        if (isEditMode) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setModalPosition({ top: rect.top + window.scrollY, left: rect.right + window.scrollX + 10 });
        setSelectedSession(booking);
    };
    
    const handleCellClick = (date: Date, hour: number) => {
        if (!isEditMode) return;

        const slotDate = new Date(date);
        slotDate.setUTCHours(hour, 0, 0, 0);
        const slotISO = slotDate.toISOString();
        const isCurrentlyAvailable = tempAvailability.includes(slotISO);

        if (isCurrentlyAvailable) {
            setTempAvailability(prev => prev.filter(s => s !== slotISO));
        } else {
            setTempAvailability(prev => [...prev, slotISO]);
        }
    };
    
    // Edit Mode Handlers
    const handleEditClick = () => {
        setTempAvailability([...availability]);
        setIsEditMode(true);
    };

    const handleCancelClick = () => {
        setIsEditMode(false);
        setIsSavePopoverOpen(false);
    };

    const handleDateApply = (date: Date) => {
        const newCurrentDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12, 0, 0));
        setCurrentDate(newCurrentDate);
        setIsDatePickerOpen(false);
    };
    
    const handleSaveForThisPeriod = () => {
        setAvailability(tempAvailability);
        setIsEditMode(false);
        setIsSavePopoverOpen(false);
        setToast({ message: 'Availability updated for this period.', type: 'success' });
    };

    const handleSaveForFuture = () => {
        // In a real application, this would update a recurring availability rule.
        // For this mock, we'll apply it to the current view and show a success toast.
        setAvailability(tempAvailability);
        setIsEditMode(false);
        setIsSavePopoverOpen(false);
        setToast({ message: `Recurring availability updated for future ${view === 'Daily' ? 'days' : 'weeks'}.`, type: 'success' });
    };


    // --- DATE & NAVIGATION UTILS ---
    const getWeekDays = (baseDate: Date) => {
        const startOfWeek = new Date(baseDate.getTime());
        startOfWeek.setUTCHours(0,0,0,0);
        const dayOfWeek = startOfWeek.getUTCDay();
        const diff = startOfWeek.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Monday as start of week
        startOfWeek.setUTCDate(diff);
        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(startOfWeek.getTime());
            day.setUTCDate(startOfWeek.getUTCDate() + i);
            return day;
        });
    };
    
    const handleNavigation = (direction: 'prev' | 'next' | 'today') => {
        if (direction === 'today') {
            const today = new Date();
            const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0));
            setCurrentDate(todayUTC);
            return;
        }

        const newDate = new Date(currentDate.getTime());
        const increment = direction === 'prev' ? -1 : 1;
        
        if (view === 'Daily') {
            newDate.setUTCDate(newDate.getUTCDate() + increment);
        } else if (view === 'Weekly') {
            newDate.setUTCDate(newDate.getUTCDate() + (7 * increment));
        } else if (view === 'Monthly') {
            newDate.setUTCMonth(newDate.getUTCMonth() + increment);
        }
        setCurrentDate(newDate);
    };

    const getDisplayDate = () => {
        const options: Intl.DateTimeFormatOptions = { timeZone: 'UTC' };
        if (view === 'Daily') {
            options.year = 'numeric'; options.month = 'long'; options.day = 'numeric';
            return currentDate.toLocaleDateString('en-US', options);
        }
        if (view === 'Monthly') {
            options.month = 'long'; options.year = 'numeric';
            return currentDate.toLocaleDateString('en-US', options);
        }
        // Weekly view
        const week = getWeekDays(currentDate);
        const start = week[0];
        const end = week[6];

        const startOptions: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', timeZone: 'UTC' };
        const endOptions: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' };
        
        if (start.getUTCFullYear() !== end.getUTCFullYear()) {
            startOptions.year = 'numeric';
        }

        return `${start.toLocaleDateString('en-US', startOptions)} - ${end.toLocaleDateString('en-US', endOptions)}`;
    };
    
    // --- MARQUEE SELECTION LOGIC ---
    const handleMouseDown = (e: React.MouseEvent, date: Date, hour: number) => {
        if (!isEditMode || e.button !== 0) return;
        e.preventDefault();

        const gridRect = gridRef.current?.getBoundingClientRect();
        if (!gridRect) return;

        const startX = e.clientX - gridRect.left;
        const startY = e.clientY - gridRect.top;
        setDragStartCoords({ x: startX, y: startY });
        
        const slotDate = new Date(date);
        slotDate.setUTCHours(hour, 0, 0, 0);
        const slotISO = slotDate.toISOString();
        const mode = tempAvailability.includes(slotISO) ? 'removing' : 'adding';
        setSelectionMode(mode);
        
        setInitialAvailabilityOnDrag([...tempAvailability]);
        setIsDragging(true);
    };
    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !dragStartCoords || !gridRef.current) return;
            e.preventDefault();
            const gridRect = gridRef.current.getBoundingClientRect();
            const currentX = e.clientX - gridRect.left;
            const currentY = e.clientY - gridRect.top;
            const rect = {
                left: Math.min(dragStartCoords.x, currentX),
                top: Math.min(dragStartCoords.y, currentY),
                width: Math.abs(dragStartCoords.x - currentX),
                height: Math.abs(dragStartCoords.y - currentY)
            };
            setSelectionRect(rect);
        };
        const handleMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                setDragStartCoords(null);
                setSelectionRect(null);
                setSelectionMode(null);
                setInitialAvailabilityOnDrag([]);
            }
        };
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStartCoords]);
    
    useEffect(() => {
        if (!isDragging || !selectionRect || !selectionMode || !gridRef.current) return;
    
        const newAvailability = new Set(initialAvailabilityOnDrag); 
        const gridRect = gridRef.current.getBoundingClientRect();
        const cellElements = gridRef.current.querySelectorAll('.calendar-cell');
    
        cellElements.forEach(cell => {
            const cellRect = cell.getBoundingClientRect();
            const relativeCellRect = {
                top: cellRect.top - gridRect.top, bottom: cellRect.bottom - gridRect.top,
                left: cellRect.left - gridRect.left, right: cellRect.right - gridRect.left
            };
            if (selectionRect.left < relativeCellRect.right && selectionRect.left + selectionRect.width > relativeCellRect.left &&
                selectionRect.top < relativeCellRect.bottom && selectionRect.top + selectionRect.height > relativeCellRect.top) {
                const iso = (cell as HTMLElement).dataset.iso;
                if(iso) {
                    if (selectionMode === 'adding') newAvailability.add(iso);
                    else if (selectionMode === 'removing') newAvailability.delete(iso);
                }
            }
        });
        setTempAvailability(Array.from(newAvailability));
    }, [selectionRect, selectionMode, initialAvailabilityOnDrag, isDragging]);

     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (saveButtonRef.current && !saveButtonRef.current.contains(event.target as Node)) {
                setIsSavePopoverOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    // --- RENDER FUNCTIONS FOR VIEWS ---
    const timeSlots = Array.from({ length: 16 }, (_, i) => `${String(i + 7).padStart(2, '0')}:00`);

    const renderHourlyGrid = (days: Date[]) => (
        <div className="overflow-x-auto relative" ref={gridRef}>
            <div className={`grid min-w-[400px]`} style={{ gridTemplateColumns: `auto repeat(${days.length}, 1fr)` }}>
                {/* Time Column Header */}
                <div className="sticky left-0 bg-white z-10"></div>
                {/* Day Headers */}
                {days.map(day => (
                    <div key={day.toISOString()} className="text-center p-3 border-b border-gray-200">
                        <p className="text-xs text-gray-500">{day.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })}</p>
                        <p className="text-lg font-bold text-gray-800">{day.getUTCDate()}</p>
                    </div>
                ))}

                {/* Time Slots and Availability Grid */}
                {timeSlots.map(time => (
                    <React.Fragment key={time}>
                        <div className="text-right pr-4 py-2 border-r border-gray-200 text-xs text-gray-500 sticky left-0 bg-white z-10 h-12 flex items-center justify-end">{time}</div>
                        {days.map(day => {
                            const hour = parseInt(time.split(':')[0]);
                            const slotDate = new Date(day);
                            slotDate.setUTCHours(hour, 0, 0, 0);
                            const slotISO = slotDate.toISOString();

                            const isAvailable = isEditMode ? tempAvailability.includes(slotISO) : availability.includes(slotISO);
                            const bookedSession = mockBookings.find(b => {
                                const sessionDate = new Date(b.date);
                                return sessionDate.getUTCFullYear() === day.getUTCFullYear() &&
                                       sessionDate.getUTCMonth() === day.getUTCMonth() &&
                                       sessionDate.getUTCDate() === day.getUTCDate() &&
                                       sessionDate.getUTCHours() === hour;
                            });

                            if (bookedSession) {
                                return (
                                    <div key={day.toISOString()} className="border-b border-r border-gray-200 p-1">
                                        <div onClick={(e) => handleSessionClick(bookedSession, e)} className={`h-full rounded text-xs p-1 ${bookedSession.color} ${!isEditMode ? 'cursor-pointer' : 'cursor-default opacity-70'}`}>
                                            <p className="font-bold">{bookedSession.title}</p>
                                            <p>{bookedSession.studentName}</p>
                                        </div>
                                    </div>
                                );
                            }
                            
                            return (
                                <div 
                                    key={day.toISOString()} data-iso={slotISO}
                                    className={`calendar-cell border-b border-r border-gray-200 h-12 text-center select-none ${isEditMode ? 'cursor-pointer' : ''}`} 
                                    onMouseDown={(e) => handleMouseDown(e, day, hour)}
                                    onClick={() => handleCellClick(day, hour)}
                                >
                                    {isAvailable && <div className={`h-full w-full ${isEditMode ? 'bg-green-200' : 'bg-green-100'} opacity-70`}></div>}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
             {isDragging && selectionRect && (
                <div className="absolute bg-blue-500 bg-opacity-30 border-2 border-blue-600 pointer-events-none z-20"
                    style={{ left: selectionRect.left, top: selectionRect.top, width: selectionRect.width, height: selectionRect.height }}
                />
            )}
        </div>
    );
    
    const renderDailyView = () => renderHourlyGrid([currentDate]);
    const renderWeeklyView = () => renderHourlyGrid(getWeekDays(currentDate));

    const renderMonthlyView = () => {
        const year = currentDate.getUTCFullYear();
        const month = currentDate.getUTCMonth();
        const firstDayOfMonth = new Date(Date.UTC(year, month, 1));
        const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0));
        const daysInMonth = lastDayOfMonth.getUTCDate();
        const startDayOfWeek = firstDayOfMonth.getUTCDay() === 0 ? 6 : firstDayOfMonth.getUTCDay() - 1;

        const calendarDays = [];
        const prevMonthLastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            calendarDays.push({ day: prevMonthLastDay - i, isCurrentMonth: false, date: new Date(Date.UTC(year, month - 1, prevMonthLastDay - i)) });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            calendarDays.push({ day: i, isCurrentMonth: true, date: new Date(Date.UTC(year, month, i)) });
        }
        const remainingCells = 42 - calendarDays.length;
        for (let i = 1; i <= remainingCells; i++) {
            calendarDays.push({ day: i, isCurrentMonth: false, date: new Date(Date.UTC(year, month + 1, i)) });
        }

        const weekDayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        return (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                    {weekDayHeaders.map(day => (
                        <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 grid-rows-6">
                    {calendarDays.map((d, index) => {
                        const dayBookings = mockBookings.filter(b => b.date.toDateString() === d.date.toDateString());
                        return (
                            <div key={index} onClick={() => { setCurrentDate(new Date(Date.UTC(d.date.getUTCFullYear(), d.date.getUTCMonth(), d.date.getUTCDate(), 12, 0, 0))); setView('Daily'); }}
                                className={`h-28 p-2 border-r border-b border-gray-200 cursor-pointer transition-colors ${d.isCurrentMonth ? 'hover:bg-gray-50' : 'bg-gray-50'}`}
                            >
                                <p className={`text-sm font-semibold ${d.isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}`}>{d.day}</p>
                                <div className="mt-1 space-y-1 overflow-hidden">
                                    {dayBookings.map(session => (
                                        <div key={session.id} className="text-xs font-semibold py-0.5 px-1 rounded text-left truncate bg-blue-100 text-blue-800">
                                            {session.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const ViewButton: React.FC<{ label: 'Daily' | 'Weekly' | 'Monthly' }> = ({ label }) => (
        <button onClick={() => setView(label)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${view === label ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:bg-white/50'}`}
        >{label}</button>
    );
    
    // --- MAIN RENDER ---
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {selectedSession && <TutorSessionDetailModal session={selectedSession} position={modalPosition} onClose={() => setSelectedSession(null)} />}
            <ScheduleDatePickerModal 
                isOpen={isDatePickerOpen} 
                onClose={() => setIsDatePickerOpen(false)} 
                onApply={handleDateApply}
                selectedDate={currentDate} 
                view={view}
            />
            
            <div className="flex flex-wrap justify-between items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                        <button onClick={() => handleNavigation('prev')} className="p-2 hover:bg-gray-100 rounded-l-md"><HiChevronLeft className="w-5 h-5" /></button>
                        <button onClick={() => handleNavigation('today')} className="px-4 py-1.5 text-sm font-semibold text-gray-700 border-x border-gray-200 hover:bg-gray-100">Today</button>
                        <button onClick={() => handleNavigation('next')} className="p-2 hover:bg-gray-100 rounded-r-md"><HiChevronRight className="w-5 h-5" /></button>
                    </div>
                    <div className="relative">
                        <button onClick={() => setIsDatePickerOpen(true)} className="bg-gray-100 border border-transparent rounded-lg pl-4 pr-10 py-2 text-sm font-medium text-gray-800 w-64 text-left cursor-pointer focus:outline-none flex items-center justify-between">
                            <span>{getDisplayDate()}</span>
                            <HiCalendar className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                 <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                        <ViewButton label="Daily" />
                        <ViewButton label="Weekly" />
                        <ViewButton label="Monthly" />
                    </div>
                    {view !== 'Monthly' && (
                        isEditMode ? (
                            <div className="flex items-center gap-2">
                                <button onClick={handleCancelClick} className="bg-gray-200 text-gray-800 font-semibold py-2.5 px-5 rounded-lg text-sm hover:bg-gray-300">Cancel</button>
                                <div ref={saveButtonRef} className="relative">
                                    <button onClick={() => setIsSavePopoverOpen(prev => !prev)} className="bg-[#0b6459] text-white font-semibold py-2.5 px-5 rounded-lg text-sm hover:bg-[#084c43]">
                                        Save Changes
                                    </button>
                                    {isSavePopoverOpen && (
                                        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-20 border border-gray-200">
                                            <div className="p-4">
                                                <p className="font-semibold text-gray-800">Choose Save Option</p>
                                                <p className="text-sm text-gray-500 mt-1">Apply changes for this period or for all future dates.</p>
                                            </div>
                                            <div className="border-t border-gray-100 p-2 space-y-1">
                                                <button onClick={handleSaveForThisPeriod} className="w-full text-left p-2 rounded-md hover:bg-gray-100 text-sm text-gray-700">
                                                    {`Apply to this ${view === 'Daily' ? 'day' : 'week'} only`}
                                                </button>
                                                <button onClick={handleSaveForFuture} className="w-full text-left p-2 rounded-md hover:bg-gray-100 text-sm text-gray-700">
                                                    {`Apply to this and all future ${view === 'Daily' ? 'days' : 'weeks'}`}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <button onClick={handleEditClick} className="flex items-center gap-2 bg-[#0b6459] text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-[#084c43]">
                                <HiPencil className="w-4 h-4" /> Edit Availability
                            </button>
                        )
                    )}
                </div>
            </div>

            <div className="mt-6">
                {view === 'Daily' && renderDailyView()}
                {view === 'Weekly' && renderWeeklyView()}
                {view === 'Monthly' && renderMonthlyView()}
            </div>
        </div>
    );
};

export default ScheduleManagementContent;