import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import BasicInformationStep from '../components/onboarding/BasicInformationStep';
import ProfessionalProfileStep from '../components/onboarding/ProfessionalProfileStep';
import MediaPortfolioStep from '../components/onboarding/MediaPortfolioStep';
import EducationExperienceStep from '../components/onboarding/EducationExperienceStep';
import CertificationsStep from '../components/onboarding/CertificationsStep';
import AvailabilityStep from '../components/onboarding/AvailabilityStep';
import { LernenLogo } from '../../../components/LernenLogo';
import authService from '../../../services/authService';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import type {Tutor} from "../../../types/api.ts";

const STEPS = [
    { number: 1, label: 'Basic Info' },
    { number: 2, label: 'Professional' },
    { number: 3, label: 'Media' },
    { number: 4, label: 'Education' },
    { number: 5, label: 'Certifications' },
    { number: 6, label: 'Availability' },
];

const TutorOnboardingPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [currentStep, setCurrentStep] = useState<number | null>(null);
    const [stepData, setStepData] = useState<Partial<Tutor>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const stepParam = searchParams.get('step');
        if (stepParam) {
            const step = parseInt(stepParam, 10);
            if (step >= 1 && step <= 6) {
                setCurrentStep(step);
                const tutorAccountData = localStorage.getItem('tutorAccountData');
                if (tutorAccountData) {
                    const parsed = JSON.parse(tutorAccountData);
                    loadStepData(step, parsed.id);
                }
            } else {
                navigate('/dashboard');
            }
        } else {
            const loadStatus = async () => {
                try {
                    const { status } = await authService.getOnboardingStatus();
                    if (status >= 1 && status <= 6) {
                        navigate(`/onboarding/tutor?step=${status}`);
                    } else if (status === 7) {
                        navigate('/dashboard');
                    } else {
                        navigate('/onboarding/tutor?step=1');
                    }
                } catch (err) {
                    console.error('Failed to load onboarding status:', err);
                    navigate('/onboarding/tutor?step=1');
                }
            };
            loadStatus();
        }
    }, [searchParams, navigate]);

    const loadStepData = async (step: number, tutorId: string) => {
        setLoading(true);
        try {
            const tutorAccountData = localStorage.getItem('tutorAccountData');
            if (tutorAccountData) {
                const data = JSON.parse(tutorAccountData);
                const socialLinks = Array.isArray(data.socialLinks) 
                    ? data.socialLinks 
                    : Object.entries(data.socialLinks || {}).map(([platform, url]) => ({ platform, url: url as string }));
                const { socialLinks: _, ...restData } = data;
                const mappedData = {
                    ...restData,
                    fullName: data.name || '',
                    email: data.email || '',
                    socialLinks,
                };
                setStepData((prev: any) => ({ ...prev, ...mappedData }));
            } else {
                const data = await authService.getOnboardingStep(Number(tutorId), step);
                setStepData((prev: any) => ({ ...prev, ...data }));
            }
        } catch (err) {
            console.error(`Failed to load step ${step} data:`, err);
            // Keep default values if API call fails
        } finally {
            setLoading(false);
        }
    };

    const handleStepDataChange = (updates: any) => {
        setStepData((prev: any) => ({ ...prev, ...updates }));
    };

    const validateStep = (step: number): boolean => {
        setError(null);
        switch (step) {
            case 1:
                if (!stepData.fullName?.trim()) {
                    setError('Full name is required');
                    return false;
                }
                if (!stepData.gender) {
                    setError('Please select your gender');
                    return false;
                }
                if (!stepData.countryCode) {
                    setError('Country is required');
                    return false;
                }

                if (!stepData.languages || stepData.languages.length === 0) {
                    setError('Please add at least one language');
                    return false;
                }
                break;
            case 2:
                if (!stepData.subjects || stepData.subjects.length === 0) {
                    setError('Please add at least one subject you teach');
                    return false;
                }
                break;
            case 3:
                // Profile photo is optional for now
                break;
            case 4:
            case 5:
            case 6:
                break;
        }
        return true;
    };

    const handleNext = async () => {
        if (!currentStep || !validateStep(currentStep)) {
            return;
        }
        setSaving(true);
        setError(null);
        try {
            const tutorAccountData = localStorage.getItem('tutorAccountData');
            if (tutorAccountData) {
                const parsed = JSON.parse(tutorAccountData);
                await authService.saveOnboardingStep(parsed.id, currentStep, { data: JSON.stringify(stepData) });
                const updatedData = { ...parsed, ...stepData };
                localStorage.setItem('tutorAccountData', JSON.stringify(updatedData));
            }
            if (currentStep < STEPS.length) {
                navigate(`/onboarding/tutor?step=${currentStep + 1}`);
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save data');
        } finally {
            setSaving(false);
        }
    };

    const handleBack = () => {
        if (currentStep && currentStep > 1) {
            navigate(`/onboarding/tutor?step=${currentStep - 1}`);
        }
    };

    const handleSkip = async () => {
        if (!currentStep) return;
        setSaving(true);
        setError(null);
        try {
            const tutorAccountData = localStorage.getItem('tutorAccountData');
            if (tutorAccountData) {
                const parsed = JSON.parse(tutorAccountData);
                await authService.saveOnboardingStep(parsed.id, currentStep, { data: JSON.stringify(stepData) });
                const updatedData = { ...parsed, ...stepData };
                localStorage.setItem('tutorAccountData', JSON.stringify(updatedData));
            }
            if (currentStep < STEPS.length) {
                navigate(`/onboarding/tutor?step=${currentStep + 1}`);
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to skip step');
        } finally {
            setSaving(false);
        }
    };

    const renderStep = () => {
        if (!currentStep || loading) {
            return (
                <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0b6459] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </div>
            );
        }
        switch (currentStep) {
            case 1:
                return <BasicInformationStep data={stepData} onChange={handleStepDataChange} />;
            case 2:
                return <ProfessionalProfileStep data={stepData} onChange={handleStepDataChange} />;
            case 3:
                return <MediaPortfolioStep data={stepData} onChange={handleStepDataChange} />;
            case 4:
                return <EducationExperienceStep data={stepData} onChange={handleStepDataChange} />;
            case 5:
                return <CertificationsStep data={stepData} onChange={handleStepDataChange} />;
            case 6:
                return <AvailabilityStep data={stepData} onChange={handleStepDataChange} />;
            default:
                return <div>Invalid step</div>;
        }
    };

    if (!currentStep) {
        return (
            <AuthLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0b6459] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading onboarding...</p>
                    </div>
                </div>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout>
            <main className="relative w-full max-w-4xl mx-auto mt-8 mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Simple Header */}
                <div className="border-b border-gray-200 bg-white px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">Tutor Onboarding</h1>
                            <p className="text-sm text-gray-500 mt-0.5">Complete your profile to start teaching</p>
                        </div>
                        <div className="text-right w-24">
                            <LernenLogo />
                        </div>
                    </div>
                </div>
                
                {/* Compact Step Indicator */}
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
                    <div className="max-w-3xl mx-auto">
                        {/* Icons and Lines */}
                        <div className="flex items-center justify-between mb-2">
                            {STEPS.map((step, index) => (
                                <React.Fragment key={step.number}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                                        currentStep === step.number
                                            ? 'bg-[#0b6459] text-white'
                                            : currentStep > step.number
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}>
                                        {currentStep > step.number ? '✓' : step.number}
                                    </div>
                                    {index < STEPS.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-2 ${
                                            currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                                        }`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        {/* Labels */}
                        <div className="flex items-center justify-between">
                            {STEPS.map((step) => (
                                <div key={step.number} className="w-8 flex justify-center">
                                    <span className={`text-xs whitespace-nowrap ${
                                        currentStep === step.number ? 'text-[#0b6459] font-medium' : 'text-gray-500'
                                    }`}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="px-8 pt-4 pb-8">
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 text-sm">{error}</p>
                        </div>
                    )}
                    {renderStep()}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                        <button onClick={handleBack} disabled={currentStep === 1} className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition">
                            <HiArrowLeft className="w-5 h-5" />
                            Back
                        </button>
                        <div className="flex items-center gap-3">
                            {currentStep >= 4 && currentStep < STEPS.length && (
                                <button onClick={handleSkip} disabled={saving} className="px-6 py-3 text-gray-600 hover:text-gray-800 transition disabled:opacity-50">
                                    Skip
                                </button>
                            )}
                            <button onClick={handleNext} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                                {saving ? 'Saving...' : currentStep === STEPS.length ? 'Complete' : 'Next'}
                                {!saving && <HiArrowRight className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </AuthLayout>
    )
};

export default TutorOnboardingPage;