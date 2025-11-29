import React, { useEffect, useState } from 'react';
import { HiX, HiExclamationCircle } from 'react-icons/hi';

interface CourseValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  missingFields: string[];
}

const CourseValidationModal: React.FC<CourseValidationModalProps> = ({ isOpen, onClose, missingFields }) => {
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) setShouldRender(true);
        else {
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'bg-black/50 opacity-100' : 'opacity-0'}`}>
            <div className={`bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-yellow-100 rounded-full">
                           <HiExclamationCircle className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Missing Information</h2>
                            <p className="text-sm text-gray-500">Please complete all required fields.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                        <HiX className="w-5 h-5" />
                    </button>
                </div>

                <div className="my-6">
                    <p className="text-gray-600 mb-3">Please complete the following required fields before publishing:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                        {missingFields.map((field, index) => (
                            <li key={index}>{field}</li>
                        ))}
                    </ul>
                </div>

                <div className="flex justify-end items-center">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43]">
                        Okay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseValidationModal;