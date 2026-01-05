import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
    HiStar, 
    HiCheckCircle, 
    HiArrowLeft, 
    HiArrowRight,
    HiCalendar,
    HiClock,
    HiSupport,
    HiLockClosed,
    HiCurrencyDollar,
    HiTag,
    HiSparkles
} from 'react-icons/hi';

interface SessionPackagePageProps {
    tutorId?: string;
}

interface LocationState {
    tutorData?: any;
    selectedTimes?: string[];
    timezone?: any;
}

// Discount tiers based on session count
const DISCOUNT_TIERS = [
    { minSessions: 5, maxSessions: 9, discount: 0 },
    { minSessions: 10, maxSessions: 19, discount: 10 },
    { minSessions: 20, maxSessions: 29, discount: 15 },
    { minSessions: 30, maxSessions: 49, discount: 20 },
    { minSessions: 50, maxSessions: 100, discount: 25 },
];

const SLIDER_MARKS = [5, 10, 20, 30, 50];

export default function SessionPackagePage({ tutorId: propTutorId }: SessionPackagePageProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { tutorId: paramTutorId } = useParams<{ tutorId: string }>();
    const tutorId = propTutorId || paramTutorId;
    
    // Get data from location state
    const locationState = location.state as LocationState;
    const tutorDataFromState = locationState?.tutorData;

    const [sessionCount, setSessionCount] = useState(15);
    
    // Use tutor data from state if available, otherwise use mock data
    const tutor = tutorDataFromState || {
        id: tutorId,
        name: 'Sarah Nguyễn',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOLN0f4LYZDfQrH7psKOd_5Zx5QwScX7z4WrLNdt2so-FD7TjZ059o8OwXbbSJHrteVFc2uM0qgcFbT3wVyJyBFayUHvILm59bsuseAEqbwnH4KksYepNEUqIjKNbVmM36RNtA24P1ee5mAbBg37F7BIhtxXJzwVbZfnoqIPPstavWLO9No6EXtvfbAf8kEuyeez7AZQrh2OCMK4bJNFmdfvFytj9HYAQHnDGcYVNeZM-UkHSaJgRQq9eAxuWfynfiBwbzkZEXM4A',
        title: 'IELTS 8.5 • Chuyên luyện thi và giao tiếp nâng cao',
        rating: 4.9,
        reviewCount: 128,
        pricePerSession: 200000,
        isVerified: true
    };

    // Map tutor data fields
    const tutorName = tutor.fullName || tutor.name;
    const tutorAvatar = tutor.profilePictureUrl || tutor.avatar;
    const tutorRating = tutor.averageRating || tutor.rating || 0;
    const tutorReviewCount = tutor.totalReviews || tutor.reviewCount || 0;
    const tutorTitle = tutor.bio || tutor.title || '';
    const basePrice = tutor.hourlyRate || tutor.pricePerSession || 200000;
    const isVerified = tutor.isVerified !== undefined ? tutor.isVerified : true;
    
    // Calculate discount
    const getDiscount = (count: number) => {
        const tier = DISCOUNT_TIERS.find(t => count >= t.minSessions && count <= t.maxSessions);
        return tier?.discount || 0;
    };

    const discount = getDiscount(sessionCount);
    const totalOriginal = basePrice * sessionCount;
    const discountAmount = totalOriginal * (discount / 100);
    const totalFinal = totalOriginal - discountAmount;
    const pricePerSession = totalFinal / sessionCount;
    const savings = discountAmount;
    const savingsPerSession = basePrice - pricePerSession;

    // Slider calculation
    const minSessions = 5;
    const maxSessions = 50;
    const sliderPercentage = ((sessionCount - minSessions) / (maxSessions - minSessions)) * 100;

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSessionCount(Number(e.target.value));
    };

    const handleConfirmPurchase = () => {
        // Navigate to payment page with session package data
        navigate(`/payment/session-package`, {
            state: {
                tutorId,
                sessionCount,
                totalAmount: totalFinal,
                discount
            }
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
                {/* Header */}
                <div className="mb-8 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Chọn Gói Buổi Học
                    </h1>
                    <p className="text-gray-600 mt-2 text-lg">
                        Đầu tư dài hạn cho kiến thức với gia sư yêu thích của bạn.
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Tutor Info Section */}
                    <div className="p-6 md:p-8 border-b border-gray-200 bg-gray-50">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <img
                                    src={tutorAvatar}
                                    alt={tutorName}
                                    className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md"
                                />
                                {isVerified && (
                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                                        <HiCheckCircle className="w-6 h-6 text-[#0b6459]" />
                                    </div>
                                )}
                            </div>

                            {/* Tutor Details */}
                            <div className="flex-1 text-center md:text-left">
                                <p className="text-sm font-semibold text-[#0b6459] uppercase tracking-wide mb-1">
                                    Gói học chuyên biệt với
                                </p>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    {tutorName}
                                </h2>
                                <p className="text-gray-600 text-base">
                                    {tutorTitle}
                                </p>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm mt-4 md:mt-0">
                                <HiStar className="w-5 h-5 text-yellow-500 fill-current" />
                                <span className="text-lg font-bold text-gray-900">{tutorRating.toFixed(1)}</span>
                                <span className="text-sm text-gray-600">({tutorReviewCount} đánh giá)</span>
                            </div>
                        </div>
                    </div>

                    {/* Slider Section */}
                    <div className="p-6 md:p-10 space-y-10">
                        <div className="w-full bg-[#F9F3EB] rounded-2xl p-6 md:p-10 border border-gray-200">
                            <div className="flex flex-col gap-10">
                                {/* Session Count Display */}
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                                            Số lượng buổi bạn chọn
                                        </span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-bold text-[#0b6459]">{sessionCount}</span>
                                            <span className="text-2xl font-medium text-gray-900">Buổi</span>
                                        </div>
                                    </div>
                                    
                                    {/* Discount Badge */}
                                    {discount > 0 && (
                                        <div className="bg-[#0b6459] bg-opacity-10 text-[#0b6459] px-5 py-2 rounded-full text-base font-medium flex items-center gap-2 self-start sm:self-end border border-[#0b6459] border-opacity-20">
                                            <HiTag className="w-5 h-5" />
                                            Đang áp dụng giảm giá {discount}%
                                        </div>
                                    )}
                                </div>

                                {/* Slider */}
                                <div className="relative pt-6 pb-2">
                                    <input
                                        type="range"
                                        min={minSessions}
                                        max={maxSessions}
                                        value={sessionCount}
                                        onChange={handleSliderChange}
                                        className="w-full h-4 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                                        style={{
                                            background: `linear-gradient(to right, #0b6459 0%, #0b6459 ${sliderPercentage}%, #e5e7eb ${sliderPercentage}%, #e5e7eb 100%)`
                                        }}
                                    />
                                    
                                    {/* Slider Labels */}
                                    <div className="flex justify-between text-sm font-semibold text-gray-500 px-1 mt-2">
                                        {SLIDER_MARKS.map((mark) => (
                                            <span
                                                key={mark}
                                                className={`relative ${sessionCount === mark ? 'text-gray-900 font-bold' : ''}`}
                                            >
                                                {mark} <span className="hidden sm:inline">Buổi</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Total Payment */}
                            <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col gap-4 hover:border-[#0b6459] transition-colors">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="p-2.5 bg-[#F9F3EB] rounded-xl">
                                        <HiCurrencyDollar className="w-6 h-6" />
                                    </div>
                                    <span className="text-base font-medium">Tổng thanh toán</span>
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-bold text-gray-900 tracking-tight">
                                            {formatCurrency(totalFinal)}
                                        </p>
                                    </div>
                                    {discount > 0 && (
                                        <p className="text-sm text-gray-600 font-normal mt-1">
                                            Gốc: <span className="line-through text-red-500">{formatCurrency(totalOriginal)}</span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Price Per Session */}
                            <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col gap-4 hover:border-[#0b6459] transition-colors">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="p-2.5 bg-[#F9F3EB] rounded-xl">
                                        <HiTag className="w-6 h-6" />
                                    </div>
                                    <span className="text-base font-medium">Giá mỗi buổi</span>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-gray-900 tracking-tight">
                                        {formatCurrency(pricePerSession)}
                                    </p>
                                    {savingsPerSession > 0 && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            Rẻ hơn mua lẻ {formatCurrency(savingsPerSession)}/buổi
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Savings */}
                            {savings > 0 && (
                                <div className="p-6 rounded-2xl border border-[#0b6459] border-opacity-30 bg-gradient-to-br from-[#F9F3EB] to-transparent shadow-sm flex flex-col gap-4 relative overflow-hidden group">
                                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#0b6459] bg-opacity-10 rounded-full blur-2xl group-hover:bg-opacity-20 transition-colors duration-500"></div>
                                    <div className="flex items-center gap-3 text-[#0b6459] relative z-10">
                                        <div className="p-2.5 bg-[#0b6459] bg-opacity-10 rounded-xl">
                                            <HiSparkles className="w-6 h-6" />
                                        </div>
                                        <span className="text-base font-bold">Tiết kiệm được</span>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-3xl font-bold text-[#0b6459] tracking-tight">
                                            {formatCurrency(savings)}
                                        </p>
                                        <p className="text-sm text-[#0b6459] font-medium mt-1">
                                            Đủ mua thêm {Math.floor(savings / basePrice)} buổi học!
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Benefits and Summary */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-4">
                            {/* Benefits */}
                            <div className="flex flex-col gap-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <HiSparkles className="w-6 h-6 text-[#0b6459]" />
                                    Đặc quyền gói học
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 group">
                                        <div className="mt-1 text-[#0b6459] bg-[#F9F3EB] p-2 rounded-lg">
                                            <HiCalendar className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-bold text-lg">Lịch học linh hoạt</span>
                                            <span className="text-gray-600 mt-1 leading-relaxed">
                                                Sắp xếp lịch học trực tiếp với giáo viên. Dễ dàng thay đổi giờ học khi có việc bận.
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 group">
                                        <div className="mt-1 text-[#0b6459] bg-[#F9F3EB] p-2 rounded-lg">
                                            <HiClock className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-bold text-lg">Không giới hạn thời gian</span>
                                            <span className="text-gray-600 mt-1 leading-relaxed">
                                                Số buổi học được bảo lưu mãi mãi. Bạn có thể học bất cứ khi nào bạn muốn, không lo hết hạn.
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 group">
                                        <div className="mt-1 text-[#0b6459] bg-[#F9F3EB] p-2 rounded-lg">
                                            <HiSupport className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-bold text-lg">Hỗ trợ ưu tiên 24/7</span>
                                            <span className="text-gray-600 mt-1 leading-relaxed">
                                                Đội ngũ chăm sóc khách hàng luôn sẵn sàng giải đáp thắc mắc của bạn.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-[#F9F3EB] p-8 rounded-2xl border border-gray-200 flex flex-col justify-center h-full">
                                <h4 className="text-lg font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h4>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-base">
                                        <span className="text-gray-600">
                                            Gói {sessionCount} buổi ({formatCurrency(basePrice)}/buổi)
                                        </span>
                                        <span className="font-medium text-gray-900">{formatCurrency(totalOriginal)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between items-center text-base">
                                            <span className="text-gray-600">Giảm giá combo (-{discount}%)</span>
                                            <span className="font-bold text-green-600">-{formatCurrency(discountAmount)}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="h-px bg-gray-300 w-full mb-6 border-dashed"></div>
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-base text-gray-600">Tổng thanh toán</span>
                                        <span className="text-sm text-gray-500 font-normal">Đã bao gồm VAT</span>
                                    </div>
                                    <span className="text-gray-900 text-3xl font-bold leading-none">
                                        {formatCurrency(totalFinal)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-gray-200 p-6 md:p-8 bg-[#F9F3EB] flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 rounded-xl text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center gap-2 group"
                        >
                            <HiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Quay lại tìm kiếm
                        </button>
                        <button
                            onClick={handleConfirmPurchase}
                            className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[#0b6459] hover:bg-[#084c43] text-white font-bold text-lg shadow-lg shadow-[#0b6459]/30 transition-all flex items-center justify-center gap-2 group transform active:scale-95"
                        >
                            <span>Xác nhận mua gói</span>
                            <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                        <HiLockClosed className="w-4 h-4" />
                        Thanh toán an toàn &amp; bảo mật. Hoàn tiền trong 30 ngày nếu không hài lòng.
                    </p>
                </div>
            </div>

            <style>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 2.5rem;
                    height: 2.5rem;
                    background: white;
                    border: 4px solid #0b6459;
                    border-radius: 50%;
                    cursor: grab;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    transition: transform 0.2s;
                }
                
                .slider::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                }
                
                .slider::-webkit-slider-thumb:active {
                    cursor: grabbing;
                    transform: scale(0.95);
                }
                
                .slider::-moz-range-thumb {
                    width: 2.5rem;
                    height: 2.5rem;
                    background: white;
                    border: 4px solid #0b6459;
                    border-radius: 50%;
                    cursor: grab;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    transition: transform 0.2s;
                }
                
                .slider::-moz-range-thumb:hover {
                    transform: scale(1.1);
                }
                
                .slider::-moz-range-thumb:active {
                    cursor: grabbing;
                    transform: scale(0.95);
                }
            `}</style>
        </div>
    );
}
