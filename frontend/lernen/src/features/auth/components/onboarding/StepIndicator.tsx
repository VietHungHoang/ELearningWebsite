import React from 'react';
import { HiCheck } from 'react-icons/hi';

interface Step {
    number: number;
    label: string;
}

interface StepIndicatorProps {
    currentStep: number;
    steps: Step[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
    return (
        <div className="bg-gray-50 px-8 py-6">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                                    step.number < currentStep
                                        ? 'bg-[#0b6459] text-white shadow-lg'
                                        : step.number === currentStep
                                        ? 'bg-[#0b6459] text-white shadow-lg ring-4 ring-teal-200'
                                        : 'bg-gray-200 text-gray-500'
                                }`}
                            >
                                {step.number < currentStep ? (
                                    <HiCheck className="w-6 h-6" />
                                ) : (
                                    step.number
                                )}
                            </div>
                            <p
                                className={`mt-2 text-xs font-medium ${
                                    step.number <= currentStep
                                        ? 'text-[#0b6459]'
                                        : 'text-gray-400'
                                }`}
                            >
                                {step.label}
                            </p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="flex-1 mx-2 mb-6">
                                <div
                                    className={`h-1 rounded transition-all duration-300 ${
                                        step.number < currentStep
                                            ? 'bg-[#0b6459]'
                                            : 'bg-gray-200'
                                    }`}
                                />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default StepIndicator;