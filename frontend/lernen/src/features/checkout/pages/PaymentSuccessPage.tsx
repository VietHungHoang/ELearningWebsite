import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useCurrency } from "../../../context/CurrencyContext";
import { formatCurrency } from "../../../utils/currencyHelper";
import Avatar from "react-avatar";
import HeaderNoNavbar from "../../../components/ui/HeaderNoNavbar";
import { FiCheckCircle, FiHelpCircle, FiHome, FiCalendar } from "react-icons/fi";
import paymentService from "../../../services/paymentService";

interface PaymentParams {
    orderId?: string;
    partnerCode?: string;
    orderInfo?: string;
    orderType?: string;
    resultCode?: string;
    message?: string;
    payType?: string;
    responseTime?: string;
    signature?: string;
    amount?: string;
}

interface PaymentSuccessData {
    orderId?: string;
    packageName?: string;
    tutorName?: string;
    tutorAvatar?: string;
    totalPrice?: number;
    sessions?: number;
    email?: string;
    paymentParams?: PaymentParams;
}

const PaymentSuccessPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { state: authState } = useAuth();
    const { selectedCurrency } = useCurrency();

    const [countdown, setCountdown] = useState(5);
    const [apiCalled, setApiCalled] = useState(false);

    // Get data from navigation state OR URL query params
    const paymentData: PaymentSuccessData = useMemo(() => {
        const stateData = location.state || {};

        // Construct paymentParams from URL if not in state
        let derivedPaymentParams = stateData.paymentParams;
        if (!derivedPaymentParams) {
            const resultCode = searchParams.get('resultCode') || searchParams.get('vnp_ResponseCode');
            const orderId = searchParams.get('orderId');
            if (orderId && resultCode) {
                derivedPaymentParams = {
                    orderId,
                    partnerCode: searchParams.get('partnerCode'),
                    orderInfo: searchParams.get('orderInfo'),
                    orderType: searchParams.get('orderType'),
                    resultCode,
                    message: searchParams.get('message'),
                    payType: searchParams.get('payType'),
                    responseTime: searchParams.get('responseTime'),
                    signature: searchParams.get('signature'),
                    amount: searchParams.get('amount'),
                };
            }
        }

        return {
            orderId: stateData.orderId || searchParams.get('orderId') || `DH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            packageName: stateData.packageName || searchParams.get('packageName') || "Gói học đã đặt",
            tutorName: stateData.tutorName || searchParams.get('tutorName') || "Gia sư",
            tutorAvatar: stateData.tutorAvatar || searchParams.get('tutorAvatar') || undefined,
            totalPrice: stateData.totalPrice || Number(searchParams.get('totalPrice')) || 0,
            sessions: stateData.sessions || Number(searchParams.get('sessions')) || 1,
            email: stateData.email || authState.user?.email || "your@email.com",
            paymentParams: derivedPaymentParams,
        };
    }, [location.state, searchParams, authState.user?.email]);

    const { orderId, packageName, tutorName, tutorAvatar, totalPrice, email, paymentParams } = paymentData;

    // Call confirm API in background if paymentParams is present
    useEffect(() => {
        if (apiCalled || !paymentParams?.orderId) return;

        const confirmPayment = async () => {
            try {
                const responseTime = paymentParams.responseTime
                    ? new Date(parseInt(paymentParams.responseTime)).toISOString()
                    : undefined;

                await paymentService.verifyPayment({
                    orderId: paymentParams.orderId ?? undefined,
                    partnerCode: paymentParams.partnerCode ?? undefined,
                    orderInfo: paymentParams.orderInfo ?? undefined,
                    orderType: paymentParams.orderType ?? undefined,
                    resultCode: paymentParams.resultCode ?? undefined,
                    message: paymentParams.message ?? undefined,
                    payType: paymentParams.payType ?? undefined,
                    responseTime,
                    signature: paymentParams.signature ?? undefined,
                });
                console.log('Payment confirmed successfully');
            } catch (error) {
                console.error('Error confirming payment:', error);
                // Still show success UI even if confirm fails - user already paid
            }
        };

        setApiCalled(true);
        confirmPayment();
    }, [paymentParams, apiCalled]);

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) {
            navigate("/dashboard/my-bookings");
            return;
        }

        const timer = setTimeout(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown, navigate]);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleGoToSchedule = () => {
        navigate("/student/schedule");
    };

    const handleGoHome = () => {
        navigate("/");
    };

    const progressWidth = (countdown / 5) * 100;

    return (
        <div className="h-screen bg-[#F8F7F4] font-sans flex flex-col overflow-hidden">
            {/* Header */}
            <HeaderNoNavbar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-lg flex flex-col gap-4">

                    {/* Success Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">

                        {/* Icon */}
                        <div className="rounded-full bg-[#0b6459]/10 p-3 mb-4">
                            <FiCheckCircle className="text-4xl text-[#0b6459]" />
                        </div>

                        {/* Text Content */}
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
                            Thanh toán thành công!
                        </h1>
                        <p className="text-gray-500 text-sm mb-5 max-w-sm mx-auto leading-relaxed">
                            Cảm ơn bạn đã tin tưởng gia sư của chúng tôi. Lớp học đã được kích hoạt. Hóa đơn đã được gửi tới{" "}
                            <span className="font-medium text-gray-700">{email}</span>
                        </p>

                        {/* Order Summary Box */}
                        <div className="w-full bg-[#F8F7F4] rounded-lg p-3 mb-5 border border-gray-100 flex items-center gap-3 text-left">
                            <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                                {tutorAvatar ? (
                                    <img src={tutorAvatar} alt={tutorName} className="w-full h-full object-cover" />
                                ) : (
                                    <Avatar name={tutorName} size="56" round="8px" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-gray-900 font-semibold text-sm truncate">
                                    {packageName}
                                </h3>
                                <p className="text-gray-500 text-xs mb-1">
                                    Giảng viên: {tutorName}
                                </p>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <span className="bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-600 text-[10px]">
                                        #{orderId}
                                    </span>
                                    <span className="font-medium text-gray-700">{formatCurrency(totalPrice || 0, selectedCurrency)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Redirect / Progress */}
                        <div className="max-w-sm flex flex-col gap-2 mb-7 mt-2 w-full">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-medium text-gray-600">
                                    Chuyển hướng về Lịch học
                                </span>
                                <span className="text-sm font-bold text-[#0b6459]">{countdown}s</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#0b6459] rounded-full transition-all duration-1000 ease-linear"
                                    style={{ width: `${progressWidth}%` }}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 w-full justify-center">
                            <button
                                onClick={handleGoToSchedule}
                                className="flex-1 cursor-pointer flex items-center justify-center gap-2 rounded-lg h-11 px-4 bg-[#0b6459] hover:bg-[#094a42] text-white text-sm font-semibold transition-colors"
                            >
                                <FiCalendar className="text-base" />
                                Đến Lịch Học
                            </button>
                            <button
                                onClick={handleGoHome}
                                className="flex-1 cursor-pointer flex items-center justify-center gap-2 rounded-lg h-11 px-4 bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition-colors"
                            >
                                <FiHome className="text-base" />
                                Về Trang Chủ
                            </button>
                        </div>
                    </div>

                    {/* Support Panel */}
                    <div className="bg-white rounded-lg border border-gray-100 p-3 flex items-center justify-between gap-3">
                        <div className="flex flex-col gap-0.5">
                            <h4 className="text-gray-900 font-semibold text-sm">
                                Bạn cần hỗ trợ?
                            </h4>
                            <p className="text-gray-500 text-xs">
                                Liên hệ ngay cho chúng tôi qua hotline <span className="text-[#0b6459] font-semibold">0388729273</span> nếu có sai sót.
                            </p>
                        </div>
                        <a
                            href="#"
                            className="flex items-center gap-1.5 text-[#0b6459] font-semibold text-xs hover:underline shrink-0"
                        >
                            <FiHelpCircle className="text-base" />
                            Hỗ trợ
                        </a>
                    </div>

                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto border-t border-gray-100 bg-white py-6 px-6 text-center">
                <p className="text-gray-400 text-sm">
                    © 2026 Lernen Inc. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default PaymentSuccessPage;


