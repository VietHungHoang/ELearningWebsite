import React, { useState, useEffect } from 'react';
import { FiX, FiCopy, FiCheck } from 'react-icons/fi';
import { useCurrency } from '../../../context/CurrencyContext';
import { formatCurrency } from '../../../utils/currencyHelper';
import paymentService from '../../../services/paymentService';

interface SepayQRModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
    amount: number;
    qrCodeUrl?: string;
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    transferContent?: string;
    orderId?: string;
}

const SepayQRModal: React.FC<SepayQRModalProps> = ({
    isOpen,
    onClose,
    onComplete,
    amount,
    qrCodeUrl = 'https://via.placeholder.com/256x256?text=QR+Code',
    bankName = 'Vietcombank',
    accountName = 'NGUYEN VAN A',
    accountNumber = '1234 5678 9999',
    transferContent = 'BOOKING 5521',
    orderId,

}) => {
    const { selectedCurrency } = useCurrency();
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // Animation states similar to ModalLayout
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            // Small timeout to allow render before animating in
            setTimeout(() => {
                setIsAnimating(true);
            }, 10);
        } else {
            setIsAnimating(false);
            // Wait for animation to finish before unmounting
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Polling for payment status
    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>;

        if (isOpen && orderId) {
            const checkStatus = async () => {
                try {
                    const response = await paymentService.getPaymentStatus(orderId);
                    if (response === 'COMPLETED' || response === 'completed') {
                        onComplete();
                    }
                } catch (error) {
                    console.error("Error checking payment status:", error);
                }
            };

            // Check immediately
            checkStatus();

            // Then poll every 3 seconds
            intervalId = setInterval(checkStatus, 3000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isOpen, orderId, onComplete]);

    const [isQrLoaded, setIsQrLoaded] = useState(false);

    // Reset loading state when QR URL changes
    useEffect(() => {
        setIsQrLoaded(false);
    }, [qrCodeUrl]);

    const handleCopy = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text.replace(/\s/g, ''));
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (!shouldRender) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200 transition-all duration-200 ease-out transform ${isAnimating ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>

                {/* Left Panel: QR & Timer */}
                <div className="w-full md:w-5/12 bg-gray-50 p-5 md:p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">

                    {/* QR Code Container */}
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 mb-4">
                        <div className="relative w-72 h-72 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                            {/* Loading Spinner for QR or OrderId */}
                            {(!isQrLoaded || !orderId) && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                                    <div className="flex flex-col items-center gap-2">
                                        <div
                                            className="animate-spin rounded-full border-b-2 border-[#0b6459]"
                                            style={{ width: 40, height: 40 }}
                                        ></div>
                                        {!orderId && <span className="text-xs text-gray-500 font-medium">Đang tạo đơn hàng...</span>}
                                    </div>
                                </div>
                            )}

                            {orderId && (
                                <img
                                    src={qrCodeUrl}
                                    alt="QR Code thanh toán"
                                    className={`w-full h-full object-cover transition-opacity duration-300 ${isQrLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    onLoad={() => setIsQrLoaded(true)}
                                />
                            )}

                            {/* Center Logo/Image - Only show when QR is loaded */}
                            {isQrLoaded && orderId && (
                                <div className="absolute inset-0 flex items-center justify-center animate-[fadeIn_0.5s_ease-out]">
                                    <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/images/logo-simple.svg"
                                            alt="Logo"
                                            className="w-full h-full object-contain rounded-md"
                                            onError={(e) => {
                                                // Fallback if image fails
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Helper Text */}
                    <div className="text-center px-4">
                        <p className="text-gray-500 text-sm">
                            Sử dụng <strong>App Ngân hàng</strong> hoặc <strong>Camera</strong> để quét mã.
                        </p>
                    </div>
                </div>

                {/* Right Panel: Payment Details */}
                <div className="w-full md:w-7/12 p-5 md:p-6 flex flex-col">

                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-gray-900 text-2xl font-bold tracking-tight mb-1">
                                Thanh toán
                            </h2>
                            <p className="text-gray-500 text-sm">
                                Vui lòng kiểm tra kỹ thông tin trước khi chuyển
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                            <FiX className="text-2xl" />
                        </button>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
                            Tổng thanh toán
                        </p>
                        <div className="flex items-baseline gap-1 text-[#0b6459]">
                            <span className="text-3xl font-bold tracking-tight">
                                {formatCurrency(amount, selectedCurrency)}
                            </span>
                        </div>
                    </div>

                    {/* Bank Details */}
                    <div className="space-y-3 mb-6">
                        {/* Bank Name */}
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500 text-sm">Ngân hàng</span>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-800">{bankName}</span>
                                <img
                                    src="/images/mb-bank-logo.png"
                                    alt="MB Bank Logo"
                                    className="w-10 h-10 object-contain"
                                />
                            </div>
                        </div>

                        {/* Account Holder */}
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500 text-sm">Chủ tài khoản</span>
                            <span className="font-semibold text-gray-800 uppercase">{accountName}</span>
                        </div>

                        {/* Account Number */}
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500 text-sm">Số tài khoản</span>
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-800 text-lg tracking-wide">
                                    {accountNumber}
                                </span>
                                <button
                                    onClick={() => handleCopy(accountNumber, 'account')}
                                    className="text-[#0b6459] hover:text-[#094a42] transition-colors p-1 rounded hover:bg-[#0b6459]/10"
                                    title="Sao chép"
                                >
                                    {copiedField === 'account' ? (
                                        <FiCheck className="text-lg" />
                                    ) : (
                                        <FiCopy className="text-lg" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Transfer Content */}
                        <div className="bg-[#0b6459]/5 p-3 rounded-lg border border-[#0b6459]/10 flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-[#0b6459] text-xs font-medium mb-0.5">
                                    Nội dung chuyển khoản
                                </span>
                                <span className="text-gray-800 font-bold font-mono min-w-[100px] min-h-[24px]">
                                    {orderId ? transferContent : (
                                        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                                    )}
                                </span>
                            </div>
                            <button
                                onClick={() => handleCopy(transferContent, 'content')}
                                className="text-[#0b6459] hover:text-[#094a42] transition-colors p-2 rounded-full hover:bg-[#0b6459]/10 flex items-center gap-1"
                            >
                                <span className="text-xs font-semibold">
                                    {copiedField === 'content' ? 'Đã sao chép' : 'Sao chép'}
                                </span>
                                {copiedField === 'content' ? (
                                    <FiCheck className="text-base" />
                                ) : (
                                    <FiCopy className="text-base" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="mb-6 hidden md:block">
                        <p className="text-gray-900 text-sm font-semibold mb-3">Hướng dẫn:</p>
                        <div className="flex justify-between px-2">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                    1
                                </div>
                                <p className="text-xs text-gray-500 leading-snug">Mở App ngân hàng</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                    2
                                </div>
                                <p className="text-xs text-gray-500 leading-snug">Chọn Quét QR</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                    3
                                </div>
                                <p className="text-xs text-gray-500 leading-snug">Xác nhận thanh toán</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto flex flex-col-reverse sm:flex-row gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            onClick={onComplete}
                            className="cursor-pointer px-8 py-3 rounded-lg bg-[#0b6459] hover:bg-[#094a42] text-white font-bold shadow-lg shadow-[#0b6459]/30 transition-colors flex items-center justify-center gap-2"
                        >
                            <FiCheck className="text-xl" />
                            Đã hoàn tất thanh toán
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SepayQRModal;
