import React, { useState, useEffect } from 'react';
import { HiX, HiCreditCard, HiOfficeBuilding } from 'react-icons/hi';
import type { PayoutMethodType } from '../payout/PayoutsPage';

interface AddPayoutMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newMethod: { type: PayoutMethodType; identifier: string }) => void;
}

const AddPayoutMethodModal: React.FC<AddPayoutMethodModalProps> = ({ isOpen, onClose, onSave }) => {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [activeTab, setActiveTab] = useState<PayoutMethodType>('PayPal');
    const [paypalEmail, setPaypalEmail] = useState('');
    const [bankDetails, setBankDetails] = useState({ holderName: '', iban: '', swift: '' });

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            // Reset state on open
            setActiveTab('PayPal');
            setPaypalEmail('');
            setBankDetails({ holderName: '', iban: '', swift: '' });
        } else {
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);
    
    const handleSave = () => {
        if(activeTab === 'PayPal' && paypalEmail) {
            onSave({ type: 'PayPal', identifier: paypalEmail });
        } else if (activeTab === 'Bank' && bankDetails.iban) {
            // In a real app, you'd do more validation
            onSave({ type: 'Bank', identifier: `**** ${bankDetails.iban.slice(-4)}` });
        }
    };

    if (!shouldRender) return null;

    const inputStyles = "w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-0 focus:border-[#0b6459] transition";

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'bg-black/50 opacity-100' : 'opacity-0'}`}>
            <div className={`bg-white rounded-2xl shadow-xl w-full max-w-lg transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h2 className="font-bold text-lg text-gray-800">Add Payout Method</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"><HiX className="w-5 h-5" /></button>
                </div>
                
                <div className="p-6">
                    <div className="bg-gray-100 p-1 rounded-xl grid grid-cols-2 gap-1 mb-6">
                        <button onClick={() => setActiveTab('PayPal')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'PayPal' ? 'bg-white shadow' : 'text-gray-600'}`}>
                            <HiCreditCard className="w-4 h-4" /> PayPal
                        </button>
                        <button onClick={() => setActiveTab('Bank')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'Bank' ? 'bg-white shadow' : 'text-gray-600'}`}>
                            <HiOfficeBuilding className="w-4 h-4" /> Bank Account
                        </button>
                    </div>

                    {activeTab === 'PayPal' && (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="paypal-email" className="block text-sm font-medium text-gray-700 mb-1">PayPal Email</label>
                                <input id="paypal-email" type="email" value={paypalEmail} onChange={e => setPaypalEmail(e.target.value)} placeholder="Enter your PayPal email address" className={inputStyles} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'Bank' && (
                        <div className="space-y-4">
                             <div>
                                <label htmlFor="holder-name" className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                                <input id="holder-name" type="text" value={bankDetails.holderName} onChange={e => setBankDetails(p => ({...p, holderName: e.target.value}))} className={inputStyles} />
                            </div>
                             <div>
                                <label htmlFor="iban" className="block text-sm font-medium text-gray-700 mb-1">IBAN / Account Number</label>
                                <input id="iban" type="text" value={bankDetails.iban} onChange={e => setBankDetails(p => ({...p, iban: e.target.value}))} className={inputStyles} />
                            </div>
                             <div>
                                <label htmlFor="swift" className="block text-sm font-medium text-gray-700 mb-1">SWIFT / BIC Code</label>
                                <input id="swift" type="text" value={bankDetails.swift} onChange={e => setBankDetails(p => ({...p, swift: e.target.value}))} className={inputStyles} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end items-center gap-3 p-4 bg-gray-50 border-t border-gray-100">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
                    <button onClick={handleSave} className="px-5 py-2.5 text-sm font-semibold bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43]">Save Method</button>
                </div>
            </div>
        </div>
    );
};

export default AddPayoutMethodModal;
