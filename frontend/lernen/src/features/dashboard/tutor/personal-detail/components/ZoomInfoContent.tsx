import React, { useState } from 'react';
import { HiVideoCamera, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';

interface ZoomInfoContentProps {
    onSave: () => void;
    isZoomConnected?: boolean;
}

const ZoomInfoContent: React.FC<ZoomInfoContentProps> = ({ onSave, isZoomConnected = false }) => {
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnectZoom = () => {
        setIsConnecting(true);
        // TODO: Implement Zoom OAuth connection
        setTimeout(() => {
            setIsConnecting(false);
            // Simulate successful connection
            onSave();
        }, 2000);
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Zoom Integration</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Connect your Zoom account to host online sessions seamlessly.
                </p>
            </div>

            <div className="space-y-6">
                {/* Connection Status */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-lg ${isZoomConnected ? 'bg-green-100' : 'bg-gray-100'}`}>
                            {isZoomConnected ? (
                                <HiCheckCircle className="w-6 h-6 text-green-600" />
                            ) : (
                                <HiVideoCamera className="w-6 h-6 text-gray-400" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Zoom Account Status</h3>
                            <p className="text-sm text-gray-600">
                                {isZoomConnected ? 'Connected and ready to use' : 'Not connected - Connect your Zoom account'}
                            </p>
                        </div>
                    </div>

                    {isZoomConnected ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                                <HiCheckCircle className="w-5 h-5 text-green-600" />
                                <p className="text-sm text-green-800">
                                    Your Zoom account is successfully connected. You can now host online sessions.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                                <HiExclamationCircle className="w-5 h-5 text-yellow-600" />
                                <p className="text-sm text-yellow-800">
                                    Connect your Zoom account to enable online tutoring sessions.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Connection Instructions */}
                {!isZoomConnected && (
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">How to Connect Zoom</h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-[#0b6459] text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                <p>Sign in to your Zoom account at <a href="https://zoom.us" target="_blank" rel="noopener noreferrer" className="text-[#0b6459] underline">zoom.us</a></p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-[#0b6459] text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                <p>Go to the Zoom App Marketplace and create an app</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-[#0b6459] text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                <p>Enter your Zoom credentials below and click "Connect Account"</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Zoom Settings */}
                {isZoomConnected && (
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Zoom Settings</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Auto-generate meeting links</p>
                                    <p className="text-xs text-gray-500">Automatically create Zoom links for new sessions</p>
                                </div>
                                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#0b6459]">
                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6"></span>
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Require meeting password</p>
                                    <p className="text-xs text-gray-500">Add password protection to all meetings</p>
                                </div>
                                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-4">
                {!isZoomConnected ? (
                    <button
                        onClick={handleConnectZoom}
                        disabled={isConnecting}
                        className="bg-[#0b6459] text-white font-semibold py-2.5 px-6 rounded-lg text-sm hover:bg-[#084c43] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isConnecting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Connecting...
                            </>
                        ) : (
                            <>
                                <HiVideoCamera className="w-4 h-4" />
                                Connect Zoom Account
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        onClick={onSave}
                        className="bg-[#0b6459] text-white font-semibold py-2.5 px-6 rounded-lg text-sm hover:bg-[#084c43] transition-colors shadow-sm"
                    >
                        Save Settings
                    </button>
                )}
            </div>
        </div>
    );
};

export default ZoomInfoContent;