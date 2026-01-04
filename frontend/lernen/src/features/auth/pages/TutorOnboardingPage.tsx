import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OnboardingLayout from '../components/OnboardingLayout';
import BasicInformationStep from '../components/onboarding/BasicInformationStep';
import ProfessionalProfileStep from '../components/onboarding/ProfessionalProfileStep';
import MediaPortfolioStep from '../components/onboarding/MediaPortfolioStep';
import EducationExperienceStep from '../components/onboarding/EducationExperienceStep';
import CertificationsStep from '../components/onboarding/CertificationsStep';
import AvailabilityStep from '../components/onboarding/AvailabilityStep';
import { LernenLogo } from '../../../components/LernenLogo';
import authService from '../../../services/authService';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import { useAuth } from '../../../context/AuthContext';
import type { TutorOnboardingData } from '../../../types/tutor';
import type { Subject } from '../../../types/common';
import commonUtils from '../../../utils/commonUtils';
import Toast from '../../../components/ui/Toast';

const TutorOnboardingPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState<number | null>(null);
    const [stepData, setStepData] = useState<Partial<TutorOnboardingData>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { state } = useAuth();
    
    const STEPS = [
        { number: 1, label: t('onboarding.steps.basicInfo') },
        { number: 2, label: t('onboarding.steps.professional') },
        { number: 3, label: t('onboarding.steps.media') },
        { number: 4, label: t('onboarding.steps.education') },
        { number: 5, label: t('onboarding.steps.certifications') },
        { number: 6, label: t('onboarding.steps.availability') },
    ];
    
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
                // jsonData đã được Axios tự động unescape, nên có thể parse trực tiếp
                let onboardingData: TutorOnboardingData;
                try {
                    // Nếu jsonData là string, parse nó
                    if (typeof response.jsonData === 'string') {
                        onboardingData = JSON.parse(response.jsonData) as TutorOnboardingData;
                    } else {
                        // Nếu đã là object (có thể do double parse), dùng trực tiếp
                        onboardingData = response.jsonData as TutorOnboardingData;
                    }
                    
                    // Normalize languages format: convert { code, isNative } to { language: { code, name }, isNative }
                    if (onboardingData.languages && Array.isArray(onboardingData.languages)) {
                        const allLanguages = commonUtils.getAllLanguages();
                        onboardingData.languages = onboardingData.languages.map((lang: any) => {
                            // Nếu đã có format đúng { language: { code, name }, isNative }
                            if (lang.language && lang.language.code) {
                                return lang;
                            }
                            // Nếu chỉ có { code, isNative }, convert sang format đúng
                            if (lang.code) {
                                const languageInfo = allLanguages.find(l => l.code === lang.code);
                                return {
                                    language: languageInfo || { code: lang.code, name: lang.code },
                                    isNative: lang.isNative || false
                                };
                            }
                            // Fallback: giữ nguyên nếu không match format nào
                            return lang;
                        });
                    }

                    // Convert subjectIds to subjects if <needed></needed>
                    const parsedData = onboardingData as any;
                    if (parsedData.subjectIds && Array.isArray(parsedData.subjectIds) && parsedData.subjectIds.length > 0) {
                        try {
                            const allSubjects = await commonUtils.getSubjects();
                            onboardingData.subjects = parsedData.subjectIds
                                .map((subjectId: string) => allSubjects.find(s => s.id === subjectId))
                                .filter((subject: Subject | undefined): subject is Subject => subject !== undefined);
                        } catch (error) {
                            console.error('Failed to fetch subjects for subjectIds:', error);
                            onboardingData.subjects = [];
                        }
                    } else if (!onboardingData.subjects) {
                        // If no subjectIds and no subjects, set empty array
                        onboardingData.subjects = [];
                    }
                    
                    console.log('✅ Parsed onboarding data:', onboardingData);
                    setStepData(onboardingData);
                } catch (parseError) {
                    console.error('❌ Failed to parse jsonData:', parseError);
                    console.error('❌ jsonData content:', response.jsonData);
                    throw new Error('Invalid JSON data in response');
                }
            } else {
                setStepData({
                    id: tutorId,
                    fullName: state.user?.name || '',
                    email: state.user?.email || '',
                    gender: 'Male',
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
        setStepData((prev: Partial<TutorOnboardingData>) => ({ ...prev, ...updates }));
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
                    code: 'language' in l ? l.language.code : "",
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
                // Clean data before saving
                const cleanedData = {
                    ...stepData,
                    subjectIds: stepData.subjects?.map(s => s.id) || [],
                    languages: stepData.languages?.map(l => ({
                        code: 'language' in l ? l.language.code : "",
                        isNative: l.isNative
                    })) || []
                };
                // Remove subjects from cleanedData if backend expects subjectIds instead
                delete cleanedData.subjects;

                const jsonData = JSON.stringify(cleanedData);
                
                // Log data for debugging
                console.log('📤 Data gửi xuống backend khi hoàn thành:');
                console.log('📋 Cleaned Data (Object):', cleanedData);
                console.log('📦 JSON Data (String):', jsonData);
                
                // Call API to save onboarding data
                await authService.saveOnboardingStep(tutorId, currentStep, jsonData);
                
                // Navigate to completion page
                navigate('/onboarding-completion');
            } catch (err) {
                setError(err instanceof Error ? err.message : t('onboarding.errors.failedToSave'));
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
            setError(err instanceof Error ? err.message : t('onboarding.errors.failedToSave'));
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
            setError(err instanceof Error ? err.message : t('onboarding.errors.failedToSkip'));
        } finally {
            setSaving(false);
        }
    };

    if (!currentStep) {
        return (
            <OnboardingLayout>
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0b6459] mx-auto"></div>
                        <p className="mt-4 text-gray-600">{t('onboarding.loadingOnboarding')}</p>
                    </div>
                </div>
            </OnboardingLayout>
        )
    }

    return (
        <OnboardingLayout>
            {/* Simple Header */}
            <div className="border-b border-gray-200 bg-white px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            {currentStep === 1 && (
                                <>
                                    <h1 className="text-xl font-semibold text-gray-900">{t('onboarding.basicInfo.title')}</h1>
                                    <p className="text-sm text-gray-500 mt-0.5">{t('onboarding.basicInfo.subtitle')}</p>
                                </>
                            )}
                            {currentStep === 2 && (
                                <>
                                    <h1 className="text-xl font-semibold text-gray-900">{t('onboarding.professionalProfile.title')}</h1>
                                    <p className="text-sm text-gray-500 mt-0.5">{t('onboarding.professionalProfile.subtitle')}</p>
                                </>
                            )}
                            {currentStep === 3 && (
                                <>
                                    <h1 className="text-xl font-semibold text-gray-900">{t('onboarding.mediaPortfolio.title')}</h1>
                                    <p className="text-sm text-gray-500 mt-0.5">{t('onboarding.mediaPortfolio.subtitle')}</p>
                                </>
                            )}
                            {currentStep === 4 && (
                                <>
                                    <h1 className="text-xl font-semibold text-gray-900">{t('onboarding.educationExperience.title')}</h1>
                                    <p className="text-sm text-gray-500 mt-0.5">{t('onboarding.educationExperience.subtitle')}</p>
                                </>
                            )}
                            {currentStep === 5 && (
                                <>
                                    <h1 className="text-xl font-semibold text-gray-900">{t('onboarding.certifications.title')}</h1>
                                    <p className="text-sm text-gray-500 mt-0.5">{t('onboarding.certifications.subtitle')}</p>
                                </>
                            )}
                            {currentStep === 6 && (
                                <>
                                    <h1 className="text-xl font-semibold text-gray-900">{t('onboarding.availability.title')}</h1>
                                    <p className="text-sm text-gray-500 mt-0.5">{t('onboarding.availability.subtitle')}</p>
                                </>
                            )}
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
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${currentStep === step.number
                                            ? 'bg-[#0b6459] text-white'
                                            : currentStep > step.number
                                                ? 'bg-[#0b6459] text-white'
                                                : 'bg-gray-200 text-gray-500'
                                            }`}>
                                        {currentStep > step.number ? '✓' : step.number}
                                    </div>
                                    {index < STEPS.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-2 ${currentStep > step.number ? 'bg-[#0b6459]' : 'bg-gray-200'
                                            }`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        {/* Labels */}
                        <div className="flex items-center justify-between">
                            {STEPS.map((step) => (
                                <div key={step.number} className="w-8 flex justify-center">
                                    <span className={`text-xs whitespace-nowrap ${currentStep === step.number ? 'text-[#0b6459] font-medium' : 'text-gray-500'
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
                    {/* Toast notification */}
                    {error && (
                        <Toast
                            message={error}
                            type="error"
                            onClose={() => setError(null)}
                        />
                    )}

                    {/* Loading State or Step Content */}
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="text-center">
                                <div
                                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0b6459] mx-auto"></div>
                                <p className="mt-4 text-gray-600">{t('onboarding.loading')}</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Conditional Step Rendering */}
                            {currentStep === 1 &&
                                <BasicInformationStep data={stepData} onChange={handleStepDataChange} />}
                            {currentStep === 2 &&
                                <ProfessionalProfileStep data={stepData} onChange={handleStepDataChange} />}
                            {currentStep === 3 && <MediaPortfolioStep data={stepData} onChange={handleStepDataChange} />}
                            {currentStep === 4 &&
                                <EducationExperienceStep data={stepData} onChange={handleStepDataChange} />}
                            {currentStep === 5 && <CertificationsStep data={stepData} onChange={handleStepDataChange} />}
                            {currentStep === 6 && <AvailabilityStep data={stepData} onChange={handleStepDataChange} />}
                        </>
                    )}

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                        <button onClick={handleBack} disabled={currentStep === 1}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition">
                            <HiArrowLeft className="w-4 h-4" />
                            {t('onboarding.back')}
                        </button>
                        <div className="flex items-center gap-2">
                            {/* Skip Button - Only show for steps 4-5 */}
                            {currentStep >= 4 && currentStep < STEPS.length && (
                                <button onClick={handleSkip} disabled={saving}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition disabled:opacity-50">
                                    {t('onboarding.skip')}
                                </button>
                            )}
                            {/* Next/Complete Button */}
                            <button onClick={handleNext} disabled={saving}
                                className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                                {saving ? t('onboarding.saving') : currentStep === STEPS.length ? t('onboarding.complete') : t('onboarding.next')}
                                {!saving && <HiArrowRight className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
        </OnboardingLayout>
    )
};

export default TutorOnboardingPage;
