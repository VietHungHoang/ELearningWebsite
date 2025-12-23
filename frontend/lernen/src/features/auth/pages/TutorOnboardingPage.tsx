import React, {useState, useEffect, useCallback} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import BasicInformationStep from '../components/onboarding/BasicInformationStep';
import ProfessionalProfileStep from '../components/onboarding/ProfessionalProfileStep';
import MediaPortfolioStep from '../components/onboarding/MediaPortfolioStep';
import EducationExperienceStep from '../components/onboarding/EducationExperienceStep';
import CertificationsStep from '../components/onboarding/CertificationsStep';
import AvailabilityStep from '../components/onboarding/AvailabilityStep';
import {LernenLogo} from '../../../components/LernenLogo';
import authService from '../../../services/authService';
import {HiArrowLeft, HiArrowRight} from 'react-icons/hi';
import {useAuth} from '../../../context/AuthContext';
import type { TutorOnboardingData } from '../../../types/tutor';

const STEPS = [
    {number: 1, label: 'Basic Info'},
    {number: 2, label: 'Professional'},
    {number: 3, label: 'Media'},
    {number: 4, label: 'Education'},
    {number: 5, label: 'Certifications'},
    {number: 6, label: 'Availability'},
];

const TutorOnboardingPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [currentStep, setCurrentStep] = useState<number | null>(null);
    const [stepData, setStepData] = useState<Partial<TutorOnboardingData>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {state} = useAuth();
    const tutorId = state.user?.id || (() => {
        try {
            const storedData = localStorage.getItem('tutor_onboarding_data');
            if (storedData) {
                const parsed = JSON.parse(storedData);
                return parsed.id;
            }
        } catch (error) {
            console.error('Failed to parse tutor onboarding data from localStorage:', error);
        }
        return null;
    })();

    const loadStepData = useCallback(async (step: number) => {
        if (!tutorId) return;
        setLoading(true);
        try {
            const response = await authService.getOnboardingData(tutorId);

            if (response.jsonData) {
                const onboardingData = JSON.parse(response.jsonData) as TutorOnboardingData;
                console.log(onboardingData);
                setStepData(onboardingData);
            } else {
                setStepData({
                    id: tutorId,
                    fullName: state.user?.name || '',
                    email: state.user?.email || '',
                    gender: 'Not specified',
                    countryCode: 'US', // Default to US
                    languages: [],
                    subjects: [],
                    educations: [],
                    experiences: [],
                    certifications: [],
                    availabilities: [],
                    socialLinks: []
                });
            }
        } catch (err) {
            console.error(`Failed to load step ${step} data:`, err);
            setError('Failed to load onboarding data');
        } finally {
            setLoading(false);
        }
    }, [tutorId, state.user]);

    useEffect(() => {
        if (!tutorId) {
            console.error('No tutor ID available');
            setLoading(false);
            navigate('/error');
            return;
        }

        const stepParam = searchParams.get('step');
        console.log('stepParam:', stepParam);

        if (stepParam) {
            const step = parseInt(stepParam, 10);
            if (step >= 1 && step <= 6) {
                setCurrentStep(step);
                (async () => await loadStepData(step))();
            } else {
                navigate('/not-found');
            }
        } else {
            navigate('/not-found');
        }
    }, [searchParams, navigate, tutorId, loadStepData]);

    const handleStepDataChange = useCallback((updates: Partial<TutorOnboardingData>) => {
        setStepData((prev: Partial<TutorOnboardingData>) => ({...prev, ...updates}));
    }, []);
    
    const saveStepData = async (): Promise<void> => {
        if (!tutorId || !currentStep) return;

        setSaving(true);
        try {
            // Clean data before saving
            const cleanedData = {
                ...stepData,
                subjectIds: stepData.subjects?.map(s => s.id) || [],
                languages: stepData.languages?.map(l => ({
                    code: l.language.code,
                    isNative: l.isNative
                })) || []
            };
            // Remove subjects from cleanedData if backend expects subjectIds instead
            delete cleanedData.subjects;

            const jsonData = JSON.stringify(cleanedData);
            await authService.saveOnboardingStep(tutorId, currentStep, jsonData);
        } catch (error) {
            console.error('Failed to save onboarding step:', error);
            throw error;
        } finally {
            setSaving(false);
        }
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
        if (!currentStep) return;

        // Small delay to ensure state updates are processed
        await new Promise(resolve => setTimeout(resolve, 100));

        if (!validateStep(currentStep)) {
            return;
        }

        if (currentStep === STEPS.length) {
            setSaving(true);
            setError(null);
            try {
                await saveStepData();
                // setShowCompletionModal(true);
                navigate('/onboarding-completion');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to save data');
            } finally {
                setSaving(false);
            }
            return;
        }

        setSaving(true);
        setError(null);
        try {
            await saveStepData();
            if (currentStep < STEPS.length) {
                navigate(`/onboarding/tutor?step=${currentStep + 1}`);
            } else {
                // Show completion modal instead of navigating immediately
                // setShowCompletionModal(true);
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
            await saveStepData();
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
                            <LernenLogo/>
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
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
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
                                        }`}/>
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

                {/* Main Content Area */}
                <div className="px-8 pt-4 pb-8">
                    {/* Error Message Display */}
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-800 text-xs">{error}</p>
                        </div>
                    )}

                    {/* Loading State or Step Content */}
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="text-center">
                                <div
                                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0b6459] mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Conditional Step Rendering */}
                            {currentStep === 1 &&
                                <BasicInformationStep data={stepData} onChange={handleStepDataChange}/>}
                            {currentStep === 2 &&
                                <ProfessionalProfileStep data={stepData} onChange={handleStepDataChange}/>}
                            {currentStep === 3 && <MediaPortfolioStep data={stepData} onChange={handleStepDataChange}/>}
                            {currentStep === 4 &&
                                <EducationExperienceStep data={stepData} onChange={handleStepDataChange}/>}
                            {currentStep === 5 && <CertificationsStep data={stepData} onChange={handleStepDataChange}/>}
                            {currentStep === 6 && <AvailabilityStep data={stepData} onChange={handleStepDataChange}/>}
                        </>
                    )}

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                        <button onClick={handleBack} disabled={currentStep === 1}
                                className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition">
                            <HiArrowLeft className="w-4 h-4"/>
                            Back
                        </button>
                        <div className="flex items-center gap-2">
                            {/* Skip Button - Only show for steps 4-5 */}
                            {currentStep >= 4 && currentStep < STEPS.length && (
                                <button onClick={handleSkip} disabled={saving}
                                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition disabled:opacity-50">
                                    Skip
                                </button>
                            )}
                            {/* Next/Complete Button */}
                            <button onClick={handleNext} disabled={saving}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                                {saving ? 'Saving...' : currentStep === STEPS.length ? 'Complete' : 'Next'}
                                {!saving && <HiArrowRight className="w-4 h-4"/>}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </AuthLayout>
    )
};

export default TutorOnboardingPage;
