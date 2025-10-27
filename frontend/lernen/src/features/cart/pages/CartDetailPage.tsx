import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../../components/ui/Layout';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import { AiFillStar, AiOutlineDelete, AiOutlineHeart, AiFillHeart, AiOutlineTag } from 'react-icons/ai';
import { FaClock, FaLanguage, FaCopy } from 'react-icons/fa';
import { MdBook, MdSchool } from 'react-icons/md';
import { HiXCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import type { CartItemResponse } from '../../../services/cartService';
import cartService from '../../../services/cartService';
import wishlistService from '../../../services/wishlistService';

const VALID_SYSTEM_COUPONS: { [key: string]: { type: 'percentage' | 'fixed'; value: number } } = {
    'SAVE20': { type: 'percentage', value: 20 },
    'SUMMER25': { type: 'percentage', value: 25 },
    'NEWUSER10': { type: 'fixed', value: 10 },
};

interface AppliedCoupon {
    code: string;
    discount: number;
}

const StatItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="w-4 h-4 text-gray-500">{icon}</div>
        <span>{text}</span>
    </div>
);


const CartDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [systemCouponInput, setSystemCouponInput] = useState('');
    const [appliedSystemCoupons, setAppliedSystemCoupons] = useState<AppliedCoupon[]>([]);
    const [systemCouponError, setSystemCouponError] = useState<string | null>(null);
    const [wishlistItems, setWishlistItems] = useState<Set<number>>(new Set());
    const [showCouponCode, setShowCouponCode] = useState<{[itemId: number]: boolean}>({});
    const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

    useEffect(() => {
        const fetchCartDetails = async () => {
            try {
                const items = await cartService.getCart();
                setCartItems(items);
                
                // Load wishlist status for cart items
                const wishlistStatus = new Set<number>();
                for (const item of items) {
                    try {
                        const isInWishlist = await wishlistService.isInWishlist(item.courseId);
                        if (isInWishlist) {
                            wishlistStatus.add(item.courseId);
                        }
                    } catch (error) {
                        console.error(`Failed to check wishlist status for course ${item.courseId}:`, error);
                    }
                }
                setWishlistItems(wishlistStatus);
            } catch (error) {
                console.error('Failed to fetch cart details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCartDetails();
    }, []);

    const handleRemoveItem = (id: number) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };
    
    const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price, 0), [cartItems]);

    const itemDiscounts = useMemo(() => {
        return cartItems
            .filter(item => item.appliedCoupon && item.availableCoupon)
            .map(item => {
                const coupon = item.availableCoupon!;
                const discount = coupon.type === 'percentage' ? item.price * (coupon.value / 100) : coupon.value;
                return { name: item.name, discount, code: coupon.code };
            });
    }, [cartItems]);
    
    const itemDiscountsTotal = useMemo(() => itemDiscounts.reduce((sum, d) => sum + d.discount, 0), [itemDiscounts]);
    const systemDiscountsTotal = useMemo(() => appliedSystemCoupons.reduce((sum, coupon) => sum + coupon.discount, 0), [appliedSystemCoupons]);
    const totalDiscount = itemDiscountsTotal + systemDiscountsTotal;
    const tax = (subtotal - itemDiscountsTotal) * 0.1; // Tax calculated after item discounts
    const total = subtotal + tax - totalDiscount;

    const handleApplySystemCoupon = () => {
        const code = systemCouponInput.toUpperCase().trim();
        setSystemCouponError(null);

        if (!code) return;
        
        // Check if coupon is already applied
        if (appliedSystemCoupons.some(c => c.code === code)) {
            setSystemCouponError('This coupon is already applied.');
            return;
        }

        const couponDetails = VALID_SYSTEM_COUPONS[code];
        if (couponDetails) {
            let discountAmount = 0;
            if (couponDetails.type === 'percentage') {
                discountAmount = (subtotal - itemDiscountsTotal) * (couponDetails.value / 100);
            } else {
                discountAmount = couponDetails.value;
            }

            // Only allow 1 coupon - replace the old one if exists
            setAppliedSystemCoupons([{ code, discount: discountAmount }]);
            setSystemCouponInput('');
        } else {
            setSystemCouponError('Invalid coupon code.');
        }
    };
    
    const handleRemoveSystemCoupon = (codeToRemove: string) => {
        setAppliedSystemCoupons(appliedSystemCoupons.filter(c => c.code !== codeToRemove));
    };
    
    const handleRemoveTutorCoupon = async (itemId: number) => {
        try {
            // Để remove coupon, có thể cần gọi API với empty code hoặc endpoint riêng
            // Hiện tại tạm thời chỉ update local state
            setCartItems(items => items.map(item => 
                item.id === itemId ? { ...item, appliedCoupon: undefined } : item
            ));
        } catch (error) {
            console.error('Failed to remove coupon:', error);
        }
    };

    const handleToggleCouponDisplay = (itemId: number) => {
        setShowCouponCode(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleCopyCouponCode = async (couponCode: string) => {
        try {
            await navigator.clipboard.writeText(couponCode);
            setCopiedCoupon(couponCode);
            setTimeout(() => setCopiedCoupon(null), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy coupon code:', err);
        }
    };

    const handleApplyItemCoupon = (couponCode: string) => {
        setSystemCouponInput(couponCode);
        setSystemCouponError(null);
        // Scroll to coupon input section
        const couponSection = document.querySelector('[data-coupon-input]');
        if (couponSection) {
            couponSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleApplyCouponDirectly = async (couponCode: string) => {
        // Apply coupon directly without needing to paste into input
        setSystemCouponInput(couponCode);
        // Auto apply the coupon
        await handleApplySystemCoupon();
    };

    const handleToggleWishlist = async (courseId: number) => {
        const isInWishlist = wishlistItems.has(courseId);
        
        try {
            if (isInWishlist) {
                await wishlistService.removeFromWishlist(courseId);
                setWishlistItems(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(courseId);
                    return newSet;
                });
            } else {
                await wishlistService.addToWishlist(courseId);
                setWishlistItems(prev => new Set([...prev, courseId]));
            }
        } catch (error) {
            console.error('Failed to toggle wishlist:', error);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <Breadcrumb paths={[
                    { name: 'Home', path: '/' },
                    { name: 'Cart', path: '/cart' }
                ]} />
                <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>

                <div className="grid lg:grid-cols-3 gap-8 mt-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {loading ? (
                            <div className="bg-white p-12 text-center rounded-xl shadow-sm">
                                <p className="text-gray-500">Loading cart items...</p>
                            </div>
                        ) : cartItems.length > 0 ? cartItems.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-start gap-6">
                                <img src={item.image} alt={item.name} className="w-full sm:w-32 h-32 rounded-md object-cover flex-shrink-0" />
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <a href="#" onClick={(e) => {e.preventDefault(); navigate('/courseDetail');}} className="font-bold text-lg text-gray-800 hover:text-[#0b6459]">{item.name}</a>
                                            <p className="text-sm text-gray-500 mt-1">by <a href="#" onClick={(e) => {e.preventDefault(); navigate('/tutorDetail');}} className="font-medium text-gray-600 hover:underline">{item.instructor.name}</a></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-gray-800">${item.price.toFixed(2)}</p>
                                            {item.appliedCoupon && item.availableCoupon && (
                                                <p className="text-sm font-semibold text-green-600">
                                                    -${(item.availableCoupon.type === 'percentage' ? item.price * (item.availableCoupon.value/100) : item.availableCoupon.value).toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded-md">{item.category}</span>
                                        <div className="flex items-center gap-1 text-sm">
                                            <AiFillStar className="w-4 h-4 text-orange-400" />
                                            <span className="font-bold">{item.rating.toFixed(1)}</span>
                                            <span className="text-gray-500">({item.reviews} reviews)</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs">
                                        <StatItem icon={<MdSchool className="w-4 h-4 text-gray-500" />} text={item.level} />
                                        <StatItem icon={<FaLanguage className="w-4 h-4 text-gray-500" />} text={item.language} />
                                        <StatItem icon={<MdBook className="w-4 h-4 text-gray-500" />} text={`${item.lessons} lessons`} />
                                        <StatItem icon={<FaClock className="w-4 h-4 text-gray-500" />} text={item.duration} />
                                    </div>

                                    {/* See Available Coupon Button - luôn hiển thị nhưng disabled nếu không có coupon */}
                                    <div className="mt-3">
                                        <button
                                            onClick={() => item.availableCoupon && handleToggleCouponDisplay(item.id)}
                                            disabled={!item.availableCoupon}
                                            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                                                item.availableCoupon
                                                    ? 'text-[#0b6459] hover:text-[#084c43] cursor-pointer'
                                                    : 'text-gray-400 cursor-not-allowed opacity-60'
                                            }`}
                                        >
                                            <AiOutlineTag className="w-4 h-4" />
                                            See Available Coupon
                                        </button>

                                        {/* Coupon Code Display */}
                                        {showCouponCode[item.id] && item.availableCoupon && (
                                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-semibold text-blue-800">
                                                            Coupon Code: <span className="font-mono bg-blue-100 px-2 py-1 rounded text-blue-900">{item.availableCoupon.code}</span>
                                                        </p>
                                                        <p className="text-xs text-blue-600 mt-1">
                                                            {item.availableCoupon.type === 'percentage'
                                                                ? `${item.availableCoupon.value}% off`
                                                                : `$${item.availableCoupon.value} off`
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleCopyCouponCode(item.availableCoupon!.code)}
                                                            className="flex items-center gap-1 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                                                        >
                                                            <FaCopy className="w-3 h-3" />
                                                            {copiedCoupon === item.availableCoupon!.code ? 'Copied!' : 'Copy'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleApplyItemCoupon(item.availableCoupon!.code)}
                                                            className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors"
                                                        >
                                                            Copy & Apply
                                                        </button>
                                                        <button
                                                            onClick={() => handleApplyCouponDirectly(item.availableCoupon!.code)}
                                                            className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition-colors"
                                                        >
                                                            Apply Directly
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                                        <div>
                                            {item.appliedCoupon ? (
                                                <div className="bg-green-100 text-green-800 text-xs font-semibold pl-2.5 pr-1 py-1 rounded-full flex items-center gap-1.5">
                                                    <span>{item.appliedCoupon} applied</span>
                                                    <button onClick={() => handleRemoveTutorCoupon(item.id)} className="bg-green-200 hover:bg-green-300 text-green-900 rounded-full h-4 w-4 flex items-center justify-center focus:outline-none transition-colors cursor-pointer">
                                                        <HiXCircle className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleToggleWishlist(item.courseId)}
                                                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                                            >
                                                {wishlistItems.has(item.courseId) ? (
                                                    <AiFillHeart className="w-5 h-5 text-red-500" />
                                                ) : (
                                                    <AiOutlineHeart className="w-5 h-5 text-gray-400 hover:text-red-400" />
                                                )}
                                            </button>
                                            <button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 p-1 cursor-pointer">
                                                <AiOutlineDelete className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="bg-white p-12 text-center rounded-xl shadow-sm">
                                <h2 className="text-xl font-semibold">Your cart is empty.</h2>
                                <p className="text-gray-500 mt-2">Looks like you haven't added anything to your cart yet.</p>
                                <button onClick={() => navigate('/findCourses')} className="mt-6 bg-[#0b6459] text-white font-semibold py-2 px-5 rounded-lg">Browse Courses</button>
                            </div>
                        )}
                    </div>

                    {/* Summary */}
                    {cartItems.length > 0 && (
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
                                <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4">Summary</h2>
                                <div className="space-y-3 mt-4 text-sm">

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
                                    </div>

                                    {itemDiscounts.map((d, i) => (
                                         <div key={i} className="flex justify-between text-green-600">
                                            <span className="text-gray-600 truncate pr-2">Discount ({d.code})</span>
                                            <span className="font-semibold">-${d.discount.toFixed(2)}</span>
                                        </div>
                                    ))}

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax (10%)</span>
                                        <span className="font-semibold text-gray-800">${tax.toFixed(2)}</span>
                                    </div>

                                    {appliedSystemCoupons.map(coupon => (
                                        <div key={coupon.code} className="flex justify-between text-green-600">
                                            <span className="text-gray-600">Discount ({coupon.code})</span>
                                            <span className="font-semibold">-${coupon.discount.toFixed(2)}</span>
                                        </div>
                                    ))}

                                    <div className="pt-2">
                                        {appliedSystemCoupons.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {appliedSystemCoupons.map(coupon => (
                                                    <div key={coupon.code} className="bg-gray-100 text-gray-700 text-xs font-semibold pl-2.5 pr-1 py-1 rounded-full flex items-center gap-1.5">
                                                        <span>{coupon.code}</span>
                                                        <button onClick={() => handleRemoveSystemCoupon(coupon.code)} className="bg-gray-300 hover:bg-gray-400 text-gray-600 hover:text-black rounded-full h-4 w-4 flex items-center justify-center focus:outline-none transition-colors cursor-pointer">
                                                          <HiXCircle className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2" data-coupon-input>
                                            <input
                                                type="text"
                                                placeholder="e.g. SAVE20"
                                                className={`w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none placeholder-gray-400 ${
                                                    systemCouponError ? 'border-red-500 focus:ring-1 focus:ring-red-200' : 'border-gray-300 focus:ring-1 focus:ring-[#0b6459]'
                                                }`} 
                                                value={systemCouponInput}
                                                onChange={(e) => setSystemCouponInput(e.target.value)}
                                                 />
                                            <button onClick={handleApplySystemCoupon} className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-300 cursor-pointer border  border-gray-200">Apply</button>
                                        </div>
                                        {systemCouponError && <p className="text-xs text-red-500 mt-1">{systemCouponError}</p>}

                                        {/* Available Coupons */}
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <p className="text-xs font-semibold text-gray-700 mb-2">Available Coupons:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {Object.entries(VALID_SYSTEM_COUPONS).map(([code, details]) => {
                                                    const isApplied = appliedSystemCoupons.some(c => c.code === code);
                                                    return (
                                                        <button
                                                            key={code}
                                                            onClick={() => {
                                                                setSystemCouponInput(code);
                                                                setSystemCouponError(null);
                                                            }}
                                                            className={`text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors ${
                                                                isApplied
                                                                    ? 'bg-green-50 text-green-700 border-green-200 cursor-pointer hover:bg-green-100'
                                                                    : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 cursor-pointer'
                                                            }`}
                                                        >
                                                            {code}
                                                            <span className="text-xs text-gray-600 ml-1">
                                                                ({details.value}{details.type === 'percentage' ? '%' : '$'} off)
                                                            </span>
                                                            {isApplied && <span className="ml-1 text-green-700">✓</span>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t border-gray-200 my-4"></div>
                                <div className="flex justify-between items-center font-bold text-lg">
                                    <span>Total</span>
                                    <span>${total > 0 ? total.toFixed(2) : '0.00'}</span>
                                </div>
                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full mt-6 bg-[#0b6459] text-white font-bold py-3 rounded-lg hover:bg-[#084c43] transition-colors cursor-pointer"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default CartDetailPage;