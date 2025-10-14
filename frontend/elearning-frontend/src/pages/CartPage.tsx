import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../scss/pages/_cart-page.scss';

type CartItem = {
  id: number;
  title: string;
  instructor: string;
  rating: number;
  totalReviews: number;
  lessons: number;
  lectures: number;
  duration: string;
  level: string;
  thumbnail: string;
  price: number;
};

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      title: 'Complete Web Development Bootcamp 2024',
      instructor: 'John Doe',
      rating: 4.8,
      totalReviews: 1250,
      lessons: 120,
      lectures: 85,
      duration: '40 hours',
      level: 'Beginner to Advanced',
      thumbnail: '/assets/images/course/course-online-01.jpg',
      price: 89.99,
    },
    {
      id: 2,
      title: 'Advanced React & Redux Masterclass',
      instructor: 'Sarah Johnson',
      rating: 4.9,
      totalReviews: 890,
      lessons: 95,
      lectures: 70,
      duration: '25 hours',
      level: 'Advanced',
      thumbnail: '/assets/images/course/course-online-03.jpg',
      price: 79.99,
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Mike Wilson',
      rating: 4.7,
      totalReviews: 650,
      lessons: 80,
      lectures: 60,
      duration: '30 hours',
      level: 'Beginner',
      thumbnail: '/assets/images/course/course-online-05.jpg',
      price: 69.99,
    },
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const shippingCost: number = 0;
  const discount = appliedCoupon ? couponDiscount : 0;
  const grandTotal = subtotal + shippingCost - discount;

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleAddToWishlist = (id: number) => {
    // Demo: In real app, this would add to wishlist
    alert('Added to wishlist! (This is a demo)');
  };

  const handleApplyCoupon = () => {
    // Demo coupon logic
    if (couponCode.toUpperCase() === 'SAVE20') {
      setAppliedCoupon('SAVE20');
      setCouponDiscount(subtotal * 0.2);
    } else if (couponCode.toUpperCase() === 'SAVE10') {
      setAppliedCoupon('SAVE10');
      setCouponDiscount(subtotal * 0.1);
    } else {
      alert('Invalid coupon code');
    }
  };

  return (
    <div className="cart-page-wrapper">
      {/* Cart Header */}
      <header className="cart-header">
        <div className="container">
          <div className="cart-header-content">
            <Link to="/courses" className="back-btn">
              <i className="feather-arrow-left"></i>
              <span>Continue Shopping</span>
            </Link>
            
            <Link to="/" className="cart-logo">
              <img src="/assets/images/logo/logo.png" alt="EduLearn" />
            </Link>
            
            <Link to="/help" className="help-link">
              <i className="feather-help-circle"></i>
              <span>Need Help?</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="cart-main-area bg-color-white rbt-section-gapBottom">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="mb--40">Shopping Cart</h2>

              {cartItems.length === 0 ? (
                <div className="empty-cart text-center py-5">
                  <i className="feather-shopping-cart" style={{ fontSize: '80px', color: '#ccc' }}></i>
                  <h3 className="mt-4">Your cart is empty</h3>
                  <p className="mb-4">Add some courses to get started!</p>
                  <Link to="/courses" className="rbt-btn btn-gradient">
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <>
                  {/* Cart Items and Summary */}
                  <div className="row g-5">
                    {/* Left Column - Cart Items */}
                    <div className="col-lg-8">
                      <div className="cart-list-wrapper rbt-shadow-box radius-10 p--30">
                        <h4 className="cart-list-title mb--30">
                          {cartItems.length} {cartItems.length === 1 ? 'Course' : 'Courses'} in your cart
                        </h4>
                        
                        <div className="cart-items-list">
                          {cartItems.map((item) => (
                            <div key={item.id} className="cart-item-card d-flex align-items-center rbt-shadow-box radius-10 p--20 mb--20">
                              <div className="item-thumbnail me-3" style={{ width: '120px', height: '80px', flexShrink: 0 }}>
                                <Link to={`/course/${item.id}`}>
                                  <img src={item.thumbnail} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                </Link>
                              </div>
                              
                              <div className="item-content flex-grow-1 me-4">
                                <div className="d-flex justify-content-between align-items-center mb--10">
                                  <h5 className="item-title mb--0 flex-grow-1">
                                    <Link to={`/course/${item.id}`} className="text-decoration-none">
                                      {item.title}
                                    </Link>
                                  </h5>
                                  <div className="item-price ms-3">
                                    <span className="price-amount">${item.price.toFixed(2)}</span>
                                  </div>
                                </div>
                                
                                <div className="course-meta">
                                  <div className="meta-row meta-row-primary mb--10">
                                    <span className="instructor">
                                      <i className="feather-user"></i> {item.instructor}
                                    </span>
                                    <span className="rating">
                                      <i className="feather-star"></i> {item.rating} ({item.totalReviews} reviews)
                                    </span>
                                  </div>
                                  <div className="meta-row meta-row-secondary">
                                    <span className="duration">
                                      <i className="feather-clock"></i> {item.duration}
                                    </span>
                                    <span className="lectures">
                                      <i className="feather-play-circle"></i> {item.lectures} lectures
                                    </span>
                                    <span className="level">
                                      <i className="feather-trending-up"></i> {item.level}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="item-actions d-flex flex-column gap-2 ms-3">
                                <button 
                                  className="wishlist-btn"
                                  onClick={() => handleAddToWishlist(item.id)}
                                  title="Add to Wishlist"
                                >
                                  <i className="feather-heart"></i>
                                </button>
                                <button 
                                  className="remove-btn"
                                  onClick={() => handleRemoveItem(item.id)}
                                  title="Remove from cart"
                                >
                                  <i className="feather-x"></i>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Cart Summary */}
                    <div className="col-lg-4">
                      <div className="cart-summary rbt-shadow-box radius-10 p--30">
                        <h5 className="mb--20">Cart Summary</h5>
                        
                        {/* Coupon Section */}
                        <div className="discount-coupon-section mb--20">
                          <h6 className="mb--15">Discount Coupon Code</h6>
                          <div className="coupon-input-group">
                            <input
                              type="text"
                              placeholder="Enter coupon code"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                            />
                            <button 
                              className="rbt-btn btn-gradient btn-sm" 
                              type="button"
                              onClick={handleApplyCoupon}
                            >
                              Apply Code
                            </button>
                          </div>
                          {appliedCoupon && (
                            <div className="applied-coupon-badge mt--15">
                              <i className="feather-check-circle"></i>
                              <span>Coupon "{appliedCoupon}" applied successfully!</span>
                            </div>
                          )}
                        </div>

                        <div className="summary-divider"></div>
                        
                        <div className="summary-line">
                          <span>Subtotal:</span>
                          <span className="amount">${subtotal.toFixed(2)}</span>
                        </div>

                        {discount > 0 && (
                          <div className="summary-line discount">
                            <span>Discount ({appliedCoupon}):</span>
                            <span className="amount">-${discount.toFixed(2)}</span>
                          </div>
                        )}

                        {/* <div className="summary-divider"></div> */}

                        <div className="summary-line total">
                          <span>Grand Total:</span>
                          <span className="amount">${grandTotal.toFixed(2)}</span>
                        </div>

                        <div className="cart-submit-btn-group mt--30">
                          <Link 
                            to="/checkout" 
                            className="rbt-btn btn-gradient w-100 mb--15 hover-icon-reverse"
                          >
                            <span className="icon-reverse-wrapper">
                              <span className="btn-text">Proceed to Checkout</span>
                              <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                              <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                            </span>
                          </Link>
                          {/* <Link 
                            to="/courses" 
                            className="rbt-btn btn-border w-100"
                          >
                            Continue Shopping
                          </Link> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
