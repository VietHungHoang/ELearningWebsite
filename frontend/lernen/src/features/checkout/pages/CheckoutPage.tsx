import React, { useState } from "react";
import {
  FiLock,
  FiLoader,
  FiCheck,
  FiCalendar,
  FiClock,
  FiStar,
  FiBookOpen,
  FiAward,
} from "react-icons/fi";
import HeaderNoNavbar from "../../../components/ui/HeaderNoNavbar";
import { useLocation } from "react-router-dom";
import { useCurrency } from "../../../context/CurrencyContext";
import { convertFromVND, formatCurrency } from "../../../utils/currencyHelper";
import Avatar from "react-avatar";
import bookingService from "../../../services/bookingService";

interface Session {
  sessionNumber: number;
  date: string;
  time: string;
}

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const { selectedCurrency } = useCurrency();
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [checkoutState, setCheckoutState] = useState<
    "selecting" | "processing" | "success"
  >("selecting");
  const [showPromo, setShowPromo] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Get data from navigation state
  const bookingData = location.state?.bookingData;
  const tutorData = location.state?.tutor;

  // Use real tutor data
  const tutor = tutorData ? {
    name: tutorData.fullName,
    avatar: tutorData.avatarUrl,
    subjects: (tutorData.subjects as any)?.map((s: any) => s.name) || [],
    experience: tutorData.experienceYears || 0,
    lessons: tutorData.bookedSessionsCount || 5,
    students: tutorData.studentCount || 0,
    rating: tutorData.rating || 0,
  } : null;

  const sessions = bookingData?.sessions || 10;
  const discountPercent = bookingData?.package?.discount || 10;

  // Use the pricing data directly from bookingData
  const originalPrice = bookingData?.pricing?.originalPrice || (sessions * 45.0); // Total before discount
  const discountAmount = bookingData?.pricing?.discountAmount || (originalPrice * discountPercent / 100);
  const subtotal = bookingData?.pricing?.totalPrice || (originalPrice - discountAmount);
  
  const couponDiscount = appliedCoupon === 'SAVE10' ? subtotal * 0.1 : 0;
  const total = subtotal - couponDiscount;

  // Use real schedule
  const schedule: Session[] = bookingData?.schedule || [];

  // Mock data for the summary

  const handlePayment = async () => {
    try {
      setCheckoutState("processing");

      // Prepare payment data
      const paymentProviderMap: { [key: string]: string } = {
        momo: 'MOMO',
        vnpay: 'VNPAY',
        sepay: 'SEPAY'
      };

      // Create booking with payment data in one API call
      const { isBestValue, ...packageData } = bookingData.package;
      const requestData = {
        ...packageData, // Flatten package info fields
        studentId: bookingData.studentId,
        tutorId: tutorData.id,
        schedule: schedule.map(s => ({
          time: new Date(s.date + ' ' + s.time).toISOString().slice(0, 19)
        })),
        // Flatten payment information
        amount: total,
        paymentProvider: paymentProviderMap[paymentMethod] || paymentMethod,
        redirectUrl: 'http://localhost:5173/payment-success'
      };

      const bookingResponse = await bookingService.createBooking(requestData) as any;

      // Handle payment response
      if (bookingResponse.status === 'completed') {
        setCheckoutState("success");
      } else if (bookingResponse.paymentData?.redirectUrl) {
        // For redirect payments, redirect to payment URL
        window.location.href = bookingResponse.paymentData.redirectUrl;
      } else if (bookingResponse.status === 'processing') {
        // For card/paypal, show processing state
        setCheckoutState("processing");
        // In a real app, you might poll for status here
      } else {
        throw new Error(bookingResponse.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setCheckoutState("selecting");
      // In a real app, show error toast/message
      alert('Payment failed. Please try again.');
    }
  };

  const handleApplyCoupon = () => {
    const code = couponInput.toUpperCase().trim();
    setCouponError(null);

    if (!code) {
      setAppliedCoupon(null);
      return;
    }

    if (code === 'SAVE10') {
      setAppliedCoupon(code);
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Try SAVE10 for 10% off.');
    }
  };

  return (
    <>
      <HeaderNoNavbar />

      {/* Overlay for Processing/Success (covers entire viewport) */}
      {checkoutState !== "selecting" && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          {checkoutState === "processing" && (
            <>
              <FiLoader className="animate-spin text-4xl text-[#0b6459]" />
              <p className="mt-4 font-semibold text-gray-700 text-lg">
                Đang xử lý thanh toán...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Vui lòng không đóng cửa sổ này.
              </p>
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

      <div className="max-w-5xl mx-auto bg-[#F8F7F4] min-h-screen flex flex-col">

        <main className="container mx-auto px-4 py-4 flex-grow">
          {/* <h1 className="text-3xl font-bold text-gray-800">Checkout</h1> */}

          <div className="grid lg:grid-cols-10 gap-6 mt-4">

            {/* Left side: Payment */}
            <div className="lg:col-span-6">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                Payment method
              </h2>
              <div className="space-y-4 mt-6">
                {/* Momo Option */}
                <div
                  onClick={() => setPaymentMethod("momo")}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "momo"
                      ? "border-[#0b6459] bg-green-50/30"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === "momo"}
                      readOnly
                      className="h-4 w-4 text-[#0b6459] focus:ring-[#0b6459]"
                    />
                    <img src="/images/momo.webp" alt="Momo" className="w-8 h-8" />
                    <span className="font-semibold text-gray-800">Momo</span>
                  </div>
                </div>
                {/* VNPay Option */}
                <div
                  onClick={() => setPaymentMethod("vnpay")}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "vnpay"
                      ? "border-[#0b6459] bg-green-50/30"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === "vnpay"}
                      readOnly
                      className="h-4 w-4 text-[#0b6459] focus:ring-[#0b6459]"
                    />
                    <img src="/images/vnpay.webp" alt="VNPay" className="w-8 h-8" />
                    <span className="font-semibold text-gray-800">
                      VNPay
                    </span>
                  </div>
                </div>

                {/* Sepay Option */}
                <div
                  onClick={() => setPaymentMethod("sepay")}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "sepay"
                      ? "border-[#0b6459] bg-green-50/30"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === "sepay"}
                      readOnly
                      className="h-4 w-4 text-[#0b6459] focus:ring-[#0b6459]"
                    />
                    <img src="/images/sepay.webp" alt="Sepay" className="w-8 h-8" />
                    <span className="font-semibold text-gray-800">
                      Sepay
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handlePayment}
                className="w-full mt-6 bg-[#0b6459] text-white font-bold py-3 rounded-lg hover:bg-[#084c43] transition-colors"
              >
                <span className="flex items-center justify-center gap-2">
                  <FiLock />
                  <span>Proceed to Payment</span>
                </span>
              </button>
            </div>

                  
            {/* Middle: Learning Schedule */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80 mt-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Your Learning Schedule
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  First {schedule.length} of {sessions} sessions are shown.
                </p>
                <div className="mt-4 border-t border-gray-100 pt-4 space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                  {schedule.map((session) => (
                    <div
                      key={session.sessionNumber}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-sm text-gray-800">
                          Session {session.sessionNumber}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <FiCalendar />
                          <span>{session.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-1 rounded-md">
                        <FiClock />
                        <span>{session.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>


            {/* Right side: Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
                <h2 className="text-xl font-bold text-gray-800">Your tutor</h2>

                <div className="my-4">
                  <div className="flex items-center gap-4">
                    {tutor?.avatar && tutor.avatar.trim() !== "" ? (
                      <img
                        src={tutor.avatar}
                        alt={tutor.name}
                        className="w-16 h-16 rounded-lg"
                      />
                    ) : (
                      <Avatar
                        name={tutor?.name || "Tutor"}
                        size="64"
                        round={false}
                        className="w-16 h-16 rounded-lg"
                      />
                    )}
                    <div>
                      <p className="font-bold text-2xl text-gray-800">
                        {tutor?.name || "Tutor"}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FiStar className="text-orange-400" /> {tutor?.rating || 0} ({tutor?.lessons || 0} lessons)
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-3">
                    <p className="text-sm text-black bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-md flex items-center gap-1 font-medium">
                      <FiAward /> {tutor?.experience || 0} years
                    </p>
                    <p className="text-sm text-black bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-md flex items-center gap-1 font-medium">
                      <FiBookOpen /> {tutor?.students || 0} students
                    </p>
                    <p className="text-sm text-black bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-md flex items-center gap-1 font-medium">
                      <FiStar /> {tutor?.lessons || 0} lessons
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>{sessions} Sessions Package</span>
                    <span>{formatCurrency(originalPrice, selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>You saved ({discountPercent}%)</span>
                    <span>-{formatCurrency(discountAmount, selectedCurrency)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon ({appliedCoupon}) <button onClick={() => setAppliedCoupon(null)} className="text-red-500 ml-1 hover:text-red-700">×</button></span>
                      <span>-{formatCurrency(couponDiscount, selectedCurrency)}</span>
                    </div>
                  )}
                  <div className="text-left">
                    {!showPromo && (
                      <button
                        onClick={() => setShowPromo(!showPromo)}
                        className="text-blue-600 hover:underline font-semibold underline"
                      >
                        Have a promo code?
                      </button>
                    )}
                  </div>
                  {showPromo && (
                    <div>
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Enter promo code"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          className={`flex-1 px-3 py-2 border-2 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-[#0b6459] ${
                            couponError ? 'border-red-500 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-[#0b6459]'
                          }`}
                        />
                        <button 
                          onClick={handleApplyCoupon}
                          className="px-4 py-2 bg-[#0b6459] text-white rounded-md text-sm hover:bg-[#084c43] transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-red-500 text-sm mt-1">{couponError}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-dashed my-4"></div>

                <div className="flex justify-between items-center font-bold text-xl">
                  <span>Total</span>
                  <span>{formatCurrency(total, selectedCurrency)}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CheckoutPage;
