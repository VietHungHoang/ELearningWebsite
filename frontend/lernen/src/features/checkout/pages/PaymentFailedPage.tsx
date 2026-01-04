import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useCurrency } from "../../../context/CurrencyContext";
import { formatCurrency } from "../../../utils/currencyHelper";
import HeaderNoNavbar from "../../../components/ui/HeaderNoNavbar";
import { FiXCircle, FiRefreshCw, FiCreditCard, FiHelpCircle } from "react-icons/fi";
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

interface PaymentFailedData {
    orderId?: string;
    packageName?: string;
    totalPrice?: number;
    errorMessage?: string;
    paymentParams?: PaymentParams;
}

const PaymentFailedPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { selectedCurrency } = useCurrency();
    const [apiCalled, setApiCalled] = useState(false);

    // Get data from navigation state OR URL query params
    const paymentData: PaymentFailedData = useMemo(() => {
        const stateData = location.state || {};
        return {
            orderId: stateData.orderId || searchParams.get('orderId') || `TRX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            packageName: stateData.packageName || searchParams.get('packageName') || "Gói học đã đặt",
            totalPrice: stateData.totalPrice || Number(searchParams.get('totalPrice')) || 0,
            errorMessage: stateData.errorMessage || searchParams.get('errorMessage') || "Vui lòng kiểm tra lại thông tin thẻ hoặc số dư tài khoản của bạn.",
            paymentParams: stateData.paymentParams,
        };
    }, [location.state, searchParams]);

    const { orderId, packageName, totalPrice, errorMessage, paymentParams } = paymentData;

    // Call confirm API in background to record failed payment status
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
                console.log('Failed payment recorded');
            } catch (error) {
                console.error('Error recording failed payment:', error);
            }
        };

        setApiCalled(true);
        confirmPayment();
    }, [paymentParams, apiCalled]);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleRetry = () => {
        navigate(-1); // Go back to checkout page
    };

    const handleChangeMethod = () => {
        navigate(-1); // Go back to checkout to select different method
    };

    return (
        <div className="min-h-screen bg-[#F8F7F4] font-sans flex flex-col">
            {/* Header */}
            <HeaderNoNavbar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 py-8">
                <div className="w-full max-w-lg flex flex-col gap-4">

                    {/* Failed Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">

                        {/* Error Icon */}
                        <div className="rounded-full bg-red-50 p-4 mb-4">
                            <FiXCircle className="text-4xl text-red-500" />
                        </div>

                        {/* Text Content */}
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
                            Thanh toán thất bại
                        </h1>
                        <p className="text-gray-500 text-sm mb-5 max-w-sm mx-auto leading-relaxed">
                            Rất tiếc, giao dịch của bạn không thể thực hiện. {errorMessage}
                        </p>

                        {/* Order Summary Box */}
                        <div className="w-full bg-[#F8F7F4] rounded-lg p-3 mb-5 border border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-500">Gói dịch vụ</span>
                                <span className="text-sm font-medium text-gray-700">{packageName}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-500">Tổng tiền</span>
                                <span className="text-sm font-bold text-gray-700">{formatCurrency(totalPrice || 0, selectedCurrency)}</span>
                            </div>
                            <div className="w-full h-px bg-gray-200 my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">Mã giao dịch</span>
                                <span className="text-xs font-mono text-gray-500">#{orderId}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 w-full">
                            <button
                                onClick={handleRetry}
                                className="w-full cursor-pointer flex items-center justify-center gap-2 rounded-lg h-11 px-4 bg-[#0b6459] hover:bg-[#094a42] text-white text-sm font-semibold transition-colors"
                            >
                                <FiRefreshCw className="text-base" />
                                Thử lại thanh toán
                            </button>
                            <button
                                onClick={handleChangeMethod}
                                className="w-full cursor-pointer flex items-center justify-center gap-2 rounded-lg h-11 px-4 bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition-colors"
                            >
                                <FiCreditCard className="text-base" />
                                Chọn phương thức khác
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
                                Liên hệ ngay cho chúng tôi qua hotline <span className="text-[#0b6459] font-semibold">0388729273</span> nếu cần hỗ trợ.
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

export default PaymentFailedPage;
