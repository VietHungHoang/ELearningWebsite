
import React, { useRef, useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import type { GroupClass, ClassScheduleItem } from '../../../../types/api';

interface GroupClassSectionProps {
  // tutor: TutorDetail; // Temporarily commented for mock data
}

const GroupClassSection: React.FC<GroupClassSectionProps> = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [selectedClass, setSelectedClass] = useState<GroupClass | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [showLeaveSuccessModal, setShowLeaveSuccessModal] = useState(false);
    const [joinedClasses, setJoinedClasses] = useState<Set<string>>(new Set());

    // Helper function to format schedule display
    const formatSchedule = (schedule: ClassScheduleItem[], duration: number): string => {
        if (schedule.length === 0) return '';

        const dayNames = schedule.map(item => {
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            return days[item.dayOfWeek - 1];
        });

        // Check if all items have the same time
        const firstTime = schedule[0].time;
        const allSameTime = schedule.every(item => item.time === firstTime);

        if (allSameTime) {
            // Calculate end time
            const endTime = calculateEndTime(firstTime, duration);
            return `${dayNames.join(', ')} - ${firstTime} - ${endTime}`;
        } else {
            // Different times - show each day with its time range
            return schedule.map(item => {
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                const endTime = calculateEndTime(item.time, duration);
                return `${days[item.dayOfWeek - 1]} ${item.time} - ${endTime}`;
            }).join(', ');
        }
    };

    // Helper function to calculate end time from start time and duration
    const calculateEndTime = (startTime: string, durationMinutes: number): string => {
        // Parse start time (assuming format like "3:00 PM" or "10:00 AM")
        const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)/i;
        const match = startTime.match(timeRegex);

        if (!match) return startTime; // Return as is if can't parse

        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const ampm = match[3].toUpperCase();

        // Convert to 24-hour format
        if (ampm === 'PM' && hours !== 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;

        // Add duration
        const totalMinutes = hours * 60 + minutes + durationMinutes;
        const endHours = Math.floor(totalMinutes / 60) % 24;
        const endMinutes = totalMinutes % 60;

        // Convert back to 12-hour format
        const endAmpm = endHours >= 12 ? 'PM' : 'AM';
        const displayHours = endHours === 0 ? 12 : endHours > 12 ? endHours - 12 : endHours;

        return `${displayHours}:${endMinutes.toString().padStart(2, '0')} ${endAmpm}`;
    };

    const checkScrollability = () => {
        const el = scrollContainerRef.current;
        if (el) {
            setCanScrollLeft(el.scrollLeft > 0);
            setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1); // -1 for precision
        }
    };

    useEffect(() => {
        checkScrollability();
        const el = scrollContainerRef.current;
        el?.addEventListener('scroll', checkScrollability);
        window.addEventListener('resize', checkScrollability);
        return () => {
            el?.removeEventListener('scroll', checkScrollability);
            window.removeEventListener('resize', checkScrollability);
        };
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    // Mock data for UI preview with additional fields
    const mockGroupClasses: GroupClass[] = [
        {
            classId: '1',
            classTitle: 'Advanced Mathematics Group',
            classDescription: 'Comprehensive math course covering algebra, calculus, and geometry for high school students. Hands-on chemistry experiments and theoretical concepts for science enthusiasts',
            maxStudents: 15,
            students: [
                { id: 's1', name: 'Alice' },
                { id: 's2', name: 'Bob' },
                { id: 's3', name: 'Charlie' },
                { id: 's4', name: 'Diana' },
                { id: 's5', name: 'Eve' },
                { id: 's6', name: 'Frank' },
            ],
            schedule: [
                { dayOfWeek: 1, time: '3:00 PM' },
                { dayOfWeek: 3, time: '3:00 PM' },
                { dayOfWeek: 5, time: '3:00 PM' }
            ],
            duration: 90,
            startDate: new Date('2025-01-15'),
            level: 'Intermediate',
            price: 299,
            sessions: 24,
            language: { code: 'en', name: 'English', isNative: true }
        },
        {
            classId: '2',
            classTitle: 'English Literature Study Group',
            classDescription: 'Explore classic and contemporary literature with in-depth analysis and discussions.',
            maxStudents: 12,
            students: [
                { id: 's7', name: 'Grace' },
                { id: 's8', name: 'Henry' },
                { id: 's9', name: 'Ivy' },
                { id: 's10', name: 'Jack' },
            ],
            schedule: [
                { dayOfWeek: 2, time: '5:00 PM' },
                { dayOfWeek: 4, time: '5:00 PM' }
            ],
            duration: 90,
            startDate: new Date('2025-01-20'),
            level: 'Advanced',
            price: 249,
            sessions: 12,
            language: { code: 'en', name: 'English', isNative: true }
        },
        {
            classId: '3',
            classTitle: 'Physics Fundamentals',
            classDescription: 'Learn the basics of physics including mechanics, thermodynamics, and electromagnetism.',
            maxStudents: 20,
            students: [
                { id: 's11', name: 'Kate' },
                { id: 's12', name: 'Liam' },
                { id: 's13', name: 'Mia' },
                { id: 's14', name: 'Noah' },
                { id: 's15', name: 'Olivia' },
                { id: 's16', name: 'Peter' },
                { id: 's17', name: 'Quinn' },
            ],
            schedule: [
                { dayOfWeek: 6, time: '10:00 AM' }
            ],
            duration: 120,
            startDate: new Date('2025-02-01'),
            level: 'Beginner',
            price: 349,
            sessions: 10,
            language: { code: 'en', name: 'English', isNative: true }
        },
        {
            classId: '4',
            classTitle: 'Chemistry Lab Sessions',
            classDescription: 'Hands-on chemistry experiments and theoretical concepts for science enthusiasts. ',
            maxStudents: 10,
            students: [
                { id: 's18', name: 'Rose' },
                { id: 's19', name: 'Sam' },
            ],
            schedule: [
                { dayOfWeek: 7, time: '2:00 PM' }
            ],
            duration: 120,
            startDate: new Date('2025-01-25'),
            level: 'Intermediate',
            price: 399,
            sessions: 12,
            language: { code: 'en', name: 'English', isNative: true }
        }
    ];

    const classes: any[] = mockGroupClasses;

    return (
        <div className="py-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Group Class</h2>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => scroll('left')} 
                        disabled={!canScrollLeft}
                        className="p-2 rounded-full bg-white border border-gray-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                    >
                        <FiChevronLeft />
                    </button>
                    <button 
                        onClick={() => scroll('right')} 
                        disabled={!canScrollRight}
                        className="p-2 rounded-full bg-white border border-gray-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                    >
                        <FiChevronRight />
                    </button>
                </div>
            </div>

            <div ref={scrollContainerRef} className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {classes.map(gc => (
                    <div key={gc.classId} className="flex-shrink-0 w-96">
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden h-full border border-gray-100 hover:shadow-lg transition-shadow">
                            {/* Header - Minimalist style */}
                            <div className="p-5 border-b border-gray-200">
                                <div className="space-y-1">
                                    {/* Dòng 1: Title và chữ Price */}
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1">{gc.classTitle}</h3>
                                        <div className="text-right flex-shrink-0 self-end">
                                            <div className="text-xs text-gray-500 mb-0.5">Price</div>
                                        </div>
                                    </div>
                                    {/* Dòng 2: Level và số tiền/sessions */}
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {gc.level && (
                                                <span className="px-3 py-1 bg-[#f9f3eb] text-gray-700 text-xs rounded-full font-semibold border border-[#e9bb71]/30">
                                                    {gc.level}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-2xl font-bold text-[#0b6459] flex-shrink-0">
                                            ${gc.price}
                                            {gc.sessions && <span className="text-sm text-gray-600 font-medium"> / {gc.sessions} sessions</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 space-y-3">
                                {/* Description */}
                                {gc.classDescription && (
                                    <p className="text-sm text-gray-600 line-clamp-3 min-h-[3.6rem]">{gc.classDescription}</p>
                                )}

                                {/* Class info grid */}
                                <div className="space-y-3 text-sm">
                                    {gc.schedule && (
                                        <div className="flex items-start gap-2">
                                            <svg className="w-4 h-4 text-[#0b6459] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500">Schedule</p>
                                                <p className="font-medium text-gray-800">{formatSchedule(gc.schedule, gc.duration)}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-3">
                                        {gc.startDate && (
                                            <div className="flex items-start gap-2">
                                                <svg className="w-4 h-4 text-[#0b6459] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <div>
                                                    <p className="text-xs text-gray-500">Starts</p>
                                                    <p className="font-medium text-gray-800">{gc.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                </div>
                                            </div>
                                        )}
                                        {gc.language && (
                                            <div className="flex items-start gap-2">
                                                <svg className="w-4 h-4 text-[#0b6459] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                                </svg>
                                                <div>
                                                    <p className="text-xs text-gray-500">Language</p>
                                                    <p className="font-medium text-gray-800">{gc.language.name}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Students enrolled */}
                                <div className="pt-3 border-t border-gray-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-gray-500">STUDENTS ENROLLED</span>
                                        <span className="text-sm font-bold text-[#0b6459]">
                                            {gc.students?.length ?? 0}/{gc.maxStudents ?? '∞'}
                                        </span>
                                    </div>
                                    {gc.students && gc.students.length > 0 && (
                                        <p className="text-xs text-gray-600">
                                            {gc.students.slice(0, 3).map((s: any, idx: number) => (
                                                <span key={s.id}>
                                                    {idx > 0 && <span className="mx-1 text-gray-400">•</span>}
                                                    {s.name}
                                                </span>
                                            ))}
                                            {gc.students.length > 3 && (
                                                <span className="text-[#0b6459] font-medium"> +{gc.students.length - 3}</span>
                                            )}
                                        </p>
                                    )}
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-3 pt-2">
                                    <button 
                                        onClick={() => setSelectedClass(gc)}
                                        className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-sm"
                                    >
                                        Details
                                    </button>
                                    {joinedClasses.has(gc.classId) ? (
                                        <button 
                                            onClick={() => {
                                                setSelectedClass(gc);
                                                setShowLeaveModal(true);
                                            }}
                                            className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-xl hover:bg-red-700 transition-colors font-semibold text-sm"
                                        >
                                            Leave Class
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => {
                                                setSelectedClass(gc);
                                                setShowConfirmModal(true);
                                            }}
                                            className="flex-1 bg-[#0b6459] text-white py-2.5 px-4 rounded-xl hover:bg-[#084c43] transition-colors font-semibold text-sm"
                                        >
                                            Join Class
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for class details */}
            {selectedClass && !showConfirmModal && !showSuccessModal && !showLeaveModal && !showLeaveSuccessModal && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedClass(null)}
                >
                    <div 
                        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3 flex-1">
                                    <h2 className="text-2xl font-bold text-gray-800">{selectedClass.classTitle}</h2>
                                    <button 
                                        className="text-gray-500 hover:text-[#0b6459] p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                        title="Group Chat"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </button>
                                </div>
                                <button 
                                    onClick={() => setSelectedClass(null)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-4"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2">
                                    {selectedClass.level && (
                                        <span className="inline-block px-3 py-1 bg-[#f9f3eb] text-gray-700 text-sm rounded-full font-semibold border border-[#e9bb71]/30">
                                            {selectedClass.level}
                                        </span>
                                    )}
                                </div>
                                <span className="font-bold text-[#0b6459] text-2xl">${selectedClass.price}</span>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {selectedClass.classDescription && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                                    <p className="text-gray-600">{selectedClass.classDescription}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                {selectedClass.schedule && (
                                    <div className="col-span-2">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Schedule</h3>
                                        <p className="text-gray-600">{formatSchedule(selectedClass.schedule, selectedClass.duration)}</p>
                                    </div>
                                )}
                                {selectedClass.startDate && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Start Date</h3>
                                        <p className="text-gray-600">{selectedClass.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                )}
                                {selectedClass.language && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Language</h3>
                                        <p className="text-gray-600">{selectedClass.language.name}</p>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Max Students</h3>
                                    <p className="text-gray-600">{selectedClass.maxStudents ?? 'Unlimited'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Enrolled</h3>
                                    <p className="text-gray-600">
                                        {selectedClass.students && selectedClass.students.length > 0 ? (
                                            <>
                                                {selectedClass.students.slice(0, 2).map((s: any) => s.name).join(', ')}
                                                {selectedClass.students.length > 2 && (
                                                    <span className="ml-1 text-[#0b6459] font-semibold">+{selectedClass.students.length - 2}</span>
                                                )}
                                            </>
                                        ) : (
                                            'No students yet'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex gap-3">
                            <button 
                                onClick={() => setSelectedClass(null)}
                                className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                            >
                                Close
                            </button>
                            <button 
                                onClick={() => setShowConfirmModal(true)}
                                className="flex-1 bg-[#0b6459] text-white py-2.5 px-4 rounded-xl hover:bg-[#084c43] transition-colors font-semibold"
                            >
                                Join This Class
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Modal */}
            {showConfirmModal && selectedClass && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl">
                        {/* Header */}
                        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">Join Group Class</h3>
                            <p className="text-sm text-gray-600 mt-1">Review details before confirming</p>
                        </div>

                        <div className="px-6 py-5 space-y-5">
                            {/* Steps */}
                            <div className="flex items-center justify-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-[#0b6459] text-white flex items-center justify-center text-sm font-bold">1</div>
                                    <span className="text-sm font-semibold text-gray-900">Register</span>
                                </div>
                                <div className="w-8 h-0.5 bg-gray-300"></div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold">2</div>
                                    <span className="text-sm font-medium text-gray-500">Payment</span>
                                </div>
                                <div className="w-8 h-0.5 bg-gray-300"></div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold">3</div>
                                    <span className="text-sm font-medium text-gray-500">Start</span>
                                </div>
                            </div>

                            {/* Class Info */}
                            <div>
                                <div className="flex items-center justify-between gap-4 mb-2">
                                    <p className="text-lg font-bold text-gray-900">{selectedClass.classTitle}</p>
                                    {(selectedClass as any).price && (
                                        <span className="font-bold text-[#0b6459] text-2xl flex-shrink-0">
                                            ${(selectedClass as any).price}
                                            {(selectedClass as any).sessions && <span className="text-sm text-gray-600 font-medium">/{(selectedClass as any).sessions}</span>}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    {(selectedClass as any).level && (
                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                            {(selectedClass as any).level}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Notice */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <div className="flex gap-3">
                                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-semibold text-amber-900 mb-1">Important Notice</p>
                                        <p className="text-sm text-amber-800">
                                            {(selectedClass as any).startDate 
                                                ? `This class will start on ${(selectedClass as any).startDate}, even if not all spots are filled.`
                                                : 'This class will start immediately once all spots are filled.'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-2.5 pt-3 border-t border-gray-100">
                                {(selectedClass as any).schedule && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Schedule</span>
                                        <span className="text-gray-900 font-medium text-right">{(selectedClass as any).schedule}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Students Enrolled</span>
                                    <span className="text-gray-900 font-medium">{selectedClass.students?.length || 0} / {selectedClass.maxStudents}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="px-6 pb-6 flex gap-3">
                            <button 
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setSelectedClass(null);
                                }}
                                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setShowSuccessModal(true);
                                    if (selectedClass) {
                                        setJoinedClasses(prev => new Set(prev).add(selectedClass.classId));
                                    }
                                }}
                                className="flex-1 px-4 py-2.5 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] text-sm font-semibold transition-colors"
                            >
                                Confirm & Join
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4">
                    <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
                        <div className="px-6 pt-6 pb-5 text-center">
                            {/* Success Icon */}
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Successfully Registered!</h3>
                            
                            {/* Message */}
                            <p className="text-sm text-gray-600 mb-1">
                                You have successfully joined the group class.
                            </p>
                            <p className="text-sm text-gray-600">
                                You will receive an email notification when the class starts.
                            </p>
                        </div>

                        {/* Action */}
                        <div className="px-6 pb-6">
                            <button 
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    setSelectedClass(null);
                                }}
                                className="w-full px-4 py-2.5 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] text-sm font-semibold transition-colors"
                            >
                                Got it!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Leave Confirmation Modal */}
            {showLeaveModal && selectedClass && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl">
                        {/* Header */}
                        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">Leave Group Class</h3>
                            <p className="text-sm text-gray-600 mt-1">Are you sure you want to leave?</p>
                        </div>

                        <div className="px-6 py-5">
                            {/* Class Info */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between gap-4 mb-2">
                                    <p className="text-lg font-bold text-gray-900">{selectedClass.classTitle}</p>
                                    {(selectedClass as any).price && (
                                        <span className="font-bold text-[#0b6459] text-2xl flex-shrink-0">${(selectedClass as any).price}</span>
                                    )}
                                </div>
                            </div>

                            {/* Warning */}
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex gap-3">
                                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-semibold text-red-900 mb-1">Warning</p>
                                        <p className="text-sm text-red-800">
                                            Leaving this class will remove your registration. You may need to re-register if you change your mind.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="px-6 pb-6 flex gap-3">
                            <button 
                                onClick={() => {
                                    setShowLeaveModal(false);
                                    setSelectedClass(null);
                                }}
                                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    setShowLeaveModal(false);
                                    setShowLeaveSuccessModal(true);
                                    if (selectedClass) {
                                        setJoinedClasses(prev => {
                                            const newSet = new Set(prev);
                                            newSet.delete(selectedClass.classId);
                                            return newSet;
                                        });
                                    }
                                }}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold transition-colors"
                            >
                                Leave Class
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Leave Success Modal */}
            {showLeaveSuccessModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4">
                    <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
                        <div className="px-6 pt-6 pb-5 text-center">
                            {/* Success Icon */}
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Successfully Left the Class</h3>
                            
                            {/* Message */}
                            <p className="text-sm text-gray-600">
                                You have successfully left the group class. You can rejoin anytime if you change your mind.
                            </p>
                        </div>

                        {/* Action */}
                        <div className="px-6 pb-6">
                            <button 
                                onClick={() => {
                                    setShowLeaveSuccessModal(false);
                                    setSelectedClass(null);
                                }}
                                className="w-full px-4 py-2.5 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] text-sm font-semibold transition-colors"
                            >
                                Got it!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupClassSection;
