import React, { useState, useEffect } from 'react';
import type { CartItem } from '../../../types/cart';
import cartService from '../../../services/cartService';
import { FaStar } from 'react-icons/fa';
import Loading from '../../../components/ui/Loading';

const CartPopup: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            setIsLoading(true);
            try {
                const items = await cartService.getCart();
                setCartItems(items);
            } catch (error) {
                console.error('Failed to fetch cart:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCart();
    }, []);

    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl z-50 border border-gray-100 animate-dropdown-in">
            <div className="p-4">
                <h4 className="font-bold text-gray-800">Shopping Cart</h4>
            </div>
            <div className="border-t border-gray-100"></div>
            {isLoading ? (
                <div className="p-10 text-center">
                    <Loading />
                </div>
            ) : cartItems.length > 0 ? (
                <>
                    <div className="p-4 space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-start gap-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
                                <div className="flex-grow min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate" title={item.name}>{item.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">by {item.tutor}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <FaStar size={16} className="text-yellow-500 pb-0.5" />
                                        <span className="text-xs font-bold text-gray-800">{item.rating.toFixed(1)}</span>
                                        <span className="text-xs text-gray-500">({item.reviews})</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{item.category}</span>
                                        <p className="text-sm font-bold text-gray-800">${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex justify-between items-center text-gray-800 font-semibold mb-4">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <button 
                            onClick={() => {}}
                            className="w-full bg-[#0b6459] text-white font-bold py-2.5 px-4 rounded-lg hover:bg-[#084c43] transition-colors btn-scale"
                        >
                            View Cart Details
                        </button>
                    </div>
                </>
            ) : (
                <div className="p-10 text-center">
                    <p className="text-gray-500">Your cart is empty.</p>
                </div>
            )}
        </div>
    );
};

export default CartPopup;