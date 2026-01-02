import React, { useState, useEffect } from 'react';
import { FiX, FiCheckCircle, FiLoader } from 'react-icons/fi';
import ModalLayout from '../../../../components/ui/ModalLayout';
import Avatar from 'react-avatar';
import { useCurrency } from '../../../../context/CurrencyContext';
import { convertFromVND, formatCurrency } from '../../../../utils/currencyHelper';
import { useTranslation } from 'react-i18next';
import type { Timezone } from '../../../../types/common';
import type { Tutor } from '../../../../types/tutor';

interface BookSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    tutorData?: any;
    navigateToApp: (page: string, data?: any) => void;
    selectedTimes?: string[];
    timezone?: Timezone | null;
}

const packages = [
    { sessions: 5, discount: 0, isBestValue: false },
    { sessions: 10, discount: 10, isBestValue: true },
    { sessions: 20, discount: 15, isBestValue: false },
    { sessions: 30, discount: 20, isBestValue: false },
];

const BookSessionModal: React.FC<BookSessionModalProps> = ({ isOpen, onClose, tutorData, navigateToApp, selectedTimes = [], timezone }) => {
    const [tutor, setTutor] = useState<Tutor | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedPackageIndex, setSelectedPackageIndex] = useState<number | null>(1); // Default to best value
    const [isProcessing, setIsProcessing] = useState(false);
    const { selectedCurrency } = useCurrency();
    const { t } = useTranslation();

    useEffect(() => {
        if (!isOpen) return;
        if (tutorData) {
            setTutor(tutorData);
            setLoading(false);
            setError(null);
        }
    }, [isOpen, tutorData]);

    // Don't render anything if modal is not open
    if (!isOpen) return null;

    if (loading || !tutor) {
        return null; // Return null instead of loading div when tutor data is not yet available
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Convert base price from VND to selected currency
    const convertedBasePrice = convertFromVND(tutor.currentSessionFee, selectedCurrency);

    // Calculate price per session after discount (in selected currency)
    const calculatePricePerSession = (discount: number) => {
        const discountedPrice = convertedBasePrice * (1 - discount / 100);
        return discountedPrice;
    };

    // Calculate total price (in selected currency)
    const calculateTotalPrice = (sessions: number, discount: number) => {
        const pricePerSession = calculatePricePerSession(discount);
        return sessions * pricePerSession;
    };

    const handleCheckout = () => {
        if (selectedPackageIndex === null) return;
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);

            const selectedPackage = packages[selectedPackageIndex];
            const pricePerSession = calculatePricePerSession(selectedPackage.discount);
            const totalPrice = calculateTotalPrice(selectedPackage.sessions, selectedPackage.discount);

            // Helper function to convert UTC ISO string to selected timezone for display
            const convertUTCToTimezoneTime = (utcISOString: string, timezone: Timezone | null): string => {
                const utcDate = new Date(utcISOString);

                if (!timezone) {
                    // No timezone, just format UTC time
                    const hour = utcDate.getUTCHours();
                    const minute = utcDate.getUTCMinutes();
                    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
                }

                // Get UTC components
                const utcYear = utcDate.getUTCFullYear();
                const utcMonth = utcDate.getUTCMonth();
                const utcDay = utcDate.getUTCDate();
                const utcHour = utcDate.getUTCHours();
                const utcMinute = utcDate.getUTCMinutes();

                // Apply timezone offset
                const offsetMatch = timezone.offset.match(/([+-])(\d{1,2}):(\d{2})/);
                if (!offsetMatch) {
                    const hour12 = utcHour === 0 ? 12 : utcHour > 12 ? utcHour - 12 : utcHour;
                    const ampm = utcHour >= 12 ? 'PM' : 'AM';
                    return `${hour12}:${utcMinute.toString().padStart(2, '0')} ${ampm}`;
                }

                const sign = offsetMatch[1] === "+" ? 1 : -1;
                const offsetHours = parseInt(offsetMatch[2]);
                const offsetMinutes = parseInt(offsetMatch[3]);

                // Create local date with offset
                const localDate = new Date(Date.UTC(
                    utcYear,
                    utcMonth,
                    utcDay,
                    utcHour + sign * offsetHours,
                    utcMinute + sign * offsetMinutes
                ));

                const displayHour = localDate.getUTCHours();
                const displayMinute = localDate.getUTCMinutes();
                const hour12 = displayHour === 0 ? 12 : displayHour > 12 ? displayHour - 12 : displayHour;
                const ampm = displayHour >= 12 ? 'PM' : 'AM';

                return `${hour12}:${displayMinute.toString().padStart(2, '0')} ${ampm}`;
            };

            // Generate learning schedule based on selected times or fallback to weekly
            const generateSchedule = (totalSessions: number, selectedTimes: string[], timezone: Timezone | null) => {
                const schedule = [];
                console.log(JSON.parse(JSON.stringify(selectedTimes)));

                // Use selected times if available, otherwise fall back to mock schedule
                if (selectedTimes && selectedTimes.length > 0) {
                    // Calculate how many full cycles we need
                    const cycleLength = selectedTimes.length;
                    const fullCycles = Math.floor(totalSessions / cycleLength);
                    const remainingSessions = totalSessions % cycleLength;

                    let sessionCount = 0;

                    // Generate sessions for each cycle
                    for (let cycle = 0; cycle <= fullCycles; cycle++) {
                        for (let timeIndex = 0; timeIndex < cycleLength; timeIndex++) {
                            if (sessionCount >= totalSessions) break;

                            // Skip remaining sessions if we're in the last partial cycle
                            if (cycle === fullCycles && timeIndex >= remainingSessions) break;

                            const selectedTime = selectedTimes[timeIndex];
                            // selectedTime is already UTC ISO string
                            const baseDate = new Date(selectedTime);

                            // Add weeks for subsequent cycles (keeping in UTC)
                            const sessionDate = new Date(baseDate);
                            sessionDate.setUTCDate(baseDate.getUTCDate() + (cycle * 7));

                            // Convert to ISO string for the helper function
                            const sessionISOString = sessionDate.toISOString();

                            // For date display, use UTC components
                            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                            const dayName = dayNames[sessionDate.getUTCDay()];
                            const monthName = monthNames[sessionDate.getUTCMonth()];
                            const day = sessionDate.getUTCDate();
                            const year = sessionDate.getUTCFullYear();
                            const timeString = convertUTCToTimezoneTime(sessionISOString, timezone);

                            schedule.push({
                                sessionNumber: sessionCount + 1,
                                date: `${dayName}, ${monthName} ${day}, ${year}`,
                                time: timeString
                            });

                            sessionCount++;
                        }
                    }
                } else {
                    // Fallback to mock schedule if no selected times
                    const now = new Date();
                    // Find next Monday
                    const nextMonday = new Date(now);
                    nextMonday.setDate(now.getDate() + (1 - now.getDay() + 7) % 7);
                    if (nextMonday <= now) {
                        nextMonday.setDate(nextMonday.getDate() + 7);
                    }

                    for (let i = 0; i < Math.min(totalSessions, 5); i++) { // Show first 5 sessions
                        const sessionDate = new Date(nextMonday);
                        sessionDate.setDate(nextMonday.getDate() + (i * 7)); // Weekly

                        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                        const dayName = dayNames[sessionDate.getDay()];
                        const monthName = monthNames[sessionDate.getMonth()];
                        const day = sessionDate.getDate();
                        const year = sessionDate.getFullYear();

                        schedule.push({
                            sessionNumber: i + 1,
                            date: `${dayName}, ${monthName} ${day}, ${year}`,
                            time: "10:00 AM" // Default time, could be made configurable
                        });
                    }
                }
                return schedule;
            };

            const schedule = generateSchedule(selectedPackage.sessions, selectedTimes, timezone || null);

            const bookingData = {
                package: selectedPackage,
                pricing: {
                    pricePerSession: pricePerSession,
                    totalPrice: totalPrice,
                    originalPrice: convertedBasePrice * selectedPackage.sessions,
                    discountAmount: (convertedBasePrice * selectedPackage.sessions) - totalPrice,
                    currency: selectedCurrency
                },
                sessions: selectedPackage.sessions,
                schedule: schedule
            };

            navigateToApp('checkout', { bookingData, tutor: tutorData });
        }, 500); // Simulate API call
    };

    const selectedPackage = selectedPackageIndex !== null ? packages[selectedPackageIndex] : null;
    const totalPrice = selectedPackage ? calculateTotalPrice(selectedPackage.sessions, selectedPackage.discount) : 0;

    return (
        <ModalLayout
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="flex flex-col overflow-hidden w-full max-w-2xl min-w-[400px]">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <Avatar
                            src={tutor.avatarUrl}
                            name={tutor.fullName}
                            size="48"
                            round="8px"
                            className="w-12 h-12"
                        />
                        <div>
                            <h2 className="font-bold text-base text-gray-800">{t('tutorDetail.bookSessionModal.title')}</h2>
                            <p className="text-sm text-gray-500">{t('tutorDetail.bookSessionModal.withTutor', { tutorName: tutor.fullName })}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full"><FiX /></button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <h3 className="text-lg font-bold text-center text-gray-800">{t('tutorDetail.bookSessionModal.choosePackage')}</h3>
                    <p className="text-center text-gray-500 mt-1">{t('tutorDetail.bookSessionModal.commitMessage')}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        {packages.map((pkg, index) => {
                            const pricePerSession = calculatePricePerSession(pkg.discount);
                            const total = calculateTotalPrice(pkg.sessions, pkg.discount);
                            const isSelected = selectedPackageIndex === index;

                            return (
                                <button
                                    key={index}
                                    onClick={() => setSelectedPackageIndex(index)}
                                    className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none ${isSelected
                                        ? 'border-transparent bg-[#0b6459] text-white shadow-lg transform scale-105'
                                        : 'bg-gray-50 border-gray-200 hover:border-[#0b6459]/50 hover:bg-white'
                                        }`}
                                >
                                    {pkg.isBestValue && (
                                        <div className={`absolute top-0 right-4 -translate-y-1/2 px-3 py-1 text-xs font-bold rounded-full border-2 ${isSelected ? 'bg-white text-[#0b6459] border-[#0b6459]' : 'bg-[#0b6459] text-white border-white'}`}>
                                            {t('tutorDetail.bookSessionModal.bestValue')}
                                        </div>
                                    )}

                                    <h4 className="text-lg font-bold">{pkg.sessions} {t('tutorDetail.bookSessionModal.sessions')}</h4>
                                    <p className={`text-sm ${isSelected ? 'text-gray-200' : 'text-gray-500'}`}>{formatCurrency(pricePerSession, selectedCurrency)}{t('tutorDetail.bookSessionModal.perSession')}</p>

                                    <div className="mt-4 flex items-baseline gap-2">
                                        <p className="text-xl font-extrabold">{formatCurrency(total, selectedCurrency)}</p>
                                        {pkg.discount > 0 && (
                                            <span className={`font-semibold text-sm ${isSelected ? 'text-green-300' : 'text-green-600'}`}>{t('tutorDetail.bookSessionModal.savePercent', { percent: pkg.discount })}</span>
                                        )}
                                    </div>

                                    {isSelected && (
                                        <div className="absolute top-4 right-4 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                            <div className="w-4 h-4 text-white"><FiCheckCircle /></div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <p className="text-xs text-gray-500">{t('tutorDetail.bookSessionModal.securePayments')}</p>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={selectedPackageIndex === null || isProcessing}
                        className="w-full bg-[#0b6459] text-white font-bold py-4 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed btn-scale"
                    >
                        {isProcessing ? (
                            <FiLoader className="h-5 w-5 text-white animate-spin" />
                        ) : (
                            <span>{t('tutorDetail.bookSessionModal.proceedToCheckout', { price: formatCurrency(totalPrice, selectedCurrency) })}</span>
                        )}
                    </button>
                </div>
            </div>
        </ModalLayout>
    );
};

export default BookSessionModal;
