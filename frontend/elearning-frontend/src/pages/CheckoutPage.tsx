import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../scss/pages/_checkout-page.scss';

type CartCourse = {
  id: number;
  title: string;
  instructor: string;
  thumbnail: string;
  price: number;
};

const cartCourses: CartCourse[] = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp 2024',
    instructor: 'John Doe',
    thumbnail: '/assets/images/course/course-online-01.jpg',
    price: 89.99,
  },
  {
    id: 2,
    title: 'Advanced React & Redux Masterclass',
    instructor: 'Sarah Johnson',
    thumbnail: '/assets/images/course/course-online-03.jpg',
    price: 79.99,
  },
  {
    id: 3,
    title: 'UI/UX Design Fundamentals',
    instructor: 'Mike Wilson',
    thumbnail: '/assets/images/course/course-online-05.jpg',
    price: 69.99,
  },
];

const CheckoutPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  const [appliedCoupons, setAppliedCoupons] = useState<string[]>([]);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [newCardData, setNewCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  // Sample valid coupons with types
  const validCoupons: { 
    [key: string]: { 
      discount: number; 
      type: 'percentage' | 'fixed';
      appliesTo: 'course' | 'cart'; // course = specific courses, cart = total cart
      description: string;
    } 
  } = {
    'SAVE10': { discount: 10, type: 'percentage', appliesTo: 'cart', description: '10% off entire cart' },
    'SAVE20': { discount: 20, type: 'percentage', appliesTo: 'cart', description: '20% off entire cart' },
    'FIRST50': { discount: 50, type: 'fixed', appliesTo: 'cart', description: '$50 off your order' },
    'COURSE10': { discount: 10, type: 'percentage', appliesTo: 'course', description: '10% off selected courses' },
    'NEWUSER': { discount: 30, type: 'fixed', appliesTo: 'course', description: '$30 off first course' },
  };

  // Sample saved cards
  const savedCards = [
    { id: '1', last4: '4242', brand: 'Visa', expiry: '12/25' },
    { id: '2', last4: '5555', brand: 'Mastercard', expiry: '08/26' },
  ];

  const subtotal = cartCourses.reduce((sum, course) => sum + course.price, 0);
  
  // Calculate discounts for each applied coupon
  const discounts = appliedCoupons.map(code => {
    const coupon = validCoupons[code];
    let amount = 0;
    
    if (coupon.type === 'percentage') {
      amount = subtotal * (coupon.discount / 100);
    } else {
      amount = coupon.discount;
    }
    
    return {
      code,
      amount,
      description: coupon.description
    };
  });
  
  const totalDiscount = discounts.reduce((sum, d) => sum + d.amount, 0);
  const tax = (subtotal - totalDiscount) * 0.1;
  const total = subtotal - totalDiscount + tax;

  // Handle apply coupon
  const handleApplyCoupon = () => {
    setCouponError(null);
    
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setIsApplyingCoupon(true);
    
    // Simulate API call
    setTimeout(() => {
      const upperCouponCode = couponCode.toUpperCase();
      
      if (!validCoupons[upperCouponCode]) {
        setCouponError('Invalid coupon code');
        setIsApplyingCoupon(false);
        return;
      }
      
      if (appliedCoupons.includes(upperCouponCode)) {
        setCouponError('This coupon is already applied');
        setIsApplyingCoupon(false);
        return;
      }
      
      setAppliedCoupons([...appliedCoupons, upperCouponCode]);
      setCouponError(null);
      setCouponCode('');
      setIsApplyingCoupon(false);
    }, 500);
  };

  // Handle remove specific coupon
  const handleRemoveCoupon = (code: string) => {
    setAppliedCoupons(appliedCoupons.filter(c => c !== code));
    setCouponError(null);
  };

  // Handle add new card
  const handleAddNewCard = () => {
    setShowAddCardForm(true);
  };

  // Handle save new card
  const handleSaveNewCard = () => {
    // Validate card data
    if (!newCardData.cardNumber || !newCardData.cardName || !newCardData.expiryMonth || !newCardData.expiryYear || !newCardData.cvv) {
      alert('Please fill in all card details');
      return;
    }

    // Validate card number (basic check)
    if (newCardData.cardNumber.replace(/\s/g, '').length < 13) {
      alert('Please enter a valid card number');
      return;
    }

    // Validate expiry
    const month = parseInt(newCardData.expiryMonth);
    const year = parseInt(newCardData.expiryYear);
    if (month < 1 || month > 12) {
      alert('Please enter a valid month (01-12)');
      return;
    }
    if (year < 25) {
      alert('Card has expired');
      return;
    }

    // Here you would normally send to API
    console.log('Saving new card:', newCardData);
    
    // Reset form and close
    setNewCardData({
      cardNumber: '',
      cardName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: ''
    });
    setShowAddCardForm(false);
    
    alert('Card added successfully! (This is a demo)');
  };

  // Handle cancel add card
  const handleCancelAddCard = () => {
    setShowAddCardForm(false);
    setNewCardData({
      cardNumber: '',
      cardName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: ''
    });
  };

  // Format card number with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    // Add space every 4 digits
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setNewCardData({...newCardData, cardNumber: formatted});
  };

  return (
    <div className="checkout-page-wrapper">
      {/* Checkout Header */}
      <header className="checkout-header">
        <div className="container">
          <div className="checkout-header-content">
            <Link to="/cart" className="back-btn">
              <i className="feather-arrow-left"></i>
              <span>Back to Cart</span>
            </Link>
            
            <Link to="/" className="checkout-logo">
              <img src="/assets/images/logo/logo.png" alt="EduLearn" />
            </Link>
            
            <Link to="/help" className="help-link">
              <i className="feather-help-circle"></i>
              <span>Need Help?</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Checkout Hero Section */}
      {/* <div className="checkout-hero-section bg-gradient-11 rbt-section-gapTop pb--60">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="checkout-hero-content">
                <span className="rbt-badge variation-02 bg-color-white color-primary mb--20">
                  <i className="feather-shopping-cart"></i> Checkout
                </span>
                <h1 className="title color-white mb--20">Complete Your Purchase</h1>
                <p className="description color-white-off mb--30">
                  You're just one step away from unlocking {cartCourses.length} amazing courses. 
                  Review your order and choose your preferred payment method.
                </p>
                
                <div className="checkout-progress-bar">
                  <div className="progress-step completed">
                    <span className="step-number"><i className="feather-check"></i></span>
                    <span className="step-label">Cart</span>
                  </div>
                  <div className="progress-line active"></div>
                  <div className="progress-step active">
                    <span className="step-number">2</span>
                    <span className="step-label">Checkout</span>
                  </div>
                  <div className="progress-line"></div>
                  <div className="progress-step">
                    <span className="step-number">3</span>
                    <span className="step-label">Payment</span>
                  </div>
                  <div className="progress-line"></div>
                  <div className="progress-step">
                    <span className="step-number">4</span>
                    <span className="step-label">Confirmation</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-5">
              <div className="checkout-guarantee-card rbt-shadow-box bg-color-white radius-10 p--30">
                <h5 className="mb--20">Our Guarantee</h5>
                <ul className="rbt-list-style-3">
                  <li><i className="feather-check-circle"></i> 30-Day Money-Back Guarantee</li>
                  <li><i className="feather-check-circle"></i> Lifetime Access to Courses</li>
                  <li><i className="feather-check-circle"></i> Secure Payment Processing</li>
                  <li><i className="feather-check-circle"></i> Certificate of Completion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="checkout-main-area bg-color-white rbt-section-gapBottom">
        <div className="container">
          <div className="row g-5">
            {/* Left Column - Payment Method & Course List */}
            <div className="col-lg-8">
              <h2 className="mb--40">Checkout</h2>
              
              {/* Payment Methods */}
              <div className="checkout-payment-wrapper rbt-shadow-box radius-10 p--30 mb--40">
                <h5 className="mb--20">Payment Method</h5>
                
                {/* Payment Options - Horizontal */}
                <div className="payment-options d-flex gap-3 mb--30">
                  <label className={`payment-option-horizontal ${paymentMethod === 'card' ? 'active' : ''}`} style={{ flex: 1 }}>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="option-content text-center">
                      <i className="feather-credit-card" style={{ fontSize: '24px', marginBottom: '8px' }}></i>
                      <h6 className="mb--0">Credit Card</h6>
                    </div>
                  </label>

                  <label className={`payment-option-horizontal ${paymentMethod === 'paypal' ? 'active' : ''}`} style={{ flex: 1 }}>
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="option-content text-center">
                      <i className="feather-dollar-sign" style={{ fontSize: '24px', marginBottom: '8px' }}></i>
                      <h6 className="mb--0">PayPal</h6>
                    </div>
                  </label>

                  <label className={`payment-option-horizontal ${paymentMethod === 'bank' ? 'active' : ''}`} style={{ flex: 1 }}>
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="option-content text-center">
                      <i className="feather-briefcase" style={{ fontSize: '24px', marginBottom: '8px' }}></i>
                      <h6 className="mb--0">Bank Transfer</h6>
                    </div>
                  </label>
                </div>

                {/* Saved Cards - Show only when Credit Card is selected */}
                <div className={`saved-cards-section ${paymentMethod === 'card' ? 'show' : 'hide'}`}>
                  <h6 className="mb--15">Select a saved card</h6>
                  <div className="saved-cards-list">
                    {savedCards.map((card) => (
                      <label key={card.id} className={`saved-card-item ${selectedCard === card.id ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="saved-card"
                          value={card.id}
                          checked={selectedCard === card.id}
                          onChange={(e) => setSelectedCard(e.target.value)}
                        />
                        <div className="card-info">
                          <div className="card-brand-number">
                            <i className="feather-credit-card"></i>
                            <span className="brand">{card.brand}</span>
                            <span className="number">•••• {card.last4}</span>
                          </div>
                          <span className="expiry">Exp: {card.expiry}</span>
                        </div>
                      </label>
                    ))}
                    
                    {!showAddCardForm ? (
                      <button 
                        className="add-card-btn rbt-btn btn-border btn-sm w-100 mt--15" 
                        type="button"
                        onClick={handleAddNewCard}
                      >
                        <i className="feather-plus"></i> Add Another Card
                      </button>
                    ) : (
                      <div className="add-card-form mt--20">
                        <h6 className="mb--15">Add New Card</h6>
                        
                        <div className="form-group mb--15">
                          <label>Card Number</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="1234 5678 9012 3456"
                            value={newCardData.cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength={19}
                          />
                        </div>
                        
                        <div className="form-group mb--15">
                          <label>Cardholder Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="John Doe"
                            value={newCardData.cardName}
                            onChange={(e) => setNewCardData({...newCardData, cardName: e.target.value})}
                          />
                        </div>
                        
                        <div className="row g-3 mb--15">
                          <div className="col-4">
                            <label>Month</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="MM"
                              value={newCardData.expiryMonth}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                if (val.length <= 2) setNewCardData({...newCardData, expiryMonth: val});
                              }}
                              maxLength={2}
                            />
                          </div>
                          <div className="col-4">
                            <label>Year</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="YY"
                              value={newCardData.expiryYear}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                if (val.length <= 2) setNewCardData({...newCardData, expiryYear: val});
                              }}
                              maxLength={2}
                            />
                          </div>
                          <div className="col-4">
                            <label>CVV</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="123"
                              value={newCardData.cvv}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                if (val.length <= 4) setNewCardData({...newCardData, cvv: val});
                              }}
                              maxLength={4}
                            />
                          </div>
                        </div>
                        
                        <div className="d-flex gap-2">
                          <button 
                            className="rbt-btn btn-gradient btn-sm flex-grow-1" 
                            type="button"
                            onClick={handleSaveNewCard}
                          >
                            <i className="feather-save"></i> Save Card
                          </button>
                          <button 
                            className="rbt-btn btn-border btn-sm" 
                            type="button"
                            onClick={handleCancelAddCard}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="checkout-courses-wrapper">
                <div className="section-title mb--30">
                  <h4 className="rbt-title-style-3">Courses in Your Cart ({cartCourses.length})</h4>
                </div>

                <div className="checkout-course-list">
                  {cartCourses.map((course) => (
                    <div key={course.id} className="checkout-course-item d-flex align-items-center rbt-shadow-box radius-10 p--20 mb--20">
                      <div className="course-thumbnail me-3" style={{ width: '80px', height: '60px', flexShrink: 0 }}>
                        <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                      </div>
                      <div className="course-content flex-grow-1">
                        <h6 className="title mb--5">{course.title}</h6>
                        <p className="instructor mb--0" style={{ fontSize: '14px', color: '#6b7385' }}>
                          <i className="feather-user"></i> {course.instructor}
                        </p>
                      </div>
                      <div className="course-price ms-3">
                        <span className="current-price" style={{ fontSize: '18px', fontWeight: 600, color: '#2f57ef' }}>${course.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary with Coupon */}
            <div className="col-lg-4">
              <div className="checkout-sidebar-wrapper">
                {/* Order Summary */}
                <div className="checkout-order-summary rbt-shadow-box radius-10 p--30 mb--30">
                  <h5 className="mb--20">Order Summary</h5>
                  
                  <div className="summary-line">
                    <span>Subtotal:</span>
                    <span className="amount">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {/* Display each applied coupon discount */}
                  {discounts.map((discount) => (
                    <div key={discount.code} className="summary-line discount">
                      <span className="discount-label">
                        <span className="discount-code">{discount.code}</span>
                        <button 
                          className="remove-discount-btn" 
                          type="button"
                          onClick={() => handleRemoveCoupon(discount.code)}
                          title="Remove coupon"
                        >
                          <i className="feather-x"></i>
                        </button>
                      </span>
                      <span className="amount">-${discount.amount.toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <div className="summary-line mb--20">
                    <span>Tax (10%):</span>
                    <span className="amount">${tax.toFixed(2)}</span>
                  </div>
                  
                  {/* Coupon Section */}
                  <div className="checkout-coupon-section mb--20">
                    <div className="coupon-input-group">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value);
                          setCouponError(null);
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        className={couponError ? 'error' : ''}
                      />
                      <button 
                        className="rbt-btn btn-gradient btn-sm" 
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon}
                      >
                        {isApplyingCoupon ? 'Applying...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <div className="coupon-error">
                        <i className="feather-alert-circle"></i>
                        {couponError}
                      </div>
                    )}
                    
                    {/* Show applied coupons list */}
                    {appliedCoupons.length > 0 && (
                      <div className="applied-coupons-list">
                        {appliedCoupons.map((code) => (
                          <div key={code} className="applied-coupon-tag">
                            <i className="feather-tag"></i>
                            <span>{code}</span>
                            <span className="tag-desc">{validCoupons[code].description}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="summary-line total">
                    <span>Total:</span>
                    <span className="amount">${total.toFixed(2)}</span>
                  </div>

                  <button className="rbt-btn btn-gradient w-100 mt--20 hover-icon-reverse" type="button">
                    <span className="icon-reverse-wrapper">
                      <span className="btn-text">Complete Purchase</span>
                      <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                      <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                    </span>
                  </button>
                  
                  {/* <div className="secure-badge mt--20 text-center">
                    <i className="feather-lock"></i>
                    <span>Secure & encrypted payment</span>
                  </div> */}
                  
                  <p className="summary-note">
                    <i className="feather-info"></i> By completing your purchase, you agree to these <a href="#">Terms of Service</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;