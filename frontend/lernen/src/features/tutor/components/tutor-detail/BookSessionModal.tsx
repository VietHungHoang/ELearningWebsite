import React, { useState, useEffect } from 'react';
import { FiX, FiCheckCircle, FiLoader } from 'react-icons/fi';

interface BookSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: { name: string; avatar: string; price: number; };
  navigateToApp: (page: string) => void;
}

const packages = [
    { sessions: 5, pricePerSession: 40, discount: 0, isBestValue: false },
    { sessions: 10, pricePerSession: 36, discount: 10, isBestValue: true },
    { sessions: 20, pricePerSession: 34, discount: 15, isBestValue: false },
    { sessions: 30, pricePerSession: 32, discount: 20, isBestValue: false },
];

const BookSessionModal: React.FC<BookSessionModalProps> = ({ isOpen, onClose, tutor, navigateToApp }) => {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [selectedPackageIndex, setSelectedPackageIndex] = useState<number | null>(1); // Default to best value
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => {
                setShouldRender(false);
                document.body.style.overflow = 'auto';
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };
    
    const handleCheckout = () => {
        if (selectedPackageIndex === null) return;
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            navigateToApp('checkout');
        }, 1500); // Simulate API call
    };

    const selectedPackage = selectedPackageIndex !== null ? packages[selectedPackageIndex] : null;
    const totalPrice = selectedPackage ? selectedPackage.sessions * selectedPackage.pricePerSession : 0;

    if (!shouldRender) return null;

    return (
        <div 
            className={`fixed inset-0 bg-black bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleOverlayClick}
            role="dialog" aria-modal="true"
        >
            <div 
                className={`bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'animate-modal-in' : 'animate-modal-out'}`} 
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <img src={tutor.avatar} alt={tutor.name} className="w-12 h-12 rounded-full" />
                        <div>
                            <h2 className="font-bold text-lg text-gray-800">Book a Session</h2>
                            <p className="text-sm text-gray-500">with {tutor.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full"><FiX /></button>
                </div>

                {/* Body */}
                <div className="p-8">
                    <h3 className="text-xl font-bold text-center text-gray-800">Choose Your Session Package</h3>
                    <p className="text-center text-gray-500 mt-1">Commit to your learning and save more.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                        {packages.map((pkg, index) => {
                            const total = pkg.sessions * pkg.pricePerSession;
                            const isSelected = selectedPackageIndex === index;

                            return (
                                <button
                                    key={index}
                                    onClick={() => setSelectedPackageIndex(index)}
                                    className={`relative text-left p-5 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                                        isSelected 
                                        ? 'border-transparent bg-[#0b6459] text-white shadow-lg transform scale-105' 
                                        : 'bg-gray-50 border-gray-200 hover:border-[#0b6459]/50 hover:bg-white'
                                    }`}
                                >
                                    {pkg.isBestValue && (
                                        <div className={`absolute top-0 right-4 -translate-y-1/2 px-3 py-1 text-xs font-bold rounded-full ${isSelected ? 'bg-white text-[#0b6459]' : 'bg-[#0b6459] text-white'}`}>
                                            Best Value
                                        </div>
                                    )}
                                    
                                    <h4 className="text-xl font-bold">{pkg.sessions} Sessions</h4>
                                    <p className={`text-sm ${isSelected ? 'text-gray-200' : 'text-gray-500'}`}>${pkg.pricePerSession.toFixed(2)}/session</p>
                                    
                                    <div className="mt-4 flex items-baseline gap-2">
                                        <p className="text-2xl font-extrabold">${total.toFixed(2)}</p>
                                        {pkg.discount > 0 && (
                                             <span className={`font-semibold text-sm ${isSelected ? 'text-green-300' : 'text-green-600'}`}>Save {pkg.discount}%</span>
                                        )}
                                    </div>

                                    {isSelected && (
                                        <div className="absolute top-4 right-4 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                            <div className="w-4 h-4 text-white"><FiCheckCircle /></div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                     <div className="flex items-center justify-center gap-2 mb-4">
                        <p className="text-xs text-gray-500">Secure payments</p>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={selectedPackageIndex === null || isProcessing}
                        className="w-full bg-[#0b6459] text-white font-bold py-4 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed btn-scale"
                    >
                        {isProcessing ? (
                            <FiLoader className="h-5 w-5 text-white animate-spin" />
                        ) : (
                            <span>Proceed to Checkout - ${totalPrice.toFixed(2)}</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookSessionModal;
