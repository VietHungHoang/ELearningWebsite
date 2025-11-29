import React, { useState, useEffect } from 'react';
import { HiX, HiExclamationCircle } from 'react-icons/hi';

interface DeclineRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  requestType: string;
}

const DeclineRequestModal: React.FC<DeclineRequestModalProps> = ({ isOpen, onClose, onConfirm, requestType }) => {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setReason('');
        } else {
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleConfirm = () => {
        if (!reason.trim()) {
            alert('Please provide a reason for declining.');
            return;
        }
        onConfirm(reason);
    };

    if (!shouldRender) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'bg-black/50 opacity-100' : 'opacity-0'}`}>
            <div className={`bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-yellow-100 rounded-full">
                           <HiExclamationCircle className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Decline {requestType}</h2>
                            <p className="text-sm text-gray-500">Please provide a reason.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                        <HiX className="w-5 h-5" />
                    </button>
                </div>

                <div className="my-6">
                    <label htmlFor="decline-reason" className="block text-sm font-medium text-gray-700 mb-1">Reason for Declining</label>
                    <textarea
                        id="decline-reason"
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        rows={4}
                        placeholder="e.g., I am unavailable at the proposed time..."
                        className="w-full bg-gray-100 border-transparent rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0b6459] resize-none"
                    />
                </div>

                <div className="flex justify-end items-center gap-4">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirm}
                        className="px-5 py-2.5 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Send & Decline
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeclineRequestModal;