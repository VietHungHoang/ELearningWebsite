import React, { useState } from 'react';

const ClassConfiguration: React.FC = () => {
    const [config, setConfig] = useState({
        sessionFee: 50,
        currency: 'USD',
        sessionDuration: 60,
        allowTrial: true,
        enableGroupClasses: true,
        maxGroupSize: 5,
        groupSessionFee: 30,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const inputStyles = "w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-0 focus:border-[#0b6459] transition";

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Class Configuration</h2>
                <p className="text-sm text-gray-500 mt-1">Set your pricing, duration, and class rules.</p>
            </div>

            <div className="space-y-8">
                {/* 1-on-1 Settings */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">1-on-1 Sessions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Session Fee</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    name="sessionFee"
                                    value={config.sessionFee}
                                    onChange={handleChange}
                                    className={`${inputStyles} pl-8`}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Minutes)</label>
                            <select
                                name="sessionDuration"
                                value={config.sessionDuration}
                                onChange={handleChange}
                                className={inputStyles}
                            >
                                <option value={30}>30 Minutes</option>
                                <option value={45}>45 Minutes</option>
                                <option value={60}>60 Minutes</option>
                                <option value={90}>90 Minutes</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="allowTrial"
                            name="allowTrial"
                            checked={config.allowTrial}
                            onChange={handleChange}
                            className="w-4 h-4 text-[#0b6459] border-gray-300 rounded focus:ring-[#0b6459]"
                        />
                        <label htmlFor="allowTrial" className="text-sm text-gray-700">Offer trial sessions (usually free or discounted)</label>
                    </div>
                </div>

                {/* Group Class Settings */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800">Group Classes</h3>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">{config.enableGroupClasses ? 'Enabled' : 'Disabled'}</span>
                            <button
                                onClick={() => setConfig(prev => ({ ...prev, enableGroupClasses: !prev.enableGroupClasses }))}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.enableGroupClasses ? 'bg-[#0b6459]' : 'bg-gray-200'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.enableGroupClasses ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>

                    {config.enableGroupClasses && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Group Session Fee (per student)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        name="groupSessionFee"
                                        value={config.groupSessionFee}
                                        onChange={handleChange}
                                        className={`${inputStyles} pl-8`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Max Students</label>
                                <input
                                    type="number"
                                    name="maxGroupSize"
                                    value={config.maxGroupSize}
                                    onChange={handleChange}
                                    min={2}
                                    max={20}
                                    className={inputStyles}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button className="bg-[#0b6459] text-white font-semibold py-2.5 px-6 rounded-lg text-sm hover:bg-[#084c43] transition-colors shadow-sm">
                    Save Configuration
                </button>
            </div>
        </div>
    );
};

export default ClassConfiguration;
