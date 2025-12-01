import React, { useState, useEffect, useRef } from 'react';
import type { Tutor } from '../../../../types/api.ts'

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
    const [availability, setAvailability] = useState<string[]>(((data as any)?.availability) || []);

    // Update parent when availability changes - write into `availability` field of parent data
    useEffect(() => {
        // cast because `availability` is not declared on Tutor type; parent uses Partial<Tutor>
        onChange({ availability } as unknown as Partial<Tutor>);
    }, [availability, onChange]);

    // Marquee Selection State
    const [isDragging, setIsDragging] = useState(false);
    const [selectionMode, setSelectionMode] = useState<'adding' | 'removing' | null>(null);
    const [dragStartCoords, setDragStartCoords] = useState<{ x: number; y: number } | null>(null);
    const [selectionRect, setSelectionRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
    const [initialAvailability, setInitialAvailability] = useState<string[]>([]);
    const gridRef = useRef<HTMLDivElement>(null);

    const timeSlots = Array.from({ length: 16 }, (_, i) => `${String(i + 7).padStart(2, '0')}:00`);

    const handleCellClick = (date: Date, hour: number) => {
        const slotDate = new Date(date);
        slotDate.setHours(hour, 0, 0, 0);
        const slotISO = slotDate.toISOString();
        const isCurrentlyAvailable = availability.includes(slotISO);

        if (isCurrentlyAvailable) {
            setAvailability(prev => prev.filter(s => s !== slotISO));
        } else {
            setAvailability(prev => [...prev, slotISO]);
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
        const mode = availability.includes(slotISO) ? 'removing' : 'adding';
        setSelectionMode(mode);

        setInitialAvailability([...availability]);
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
        setAvailability(Array.from(newAvailability));
    }, [selectionRect, selectionMode, initialAvailability, isDragging]);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-gray-800">Availability Schedule</h3>
                <p className="text-sm text-gray-500 mt-1">
                    Click or drag on time slots to mark when you're available (optional)
                </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    <strong>💡 Tip:</strong> Click on any time slot to toggle availability.
                    You can also click and drag to select multiple slots at once.
                    Green slots = available.
                </p>
            </div>

            {/* Simplified Weekly Calendar Grid */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto relative" ref={gridRef}>
                    <div className="grid min-w-[400px]" style={{ gridTemplateColumns: `auto repeat(7, 1fr)` }}>
                        {/* Time Column Header */}
                        <div className="sticky left-0 bg-white z-10"></div>

                        {/* Day Headers */}
                        {weekDays.map(day => (
                            <div key={day.toISOString()} className="text-center p-3 border-b border-gray-200 bg-gray-50">
                                <p className="text-sm font-semibold text-gray-700">
                                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                </p>
                            </div>
                        ))}

                        {/* Time Slots and Availability Grid */}
                        {timeSlots.map(time => (
                            <React.Fragment key={time}>
                                <div className="text-right pr-4 py-2 border-r border-gray-200 text-xs text-gray-500 sticky left-0 bg-white z-10 h-12 flex items-center justify-end">
                                    {time}
                                </div>

                                {weekDays.map(day => {
                                    const hour = parseInt(time.split(':')[0]);
                                    const slotDate = new Date(day);
                                    slotDate.setHours(hour, 0, 0, 0);
                                    const slotISO = slotDate.toISOString();
                                    const isAvailable = availability.includes(slotISO);

                                    return (
                                        <div
                                            key={day.toISOString()}
                                            data-iso={slotISO}
                                            className="calendar-cell border-b border-r border-gray-200 h-12 cursor-pointer select-none hover:bg-gray-50 transition"
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

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        ⏰ Time slots: <strong>7:00 AM - 10:00 PM</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                        🌍 Timezone: <strong>{Intl.DateTimeFormat().resolvedOptions().timeZone}</strong>
                    </p>
                </div>
            </div>

            {/* Selected Slots List */}
            {availability.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">
                        Selected Time Slots ({availability.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(() => {
                            // Group slots by day
                            const groupedSlots: { [key: string]: string[] } = {};
                            availability.forEach(slot => {
                                const date = new Date(slot);
                                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                                const time = date.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                });
                                if (!groupedSlots[dayName]) {
                                    groupedSlots[dayName] = [];
                                }
                                groupedSlots[dayName].push(time);
                            });

                            // Sort days and times
                            const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                            const sortedDays = Object.keys(groupedSlots).sort((a, b) =>
                                dayOrder.indexOf(a) - dayOrder.indexOf(b)
                            );

                            return sortedDays.map(day => (
                                <div key={day} className="bg-gray-50 rounded-lg p-4">
                                    <p className="font-semibold text-gray-800 mb-2">{day}</p>
                                    <div className="space-y-1">
                                        {groupedSlots[day].sort().map((time, idx) => (
                                            <p key={idx} className="text-sm text-gray-600">
                                                • {time}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AvailabilityStep;
