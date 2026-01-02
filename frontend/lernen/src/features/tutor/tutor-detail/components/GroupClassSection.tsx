
import React, { useRef, useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiMessageCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import type { GroupClass } from '../../../../types/tutor';
import type { ClassSchedule } from '../../../../types/class';
import { useTranslation } from "react-i18next";
import ModalLayout from '../../../../components/ui/ModalLayout';
import { classService } from '../../../../services/classService';
import { useAuth } from '../../../../context/AuthContext';

interface GroupClassSectionProps {
  groupClasses: GroupClass[];
}

const GroupClassSection: React.FC<GroupClassSectionProps> = ({ groupClasses }) => {
    const navigate = useNavigate();
    const { state } = useAuth();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [selectedClass, setSelectedClass] = useState<GroupClass | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [showLeaveSuccessModal, setShowLeaveSuccessModal] = useState(false);
    const [joinedClasses, setJoinedClasses] = useState<Set<string>>(new Set());
    const [localGroupClasses, setLocalGroupClasses] = useState<GroupClass[]>(groupClasses);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    // Update local state when groupClasses prop changes
    useEffect(() => {
        setLocalGroupClasses(groupClasses);
    }, [groupClasses]);

    // Helper function to format schedule display
    const formatSchedule = (schedule: ClassSchedule[], duration: number): string => {
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
        // Try to parse 12-hour format first (e.g., "3:00 PM" or "10:00 AM")
        const time12Regex = /(\d{1,2}):(\d{2})\s*(AM|PM)/i;
        const match12 = startTime.match(time12Regex);

        let hours: number;
        let minutes: number;

        if (match12) {
            // 12-hour format
            hours = parseInt(match12[1]);
            minutes = parseInt(match12[2]);
            const ampm = match12[3].toUpperCase();

            // Convert to 24-hour format
            if (ampm === 'PM' && hours !== 12) hours += 12;
            if (ampm === 'AM' && hours === 12) hours = 0;
        } else {
            // Try to parse 24-hour format (e.g., "15:00" or "15:00:00")
            const time24Regex = /(\d{1,2}):(\d{2})(?::\d{2})?/;
            const match24 = startTime.match(time24Regex);

            if (match24) {
                hours = parseInt(match24[1]);
                minutes = parseInt(match24[2]);
            } else {
                return startTime; // Return as is if can't parse
            }
        }

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
    }, [groupClasses]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="py-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">{t('tutorDetail.groupClass.title')}</h2>
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
                {localGroupClasses.map(gc => (
                    <div key={gc.id} className="flex-shrink-0 w-96">
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden h-full border border-gray-100 hover:shadow-lg transition-shadow">
                            {/* 
                                DESIGN OPTIONS - Uncomment the one you prefer:
                                
                                OPTION 1: Side-by-side with price badge (CURRENT)
                                OPTION 2: Stacked with price at bottom
                                OPTION 3: Compact with price in corner
                                OPTION 4: Card-style with colored background
                            */}
                            
                            {/* OPTION 1: Side-by-side layout with price badge */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight pr-2">
                                            {gc.title}
                                        </h3>
                                    </div>
                                    <div className="flex-shrink-0 text-right">
                                        <div className="flex items-baseline justify-end gap-1.5">
                                            <span className="text-2xl font-bold text-[#0b6459] leading-none">
                                                {new Intl.NumberFormat('vi-VN').format(gc.pricePerHour)}
                                            </span>
                                            <span className="text-sm font-semibold text-gray-700">
                                                {t('common.currency')}
                                            </span>
                                            <span className="text-sm text-gray-500 font-medium">
                                                /hour
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* OPTION 2: Stacked layout with price at bottom - Uncomment to use
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-5 leading-tight">
                                    {gc.title}
                                </h3>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="text-sm font-medium text-gray-600">
                                        {t('tutorDetail.groupClass.price')}
                                    </span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-[#0b6459]">
                                            {new Intl.NumberFormat('vi-VN').format(gc.pricePerHour)}
                                        </span>
                                        <span className="text-lg font-semibold text-gray-700">
                                            {t('common.currency')}
                                        </span>
                                        <span className="text-sm text-gray-500 ml-1">
                                            /hour
                                        </span>
                                    </div>
                                </div>
                            </div>
                            */}

                            {/* OPTION 3: Compact with price in top-right corner - Uncomment to use
                            <div className="p-6 border-b border-gray-200 relative">
                                <div className="absolute top-4 right-4 bg-[#0b6459]/10 rounded-lg px-3 py-1.5 border border-[#0b6459]/20">
                                    <div className="text-right">
                                        <div className="text-xs text-gray-600 mb-0.5">
                                            {t('tutorDetail.groupClass.price')}
                                        </div>
                                        <div className="flex items-baseline justify-end gap-1">
                                            <span className="text-xl font-bold text-[#0b6459]">
                                                {new Intl.NumberFormat('vi-VN').format(gc.pricePerHour)}
                                            </span>
                                            <span className="text-sm font-semibold text-gray-700">
                                                {t('common.currency')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight pr-24">
                                    {gc.title}
                                </h3>
                            </div>
                            */}

                            {/* OPTION 4: Card-style with colored price section - Uncomment to use
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-4 leading-tight">
                                    {gc.title}
                                </h3>
                                <div className="bg-gradient-to-r from-[#0b6459] to-[#084c43] rounded-lg p-4 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-xs font-medium opacity-90 mb-1">
                                                {t('tutorDetail.groupClass.price')}
                                            </div>
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-3xl font-bold">
                                                    {new Intl.NumberFormat('vi-VN').format(gc.pricePerHour)}
                                                </span>
                                                <span className="text-base font-semibold opacity-95">
                                                    {t('common.currency')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs opacity-80">
                                                per hour
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            */}

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
                                                <p className="text-xs text-gray-500">{t('tutorDetail.groupClass.schedule')}</p>
                                                <p className="font-medium text-gray-800">{formatSchedule(gc.schedule, 60)}</p>
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
                                                    <p className="text-xs text-gray-500">{t('tutorDetail.groupClass.starts')}</p>
                                                    <p className="font-medium text-gray-800">{gc.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                </div>
                                            </div>
                                        )}
                                        {/* Language field removed from interface */}
                                        {/* {gc.language && (
                                            <div className="flex items-start gap-2">
                                                <svg className="w-4 h-4 text-[#0b6459] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                                </svg>
                                                <div>
                                                    <p className="text-xs text-gray-500">{t('tutorDetail.groupClass.language')}</p>
                                                    <p className="font-medium text-gray-800">{gc.language.name}</p>
                                                </div>
                                            </div>
                                        )} */}
                                    </div>
                                </div>

                                {/* Students enrolled */}
                                <div className="pt-3 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-gray-500">{t('tutorDetail.groupClass.studentsEnrolled')}</span>
                                        <span className="text-sm font-bold text-[#0b6459]">
                                            {gc.enrolledStudents ?? gc.students?.length ?? 0}/{gc.maxStudents ?? '∞'}
                                        </span>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-3 pt-2">
                                    <button 
                                        onClick={() => {
                                            // Navigate to inbox/chat for this group class
                                            navigate(`/dashboard/inbox?classId=${gc.id}&type=group`);
                                        }}
                                        className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
                                    >
                                        <FiMessageCircle className="w-4 h-4" />
                                        {t('tutorDetail.groupClass.message')}
                                    </button>
                                    {joinedClasses.has(gc.id) ? (
                                        <button 
                                            onClick={() => {
                                                setSelectedClass(gc);
                                                setShowLeaveModal(true);
                                            }}
                                            className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-xl hover:bg-red-700 transition-colors font-semibold text-sm"
                                        >
                                            {t('tutorDetail.groupClass.leaveClass')}
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => {
                                                setSelectedClass(gc);
                                                setShowConfirmModal(true);
                                            }}
                                            className="flex-1 bg-[#0b6459] text-white py-2.5 px-4 rounded-xl hover:bg-[#084c43] transition-colors font-semibold text-sm"
                                        >
                                            {t('tutorDetail.groupClass.joinClass')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Confirm Modal */}
            <ModalLayout
                isOpen={showConfirmModal && selectedClass !== null}
                onClose={() => {
                    setShowConfirmModal(false);
                    setSelectedClass(null);
                }}
                maxWidth="lg"
            >
                {selectedClass && (
                    <div>
                        {/* Header */}
                        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">{t('tutorDetail.groupClass.joinGroupClass')}</h3>
                            <p className="text-sm text-gray-600 mt-1">{t('tutorDetail.groupClass.reviewDetails')}</p>
                        </div>

                        <div className="px-6 py-5 space-y-5">
                            {/* Steps */}
                            <div className="flex items-center justify-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-[#0b6459] text-white flex items-center justify-center text-sm font-bold">1</div>
                                    <span className="text-sm font-semibold text-gray-900">{t('tutorDetail.groupClass.register')}</span>
                                </div>
                                <div className="w-8 h-0.5 bg-gray-300"></div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold">2</div>
                                    <span className="text-sm font-medium text-gray-500">{t('tutorDetail.groupClass.payment')}</span>
                                </div>
                                <div className="w-8 h-0.5 bg-gray-300"></div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold">3</div>
                                    <span className="text-sm font-medium text-gray-500">{t('tutorDetail.groupClass.start')}</span>
                                </div>
                            </div>

                            {/* Class Info */}
                            <div>
                                <div className="flex items-center justify-between gap-4 mb-2">
                                    <p className="text-lg font-bold text-gray-900">{selectedClass.title}</p>
                                    {(selectedClass as any).price && (
                                        <span className="font-bold text-[#0b6459] text-2xl flex-shrink-0">
                                            {t('common.currency')}{(selectedClass as any).price}
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

                            {/* Important Information */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                                <div className="flex gap-3">
                                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-blue-900 mb-1">{t('tutorDetail.groupClass.importantInformation')}</p>
                                        <ul className="space-y-2 text-sm text-blue-800">
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-600 mt-0.5">•</span>
                                                <span>{t('tutorDetail.groupClass.classOpensWhenFull')}</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-600 mt-0.5">•</span>
                                                <span>{t('tutorDetail.groupClass.paymentWhenClassStarts')}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-2.5 pt-3 border-t border-gray-100">
                                {selectedClass.schedule && selectedClass.schedule.length > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">{t('tutorDetail.groupClass.schedule')}</span>
                                        <span className="text-gray-900 font-medium text-right">{formatSchedule(selectedClass.schedule, 60)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">{t('tutorDetail.groupClass.studentsEnrolledLabel')}</span>
                                    <span className="text-gray-900 font-medium">{selectedClass.enrolledStudents ?? selectedClass.students?.length ?? 0} / {selectedClass.maxStudents}</span>
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
                                {t('tutorDetail.groupClass.cancel')}
                            </button>
                            <button 
                                onClick={async () => {
                                    if (!selectedClass || !state.user?.id) return;
                                    
                                    setIsLoading(true);
                                    try {
                                        const response = await classService.addStudentToClass(selectedClass.id, state.user.id);
                                        if (response.success) {
                                            setShowConfirmModal(false);
                                            setShowSuccessModal(true);
                                            setJoinedClasses(prev => new Set(prev).add(selectedClass.id));
                                            // Update enrolled students count
                                            setLocalGroupClasses(prev => prev.map(gc => 
                                                gc.id === selectedClass.id 
                                                    ? { ...gc, enrolledStudents: (gc.enrolledStudents ?? 0) + 1 }
                                                    : gc
                                            ));
                                        } else {
                                            alert(response.message || t('tutorDetail.groupClass.joinError'));
                                        }
                                    } catch (error) {
                                        console.error('Error joining class:', error);
                                        alert(t('tutorDetail.groupClass.joinError'));
                                    } finally {
                                        setIsLoading(false);
                                    }
                                }}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2.5 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? t('common.loading') : t('tutorDetail.groupClass.confirmJoin')}
                            </button>
                        </div>
                    </div>
                )}
            </ModalLayout>

            {/* Success Modal */}
            <ModalLayout
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    setSelectedClass(null);
                }}
                maxWidth="md"
            >
                        <div className="px-6 pt-6 pb-5 text-center">
                            {/* Success Icon */}
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('tutorDetail.groupClass.successRegistered')}</h3>
                            
                            {/* Message */}
                            <p className="text-sm text-gray-600 mb-1">
                                {t('tutorDetail.groupClass.successMessage')}
                            </p>
                            <p className="text-sm text-gray-600">
                                {t('tutorDetail.groupClass.emailNotification')}
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
                                {t('tutorDetail.groupClass.gotIt')}
                            </button>
                        </div>
            </ModalLayout>

            {/* Leave Confirmation Modal */}
            <ModalLayout
                isOpen={showLeaveModal && selectedClass !== null}
                onClose={() => {
                    setShowLeaveModal(false);
                    setSelectedClass(null);
                }}
                maxWidth="lg"
            >
                {selectedClass && (
                    <div>
                        {/* Header */}
                        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">{t('tutorDetail.groupClass.leaveGroupClass')}</h3>
                            <p className="text-sm text-gray-600 mt-1">{t('tutorDetail.groupClass.confirmLeave')}</p>
                        </div>

                        <div className="px-6 py-5">
                            {/* Class Info */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between gap-4 mb-2">
                                    <p className="text-lg font-bold text-gray-900">{selectedClass.title}</p>
                                    {(selectedClass as any).price && (
                                        <span className="font-bold text-[#0b6459] text-2xl flex-shrink-0">{t('common.currency')}{(selectedClass as any).price}</span>
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
                                        <p className="text-sm font-semibold text-red-900 mb-1">{t('tutorDetail.groupClass.warning')}</p>
                                        <p className="text-sm text-red-800">
                                            {t('tutorDetail.groupClass.leaveWarning')}
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
                                {t('tutorDetail.groupClass.cancel')}
                            </button>
                            <button 
                                onClick={async () => {
                                    if (!selectedClass || !state.user?.id) return;
                                    
                                    setIsLoading(true);
                                    try {
                                        const response = await classService.removeStudentFromClass(selectedClass.id, state.user.id);
                                        if (response.success) {
                                            setShowLeaveModal(false);
                                            setShowLeaveSuccessModal(true);
                                            setJoinedClasses(prev => {
                                                const newSet = new Set(prev);
                                                newSet.delete(selectedClass.id);
                                                return newSet;
                                            });
                                            // Update enrolled students count
                                            setLocalGroupClasses(prev => prev.map(gc => 
                                                gc.id === selectedClass.id 
                                                    ? { ...gc, enrolledStudents: Math.max(0, (gc.enrolledStudents ?? 0) - 1) }
                                                    : gc
                                            ));
                                        } else {
                                            alert(response.message || t('tutorDetail.groupClass.leaveError'));
                                        }
                                    } catch (error) {
                                        console.error('Error leaving class:', error);
                                        alert(t('tutorDetail.groupClass.leaveError'));
                                    } finally {
                                        setIsLoading(false);
                                    }
                                }}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t('tutorDetail.groupClass.leaveClass')}
                            </button>
                        </div>
                    </div>
                )}
            </ModalLayout>

            {/* Leave Success Modal */}
            <ModalLayout
                isOpen={showLeaveSuccessModal}
                onClose={() => {
                    setShowLeaveSuccessModal(false);
                    setSelectedClass(null);
                }}
                maxWidth="md"
            >
                        <div className="px-6 pt-6 pb-5 text-center">
                            {/* Success Icon */}
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('tutorDetail.groupClass.successLeft')}</h3>
                            
                            {/* Message */}
                            <p className="text-sm text-gray-600">
                                {t('tutorDetail.groupClass.leaveSuccessMessage')}
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
                                {t('tutorDetail.groupClass.gotIt')}
                            </button>
                        </div>
            </ModalLayout>
        </div>
    );
};

export default GroupClassSection;
