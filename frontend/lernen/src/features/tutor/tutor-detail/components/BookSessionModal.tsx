import React, { useState } from 'react';
import { FiX, FiCheckCircle, FiLoader } from 'react-icons/fi';
import ModalLayout from '../../../../components/ui/ModalLayout';
import Avatar from 'react-avatar';
import { useCurrency } from '../../../../context/CurrencyContext';
import { convertFromVND, formatCurrency } from '../../../../utils/currencyHelper';

interface BookSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: { name: string; avatar: string; currentSessionFee: number; };
  navigateToApp: (page: string) => void;
}

const packages = [
    { sessions: 5, discount: 0, isBestValue: false },
    { sessions: 10, discount: 10, isBestValue: true },
    { sessions: 20, discount: 15, isBestValue: false },
    { sessions: 30, discount: 20, isBestValue: false },
];

const BookSessionModal: React.FC<BookSessionModalProps> = ({ isOpen, onClose, tutor, navigateToApp }) => {
    const [selectedPackageIndex, setSelectedPackageIndex] = useState<number | null>(1); // Default to best value
    const [isProcessing, setIsProcessing] = useState(false);
    const { selectedCurrency } = useCurrency();

    // Convert base price from VND to selected currency
    const convertedBasePrice = convertFromVND(tutor.currentSessionFee, selectedCurrency);

    // Calculate price per session after discount (in selected currency)
    const calculatePricePerSession = (discount: number) => {
        const discountedPrice = convertedBasePrice * (1 - discount / 100);
        return discountedPrice;
    };

    // Calculate total price (in selected currency)
    const calculateTotalPrice = (sessions: number, discount: number) => {
        const pricePerSession = calculatePricePerSession(discount);
        return sessions * pricePerSession;
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
    const totalPrice = selectedPackage ? calculateTotalPrice(selectedPackage.sessions, selectedPackage.discount) : 0;

    return (
        <ModalLayout
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="flex flex-col overflow-hidden w-full max-w-2xl min-w-[400px]">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <Avatar
                            src={tutor.avatar}
                            name={tutor.name}
                            size="48"
                            round="8px"
                            className="w-12 h-12"
                        />
                        <div>
                            <h2 className="font-bold text-base text-gray-800">Book a Session</h2>
                            <p className="text-sm text-gray-500">with {tutor.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full"><FiX /></button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <h3 className="text-lg font-bold text-center text-gray-800">Choose Your Session Package</h3>
                    <p className="text-center text-gray-500 mt-1">Commit to your learning and save more.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        {packages.map((pkg, index) => {
                            const pricePerSession = calculatePricePerSession(pkg.discount);
                            const total = calculateTotalPrice(pkg.sessions, pkg.discount);
                            const isSelected = selectedPackageIndex === index;

                            return (
                                <button
                                    key={index}
                                    onClick={() => setSelectedPackageIndex(index)}
                                    className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                                        isSelected 
                                        ? 'border-transparent bg-[#0b6459] text-white shadow-lg transform scale-105' 
                                        : 'bg-gray-50 border-gray-200 hover:border-[#0b6459]/50 hover:bg-white'
                                    }`}
                                >
                                    {pkg.isBestValue && (
                                        <div className={`absolute top-0 right-4 -translate-y-1/2 px-3 py-1 text-xs font-bold rounded-full border-2 ${isSelected ? 'bg-white text-[#0b6459] border-[#0b6459]' : 'bg-[#0b6459] text-white border-white'}`}>
                                            Best Value
                                        </div>
                                    )}
                                    
                                    <h4 className="text-lg font-bold">{pkg.sessions} Sessions</h4>
                                    <p className={`text-sm ${isSelected ? 'text-gray-200' : 'text-gray-500'}`}>{formatCurrency(pricePerSession, selectedCurrency)}/session</p>
                                    
                                    <div className="mt-4 flex items-baseline gap-2">
                                        <p className="text-xl font-extrabold">{formatCurrency(total, selectedCurrency)}</p>
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
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
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
                            <span>Proceed to Checkout - {formatCurrency(totalPrice, selectedCurrency)}</span>
                        )}
                    </button>
                </div>
            </div>
        </ModalLayout>
    );
};

export default BookSessionModal;
