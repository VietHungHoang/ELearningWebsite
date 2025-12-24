import React, { useState, useEffect, useMemo } from 'react';
import { FiX, FiCheckCircle, FiChevronLeft, FiChevronRight, FiLoader } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import type { Tutor } from '../../types/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: Tutor;
}

// Mock data: In a real app, this would be fetched based on the selected date.
const mockAvailableSlots = [ '09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '05:00 PM', '07:00 PM' ];

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, tutor }) => {
    const { t } = useTranslation();
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [step, setStep] = useState<'selecting' | 'success'>('selecting');
    const [isBooking, setIsBooking] = useState(false);
    const [displayDate, setDisplayDate] = useState(new Date(2025, 9, 1)); // Default to Oct 2025
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setStep('selecting');
            setIsBooking(false);
            setSelectedDate(null);
            setSelectedTime(null);
            setDisplayDate(new Date(2025, 9, 1));
        } else {
            const timer = setTimeout(() => setShouldRender(false), 300); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };
    
    const handleConfirmBooking = async () => {
        if (!selectedDate || !selectedTime || isBooking) return;
        setIsBooking(true);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
        setIsBooking(false);
        setStep('success');
    };

    const calendarGrid = useMemo(() => {
        const year = displayDate.getFullYear();
        const month = displayDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const grid = [];
        // Add blank cells for days before the 1st of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            grid.push(null);
        }
        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            grid.push(new Date(year, month, i));
        }
        return grid;
    }, [displayDate]);

    const handlePrevMonth = () => setDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    const handleNextMonth = () => setDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    
    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setSelectedTime(null);
    };

    if (!shouldRender) return null;
    
    const weekdays = t('booking.weekdays', { returnObjects: true }) as string[];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <div 
            className={`fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleOverlayClick}
            role="dialog" aria-modal="true"
        >
            <div className={`bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'animate-modal-in' : 'animate-modal-out'}`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <img src={tutor.avatarUrl} alt={tutor.name} className="w-10 h-10 rounded-full" />
                        <div>
                            <h2 className="font-bold text-gray-800">{t('booking.bookTrialLesson')}</h2>
                            <p className="text-sm text-gray-500">{t('booking.withTutor', { tutorName: tutor.name })}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full"><FiX /></button>
                </div>

                {step === 'success' ? (
                    <div className="text-center p-8 sm:p-12">
                        <div className="w-16 h-16 mx-auto"><FiCheckCircle /></div>
                        <h3 className="text-xl font-bold text-gray-800 mt-4">{t('booking.trialLessonBooked')}</h3>
                        <p className="text-gray-600 mt-2">
                            {t('booking.bookingConfirmation', {
                                tutorName: tutor.name,
                                date: selectedDate!.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
                                time: selectedTime
                            })}
                        </p>
                        <button onClick={onClose} className="mt-6 w-full max-w-xs mx-auto bg-[#0b6459] text-white font-bold py-3 rounded-lg hover:bg-[#084c43] btn-scale">{t('booking.done')}</button>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col md:flex-row">
                            {/* Calendar */}
                            <div className="w-full md:w-1/2 p-5 border-b md:border-b-0 md:border-r border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100"><FiChevronLeft /></button>
                                    <p className="font-semibold text-gray-800 text-center">{displayDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</p>
                                    <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100"><FiChevronRight /></button>
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                    {weekdays.map(day => <div key={day} className="font-medium text-gray-500 py-1">{day[0]}</div>)}
                                    {calendarGrid.map((date, index) => (
                                        <div key={index} className="flex justify-center items-center h-9">
                                            {date && (
                                                <button
                                                    onClick={() => handleDateSelect(date)}
                                                    disabled={date < today}
                                                    className={`w-9 h-9 rounded-full font-semibold transition-colors disabled:text-gray-300 disabled:cursor-not-allowed ${
                                                        selectedDate?.getTime() === date.getTime() 
                                                            ? 'bg-[#0b6459] text-white' 
                                                            : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {date.getDate()}
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Time Slots */}
                            <div className="w-full md:w-1/2 p-5">
                                {selectedDate ? (
                                    <>
                                        <h3 className="font-semibold text-gray-800 mb-3">{t('booking.availableTimesFor', { date: selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) })}</h3>
                                        <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto custom-scrollbar pr-2 -mr-2">
                                            {mockAvailableSlots.map(time => {
                                                const isSelected = selectedTime === time;
                                                return (
                                                    <button
                                                        key={time}
                                                        onClick={() => setSelectedTime(time)}
                                                        className={`py-2 rounded-lg font-semibold text-sm border transition-all duration-200 ${
                                                            isSelected ? 'bg-[#0b6459] text-white border-transparent shadow-md' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                                                        }`}
                                                    >
                                                        {time}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                                        <svg className="w-12 h-12 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        <p className="font-semibold">{t('booking.selectDate')}</p>
                                        <p className="text-xs">{t('booking.selectDateDescription')}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-sm text-center sm:text-left">
                                {selectedDate && selectedTime ? (
                                    <>
                                        <p className="font-semibold text-gray-800">{selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}</p>
                                        <p className="text-gray-500">{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at <span className="font-medium text-gray-600">{selectedTime}</span></p>
                                    </>
                                ) : (
                                    <p className="font-medium text-gray-500">{t('booking.pleaseSelectDateTime')}</p>
                                )}
                            </div>
                            <button
                                onClick={handleConfirmBooking}
                                disabled={!selectedTime || isBooking}
                                className="bg-[#0b6459] text-white font-bold py-3 px-6 rounded-lg min-w-[180px] h-[48px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed btn-scale"
                            >
                                {isBooking ? <FiLoader className="h-5 w-5 text-white animate-spin" /> : t('booking.confirmBooking')}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingModal;
