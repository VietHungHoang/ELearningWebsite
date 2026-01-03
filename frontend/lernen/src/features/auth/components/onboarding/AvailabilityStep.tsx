import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { TutorOnboardingData, TutorAvailability } from '../../../../types/tutor'

interface AvailabilityStepProps {
    data?: Partial<TutorOnboardingData>;
    onChange: (data: Partial<TutorOnboardingData>) => void;
}

const AvailabilityStep: React.FC<AvailabilityStepProps> = ({ data, onChange }) => {
    const { t } = useTranslation();
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
            // Convert to UTC for dayOfWeek calculation
            const utcDate = new Date(Date.UTC(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate(),
                date.getUTCHours(),
                0,
                0
            ));
            const dayOfWeek = utcDate.getUTCDay();
            if (!slotsByDay[dayOfWeek]) {
                slotsByDay[dayOfWeek] = [];
            }
            slotsByDay[dayOfWeek].push(utcDate);
        });

        // Convert to TutorAvailability format with time ranges (UTC+0)
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
                    // End of range, save it - convert to UTC+0
                    availabilities.push({
                        dayOfWeek,
                        startTime: `${String(rangeStart.getUTCHours()).padStart(2, '0')}:00`,
                        endTime: `${String(rangeEnd.getUTCHours() + 1).padStart(2, '0')}:00`,
                        effectiveStartDate: new Date().toISOString().split('T')[0],
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
    const [dragStartScroll, setDragStartScroll] = useState<{ scrollLeft: number; scrollTop: number } | null>(null);
    const [selectionRect, setSelectionRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
    const [initialAvailability, setInitialAvailability] = useState<string[]>([]);
    const gridRef = useRef<HTMLDivElement>(null);

    // Time slots: 8:00 AM - 11:00 PM (16 hours: 8:00 to 23:00)
    // 24:00 is only a label at the bottom, not a selectable slot
    const timeSlots = Array.from({ length: 16 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);

    const handleCellClick = (date: Date, hour: number) => {
        // Create date with local time first
        const slotDate = new Date(date);
        slotDate.setHours(hour, 0, 0, 0);
        // Convert to UTC+0 for storage
        const utcDate = new Date(Date.UTC(
            slotDate.getUTCFullYear(),
            slotDate.getUTCMonth(),
            slotDate.getUTCDate(),
            slotDate.getUTCHours(),
            0,
            0
        ));
        const slotISO = utcDate.toISOString();
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

        const container = gridRef.current;
        if (!container) return;

        const gridRect = container.getBoundingClientRect();
        
        // Lưu vị trí bắt đầu tương đối với viewport (không tính scroll)
        const startX = e.clientX - gridRect.left;
        const startY = e.clientY - gridRect.top;
        setDragStartCoords({ x: startX, y: startY });

        // Lưu scroll position tại thời điểm bắt đầu drag
        setDragStartScroll({
            scrollLeft: container.scrollLeft,
            scrollTop: container.scrollTop
        });

        // Create date with local time first
        const slotDate = new Date(date);
        slotDate.setHours(hour, 0, 0, 0);
        // Convert to UTC+0 for storage
        const utcDate = new Date(Date.UTC(
            slotDate.getUTCFullYear(),
            slotDate.getUTCMonth(),
            slotDate.getUTCDate(),
            slotDate.getUTCHours(),
            0,
            0
        ));
        const slotISO = utcDate.toISOString();
        const mode = selectedSlots.includes(slotISO) ? 'removing' : 'adding';
        setSelectionMode(mode);

        setInitialAvailability([...selectedSlots]);
        setIsDragging(true);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !dragStartCoords || !dragStartScroll || !gridRef.current) return;
            e.preventDefault();
            
            const container = gridRef.current;
            const gridRect = container.getBoundingClientRect();
            
            // Vị trí hiện tại của chuột tương đối với viewport
            const currentX = e.clientX - gridRect.left;
            const currentY = e.clientY - gridRect.top;
            
            // Tính toán sự thay đổi scroll từ lúc bắt đầu drag
            const scrollDeltaX = container.scrollLeft - dragStartScroll.scrollLeft;
            const scrollDeltaY = container.scrollTop - dragStartScroll.scrollTop;
            
            // Điều chỉnh vị trí bắt đầu theo scroll delta
            const adjustedStartX = dragStartCoords.x - scrollDeltaX;
            const adjustedStartY = dragStartCoords.y - scrollDeltaY;
            
            const rect = {
                left: Math.min(adjustedStartX, currentX),
                top: Math.min(adjustedStartY, currentY),
                width: Math.abs(adjustedStartX - currentX),
                height: Math.abs(adjustedStartY - currentY)
            };
            setSelectionRect(rect);
        };

        const handleMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                setDragStartCoords(null);
                setDragStartScroll(null);
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
    }, [isDragging, dragStartCoords, dragStartScroll]);

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

            {/* Main Content: Grid Layout - Calendar Left, Selected Slots Right */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-2.5">
                {/* Left: Calendar Grid */}
                <div className="space-y-1.5">
                    {/* Tips and Timezone - Same row */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-1.5 flex items-center justify-between">
                        <p className="text-xs text-blue-800">
                            <strong>{t('onboarding.availability.tip')}</strong>
                        </p>
                        <p className="text-xs text-blue-800">
                            🌍 <strong>{Intl.DateTimeFormat().resolvedOptions().timeZone}</strong>
                        </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto relative max-h-[400px] overflow-y-auto" ref={gridRef}>
                            <div className="grid min-w-[400px]" style={{ gridTemplateColumns: `50px repeat(7, 1fr)` }}>
                                {/* Time Column Header */}
                                <div className="sticky left-0 bg-white z-10 border-b border-gray-200"></div>

                                {/* Day Headers */}
                                {weekDays.map(day => (
                                    <div key={day.toISOString()} className="text-center p-1.5 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
                                        <p className="text-xs font-semibold text-gray-700">
                                            {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                        </p>
                                    </div>
                                ))}

                                {/* Time Slots and Availability Grid */}
                                {timeSlots.map((time) => (
                                    <React.Fragment key={time}>
                                        <div className="relative border-r border-t border-gray-200 sticky left-0 bg-white z-10 h-6">
                                            <span 
                                                className="absolute right-2 text-xs text-gray-500 bg-white px-0.5"
                                                style={{ top: 0, transform: 'translateY(-50%)' }}
                                            >
                                            {time}
                                            </span>
                                        </div>

                                        {weekDays.map(day => {
                                            const hour = parseInt(time.split(':')[0]);
                                            // Create date with local time first
                                            const slotDate = new Date(day);
                                            slotDate.setHours(hour, 0, 0, 0);
                                            // Convert to UTC+0 for comparison
                                            const utcDate = new Date(Date.UTC(
                                                slotDate.getUTCFullYear(),
                                                slotDate.getUTCMonth(),
                                                slotDate.getUTCDate(),
                                                slotDate.getUTCHours(),
                                                0,
                                                0
                                            ));
                                            const slotISO = utcDate.toISOString();
                                            const isAvailable = selectedSlots.includes(slotISO);

                                            return (
                                                <div
                                                    key={day.toISOString()}
                                                    data-iso={slotISO}
                                                    className="calendar-cell border-r border-t border-gray-200 h-6 cursor-pointer select-none hover:bg-gray-50 transition"
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
                                
                                {/* Bottom border line with 24:00 label - no selectable cells */}
                                <div className="relative border-r border-t border-gray-200 sticky left-0 bg-white z-10 h-3">
                                    <span 
                                        className="absolute right-2 text-xs text-gray-500 bg-white px-0.5"
                                        style={{ top: 0, transform: 'translateY(-50%)' }}
                                    >
                                        24:00
                                    </span>
                                </div>
                                {weekDays.map(day => (
                                    <div key={`bottom-${day.toISOString()}`} className="border-t border-gray-200 h-3"></div>
                                ))}
                            </div>

                            {/* Marquee Selection Rectangle */}
                            {isDragging && selectionRect && (
                                <div
                                    className="absolute bg-blue-200 bg-opacity-40 border border-blue-400 pointer-events-none z-20"
                                    style={{
                                        left: selectionRect.left + (gridRef.current?.scrollLeft || 0),
                                        top: selectionRect.top + (gridRef.current?.scrollTop || 0),
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
                                {t('onboarding.availability.selectedSlots')} ({selectedSlots.length})
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
                            <p className="text-xs text-gray-500" dangerouslySetInnerHTML={{ __html: t('onboarding.availability.noSlotsSelected') }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AvailabilityStep;
