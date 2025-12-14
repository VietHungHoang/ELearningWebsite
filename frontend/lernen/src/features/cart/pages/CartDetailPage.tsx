import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../../components/ui/Layout';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import { AiFillStar, AiOutlineDelete, AiOutlineHeart, AiFillHeart, AiOutlineTag } from 'react-icons/ai';
import { FaClock, FaLanguage } from 'react-icons/fa';
import { MdBook, MdSchool } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import type { CartItem } from '../../../types/cart';
import cartService from '../../../services/cartService';
import wishlistService from '../../../services/wishlistService';
import { useTranslation } from 'react-i18next';

const StatItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="w-4 h-4 text-gray-500">{icon}</div>
        <span>{text}</span>
    </div>
);


const CartDetailPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [couponInput, setCouponInput] = useState('');
    const [couponError, setCouponError] = useState<string | null>(null);
    const [wishlistItems, setWishlistItems] = useState<Set<number>>(new Set());
    const [showCouponCode, setShowCouponCode] = useState<{[itemId: number]: boolean}>({});

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

    const handleRemoveItem = async (id: number) => {
        try {
            setLoading(true); // Show loading state
            
            // Tìm item để lấy courseId
            const itemToRemove = cartItems.find(item => item.id === id);
            if (!itemToRemove) {
                console.error('Item not found in cart');
                return;
            }

            // Optimistic update - xóa item khỏi UI ngay lập tức
            setCartItems(prev => prev.filter(item => item.id !== id));

            try {
                await cartService.removeItem(itemToRemove.courseId);
            } catch (error) {
                console.error('Failed to remove item from cart:', error);
                setCartItems(prev => [...prev, itemToRemove]);
                
                alert('Failed to remove item from cart. Please try again.');
            }
        } finally {
            setLoading(false);
        }
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
    const totalDiscount = itemDiscountsTotal;
    const tax = (subtotal - itemDiscountsTotal) * 0.1; // Tax calculated after item discounts
    const total = subtotal + tax - totalDiscount;

    const handleToggleCouponDisplay = (itemId: number) => {
        setShowCouponCode(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };



    const handleApplyCouponDirectly = async (couponCode: string) => {
        // Apply coupon to the specific course that has this coupon
        const code = couponCode.toUpperCase().trim();

        // Find the course that has this coupon
        const targetCourse = cartItems.find(item => item.availableCoupon?.code.toUpperCase() === code);

        if (targetCourse) {
            // Apply coupon to this specific course
            setCartItems(items => items.map(item =>
                item.id === targetCourse.id
                    ? { ...item, appliedCoupon: couponCode }
                    : item
            ));
            setCouponInput(couponCode); // Set input to show applied coupon
        }
    };

    const handleApplyCouponFromInput = () => {
        const code = couponInput.toUpperCase().trim();
        setCouponError(null);

        if (!code) {
            // If input is empty, remove all applied coupons
            setCartItems(items => items.map(item => ({ ...item, appliedCoupon: undefined })));
            return;
        }

        // Find the course that has this coupon
        const targetCourse = cartItems.find(item => item.availableCoupon?.code.toUpperCase() === code);

        if (targetCourse) {
            // Check if coupon is already applied to this course
            if (targetCourse.appliedCoupon?.toUpperCase() === code) {
                setCouponError('This coupon is already applied to this course.');
                return;
            }

            // Apply coupon to this specific course
            setCartItems(items => items.map(item =>
                item.id === targetCourse.id
                    ? { ...item, appliedCoupon: code }
                    : item
            ));
        } else {
            setCouponError('Invalid coupon code or coupon not available for any course in your cart.');
        }
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
                <h1 className="text-3xl font-bold text-gray-800">{t('cart.shoppingCart')}</h1>

                <div className="grid lg:grid-cols-3 gap-8 mt-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {loading ? (
                            <div className="bg-white p-12 text-center rounded-xl shadow-sm">
                                <p className="text-gray-500">{t('cart.loadingCart')}</p>
                            </div>
                        ) : cartItems.length > 0 ? cartItems.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-start gap-6">
                                <img src={item.image} alt={item.name} className="w-full sm:w-32 h-32 rounded-md object-cover flex-shrink-0" />
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <a href="#" onClick={(e) => {e.preventDefault(); navigate(`/course-detail/${item.courseId}`);}} className="font-bold text-lg text-gray-800 hover:text-[#0b6459]">{item.name}</a>
                                            <p className="text-sm text-gray-500 mt-1">{t('cart.byTutor', { tutor: item.tutor })}</p>
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
                                            {t('cart.seeAvailableCoupon')}
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
                                                            ${item.availableCoupon.value}% off
                                                        </p>
                                                    </div>
                                                    {!item.appliedCoupon ? (
                                                        <button
                                                            onClick={() => handleApplyCouponDirectly(item.availableCoupon!.code)}
                                                            className="text-sm bg-[#0b6459] text-white px-4 py-1 rounded hover:bg-[#084c43] transition-colors"
                                                        >
                                                            {t('cart.apply')}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setCouponInput(item.appliedCoupon!);
                                                                setCouponError(null);
                                                            }}
                                                            className="text-sm text-green-600 font-medium hover:text-green-700 cursor-pointer"
                                                        >
                                                            ✓ {t('cart.apply')}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                                        <div>
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
                                <h2 className="text-xl font-semibold">{t('cart.cartEmpty')}</h2>
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

                                    <div className="pt-2">
                                        {/* Item discounts are already shown above */}
                                    </div>
                                </div>
                                <div className="border-t border-gray-200 my-4"></div>
                                <div className="flex justify-between items-center font-bold text-lg">
                                    <span>Total</span>
                                    <span>${total > 0 ? total.toFixed(2) : '0.00'}</span>
                                </div>

                                {/* Coupon Input Section */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <label htmlFor="coupon-input" className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('cart.haveCouponCode')}
                                    </label>

                                    {/* Applied Coupons Display */}
                                    {cartItems.some(item => item.appliedCoupon) && (
                                        <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-md">
                                            <div className="flex flex-wrap gap-2">
                                                {cartItems
                                                    .filter(item => item.appliedCoupon)
                                                    .map(item => (
                                                        <div key={item.id} className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded border border-green-300">
                                                            <span className="font-mono font-semibold text-green-700 text-sm">{item.appliedCoupon}</span>
                                                            <button
                                                                onClick={() => handleRemoveTutorCoupon(item.id)}
                                                                className="text-red-500 hover:text-red-700 font-bold text-sm cursor-pointer transition-colors"
                                                                title="Remove this coupon"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <input
                                            id="coupon-input"
                                            type="text"
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value)}
                                            placeholder={t('cart.enterCouponCode')}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b6459] focus:border-transparent"
                                            onKeyPress={(e) => e.key === 'Enter' && handleApplyCouponFromInput()}
                                        />
                                        <button
                                            onClick={handleApplyCouponFromInput}
                                            className="px-4 py-2 bg-[#0b6459] text-white rounded-md hover:bg-[#084c43] transition-colors font-medium"
                                        >
                                            {t('cart.apply')}
                                        </button>
                                    </div>
                                    {couponError && (
                                        <p className="text-red-500 text-sm mt-1">{couponError}</p>
                                    )}
                                </div>

                                {/* Available Coupons Section */}
                                {cartItems.some(item => item.availableCoupon) && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h3 className="text-sm font-medium text-gray-700 mb-3">{t('cart.availableCoupons')}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {cartItems
                                                .filter(item => item.availableCoupon)
                                                .map(item => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => {
                                                        if (item.appliedCoupon) {
                                                            setCouponInput(item.appliedCoupon);
                                                            setCouponError(null);
                                                        } else {
                                                            setCouponInput(item.availableCoupon!.code);
                                                            setCouponError(null);
                                                        }
                                                    }}
                                                    className={`relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                                        item.appliedCoupon
                                                            ? 'bg-green-100 text-green-800 hover:bg-blue-100 hover:text-blue-800 cursor-pointer'
                                                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer border border-blue-200'
                                                    }`}
                                                >
                                                        <AiOutlineTag className="w-4 h-4" />
                                                        <span className="font-mono">{item.availableCoupon!.code}</span>
                                                        <span className="text-xs">
                                                            ({item.availableCoupon!.type === 'percentage'
                                                                ? `${item.availableCoupon!.value}%`
                                                                : `$${item.availableCoupon!.value}`
                                                            } off)
                                                        </span>
                                                        {item.appliedCoupon && <span className="text-green-600">✓</span>}
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full mt-6 bg-[#0b6459] text-white font-bold py-3 rounded-lg hover:bg-[#084c43] transition-colors cursor-pointer"
                                >
                                    {t('cart.proceedToCheckout')}
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