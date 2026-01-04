import React, { useState, useEffect } from "react";
import {
  MdPayments,
  MdInfo,
  MdVerifiedUser,
  MdStar,
  MdLock,
  MdLockClock,
  MdCurrencyExchange,
  MdHeadsetMic,
} from "react-icons/md";
import { useLocation } from "react-router-dom";
import { useCurrency } from "../../../context/CurrencyContext";
import { useAuth } from "../../../context/AuthContext";
import { formatCurrency } from "../../../utils/currencyHelper";
import Avatar from "react-avatar";
import bookingService from "../../../services/bookingService";
import { useTranslation } from "react-i18next";
import { FiLoader, FiCheck } from "react-icons/fi";
import HeaderNoNavbar from "../../../components/ui/HeaderNoNavbar";
import BirdLoading from "../../../components/ui/BirdLoading";
import SepayQRModal from "../components/SepayQRModal";
import Toast from "../../../components/ui/Toast";

interface Session {
  sessionNumber: number;
  date: string;
  time: string;
  dayOfWeek?: number; // For fixed weekly schedules (1=Monday, 7=Sunday)
}

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const { selectedCurrency } = useCurrency();
  const { state } = useAuth();
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [checkoutState, setCheckoutState] = useState<
    "selecting" | "processing" | "success"
  >("selecting");
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [showSepayModal, setShowSepayModal] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get data from navigation state
  const bookingData = location.state?.bookingData;
  const tutorData = location.state?.tutor;

  // Use real tutor data
  const tutor = tutorData
    ? {
      name: tutorData.fullName,
      avatar: tutorData.avatarUrl,
      subjects:
        (tutorData.subjects as any)?.map((s: any) =>
          t("locale") === "vi" ? s.nameVi || s.name : s.nameEn || s.name
        ) || [],
      experience: tutorData.experienceYears || 0,
      lessons: tutorData.bookedSessionsCount || 5,
      students: tutorData.studentCount || 0,
      rating: tutorData.rating || 0,
      reviews: tutorData.reviewCount || 120, // Fallback if data missing
    }
    : null;

  const sessions = bookingData?.sessions || 10;
  const discountPercent = bookingData?.package?.discount || 10;

  // Use the pricing data directly from bookingData
  const originalPrice =
    bookingData?.pricing?.originalPrice || sessions * 45.0; // Total before discount
  const discountAmount =
    bookingData?.pricing?.discountAmount ||
    (originalPrice * discountPercent) / 100;
  const subtotal =
    bookingData?.pricing?.totalPrice || originalPrice - discountAmount;

  const couponDiscount = appliedCoupon === "SAVE10" ? subtotal * 0.1 : 0;
  const total = subtotal - couponDiscount;

  // Use real schedule
  const schedule: Session[] = bookingData?.schedule || [];

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handlePayment = async () => {
    // 1. Show modal immediately if SePay
    if (paymentMethod === 'sepay') {
      setShowSepayModal(true);
      // Don't return, proceed to create booking in background
    } else {
      setCheckoutState("processing");
    }

    try {
      // Prepare payment data
      const paymentProviderMap: { [key: string]: string } = {
        momo: "MOMO",
        vnpay: "VNPAY",
        sepay: "SEPAY",
      };

      // Create booking with payment data in one API call
      const { isBestValue, ...packageData } = bookingData.package;

      // For schedule, prefer selectedTimes (actual UTC timestamps) over display schedule
      // selectedTimes is set by BookSessionModal for package bookings
      // Backend uses LocalDateTime.parse() which expects format: yyyy-MM-ddTHH:mm:ss (no Z, no milliseconds)
      const formatForBackend = (isoString: string) => {
        // Remove Z suffix and milliseconds: "2026-01-08T02:00:00.000Z" -> "2026-01-08T02:00:00"
        return isoString.replace(/\.\d{3}Z$/, '').replace(/Z$/, '');
      };

      const scheduleForApi = bookingData.selectedTimes && bookingData.selectedTimes.length > 0
        ? bookingData.selectedTimes.map((time: string) => ({ time: formatForBackend(time) }))
        : schedule.filter(s => s.date).map((s) => ({
          // If date contains full ISO string, use it, otherwise construct it
          time: formatForBackend(s.date.includes('T') ? s.date : new Date(s.date + ' ' + s.time).toISOString())
        }));

      const requestData = {
        ...packageData, // Flatten package info fields
        studentId: state.user?.id, // Get from logged-in user
        tutorId: tutorData.id,
        schedule: scheduleForApi,
        // Flatten payment information
        amount: total,
        paymentProvider: paymentProviderMap[paymentMethod] || paymentMethod,
        redirectUrl: `${window.location.origin}/payment-result`,
      };

      const bookingResponse = (await bookingService.createBooking(
        requestData
      )) as any;

      // Handle SePay specifically
      if (paymentMethod === 'sepay') {
        if (bookingResponse.id) {
          setPendingOrderId(bookingResponse.id);
        } else {
          throw new Error("Missing booking ID");
        }
        return;
      }

      // Handle payment response for other methods
      if (bookingResponse.status === "completed") {
        setCheckoutState("success");
      } else if (bookingResponse.paymentData?.redirectUrl) {
        // For redirect payments, redirect to payment URL
        window.location.href = bookingResponse.paymentData.redirectUrl;
      } else if (bookingResponse.status === "processing") {
        // For card/paypal, show processing state
        setCheckoutState("processing");
        // In a real app, you might poll for status here
      } else {
        throw new Error(bookingResponse.message || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);

      if (paymentMethod === 'sepay') {
        setShowSepayModal(false);
        setToast({ message: "Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.", type: 'error' });
      } else {
        setCheckoutState("selecting");
        alert("Payment failed. Please try again.");
      }
    }
  };

  const handleApplyCoupon = () => {
    const code = couponInput.toUpperCase().trim();
    setCouponError(null);

    if (!code) {
      setAppliedCoupon(null);
      return;
    }

    if (code === "SAVE10") {
      setAppliedCoupon(code);
      setCouponInput("");
    } else {
      setCouponError("Invalid coupon code. Try SAVE10 for 10% off.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      <HeaderNoNavbar />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 pb-6 pt-2 md:py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Thanh toán
          </h1>
          <p className="text-gray-500 text-base">
            Vui lòng chọn phương thức thanh toán để hoàn tất đơn hàng
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Left Column (Payment Methods) */}
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[500px]">
              <div className="flex items-center gap-3 mb-6">
                <MdPayments className="text-[#0b6459] text-2xl" />
                <h2 className="text-xl font-bold text-gray-800">Phương thức thanh toán</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-8">
                {/* MoMo */}
                <label className="cursor-pointer relative group">
                  <input
                    type="radio"
                    name="payment_method"
                    value="momo"
                    checked={paymentMethod === "momo"}
                    onChange={() => setPaymentMethod("momo")}
                    className="peer sr-only"
                  />
                  <div className="p-3 rounded-lg border-2 border-gray-200 bg-white hover:border-[#0b6459]/50 peer-checked:border-[#0b6459] peer-checked:bg-[#0b6459]/5 transition-all flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
                        <img
                          src="/images/momo.webp"
                          alt="MoMo"
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-lg block text-gray-900 mb-1">
                          Ví MoMo
                        </span>
                        <span className="text-sm text-gray-500">
                          Thanh toán nhanh qua ứng dụng MoMo
                        </span>
                      </div>
                    </div>
                    {/* Radio Button Indicator */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'momo' ? 'border-[#0b6459]' : 'border-gray-300'}`}>
                      {paymentMethod === 'momo' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0b6459]" />
                      )}
                    </div>
                  </div>
                </label>

                {/* VNPay */}
                <label className="cursor-pointer relative group">
                  <input
                    type="radio"
                    name="payment_method"
                    value="vnpay"
                    checked={paymentMethod === "vnpay"}
                    onChange={() => setPaymentMethod("vnpay")}
                    className="peer sr-only"
                  />
                  <div className="p-3 rounded-lg border-2 border-gray-200 bg-white hover:border-[#0b6459]/50 peer-checked:border-[#0b6459] peer-checked:bg-[#0b6459]/5 transition-all flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
                        <img
                          src="/images/vnpay.webp"
                          alt="VNPay"
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-lg block text-gray-900 mb-1">
                          Ví VNPay
                        </span>
                        <span className="text-sm text-gray-500">
                          Quét mã QR từ ứng dụng ngân hàng và ví điện tử
                        </span>
                      </div>
                    </div>
                    {/* Radio Button Indicator */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'vnpay' ? 'border-[#0b6459]' : 'border-gray-300'}`}>
                      {paymentMethod === 'vnpay' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0b6459]" />
                      )}
                    </div>
                  </div>
                </label>

                {/* Sepay */}
                <label className="cursor-pointer relative group">
                  <input
                    type="radio"
                    name="payment_method"
                    value="sepay"
                    checked={paymentMethod === "sepay"}
                    onChange={() => setPaymentMethod("sepay")}
                    className="peer sr-only"
                  />
                  <div className="p-3 rounded-lg border-2 border-gray-200 bg-white hover:border-[#0b6459]/50 peer-checked:border-[#0b6459] peer-checked:bg-[#0b6459]/5 transition-all flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
                        <img
                          src="/images/sepay.webp"
                          alt="Sepay"
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-lg block text-gray-900 mb-1">
                          Chuyển khoản ngân hàng
                        </span>
                        <span className="text-sm text-gray-500">
                          Chuyển khoản ngân hàng xác nhận tự động 24/7
                        </span>
                      </div>
                    </div>
                    {/* Radio Button Indicator */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'sepay' ? 'border-[#0b6459]' : 'border-gray-300'}`}>
                      {paymentMethod === 'sepay' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0b6459]" />
                      )}
                    </div>
                  </div>
                </label>
              </div>

              <div className="rounded-lg bg-gray-50 p-5 border border-dashed border-gray-300">
                <div className="flex gap-4">
                  <div className="shrink-0 mt-1 text-[#0b6459]">
                    <MdInfo className="text-xl" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium text-gray-900">
                      Lưu ý khi thanh toán:
                    </p>
                    <ul className="list-disc pl-4 text-gray-500 space-y-1">
                      <li>
                        Sau khi nhấn nút "Thanh toán ngay", bạn sẽ được chuyển
                        hướng đến cổng thanh toán tương ứng hoặc nhận mã QR để
                        hoàn tất giao dịch.
                      </li>
                      <li>
                        Lớp học của bạn sẽ được kích hoạt ngay sau khi hệ thống nhận
                        được thông tin thanh toán thành công.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            <div className="flex items-center gap-3 text-sm text-gray-500 p-2">
              <MdVerifiedUser className="text-lg" />
              <p>Thông tin của bạn được mã hóa an toàn và bảo mật 100%.</p>
            </div>



          </div>

          {/* Right Column (Summary) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                  <div className="flex gap-4 items-start mb-4">
                    <div className="relative w-16 h-16 shrink-0">
                      {tutor?.avatar ? (
                        <div
                          className="w-full h-full rounded-lg bg-cover bg-center"
                          style={{ backgroundImage: `url("${tutor.avatar}")` }}
                        ></div>
                      ) : (
                        <Avatar
                          name={tutor?.name || "Tutor"}
                          className="w-full h-full rounded-lg"
                          size="64"
                        />
                      )}

                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                        <div className="bg-green-500 rounded-full size-3 border-2 border-white"></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-base leading-tight mb-1 text-gray-900">
                        {tutor?.name || "Gia sư"}
                      </h4>
                      <p className="text-sm font-medium text-gray-900">
                        {tutor?.subjects[0] || "Gia sư"}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-medium">
                        <MdStar className="text-[14px] fill-current" />
                        <span>{tutor?.rating} ({tutor?.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center mt-2">
                    <div>
                      <p className="font-medium text-sm text-gray-900">Gói {sessions} buổi học</p>
                      <div className="text-xs text-gray-500">
                        {schedule.length > 0 ? (
                          schedule.map((session, index) => {
                            if (session.dayOfWeek) {
                              // Fixed schedule (e.g. Group Class or Package 1-1)
                              const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
                              const dayName = dayNames[session.dayOfWeek - 1];
                              return (
                                <p key={index}>
                                  Mỗi {dayName} - {session.time}
                                </p>
                              );
                            } else {
                              // Specific date (e.g. 1-1 booking)
                              return (
                                <p key={index}>
                                  {new Date(session.date).toLocaleDateString('vi-VN', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'numeric',
                                  })} - {session.time}
                                </p>
                              );
                            }
                          })
                        ) : (
                          <p>Video Call 1-1</p>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-[#0b6459]">
                      {formatCurrency(subtotal, selectedCurrency)}
                    </span>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 space-y-4">
                  {/* Coupon Input */}
                  <div className="flex gap-2 w-full">
                    <input
                      className={`flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border bg-white outline-none transition-all duration-300 ease-in-out ${couponError
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#0b6459]'
                        }`}
                      placeholder="Mã giảm giá"
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="shrink-0 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                    >
                      Áp dụng
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-500 text-xs">{couponError}</p>
                  )}

                  <div className="space-y-2 pt-2 text-sm">

                    <div className="flex justify-between text-gray-600">
                      <span className="font-medium">Tạm tính</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(originalPrice, selectedCurrency)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span className="font-medium">Giảm giá ({discountPercent}%)</span>
                        <span className="font-semibold">-{formatCurrency(discountAmount, selectedCurrency)}</span>
                      </div>
                    )}

                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span className="font-medium">Coupon ({appliedCoupon}) <button onClick={() => setAppliedCoupon(null)} className="text-red-500 ml-1 hover:text-red-700 font-bold">×</button></span>
                        <span className="font-semibold">-{formatCurrency(couponDiscount, selectedCurrency)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-600">
                      <span className="font-medium">Phí dịch vụ</span>
                      <span className="font-semibold text-gray-900">Miễn phí</span>
                    </div>
                  </div>
                  <div className="border-t border-dashed border-gray-300 pt-4 flex justify-between items-end">
                    <span className="font-bold text-lg text-gray-900">Tổng cộng</span>
                    <span className="font-black text-2xl text-[#0b6459]">
                      {formatCurrency(total, selectedCurrency)}
                    </span>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={checkoutState === 'processing'}
                    className="w-full bg-[#0b6459] hover:bg-[#084c43] text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {checkoutState === 'processing' ? (
                      <FiLoader className="animate-spin text-xl" />
                    ) : (
                      <>
                        <MdLock className="text-xl" />
                        <span>Thanh toán ngay</span>
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    Bằng cách thanh toán, bạn đồng ý với{" "}
                    <a className="underline hover:text-[#0b6459]" href="#">
                      Điều khoản dịch vụ
                    </a>{" "}
                    của chúng tôi.
                  </p>
                </div>
              </div>

              <div className="flex justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all text-gray-500">
                <div
                  className="flex flex-col items-center gap-1"
                  title="SSL Secured"
                >
                  <MdLockClock className="text-3xl" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    SSL Secure
                  </span>
                </div>
                <div
                  className="flex flex-col items-center gap-1"
                  title="Money Back Guarantee"
                >
                  <MdCurrencyExchange className="text-3xl" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Hoàn tiền
                  </span>
                </div>
                <div
                  className="flex flex-col items-center gap-1"
                  title="24/7 Support"
                >
                  <MdHeadsetMic className="text-3xl" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Hỗ trợ 24/7
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-gray-100 bg-white py-6 px-6 text-center">
        <p className="text-gray-400 text-sm">
          © 2026 Lernen Inc. All rights reserved.
        </p>
      </footer>

      {/* Overlay for Processing/Success (covers entire viewport) */}
      {checkoutState !== "selecting" && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          {checkoutState === "processing" && (
            <>
              <BirdLoading
                title="Đang xử lý thanh toán..."
                description="Vui lòng không đóng cửa sổ này."
                size="lg"
              />
            </>
          )}
          {checkoutState === "success" && (
            <>
              <div className="w-20 h-20">
                <FiCheck className="w-full h-full text-green-500" />
              </div>
              <p className="mt-4 text-xl font-bold text-gray-800">
                Thanh toán thành công!
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Bạn sẽ được chuyển hướng sau giây lát.
              </p>
            </>
          )}
        </div>
      )}

      {/* SePay QR Modal */}
      <SepayQRModal
        isOpen={showSepayModal}
        onClose={() => setShowSepayModal(false)}
        onComplete={() => {
          setShowSepayModal(false);
          // Redirect to success page after user confirms payment
          const successData = {
            orderId: pendingOrderId || `DH-${Date.now().toString(36).toUpperCase()}`, // Fallback if needed
            packageName: bookingData?.package?.name || `Gói ${sessions} buổi`,
            tutorName: tutor?.name || "Gia sư",
            totalPrice: total,
            sessions: sessions,
          };
          window.location.href = `/payment-success?orderId=${successData.orderId}&packageName=${encodeURIComponent(successData.packageName)}&tutorName=${encodeURIComponent(successData.tutorName)}&totalPrice=${successData.totalPrice}&sessions=${successData.sessions}`;
        }}
        amount={total}
        bankName="MB Bank"
        accountName="MAC VAN THANH"
        accountNumber="0982316213"
        transferContent={pendingOrderId ? `DH ${pendingOrderId}` : `DH${Date.now().toString().slice(-8)}`}
        orderId={pendingOrderId || undefined}
        qrCodeUrl={`https://img.vietqr.io/image/MB-0982316213-compact.png?amount=${total}&addInfo=${pendingOrderId ? `DH%20${pendingOrderId}` : `DH${Date.now().toString().slice(-8)}`}&accountName=MAC%20VAN%20THANH`}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
