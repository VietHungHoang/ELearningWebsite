import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Check, ArrowRight } from 'lucide-react'
import PaymentMethodsSection from '../../components/checkout/PaymentMethodsSection'

interface CheckoutPageProps {
  onPayment?: (paymentData: any) => void
  courseData?: {
    title: string
    duration: string
    price: number
    originalPrice?: number
  }
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ 
  onPayment,
  courseData: propCourseData
}) => {
  const location = useLocation()
  const [courseData, setCourseData] = useState({
    title: "Advanced",
    duration: "6 Months",
    price: 799.99,
    originalPrice: 999.99
  })
  const [formData, setFormData] = useState({
    firstName: 'Sarah',
    lastName: 'Chapman',
    companyTitle: '',
    email: 'student@amentotech.com',
    phone: '',
    country: 'Afghanistan',
    city: 'Kabul',
    state: 'Benguela', 
    zipCode: '10001',
    orderNote: '',
    couponCode: ''
  })
  
  const [paymentMethod, setPaymentMethod] = useState('visa')
  const [paymentFormData, setPaymentFormData] = useState<{ [key: string]: string }>({})
  const [isProcessing, setIsProcessing] = useState(false)

  // Get course data from navigation state or props
  useEffect(() => {
    if (location.state?.planData) {
      setCourseData({
        ...location.state.planData,
        originalPrice: location.state.planData.originalPrice || location.state.planData.price * 1.2
      })
    } else if (propCourseData) {
      setCourseData({
        ...propCourseData,
        originalPrice: propCourseData.originalPrice || propCourseData.price * 1.2
      })
    }
  }, [location.state, propCourseData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleApplyCoupon = () => {
    console.log('Applying coupon:', formData.couponCode)
  }

  const handlePaymentMethodSelect = (methodId: string) => {
    setPaymentMethod(methodId)
    // Clear previous payment form data when switching methods
    setPaymentFormData({})
  }

  const handlePaymentFormChange = (field: string, value: string) => {
    setPaymentFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    
    setTimeout(() => {
      onPayment?.({
        ...formData,
        paymentMethod,
        paymentFormData,
        amount: courseData.price
      })
      setIsProcessing(false)
    }, 2000)
  }

  const steps = [
    { id: 1, title: 'Select Best Tutor', completed: true },
    { id: 2, title: 'Add Checkout Details', completed: false, active: true },
    { id: 3, title: "You're Done!", completed: false }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/media/homepage/logo-default.svg" 
              alt="Lernen Logo" 
              className="w-32 h-12 mr-3"
            />
    
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">You are almost there</h1>
          <p className="text-gray-600">Fill the details mentioned below to purchase the selected courses</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.completed 
                      ? 'bg-emerald-600 text-white' 
                      : step.active 
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.completed ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span className={`text-sm font-medium ${
                    step.completed || step.active ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-12 h-px bg-gray-300"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT SIDE - Payment Methods, Billing Details, Additional Information */}
          <div className="space-y-8">
            
            {/* Payment Methods Section */}
            <PaymentMethodsSection
              selectedMethod={paymentMethod}
              onMethodSelect={handlePaymentMethodSelect}
              formData={paymentFormData}
              onFormChange={handlePaymentFormChange}
            />

            {/* Billing Details Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing Details</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Sarah"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 placeholder-gray-500"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Chapman"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>
                
                <input
                  type="text"
                  name="companyTitle"
                  value={formData.companyTitle}
                  onChange={handleInputChange}
                  placeholder="Add company title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 placeholder-gray-500"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="student@amentotech.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 placeholder-gray-500"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Add phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>

                {/* Country Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900"
                  >
                    <option value="Afghanistan">Afghanistan</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                {/* City, State, Zip Row */}
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Kabul"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 placeholder-gray-500"
                  />
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Benguela"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 placeholder-gray-500"
                  />
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional information</h2>
              
              <textarea
                name="orderNote"
                value={formData.orderNote}
                onChange={handleInputChange}
                placeholder="Note about your order, e.g. special note to add here"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none bg-white text-gray-900 placeholder-gray-500"
              />
              <p className="text-xs text-gray-500 mt-2 text-right">200 Characters left</p>
            </div>
          </div>

          {/* RIGHT SIDE - Order Summary */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Course Item */}
              <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">L</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {courseData.duration}
                  </h3>
                  <p className="text-sm text-gray-600">{courseData.title}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${courseData.price}</p>
                  <div className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-500 cursor-pointer">
                    <span>✏️</span>
                    <span>Remove</span>
                  </div>
                </div>
              </div>
              
              <hr className="my-4" />
              
              {/* Pricing Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">${courseData.price}</span>
                </div>
                
                <div className="flex justify-between font-semibold text-lg text-gray-900">
                  <span>Grand Total</span>
                  <span>${courseData.price}</span>
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="flex space-x-2 mb-6">
                <input
                  type="text"
                  name="couponCode"
                  value={formData.couponCode}
                  onChange={handleInputChange}
                  placeholder="Enter coupon"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 placeholder-gray-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Apply
                </button>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ${courseData.price}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
