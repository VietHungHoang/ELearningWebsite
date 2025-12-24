import React, { useState, useEffect, useRef } from 'react';
import type { Tutor, TutorAvailability } from '../../../../types/api.ts'

interface AvailabilityStepProps {
    data?: Partial<Tutor>;
    onChange: (data: Partial<Tutor>) => void;
}

const AvailabilityStep: React.FC<AvailabilityStepProps> = ({ data, onChange }) => {
    // Use current week
    const getCurrentWeek = () => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setHours(0, 0, 0, 0);
        const dayOfWeek = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        startOfWeek.setDate(diff);

        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            return day;
        });
    };

    const [weekDays] = useState(getCurrentWeek());
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

    // Convert TutorAvailability[] to selected time slots on mount
    useEffect(() => {
        if (data?.availabilities) {
            const slots: string[] = [];
            data.availabilities.forEach(avail => {
                // For each availability, generate hourly slots between start and end time
                const startHour = parseInt(avail.startTime.split(':')[0]);
                const endHour = parseInt(avail.endTime.split(':')[0]);
                
                weekDays.forEach(day => {
                    if (day.getDay() === avail.dayOfWeek || (avail.dayOfWeek === 0 && day.getDay() === 0)) {
                        for (let hour = startHour; hour < endHour; hour++) {
                            const slotDate = new Date(day);
                            slotDate.setHours(hour, 0, 0, 0);
                            slots.push(slotDate.toISOString());
                        }
                    }
                });
            });
            setSelectedSlots(slots);
        }
    }, []);

    // Convert selected slots to TutorAvailability[] format when slots change
    useEffect(() => {
        const availabilities: TutorAvailability[] = [];
        
        // Group slots by day of week
        const slotsByDay: { [key: number]: Date[] } = {};
        selectedSlots.forEach(slotISO => {
            const date = new Date(slotISO);
            const dayOfWeek = date.getDay();
            if (!slotsByDay[dayOfWeek]) {
                slotsByDay[dayOfWeek] = [];
            }
            slotsByDay[dayOfWeek].push(date);
        });

        // Convert to TutorAvailability format with time ranges
        Object.keys(slotsByDay).forEach(dayKey => {
            const dayOfWeek = parseInt(dayKey);
            const slots = slotsByDay[dayOfWeek].sort((a, b) => a.getTime() - b.getTime());
            
            if (slots.length === 0) return;

            let rangeStart = slots[0];
            let rangeEnd = slots[0];

            for (let i = 1; i <= slots.length; i++) {
                const currentSlot = slots[i];
                const prevSlot = slots[i - 1];
                
                if (currentSlot && currentSlot.getTime() - prevSlot.getTime() === 3600000) {
                    // Consecutive slot
                    rangeEnd = currentSlot;
                } else {
                    // End of range, save it
                    availabilities.push({
                        dayOfWeek,
                        startTime: `${String(rangeStart.getHours()).padStart(2, '0')}:00`,
                        endTime: `${String(rangeEnd.getHours() + 1).padStart(2, '0')}:00`,
                        effectiveStartDate: new Date().toISOString().split('T')[0],
                        status: 'AVAILABLE'
                    });
                    
                    if (currentSlot) {
                        rangeStart = currentSlot;
                        rangeEnd = currentSlot;
                    }
                }
            }
        });

        onChange({ availabilities });
    }, [selectedSlots, onChange]);

    // Marquee Selection State
    const [isDragging, setIsDragging] = useState(false);
    const [selectionMode, setSelectionMode] = useState<'adding' | 'removing' | null>(null);
    const [dragStartCoords, setDragStartCoords] = useState<{ x: number; y: number } | null>(null);
    const [selectionRect, setSelectionRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
    const [initialAvailability, setInitialAvailability] = useState<string[]>([]);
    const gridRef = useRef<HTMLDivElement>(null);

    // Reduced time slots: 8:00 AM - 8:00 PM (12 hours)
    const timeSlots = Array.from({ length: 12 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);

    const handleCellClick = (date: Date, hour: number) => {
        const slotDate = new Date(date);
        slotDate.setHours(hour, 0, 0, 0);
        const slotISO = slotDate.toISOString();
        const isCurrentlyAvailable = selectedSlots.includes(slotISO);

        if (isCurrentlyAvailable) {
            setSelectedSlots(prev => prev.filter(s => s !== slotISO));
        } else {
            setSelectedSlots(prev => [...prev, slotISO]);
        }
    };

    const handleMouseDown = (e: React.MouseEvent, date: Date, hour: number) => {
        if (e.button !== 0) return;
        e.preventDefault();

        const gridRect = gridRef.current?.getBoundingClientRect();
        if (!gridRect) return;

        const startX = e.clientX - gridRect.left;
        const startY = e.clientY - gridRect.top;
        setDragStartCoords({ x: startX, y: startY });

        const slotDate = new Date(date);
        slotDate.setHours(hour, 0, 0, 0);
        const slotISO = slotDate.toISOString();
        const mode = selectedSlots.includes(slotISO) ? 'removing' : 'adding';
        setSelectionMode(mode);

        setInitialAvailability([...selectedSlots]);
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
                setInitialAvailability([]);
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

        const newAvailability = new Set(initialAvailability);
        const gridRect = gridRef.current.getBoundingClientRect();
        const cellElements = gridRef.current.querySelectorAll('.calendar-cell');

        cellElements.forEach(cell => {
            const cellRect = cell.getBoundingClientRect();
            const relativeCellRect = {
                top: cellRect.top - gridRect.top,
                bottom: cellRect.bottom - gridRect.top,
                left: cellRect.left - gridRect.left,
                right: cellRect.right - gridRect.left
            };

            if (selectionRect.left < relativeCellRect.right &&
                selectionRect.left + selectionRect.width > relativeCellRect.left &&
                selectionRect.top < relativeCellRect.bottom &&
                selectionRect.top + selectionRect.height > relativeCellRect.top) {
                const iso = (cell as HTMLElement).dataset.iso;
                if (iso) {
                    if (selectionMode === 'adding') newAvailability.add(iso);
                    else if (selectionMode === 'removing') newAvailability.delete(iso);
                }
            }
        });
        setSelectedSlots(Array.from(newAvailability));
    }, [selectionRect, selectionMode, initialAvailability, isDragging]);

    // Group slots by day and convert to time ranges for display
    const groupedSlots: { [key: string]: Date[] } = {};
    selectedSlots.forEach(slot => {
        const date = new Date(slot);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        if (!groupedSlots[dayName]) {
            groupedSlots[dayName] = [];
        }
        groupedSlots[dayName].push(date);
    });

    // Convert time slots to ranges for each day
    const timeRangesByDay: { [key: string]: { start: string; end: string }[] } = {};
    Object.keys(groupedSlots).forEach(day => {
        const slots = groupedSlots[day].sort((a, b) => a.getTime() - b.getTime());
        const ranges: { start: string; end: string }[] = [];

        if (slots.length === 0) return;

        let rangeStart = slots[0];
        let rangeEnd = slots[0];

        for (let i = 1; i < slots.length; i++) {
            const currentSlot = slots[i];
            const prevSlot = slots[i - 1];
            const timeDiff = currentSlot.getTime() - prevSlot.getTime();

            // If slots are consecutive (1 hour apart = 3600000 ms)
            if (timeDiff === 3600000) {
                rangeEnd = currentSlot;
            } else {
                // Save current range
                ranges.push({
                    start: rangeStart.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    }),
                    end: new Date(rangeEnd.getTime() + 3600000).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    })
                });
                // Start new range
                rangeStart = currentSlot;
                rangeEnd = currentSlot;
            }
        }

        // Add last range
        ranges.push({
            start: rangeStart.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }),
            end: new Date(rangeEnd.getTime() + 3600000).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })
        });

        timeRangesByDay[day] = ranges;
    });

    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const sortedDays = Object.keys(timeRangesByDay).sort((a, b) =>
        dayOrder.indexOf(a) - dayOrder.indexOf(b)
    );

    return (
        <div className="space-y-2">
            <div>
                <h3 className="text-lg font-bold text-gray-800">Availability Schedule</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                    Click or drag on time slots to mark when you're available (optional)
                </p>
            </div>

            {/* Main Content: Grid Layout - Calendar Left, Selected Slots Right */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-2.5">
                {/* Left: Calendar Grid */}
                <div className="space-y-1.5">
                    {/* Tips and Timezone - Same row */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-1.5 flex items-center justify-between">
                        <p className="text-xs text-blue-800">
                            <strong>💡 Tip:</strong> Click to toggle, drag to select multiple. Green = available.
                        </p>
                        <p className="text-xs text-blue-800">
                            🌍 <strong>{Intl.DateTimeFormat().resolvedOptions().timeZone}</strong>
                        </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto relative max-h-[400px] overflow-y-auto" ref={gridRef}>
                            <div className="grid min-w-[400px]" style={{ gridTemplateColumns: `auto repeat(7, 1fr)` }}>
                                {/* Time Column Header */}
                                <div className="sticky left-0 bg-white z-10"></div>

                                {/* Day Headers */}
                                {weekDays.map(day => (
                                    <div key={day.toISOString()} className="text-center p-1.5 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
                                        <p className="text-xs font-semibold text-gray-700">
                                            {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                        </p>
                                    </div>
                                ))}

                                {/* Time Slots and Availability Grid */}
                                {timeSlots.map(time => (
                                    <React.Fragment key={time}>
                                        <div className="text-right pr-2 py-1 border-r border-gray-200 text-xs text-gray-500 sticky left-0 bg-white z-10 h-6 flex items-center justify-end">
                                            {time}
                                        </div>

                                        {weekDays.map(day => {
                                            const hour = parseInt(time.split(':')[0]);
                                            const slotDate = new Date(day);
                                            slotDate.setHours(hour, 0, 0, 0);
                                            const slotISO = slotDate.toISOString();
                                            const isAvailable = selectedSlots.includes(slotISO);

                                            return (
                                                <div
                                                    key={day.toISOString()}
                                                    data-iso={slotISO}
                                                    className="calendar-cell border-b border-r border-gray-200 h-6 cursor-pointer select-none hover:bg-gray-50 transition"
                                                    onMouseDown={(e) => handleMouseDown(e, day, hour)}
                                                    onClick={() => handleCellClick(day, hour)}
                                                >
                                                    {isAvailable && (
                                                        <div className="h-full w-full bg-green-200 opacity-70"></div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Marquee Selection Rectangle */}
                            {isDragging && selectionRect && (
                                <div
                                    className="absolute bg-blue-500 bg-opacity-30 border-2 border-blue-600 pointer-events-none z-20"
                                    style={{
                                        left: selectionRect.left,
                                        top: selectionRect.top,
                                        width: selectionRect.width,
                                        height: selectionRect.height
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Selected Slots List - Sticky */}
                <div className="lg:sticky lg:top-4 h-fit">
                    {selectedSlots.length > 0 ? (
                        <div className="bg-white border border-gray-200 rounded-lg p-2.5 max-h-[380px] overflow-y-auto">
                            <h4 className="font-semibold text-xs text-gray-800 mb-2">
                                Selected Slots ({selectedSlots.length})
                            </h4>
                            <div className="space-y-1.5">
                                {sortedDays.map(day => (
                                    <div key={day} className="bg-gray-50 rounded-md p-2">
                                        <p className="font-semibold text-xs text-gray-800 mb-1">{day}</p>
                                        <div className="space-y-0.5">
                                            {timeRangesByDay[day].map((range, idx) => (
                                                <div key={idx} className="text-xs text-gray-700 bg-white px-2 py-1 rounded border border-gray-200">
                                                    {range.start} - {range.end}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500">
                                No time slots selected yet.<br />
                                Click on the calendar to add availability.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AvailabilityStep;
