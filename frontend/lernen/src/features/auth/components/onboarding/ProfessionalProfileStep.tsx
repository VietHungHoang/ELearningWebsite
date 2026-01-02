import React, { useState, useEffect, useMemo, useRef } from "react";
import { HiSparkles, HiPaperAirplane } from "react-icons/hi";
import CustomDropdown from "../../../../components/ui/CustomDropdown";
import ModalLayout from "../../../../components/ui/ModalLayout";
import commonUtils from "../../../../utils/commonUtils";
import authService from "../../../../services/authService";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../../../../context/CurrencyContext";
import { CURRENCY_INFO } from "../../../../utils/currencyHelper";
import type { Category, Subject } from "../../../../types/common";
import type { TutorOnboardingData } from "../../../../types/tutor";

interface ProfessionalProfileStepProps {
    data: Partial<TutorOnboardingData>;
    onChange: (data: Partial<TutorOnboardingData>) => void;
}

const ProfessionalProfileStep: React.FC<ProfessionalProfileStepProps> = ({ data, onChange }) => {
    const { t, i18n } = useTranslation();
    const { selectedCurrency } = useCurrency();
    const currencySymbol = CURRENCY_INFO[selectedCurrency]?.symbol || '$';
    const currentLanguage = i18n.language || 'vi';
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [subjectOptions, setSubjectOptions] = useState<Subject[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const introductionTextareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const subjects = await commonUtils.getSubjects();
                setSubjectOptions(subjects);
            } catch (error) {
                console.error("Failed to fetch subjects:", error);
            }
        };
        fetchSubjects();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await commonUtils.getCategories();
                setCategoryOptions(categories);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const availableSubjects = useMemo(
        () =>
            subjectOptions
                .filter((s) => !(data.subjects || []).some((subj) => subj.id === s.id))
                .filter((s) => !selectedCategory || s.categoryId === selectedCategory),
        [subjectOptions, data.subjects, selectedCategory]
    );

    const handleAddSubject = (subject: Subject) => {
        if (!(data.subjects || []).some((s) => s.id === subject.id)) {
            onChange({ subjects: [...(data.subjects || []), subject] });
        }
    };

    const handleOpenAiModal = () => {
        setIsAiModalOpen(true);
        setAiPrompt("");
    };

    const handleCloseAiModal = () => {
        setIsAiModalOpen(false);
        setAiPrompt("");
    };

    // Auto-resize textarea when introduction changes
    useEffect(() => {
        const textarea = introductionTextareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [data.introduction]);

    const handleGenerateIntroduction = async () => {
        if (!aiPrompt.trim()) return;
        if (!data.id) {
            alert(t('onboarding.professionalProfile.generateError') || 'Không thể tạo phần giới thiệu. Vui lòng thử lại.');
            return;
        }

        setIsGenerating(true);
        try {
            const generatedIntroduction = await authService.generateIntroductionWithAI(data.id, aiPrompt);
            onChange({ introduction: generatedIntroduction });
            handleCloseAiModal();
        } catch (error) {
            console.error("Failed to generate introduction:", error);
            // Show error to user (you can add toast notification here)
            alert(error instanceof Error ? error.message : t('onboarding.professionalProfile.generateError') || 'Không thể tạo phần giới thiệu. Vui lòng thử lại.');
        } finally {
            setIsGenerating(false);
        }
    };

    const inputStyles =
        "w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-gray-800 placeholder:text-gray-400 placeholder:font-thin hover:bg-white hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-0 focus:border-[#0b6459] transition-all duration-500 ease-in-out";

    return (
        <div className="space-y-6">

            {/* Professional Headline & Session Fee - Same Row (7:3) */}
            <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
                {/* Professional Headline - 7 parts */}
                <div className="md:col-span-7">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('onboarding.professionalProfile.headline')}</label>
                    <input
                        type="text"
                        value={data.headline}
                        onChange={(e) => onChange({ headline: e.target.value })}
                        placeholder={t('onboarding.professionalProfile.headlinePlaceholder')}
                        className={inputStyles}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {t('onboarding.professionalProfile.headlineHint')}
                    </p>
                </div>

                {/* Session Fee - 3 parts */}
                <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('onboarding.professionalProfile.sessionFee')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">{currencySymbol}</span>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={data.currentSessionFee || ''}
                            onChange={(e) => onChange({ currentSessionFee: parseFloat(e.target.value) || 0 })}
                            placeholder="0.00"
                            className={`${inputStyles} pl-8`}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {t('onboarding.professionalProfile.sessionFeeHint')}
                    </p>
                </div>
            </div>

            {/* Subjects I Teach */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('onboarding.professionalProfile.subjectsITeach')} <span className="text-red-500">*</span>
                </label>
                {/* Category and Subject Dropdowns - Same Row (3:7) */}
                <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
                    {/* Category Filter - 3 parts */}
                    <div className="md:col-span-3">
                        <CustomDropdown
                            options={[t('onboarding.professionalProfile.allCategories'), ...categoryOptions.map((c) => currentLanguage === 'vi' ? c.nameVi : c.nameEn)]}
                            selectedValue={selectedCategory ? categoryOptions.find((c) => c.id === selectedCategory)?.[currentLanguage === 'vi' ? 'nameVi' : 'nameEn'] || t('onboarding.professionalProfile.allCategories') : t('onboarding.professionalProfile.allCategories')}
                            placeholder={t('onboarding.professionalProfile.selectCategory')}
                            onSelect={(value) => {
                                if (value === t('onboarding.professionalProfile.allCategories')) {
                                    setSelectedCategory("");
                                } else {
                                    const cat = categoryOptions.find((c) =>
                                        (currentLanguage === 'vi' ? c.nameVi : c.nameEn) === value
                                    );
                                    if (cat) setSelectedCategory(cat.id);
                                }
                            }}
                            dropdownId="categories"
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            hasSearch={false}
                        />
                    </div>
                    {/* Subject Dropdown - 7 parts */}
                    <div className="md:col-span-7">
                        <CustomDropdown
                            options={availableSubjects.map((s) => currentLanguage === 'vi' ? s.nameVi : s.nameEn)}
                            selectedValue={t('onboarding.professionalProfile.addSubject')}
                            placeholder={t('onboarding.professionalProfile.addSubject')}
                            onSelect={(value) => {
                                const subj = availableSubjects.find((s) =>
                                    (currentLanguage === 'vi' ? s.nameVi : s.nameEn) === value
                                );
                                if (subj) handleAddSubject(subj);
                            }}
                            dropdownId="subjects"
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            hasSearch={true}
                            searchPlaceholder={t('onboarding.professionalProfile.searchSubject')}
                        />
                        {/* Selected Subjects Tags - Below Subject Dropdown */}
                        {(data.subjects || []).length > 0 && (
                            <div className="flex flex-wrap gap-2 items-center min-h-[40px] mt-2">
                                {(data.subjects || []).map((subject) => (
                                    <span
                                        key={subject.id}
                                        className="text-xs text-gray-700 flex items-center gap-1.5 px-2 py-1 border border-gray-300 rounded"
                                    >
                                        <span>{currentLanguage === 'vi' ? subject.nameVi : subject.nameEn}</span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onChange({
                                                    subjects: (data.subjects || []).filter((item) => item.id !== subject.id),
                                                })
                                            }
                                            className="text-gray-400 hover:text-gray-600 text-sm leading-none"
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* A brief introduction */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                        {t('onboarding.professionalProfile.briefIntroduction')}
                    </label>
                    <button
                        type="button"
                        onClick={handleOpenAiModal}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md hover:bg-purple-200"
                    >
                        <HiSparkles className="w-3.5 h-3.5" />
                        {t('onboarding.professionalProfile.writeWithAI')}
                    </button>
                </div>
                <textarea
                    ref={introductionTextareaRef}
                    rows={4}
                    value={data.introduction}
                    onChange={(e) => {
                        onChange({ introduction: e.target.value });
                        // Auto-resize on input
                        const textarea = e.target;
                        textarea.style.height = 'auto';
                        textarea.style.height = `${textarea.scrollHeight}px`;
                    }}
                    className="w-full p-2.5 text-sm bg-gray-100 border border-transparent rounded-lg text-gray-800 placeholder:text-gray-400 placeholder:font-thin hover:bg-white hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-0 focus:border-[#0b6459] transition-all duration-500 ease-in-out resize-none overflow-hidden"
                    placeholder={t('onboarding.professionalProfile.introductionPlaceholder')}
                ></textarea>
                <p className="text-xs text-gray-500 text-right mt-1">
                    {t('onboarding.professionalProfile.charactersCount')}: {(data.introduction || "").length}
                </p>
            </div>

            {/* Write with AI Modal */}
            <ModalLayout
                isOpen={isAiModalOpen}
                onClose={handleCloseAiModal}
                maxWidth="2xl"
                showCloseButton={true}
            >
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-6">
                        <HiSparkles className="w-5 h-5 text-purple-600" />
                        <h2 className="text-xl font-semibold text-gray-800">
                            {t('onboarding.professionalProfile.writeWithAI')}
                        </h2>
                    </div>

                    {/* Body */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('onboarding.professionalProfile.aiPromptLabel')}
                            </label>
                            <div className="relative">
                                <textarea
                                    rows={4}
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder={t('onboarding.professionalProfile.aiPromptPlaceholder')}
                                    className="w-full p-3 text-sm bg-gray-100 border border-transparent rounded-lg text-gray-800 placeholder:text-gray-400 placeholder:font-thin hover:bg-white hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-0 focus:border-[#0b6459] transition-all duration-500 ease-in-out resize-none"
                                    disabled={isGenerating}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleCloseAiModal}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                {t('onboarding.professionalProfile.cancel')}
                            </button>
                            <button
                                type="button"
                                onClick={handleGenerateIntroduction}
                                disabled={!aiPrompt.trim() || isGenerating}
                                className="flex items-center gap-2 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                                        {t('onboarding.professionalProfile.generating')}
                                    </>
                                ) : (
                                    <>
                                        <HiPaperAirplane className="w-4 h-4 rotate-90" />
                                        {t('onboarding.professionalProfile.generate')}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </ModalLayout>
        </div>
    );
};

export default ProfessionalProfileStep;
