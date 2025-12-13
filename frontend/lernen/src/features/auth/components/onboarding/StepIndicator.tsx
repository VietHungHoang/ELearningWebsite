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
        <div className="bg-gray-50 px-6 py-3">
            <div className="flex items-center justify-between px-14">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                    step.number < currentStep
                                        ? 'bg-[#0b6459] text-white shadow-md'
                                        : step.number === currentStep
                                        ? 'bg-[#0b6459] text-white shadow-md ring-2 ring-teal-200'
                                        : 'bg-gray-200 text-gray-500'
                                }`}
                            >
                                {step.number < currentStep ? (
                                    <HiCheck className="w-4 h-4" />
                                ) : (
                                    step.number
                                )}
                            </div>
                            <p
                                className={`mt-1 text-[10px] font-medium ${
                                    step.number <= currentStep
                                        ? 'text-[#0b6459]'
                                        : 'text-gray-400'
                                }`}
                            >
                                {step.label}
                            </p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="flex-1 mx-1 mb-4">
                                <div
                                    className={`h-0.5 rounded transition-all duration-300 ${
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