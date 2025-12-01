import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import BasicInformationStep from '../components/onboarding/BasicInformationStep';
import ProfessionalProfileStep from '../components/onboarding/ProfessionalProfileStep';
import MediaPortfolioStep from '../components/onboarding/MediaPortfolioStep';
import EducationExperienceStep from '../components/onboarding/EducationExperienceStep';
import CertificationsStep from '../components/onboarding/CertificationsStep';
import AvailabilityStep from '../components/onboarding/AvailabilityStep';
import StepIndicator from '../components/onboarding/StepIndicator';
import authService from '../../../services/authService';
import { HiArrowLeft, HiArrowRight, HiAcademicCap, HiCheckCircle, HiX } from 'react-icons/hi';
import { LernenLogo } from '../../../components/LernenLogo';

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
    const [stepData, setStepData] = useState<any>({
        fullName: '',
        email: '',
        gender: 'Male',
        country: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        nativeLanguage: null,
        languages: [],
        subjects: [],
        headline: '',
        introduction: '',
        profilePhoto: null,
        introVideo: null,
        socialLinks: [
            { platform: 'facebook', url: '' },
            { platform: 'twitter', url: '' },
            { platform: 'linkedin', url: '' },
            { platform: 'instagram', url: '' },
            { platform: 'youtube', url: '' }
        ],
        education: [],
        experience: [],
        certifications: [],
        availability: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCompletionModal, setShowCompletionModal] = useState(false);

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

    const handleStepDataChange = useCallback((updates: any) => {
        setStepData((prev: any) => ({ ...prev, ...updates }));
    }, []);

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
                if (!stepData.country) {
                    setError('Country is required');
                    return false;
                }
                if (!stepData.city?.trim()) {
                    setError('City is required');
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
        
        // Temporarily comment out to test notification
        if (currentStep === STEPS.length) {
            // Show completion modal for testing
            setShowCompletionModal(true);
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
        );
    }

    return (
        <AuthLayout>
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0b6459]/5 via-transparent to-teal-500/5" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="transform -rotate-45 opacity-[0.03]">
                        <p className="text-[20rem] font-bold text-[#0b6459] whitespace-nowrap">Lernen</p>
                    </div>
                </div>
                <div className="absolute top-8 left-8 opacity-10">
                    <p className="text-6xl font-bold text-[#0b6459]">Lernen</p>
                    <div className="w-20 h-1 bg-[#0b6459] mt-2"></div>
                </div>
            </div>
            <main className="relative w-full max-w-4xl mx-auto mt-2 mb-2 bg-white rounded-tl-2xl rounded-tr-2xl rounded-b-2xl shadow-2xl overflow-visible animate-fade-in-horizontal">
                <div className="overflow-hidden rounded-tl-2xl rounded-tr-2xl">
                    <div className="bg-gradient-to-r from-[#0b6459] via-[#0a5a4f] to-[#084c43] text-white p-5 relative overflow-hidden">
                        {/* Complex background pattern */}
                        {/* Large blurred circles */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/6 rounded-full -mr-40 -mt-40 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/6 rounded-full -ml-32 -mb-32 blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/4 w-56 h-56 bg-teal-200/8 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
                        
                        {/* Hexagon pattern overlay */}
                        <div className="absolute inset-0 opacity-8" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L50 15 L50 45 L30 60 L10 45 L10 15 Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
                            backgroundSize: '60px 60px',
                            backgroundPosition: '0 0'
                        }}></div>
                        
                        {/* Diagonal stripes */}
                        <div className="absolute inset-0 opacity-6" style={{
                            backgroundImage: `repeating-linear-gradient(
                                45deg,
                                transparent,
                                transparent 2px,
                                white 2px,
                                white 3px
                            )`,
                            backgroundSize: '20px 20px'
                        }}></div>
                        
                        {/* Radial gradient overlay */}
                        <div className="absolute inset-0 opacity-15" style={{
                            background: `radial-gradient(ellipse at top left, white 0%, transparent 50%),
                                        radial-gradient(ellipse at bottom right, white 0%, transparent 50%)`
                        }}></div>
                        
                        {/* Shine effect from top */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/12 via-white/4 to-transparent"></div>
                        
                        {/* Corner accents */}
                        <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-white/20"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-white/20"></div>
                        
                        <div className="relative z-10 flex items-center justify-between">
                            {/* Left: Logo and Welcome Text */}
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                    <LernenLogo variant="white" className="h-8 w-auto" />
                                </div>
                                <div className="h-12 w-px bg-white/20"></div>
                                <div>
                                    <h1 className="text-xl font-bold tracking-tight">Welcome to Your Teaching Journey!</h1>
                                    <p className="text-teal-100 text-sm mt-1 font-medium">Let's set up your profile in 6 easy steps</p>
                                </div>
                            </div>
                            
                            {/* Right: Icon */}
                            <div className="flex-shrink-0">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                                    <HiAcademicCap className="w-6 h-6 text-teal-200" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <StepIndicator currentStep={currentStep} steps={STEPS} />
                </div>
                <div className="px-6 pt-3 pb-4 overflow-visible">
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-800 text-xs">{error}</p>
                        </div>
                    )}
                    {renderStep()}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                        <button onClick={handleBack} disabled={currentStep === 1} className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition">
                            <HiArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                        <div className="flex items-center gap-2">
                            {currentStep >= 4 && currentStep < STEPS.length && (
                                <button onClick={handleSkip} disabled={saving} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition disabled:opacity-50">
                                    Skip
                                </button>
                            )}
                            <button onClick={handleNext} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                                {saving ? 'Saving...' : currentStep === STEPS.length ? 'Complete' : 'Next'}
                                {!saving && <HiArrowRight className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Completion Modal */}
            {showCompletionModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-fade-in-horizontal">
                        {/* Header with gradient */}
                        <div className="bg-gradient-to-r from-[#0b6459] via-[#0a5a4f] to-[#084c43] p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <HiCheckCircle className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Yêu cầu đã được gửi!</h3>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowCompletionModal(false);
                                        navigate('/dashboard');
                                    }}
                                    className="text-white/80 hover:text-white transition p-1"
                                >
                                    <HiX className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            <div className="text-center space-y-2">
                                <p className="text-gray-700 text-base leading-relaxed">
                                    Chúng tôi đã nhận được yêu cầu của bạn. Đội ngũ của chúng tôi sẽ xem xét và phản hồi lại trong vòng <strong className="text-[#0b6459]">24-48 giờ</strong>.
                                </p>
                                <p className="text-sm text-gray-500 mt-3">
                                    Bạn sẽ nhận được thông báo qua email khi hồ sơ của bạn được duyệt.
                                </p>
                            </div>

                            {/* Info Box */}
                            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                                            <span className="text-teal-600 text-lg">📧</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-teal-900 mb-1">Kiểm tra email của bạn</p>
                                        <p className="text-xs text-teal-700">
                                            Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn. Vui lòng kiểm tra hộp thư đến và thư mục spam.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => {
                                    setShowCompletionModal(false);
                                    navigate('/dashboard');
                                }}
                                className="w-full py-3 px-4 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition font-semibold text-sm flex items-center justify-center gap-2"
                            >
                                <span>Đi đến Dashboard</span>
                                <HiArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthLayout>
    );
};

export default TutorOnboardingPage;

