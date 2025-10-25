import React, { useEffect, useMemo, useRef, useState } from 'react';
import Layout from '../../../components/ui/Layout';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import { AiFillStar, AiOutlineDelete } from 'react-icons/ai';
import { FaClock, FaLanguage } from 'react-icons/fa';
import { MdBook, MdSchool } from 'react-icons/md';
import { HiXCircle, HiTag } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import type { CartItemDetail } from '../../../types/api';
import cartService from '../../../services/cartService';

const VALID_SYSTEM_COUPONS: { [key: string]: { type: 'percentage' | 'fixed'; value: number } } = {
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
    const [cartItems, setCartItems] = useState<CartItemDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [systemCouponInput, setSystemCouponInput] = useState('');
    const [appliedSystemCoupons, setAppliedSystemCoupons] = useState<AppliedCoupon[]>([]);
    const [systemCouponError, setSystemCouponError] = useState<string | null>(null);
    const [openCouponPopover, setOpenCouponPopover] = useState<number | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchCartDetails = async () => {
            try {
                const data = await cartService.getCartDetail();
                setCartItems(data);
            } catch (error) {
                console.error('Failed to fetch cart details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCartDetails();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setOpenCouponPopover(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleRemoveItem = (id: number) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };
    
    const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price, 0), [cartItems]);

    const itemDiscounts = useMemo(() => {
        return cartItems
            .filter(item => item.appliedCouponCode && item.availableCoupon)
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
        
        if (appliedSystemCoupons.some(c => c.code === code)) {
            setSystemCouponError('Coupon has already been applied.');
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

            setAppliedSystemCoupons([...appliedSystemCoupons, { code, discount: discountAmount }]);
            setSystemCouponInput('');
        } else {
            setSystemCouponError('Invalid system coupon code.');
        }
    };
    
    const handleRemoveSystemCoupon = (codeToRemove: string) => {
        setAppliedSystemCoupons(appliedSystemCoupons.filter(c => c.code !== codeToRemove));
    };
    
    const handleApplyTutorCoupon = (itemId: number, couponCode: string) => {
        setCartItems(items => items.map(item => item.id === itemId ? { ...item, appliedCouponCode: couponCode } : item));
        setOpenCouponPopover(null);
    };

    const handleRemoveTutorCoupon = (itemId: number) => {
         setCartItems(items => items.map(item => item.id === itemId ? { ...item, appliedCouponCode: undefined } : item));
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
                                            <p className="text-sm text-gray-500 mt-1">by <a href="#" onClick={(e) => {e.preventDefault(); navigate('/tutorDetail');}} className="font-medium text-gray-600 hover:underline">{item.tutor}</a></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-gray-800">${item.price.toFixed(2)}</p>
                                            {item.appliedCouponCode && item.availableCoupon && (
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
                                    
                                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                                        <div>
                                            {item.appliedCouponCode ? (
                                                <div className="bg-green-100 text-green-800 text-xs font-semibold pl-2.5 pr-1 py-1 rounded-full flex items-center gap-1.5">
                                                    <span>{item.appliedCouponCode} applied</span>
                                                    <button onClick={() => handleRemoveTutorCoupon(item.id)} className="bg-green-200 hover:bg-green-300 text-green-900 rounded-full h-4 w-4 flex items-center justify-center focus:outline-none transition-colors cursor-pointer">
                                                        <HiXCircle className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <button 
                                                        onClick={() => item.availableCoupon && setOpenCouponPopover(openCouponPopover === item.id ? null : item.id)} 
                                                        disabled={!item.availableCoupon}
                                                        className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                                                            item.availableCoupon 
                                                            ? 'text-blue-600 hover:text-blue-800 cursor-pointer' 
                                                            : 'text-gray-400 cursor-not-allowed'
                                                        }`}
                                                    >
                                                        <HiTag className="h-3 w-3" /> See available coupons
                                                    </button>
                                                    {item.availableCoupon && openCouponPopover === item.id && (
                                                        <div ref={popoverRef} className="absolute top-full left-0 mt-2 w-64 bg-white p-3 rounded-lg shadow-lg border border-gray-200 z-10 animate-fade-in-up">
                                                            <p className="text-xs font-bold text-gray-800 mb-2">Tutor Coupon</p>
                                                            <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                                                <div>
                                                                    <p className="text-sm font-bold text-gray-700">{item.availableCoupon.code}</p>
                                                                    <p className="text-xs text-gray-500">{item.availableCoupon.value}{item.availableCoupon.type === 'percentage' ? '%' : '$'} off this course</p>
                                                                </div>
                                                                <button onClick={() => handleApplyTutorCoupon(item.id, item.availableCoupon!.code)} className="text-xs bg-blue-600 text-white px-2 py-1 rounded font-semibold hover:bg-blue-700">Apply</button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 p-1 cursor-pointer">
                                            <AiOutlineDelete className="w-5 h-5" />
                                        </button>
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

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                placeholder="Coupon code"
                                                className={`w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none placeholder-gray-400 ${
                                                    systemCouponError ? 'border-red-500 focus:ring-1 focus:ring-red-200' : 'border-gray-300 focus:ring-1 focus:ring-[#0b6459]'
                                                }`} 
                                                value={systemCouponInput}
                                                onChange={(e) => setSystemCouponInput(e.target.value)}
                                                 />
                                            <button onClick={handleApplySystemCoupon} className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-300 cursor-pointer border  border-gray-200">Apply</button>
                                        </div>
                                        {systemCouponError && <p className="text-xs text-red-500 mt-1">{systemCouponError}</p>}
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