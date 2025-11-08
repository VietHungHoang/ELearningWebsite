import React, { useState, useEffect } from 'react';
import { IoClose, IoChevronBack, IoChevronForward, IoCheckmarkCircle, IoReload } from 'react-icons/io5';
import type { Tutor } from '../../../../types/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: Tutor;
}

const mockAvailableSlots = [ '09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '05:00 PM', '07:00 PM' ];

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, tutor }) => {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [step, setStep] = useState<'selecting' | 'success'>('selecting');
    const [isBooking, setIsBooking] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ date: Date, time: string } | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 20)); // Start on a Monday

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setStep('selecting');
            setSelectedSlot(null);
            setIsBooking(false);
            setCurrentDate(new Date(2025, 9, 20));
        } else {
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleSlotSelect = (date: Date, time: string) => {
        if (isBooking) return;
        if (selectedSlot && selectedSlot.date.getTime() === date.getTime() && selectedSlot.time === time) {
            setSelectedSlot(null); // Deselect if same slot is clicked
        } else {
            setSelectedSlot({ date, time });
        }
    };
    
    const handleConfirmBooking = async () => {
        if (!selectedSlot || isBooking) return;
        setIsBooking(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsBooking(false);
        setStep('success');
    };
    
    // --- Calendar Logic ---
    const getWeekRange = (date: Date) => {
        const startDate = new Date(date);
        const dayOfWeek = startDate.getDay();
        const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday
        startDate.setDate(diff);
        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(startDate);
            day.setDate(startDate.getDate() + i);
            return day;
        });
    };
    const [weekDays, setWeekDays] = useState(getWeekRange(currentDate));

    const goToNextWeek = () => {
        const nextWeekDate = new Date(currentDate);
        nextWeekDate.setDate(currentDate.getDate() + 7);
        setCurrentDate(nextWeekDate);
        setWeekDays(getWeekRange(nextWeekDate));
    };

    const goToPrevWeek = () => {
        const prevWeekDate = new Date(currentDate);
        prevWeekDate.setDate(currentDate.getDate() - 7);
        setCurrentDate(prevWeekDate);
        setWeekDays(getWeekRange(prevWeekDate));
    };
    
    const formatDate = (date: Date, options: Intl.DateTimeFormatOptions) => date.toLocaleDateString('en-US', options);
    
    return (
        <div 
            className={`fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleOverlayClick}
            role="dialog" aria-modal="true"
        >
            <div className={`bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'animate-modal-in' : 'animate-modal-out'}`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <img src={tutor.avatarUrl} alt={tutor.name} className="w-10 h-10 rounded-full" />
                        <div>
                            <h2 className="font-bold text-gray-800">Book a Trial Lesson</h2>
                            <p className="text-sm text-gray-500">with {tutor.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full">
                        <IoClose />
                    </button>
                </div>

                {step === 'success' ? (
                    <div className="text-center p-8 sm:p-12">
                        <div className="w-16 h-16 mx-auto"><IoCheckmarkCircle /></div>
                        <h3 className="text-xl font-bold text-gray-800 mt-4">Trial Lesson Booked!</h3>
                        <p className="text-gray-600 mt-2">
                            Your trial lesson with <span className="font-semibold">{tutor.name}</span> is confirmed for <span className="font-semibold">{formatDate(selectedSlot!.date, { weekday: 'long', month: 'long', day: 'numeric' })}</span> at <span className="font-semibold">{selectedSlot!.time}</span>.
                        </p>
                        <button onClick={onClose} className="mt-6 w-full bg-[#0b6459] text-white font-bold py-3 rounded-lg hover:bg-[#084c43] btn-scale">Done</button>
                    </div>
                ) : (
                    <>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <button onClick={goToPrevWeek} className="p-2 rounded-full hover:bg-gray-100"><IoChevronBack /></button>
                                <p className="font-semibold text-gray-800 text-center">
                                    {formatDate(weekDays[0], { month: 'long', day: 'numeric' })} - {formatDate(weekDays[6], { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                                <button onClick={goToNextWeek} className="p-2 rounded-full hover:bg-gray-100"><IoChevronForward /></button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center">
                                {weekDays.map(day => (
                                    <div key={day.toISOString()}>
                                        <p className="text-xs font-bold text-gray-500">{formatDate(day, { weekday: 'short' })}</p>
                                        <p className={`font-semibold mt-1 ${formatDate(day, { day: 'numeric' }) === formatDate(new Date(), { day: 'numeric' }) ? 'text-[#0b6459]' : ''}`}>
                                            {formatDate(day, { day: 'numeric' })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                             <div className="grid grid-cols-7 gap-1 mt-2 h-72 overflow-y-auto custom-scrollbar pr-2 -mr-2">
                                {weekDays.map(day => (
                                    <div key={day.toISOString()} className="space-y-1.5 p-0.5">
                                        {mockAvailableSlots.map(time => {
                                            const isSelected = selectedSlot?.date.getTime() === day.getTime() && selectedSlot?.time === time;
                                            return (
                                                <button 
                                                    key={time}
                                                    onClick={() => handleSlotSelect(day, time)}
                                                    className={`w-full text-xs py-2 rounded-md font-semibold transition-all duration-200 border ${
                                                        isSelected 
                                                        ? 'bg-[#0b6459] text-white border-transparent shadow-md' 
                                                        : 'bg-[#F9F3EB] text-gray-700 border-transparent hover:bg-[#e9e0d4] hover:border-[#d1c8bd]'
                                                    }`}
                                                >
                                                    {time}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex justify-between items-center">
                            <div className="text-sm">
                                {selectedSlot ? (
                                    <>
                                        <p className="font-semibold text-gray-800">{formatDate(selectedSlot.date, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                        <p className="text-gray-500">Time: <span className="font-medium text-gray-600">{selectedSlot.time}</span></p>
                                    </>
                                ) : (
                                    <p className="font-medium text-gray-500">Please select a time slot to proceed.</p>
                                )}
                            </div>
                            <button
                                onClick={handleConfirmBooking}
                                disabled={!selectedSlot || isBooking}
                                className="bg-[#0b6459] text-white font-bold py-3 px-6 rounded-lg min-w-[180px] h-[48px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed btn-scale"
                            >
                                {isBooking ? <IoReload className="h-5 w-5 text-white animate-spin" /> : 'Confirm Booking'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingModal;