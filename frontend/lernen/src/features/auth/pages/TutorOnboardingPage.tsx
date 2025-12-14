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
import { mapTutorDetailResponseToTutorDetail } from '../../../mappers/tutorMapper';
import type { TutorDetail, TutorDetailResponse } from '../../../types/tutor';

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
    const [stepData, setStepData] = useState<Partial<TutorDetail>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {state} = useAuth();
    
    const tutorId = state.user?.id;

    const loadStepData = useCallback(async (step: number) => {
        if (!tutorId) return;
        
        setLoading(true);
        try {
            let tutorOnboardingData = localStorage.getItem('tutor_onboarding_data');
            
            if (!tutorOnboardingData) {
                const response = await authService.getOnboardingData(tutorId);
                if (response.jsonData) {
                    // Save jsonData (TutorDetailResponse - already has id)
                    tutorOnboardingData = response.jsonData;
                    localStorage.setItem('tutor_onboarding_data', response.jsonData);
                } else {
                    console.log('No onboarding data found from API');
                    navigate('/error');
                    return;
                }
            }
            
            // Parse TutorDetailResponse from localStorage/API
            const tutorDetailResponse = JSON.parse(tutorOnboardingData) as TutorDetailResponse;
            
            // Convert to TutorDetail for UI using mapper
            const tutorDetail = await mapTutorDetailResponseToTutorDetail(tutorDetailResponse);
            
            setStepData(tutorDetail);
        } catch (err) {
            console.error(`Failed to load step ${step} data:`, err);
            navigate('/error');
        } finally {
            setLoading(false);
        }
    }, [navigate, tutorId]);

    useEffect(() => {
        if (!tutorId) return;
        
        const stepParam = searchParams.get('step');
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

    const handleStepDataChange = useCallback((updates: Partial<TutorDetail>) => {
        setStepData((prev: Partial<TutorDetail>) => ({...prev, ...updates}));
    }, []);
    
    // Check if user is authenticated - AFTER all hooks
    if (!state.user) {
        return (
            <AuthLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0b6459] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    // Mapper: Convert UI model (Partial<TutorDetail>) to API model (TutorDetailResponse)
    const mapToTutorDetailResponse = (data: Partial<TutorDetail>): TutorDetailResponse => {
        return {
            // Basic info
            id: data.id || '',
            fullName: data.fullName || '',
            avatarUrl: data.avatarUrl || '',
            email: data.email || '',
            isVerified: data.isVerified || false,
            introduction: data.introduction || '',
            headline: data.headline || '',
            gender: data.gender || 'Not specified',
            timezone: data.timezone || '',
            videoUrl: data.videoUrl || '',
            currentSessionFee: data.currentSessionFee || 0,
            originalSessionFee: data.originalSessionFee,
            averageRating: data.averageRating || 0,
            reviewCount: data.reviewCount || 0,
            bookedSessionsCount: data.bookedSessionsCount || 0,
            studentCount: data.studentCount || 0,
            hasTrialSession: data.hasTrialSession || false,
            
            // Convert Country to string
            countryCode: data.country?.code || '',
            
            // Convert TutorLanguage[] to TutorLanguageResponse[]
            languageCodes: (data.languages || []).map(lang => ({
                code: lang.language?.code || '',
                isNative: lang.isNative || false
            })),
            
            // Convert Subject[] to string[]
            subjectIds: (data.subjects || []).map(subject => subject?.id || '').filter(id => id !== ''),
            
            // Additional fields
            availabilities: data.availabilities || [],
            socialLinks: data.socialLinks || [],
            educations: data.educations || [],
            experiences: data.experiences || [],
            certifications: data.certifications || [],
            reviews: data.reviews,
            groupClasses: data.groupClasses
        };
    };

    const saveStepData = async (): Promise<void> => {
        const tutorOnboardingData = localStorage.getItem('tutor_onboarding_data');
        if (!tutorOnboardingData) throw new Error('No tutor onboarding data found');

        const parsed = JSON.parse(tutorOnboardingData) as TutorDetailResponse;
        
        // Merge current stepData with existing data from localStorage
        // stepData is Partial<TutorDetail>, we need to merge carefully
        const mergedData = { ...parsed, ...stepData } as any;
        
        // Convert to TutorDetailResponse for API
        const tutorDetailResponse = mapToTutorDetailResponse(mergedData);
        
        // Call API with tutorId from parsed data (TutorDetailResponse has id field)
        await authService.saveOnboardingStep(parsed.id, currentStep!, tutorDetailResponse);

        // Update localStorage with TutorDetailResponse as JSON string
        localStorage.setItem('tutor_onboarding_data', JSON.stringify(tutorDetailResponse));
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
                if (!stepData.country) {
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
