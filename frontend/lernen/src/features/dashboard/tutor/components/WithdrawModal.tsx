import React, { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  balance: number;
}

const WITHDRAWAL_FEE = 2.50; // Example fixed fee

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, onConfirm, balance }) => {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setAmount('');
            setError('');
        } else {
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers and a single decimal point
        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setAmount(value);
            if (Number(value) > balance) {
                setError('Amount cannot exceed available balance.');
            } else {
                setError('');
            }
        }
    };
    
    const handleSubmit = () => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }
        if (numericAmount > balance) {
            setError('Amount cannot exceed available balance.');
            return;
        }
        if (numericAmount <= WITHDRAWAL_FEE) {
            setError('Withdrawal amount must be greater than the fee.');
            return;
        }
        setError('');
        onConfirm(numericAmount);
    };

    if (!shouldRender) return null;

    const numericAmount = parseFloat(amount) || 0;
    const amountToReceive = numericAmount > WITHDRAWAL_FEE ? numericAmount - WITHDRAWAL_FEE : 0;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'bg-black/50 opacity-100' : 'opacity-0'}`}>
            <div className={`bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Withdraw Funds</h2>
                        <p className="text-sm text-gray-500">Available Balance: <span className="font-semibold text-gray-700">${balance.toFixed(2)}</span></p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><HiX className="w-5 h-5" /></button>
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount to withdraw</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                            type="text"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="0.00"
                            className={`w-full bg-gray-100 border rounded-lg pl-8 pr-4 py-2.5 text-gray-800 focus:outline-none focus:ring-0 transition ${error ? 'border-red-500' : 'border-transparent focus:border-[#0b6459]'}`}
                        />
                    </div>
                    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Withdrawal Fee:</span>
                        <span className="font-semibold text-gray-800">-${WITHDRAWAL_FEE.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                        <span className="text-gray-800">You will receive:</span>
                        <span className="text-[#0b6459]">${amountToReceive.toFixed(2)}</span>
                    </div>
                </div>

                <div className="flex justify-end items-center gap-4 mt-6">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-5 py-2.5 text-sm font-semibold bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43]">
                        Confirm Withdrawal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WithdrawModal;
