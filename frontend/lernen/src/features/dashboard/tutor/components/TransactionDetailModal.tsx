import React from 'react';
import { HiX, HiCreditCard, HiOfficeBuilding, HiCheckCircle, HiClock, HiExclamation } from 'react-icons/hi';
import type { PayoutMethod, PayoutStatus } from '../pages/PayoutsPage';

interface TransactionDetailModalProps {
    transaction: {
        id: string;
        date: string;
        amount: number;
        method: PayoutMethod;
        status: PayoutStatus;
    };
    commissionRate: number;
    onClose: () => void;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ transaction, commissionRate, onClose }) => {
    const grossAmount = transaction.amount / (1 - commissionRate / 100);
    const commissionAmount = grossAmount - transaction.amount;

    const statusConfig = {
        'Completed': { icon: HiCheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
        'Processing': { icon: HiClock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        'Failed': { icon: HiExclamation, color: 'text-red-600', bg: 'bg-red-50' }
    };

    const config = statusConfig[transaction.status];
    const StatusIcon = config.icon;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Transaction Details</h2>
                        <p className="text-sm text-gray-500 font-mono mt-0.5">{transaction.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                    >
                        <HiX className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content - 2 Columns */}
                <div className="grid grid-cols-2 gap-6 px-6 py-5">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {/* Status */}
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase mb-1.5 block">Status</label>
                            <div className={`${config.bg} rounded-lg px-3 py-2 flex items-center gap-2`}>
                                <StatusIcon className={`w-4 h-4 ${config.color}`} />
                                <span className={`font-semibold text-sm ${config.color}`}>{transaction.status}</span>
                            </div>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase mb-1.5 block">Date</label>
                            <div className="text-sm font-medium text-gray-800">{transaction.date}</div>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase mb-1.5 block">Payment Method</label>
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 bg-[#0b6459] rounded-lg flex items-center justify-center text-white">
                                    {transaction.method.type === 'PayPal' ?
                                        <HiCreditCard className="w-4 h-4" /> :
                                        <HiOfficeBuilding className="w-4 h-4" />
                                    }
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-gray-800">{transaction.method.type}</p>
                                    <p className="text-xs text-gray-500">{transaction.method.identifier}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Breakdown */}
                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase mb-1.5 block">Amount Breakdown</label>
                        <div className="space-y-2.5">
                            {/* Gross */}
                            <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-600">Gross Amount</span>
                                <span className="font-semibold text-gray-800">${grossAmount.toFixed(2)}</span>
                            </div>

                            {/* Fee */}
                            <div className="flex items-center justify-between py-2 px-3 bg-red-50 rounded-lg">
                                <span className="text-sm text-gray-600">Platform Fee ({commissionRate}%)</span>
                                <span className="font-semibold text-red-600">-${commissionAmount.toFixed(2)}</span>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-300"></div>

                            {/* Net */}
                            <div className="flex items-center justify-between py-2.5 px-3 bg-[#0b6459] rounded-lg">
                                <span className="text-sm font-medium text-white">Net Amount</span>
                                <span className="text-xl font-bold text-white">${transaction.amount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailModal;
