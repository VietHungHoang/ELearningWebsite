import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiLoader, FiArrowRight } from 'react-icons/fi';
import { HiCheckCircle, HiCalendar } from 'react-icons/hi';
import { MdSavings, MdReceipt } from 'react-icons/md';

import { useCurrency } from '../../../../../context/CurrencyContext';
import { convertFromVND, formatCurrency } from '../../../../../utils/currencyHelper';
import type { ClassTable } from '../../../../../types/class';

// Custom currency formatter for VND in pricing cards (shows "tr" for millions)
const formatCurrencyVND = (amount: number, currency: string): string => {
    if (currency === 'VND') {
        if (amount >= 1000000) {
            const millionAmount = amount / 1000000;
            const formatted = millionAmount % 1 === 0
                ? millionAmount.toFixed(0)
                : millionAmount.toFixed(1);
            return `${formatted}tr`;
        } else {
            return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
        }
    } else {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    }
};

interface RenewClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    classData: ClassTable;
}

const packages = [
    { sessions: 5, discount: 0, isBestValue: false, validity: '2 tháng' },
    { sessions: 10, discount: 10, isBestValue: true, validity: '6 tháng' },
    { sessions: 20, discount: 20, isBestValue: false, validity: '1 năm' },
];

const RenewClassModal: React.FC<RenewClassModalProps> = ({ isOpen, onClose, classData }) => {
    const navigate = useNavigate();
    const [selectedPackageIndex, setSelectedPackageIndex] = useState<number | null>(1); // Default to best value
    const [isProcessing, setIsProcessing] = useState(false);
    const { selectedCurrency } = useCurrency();

    // Animation states
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setTimeout(() => {
                setIsAnimating(true);
            }, 10);
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!shouldRender) return null;

    // Get tutor's session fee from class data
    const basePrice = classData.tutor?.currentSessionFee || 300000; // Fallback to 300k VND
    const convertedBasePrice = convertFromVND(basePrice, selectedCurrency);

    const calculatePricePerSession = (discount: number) => {
        return convertedBasePrice * (1 - discount / 100);
    };

    const calculateTotalPrice = (sessions: number, discount: number) => {
        return sessions * calculatePricePerSession(discount);
    };

    const handleCheckout = () => {
        if (selectedPackageIndex === null) return;
        setIsProcessing(true);

        setTimeout(() => {
            setIsProcessing(false);

            const selectedPackage = packages[selectedPackageIndex];
            const pricePerSession = calculatePricePerSession(selectedPackage.discount);
            const totalPrice = calculateTotalPrice(selectedPackage.sessions, selectedPackage.discount);

            // Generate schedule from existing class schedules
            const schedule = classData.schedules.map((s, index) => ({
                sessionNumber: index + 1,
                date: '',
                time: s.time,
                dayOfWeek: s.dayOfWeek
            }));

            // Use existing schedule times for selectedTimes (for backend)
            const selectedTimes = classData.schedules.map(s => {
                // Create a date for next occurrence of this day
                const now = new Date();
                const currentDay = now.getDay();
                const targetDay = s.dayOfWeek === 7 ? 0 : s.dayOfWeek; // Convert 7 (Sunday) to 0
                let daysUntilNext = targetDay - currentDay;
                if (daysUntilNext <= 0) daysUntilNext += 7;

                const nextDate = new Date(now);
                nextDate.setDate(now.getDate() + daysUntilNext);

                const [hours, minutes] = s.time.split(':').map(Number);
                nextDate.setUTCHours(hours, minutes, 0, 0);

                return nextDate.toISOString();
            });

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
                schedule: schedule,
                selectedTimes: selectedTimes
            };

            // Prepare tutor data from class
            const tutorData = {
                id: classData.tutor?.id,
                fullName: classData.tutor?.fullName,
                avatarUrl: classData.tutor?.avatarUrl,
                currentSessionFee: basePrice,
                rating: 5.0,
                reviewCount: 0,
                studentCount: 0,
                bookedSessionsCount: 0,
            };

            // Navigate to checkout with classId for renewal
            navigate('/checkout', {
                state: {
                    bookingData,
                    tutor: tutorData,
                    classId: classData.id, // Pass classId for renewal
                    isRenewal: true
                }
            });
        }, 500);
    };

    const selectedPackage = selectedPackageIndex !== null ? packages[selectedPackageIndex] : null;
    const totalPrice = selectedPackage ? calculateTotalPrice(selectedPackage.sessions, selectedPackage.discount) : 0;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
        >
            {/* Background overlay */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-200 ${isAnimating ? 'opacity-50' : 'opacity-0'
                    }`}
            />

            {/* Modal Container */}
            <div className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-200 ease-out ${isAnimating ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                            Gia hạn lớp học
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Mua thêm buổi học để tiếp tục hành trình học tập của bạn.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500"
                    >
                        <FiX className="text-2xl" />
                    </button>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                    {/* Pricing Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {packages.map((pkg, index) => {
                            const pricePerSession = calculatePricePerSession(pkg.discount);
                            const total = calculateTotalPrice(pkg.sessions, pkg.discount);
                            const isSelected = selectedPackageIndex === index;
                            const pkgOriginalPrice = convertedBasePrice * pkg.sessions;

                            return (
                                <div
                                    key={index}
                                    onClick={() => setSelectedPackageIndex(index)}
                                    className={`group relative flex flex-col rounded-xl p-5 cursor-pointer border-2 transition-all duration-300 ease-out ${isSelected
                                        ? 'border-[#0b6459] bg-white shadow-md shadow-[#0b6459]/10 -translate-y-1'
                                        : 'border-slate-200 bg-white hover:border-[#0b6459]/50 hover:shadow-lg hover:-translate-y-0.5'
                                        }`}
                                >
                                    {/* Badge for Best Value */}
                                    {pkg.isBestValue && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0b6459] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                            PHỔ BIẾN NHẤT
                                        </div>
                                    )}

                                    {/* Selection Ring */}
                                    <div className={`absolute top-6 right-6 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-[#0b6459]' : 'border-slate-300 group-hover:border-[#0b6459]'
                                        }`}>
                                        <div className={`h-3 w-3 rounded-full bg-[#0b6459] transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'
                                            }`}></div>
                                    </div>

                                    <div className={`mb-4 ${pkg.isBestValue ? 'pt-2' : ''}`}>
                                        <h3 className={`text-lg font-bold ${isSelected ? 'text-[#0b6459]' : 'text-slate-900'}`}>
                                            {index === 0 ? 'Gói Khởi Động' : index === 1 ? 'Gói Tiêu Chuẩn' : 'Gói Chuyên Nghiệp'}
                                        </h3>
                                        <p className="text-sm text-slate-500 font-normal">
                                            {index === 0 ? 'Thích hợp để trải nghiệm' : index === 1 ? 'Lộ trình học tập cơ bản' : 'Đầu tư dài hạn, tối ưu chi phí'}
                                        </p>
                                    </div>

                                    <div className="flex items-baseline gap-1 mb-1">
                                        <span className={`font-black tracking-tight text-slate-900 transition-all duration-300 ease-out ${isSelected ? 'text-4xl' : 'text-3xl'}`}>
                                            {formatCurrencyVND(total, selectedCurrency)}
                                        </span>
                                        <span className="text-sm text-slate-500 font-medium">
                                            / {pkg.sessions} buổi
                                        </span>
                                    </div>

                                    {pkg.discount > 0 && (
                                        <div className="text-xs text-slate-400 line-through mb-6">
                                            Giá gốc: {formatCurrencyVND(pkgOriginalPrice, selectedCurrency)}
                                        </div>
                                    )}

                                    <div className="w-full h-px bg-slate-100 mb-6"></div>

                                    <ul className="flex flex-col gap-3 mb-auto">
                                        <li className="flex items-start gap-3 text-sm text-slate-700">
                                            <HiCheckCircle className="text-[#0b6459] text-[20px] flex-shrink-0 mt-0.5" />
                                            <span>
                                                <strong>{formatCurrencyVND(pricePerSession, selectedCurrency)}</strong>/buổi
                                            </span>
                                        </li>
                                        {pkg.discount > 0 && (
                                            <li className="flex items-start gap-3 text-sm text-slate-700">
                                                <MdSavings className="text-green-600 text-[20px] flex-shrink-0 mt-0.5" />
                                                <span className="text-green-600 font-bold">
                                                    Tiết kiệm {pkg.discount}%
                                                </span>
                                            </li>
                                        )}
                                        <li className="flex items-start gap-3 text-sm text-slate-700">
                                            <HiCalendar className="text-slate-400 text-[20px] flex-shrink-0 mt-0.5" />
                                            <span>
                                                Giữ nguyên lịch học hiện tại
                                            </span>
                                        </li>
                                    </ul>

                                    <button
                                        className={`mt-6 w-full py-2.5 rounded-lg font-semibold text-sm transition-all ${isSelected
                                            ? 'bg-[#0b6459] text-white hover:bg-[#084c43] shadow-md shadow-[#0b6459]/30'
                                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {isSelected ? 'Đang chọn' : 'Chọn gói này'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-5 border-t border-slate-100 bg-white shrink-0">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                <MdReceipt className="text-xl" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-slate-500">Tổng thanh toán:</span>
                                <span className="text-xl font-bold text-slate-900">
                                    {formatCurrency(totalPrice, selectedCurrency)}
                                </span>
                            </div>
                        </div>
                        <div className="flex w-full md:w-auto gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 md:flex-none px-6 py-3 rounded-lg border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleCheckout}
                                disabled={selectedPackageIndex === null || isProcessing}
                                className="flex-1 md:flex-none px-8 py-3 rounded-lg bg-[#0b6459] text-white font-bold text-sm hover:bg-[#084c43] transition-all shadow-md shadow-[#0b6459]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <FiLoader className="animate-spin text-lg" />
                                ) : (
                                    <>
                                        <span>Tiếp tục thanh toán</span>
                                        <FiArrowRight className="text-lg" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RenewClassModal;
