import React from 'react';
import { HiShieldCheck, HiDocument, HiIdentification } from 'react-icons/hi';

interface IdentityVerificationContentProps {
    onSave: () => void;
}

const IdentityVerificationContent: React.FC<IdentityVerificationContentProps> = ({ onSave }) => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Identity Verification</h2>
                <p className="text-sm text-gray-500 mt-1">Verify your identity to build trust with students and access all platform features.</p>
            </div>

            <div className="space-y-6">
                {/* Verification Status */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <HiShieldCheck className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Verification Status</h3>
                            <p className="text-sm text-gray-600">Your identity verification is pending review</p>
                        </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                            Your documents have been submitted and are currently under review. This process typically takes 1-3 business days.
                        </p>
                    </div>
                </div>

                {/* ID Document Upload */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Government ID</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                            <HiDocument className="w-8 h-8 text-gray-400" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Upload ID Document</p>
                                <p className="text-xs text-gray-500">Passport, Driver's License, or National ID</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">
                            Accepted formats: JPG, PNG, PDF. Max file size: 5MB
                        </p>
                    </div>
                </div>

                {/* Selfie Upload */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Selfie Verification</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                            <HiIdentification className="w-8 h-8 text-gray-400" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Upload Selfie</p>
                                <p className="text-xs text-gray-500">Clear photo of yourself holding your ID</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">
                            Make sure your face and ID are clearly visible in the photo
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={onSave}
                    className="bg-[#0b6459] text-white font-semibold py-2.5 px-6 rounded-lg text-sm hover:bg-[#084c43] transition-colors shadow-sm"
                >
                    Submit for Verification
                </button>
            </div>
        </div>
    );
};

export default IdentityVerificationContent;