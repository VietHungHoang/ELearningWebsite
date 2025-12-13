import React, { useState, useEffect } from "react";
import {
  FiLock,
  FiCreditCard,
  FiDollarSign,
  FiSmartphone,
  FiLoader,
  FiCheck,
  FiCalendar,
  FiClock,
  FiStar,
  FiBookOpen,
  FiAward,
} from "react-icons/fi";
import HeaderNoNavbar from "../../../components/ui/HeaderNoNavbar";
import paymentService from "../../../services/paymentService";

const mockSchedule = [
  { sessionNumber: 1, date: "Monday, Oct 20, 2025", time: "10:00 AM" },
  { sessionNumber: 2, date: "Monday, Oct 27, 2025", time: "10:00 AM" },
  { sessionNumber: 3, date: "Monday, Nov 03, 2025", time: "10:00 AM" },
  { sessionNumber: 4, date: "Monday, Nov 10, 2025", time: "10:00 AM" },
  { sessionNumber: 5, date: "Monday, Nov 17, 2025", time: "10:00 AM" },
];

const CheckoutPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState("bank-transfer");
  const [checkoutState, setCheckoutState] = useState<
    "selecting" | "processing" | "success"
  >("selecting");
  const [showPromo, setShowPromo] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const tutor = {
    name: "Cynthia Hunter",
    avatar: "https://picsum.photos/seed/cynthia/96/96",
    rating: 4.9,
    subjects: ["Math", "Physics"],
    experience: 5,
    lessons: 50,
    students: 200,
  };
  const sessions = 10;
  const pricePerSession = 40.0;
  const discountPercent = 10;

  const originalPrice = sessions * pricePerSession;
  const discountAmount = originalPrice * (discountPercent / 100);
  const subtotal = originalPrice - discountAmount;
  const couponDiscount = appliedCoupon === 'SAVE10' ? subtotal * 0.1 : 0;
  const total = subtotal - couponDiscount;

  // Mock data for the summary

  useEffect(() => {
    if (checkoutState === "processing") {
      const timer = setTimeout(() => {
        setCheckoutState("success");
      }, 3000); // 3-second processing delay
      return () => clearTimeout(timer);
    }
    if (checkoutState === "success") {
      const redirectTimer = setTimeout(() => {}, 2000); // 2-second delay to show success message
      return () => clearTimeout(redirectTimer);
    }
  }, [checkoutState]);

  const handlePayment = async () => {
    try {
      setCheckoutState("processing");

      const paymentRequest = {
        paymentMethod: paymentMethod as 'momo' | 'zalopay' | 'credit-card' | 'paypal',
        amount: total,
        currency: 'USD'
      };

      const paymentResponse = await paymentService.initiatePayment(paymentRequest);

      if (paymentResponse.status === 'completed') {
        setCheckoutState("success");
      } else if (paymentResponse.status === 'pending' && paymentResponse.paymentUrl) {
        // For QR code payments, redirect to payment URL
        window.location.href = paymentResponse.paymentUrl;
      } else if (paymentResponse.status === 'processing') {
        // For card/paypal, show processing state
        setCheckoutState("processing");
        // In a real app, you might poll for status here
      } else {
        throw new Error(paymentResponse.message || 'Payment failed');
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
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment-method"
                        checked={paymentMethod === "momo"}
                        readOnly
                        className="h-4 w-4 text-[#0b6459] focus:ring-[#0b6459]"
                      />
                      <span className="font-semibold text-gray-800">Momo</span>
                    </div>
                    <FiSmartphone />
                  </div>
                </div>
                {/* ZaloPay Option */}
                <div
                  onClick={() => setPaymentMethod("zalopay")}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "zalopay"
                      ? "border-[#0b6459] bg-green-50/30"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment-method"
                        checked={paymentMethod === "zalopay"}
                        readOnly
                        className="h-4 w-4 text-[#0b6459] focus:ring-[#0b6459]"
                      />
                      <span className="font-semibold text-gray-800">
                        ZaloPay
                      </span>
                    </div>
                    <FiSmartphone />
                  </div>
                </div>

                {/* Credit Card Option */}
                <div
                  onClick={() => setPaymentMethod("credit-card")}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "credit-card"
                      ? "border-[#0b6459] bg-green-50/30"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment-method"
                        checked={paymentMethod === "credit-card"}
                        readOnly
                        className="h-4 w-4 text-[#0b6459] focus:ring-[#0b6459]"
                      />
                      <span className="font-semibold text-gray-800">
                        Credit Card
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCreditCard />
                      <FiCreditCard />
                    </div>
                  </div>
                </div>

                {/* PayPal Option */}
                <div
                  onClick={() => setPaymentMethod("paypal")}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "paypal"
                      ? "border-[#0b6459] bg-green-50/30"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment-method"
                        checked={paymentMethod === "paypal"}
                        readOnly
                        className="h-4 w-4 text-[#0b6459] focus:ring-[#0b6459]"
                      />
                      <span className="font-semibold text-gray-800">
                        PayPal
                      </span>
                    </div>
                    <FiDollarSign />
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
                  First {mockSchedule.length} of {sessions} sessions are shown.
                </p>
                <div className="mt-4 border-t border-gray-100 pt-4 space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                  {mockSchedule.map((session) => (
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
                    <img
                      src={tutor.avatar}
                      alt={tutor.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <p className="font-bold text-2xl text-gray-800">
                        {tutor.name}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FiStar className="text-orange-400" /> {tutor.rating} ({tutor.lessons} lessons)
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-3">
                    <p className="text-sm text-black bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-md flex items-center gap-1 font-medium">
                      <FiAward /> {tutor.experience} years
                    </p>
                    <p className="text-sm text-black bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-md flex items-center gap-1 font-medium">
                      <FiBookOpen /> {tutor.students} students
                    </p>
                    <p className="text-sm text-black bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-md flex items-center gap-1 font-medium">
                      <FiStar /> {tutor.rating}/5
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>{sessions} Sessions Package</span>
                    <span>${originalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>You saved ({discountPercent}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon ({appliedCoupon}) <button onClick={() => setAppliedCoupon(null)} className="text-red-500 ml-1 hover:text-red-700">×</button></span>
                      <span>-${couponDiscount.toFixed(2)}</span>
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
                  <span>${total.toFixed(2)}</span>
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
