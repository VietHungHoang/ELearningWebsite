import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileSettingsLayout from './ProfileSettingsLayout';
import ModalLayout from '../../../../components/ui/ModalLayout';
import CustomDropdownDashboard from '../../../../components/ui/CustomDropdownDashboard';
import commonUtils from '../../../../utils/commonUtils';
import { useCurrency } from '../../../../context/CurrencyContext';
import { CURRENCY_INFO } from '../../../../utils/currencyHelper';
import type { Category, Subject } from '../../../../types/common';

const SubjectICanTeachPage: React.FC = () => {
    const { t } = useTranslation();
    const { selectedCurrency } = useCurrency();
    const currencySymbol = CURRENCY_INFO[selectedCurrency]?.symbol || '$';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [tuitionFee, setTuitionFee] = useState<string>('');

    // Fetch from commonUtils instead of local mock
    const [categories, setCategories] = useState<Category[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await commonUtils.getCategories();
            setCategories(data);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchSubjects = async () => {
            const data = await commonUtils.getSubjects();
            setSubjects(data);
        };
        fetchSubjects();
    }, []);

    const filteredSubjects = selectedCategory
        ? subjects.filter(subject => subject.categoryId === selectedCategory.id)
        : subjects;

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category);
        // Don't reset subjects when category changes since category is now optional
    };

    const handleSave = () => {
        // TODO: Save selected subjects to backend
        console.log('Selected category:', selectedCategory);
        console.log('Selected subjects:', selectedSubjects);
        console.log('Tuition fee:', tuitionFee);
        setIsModalOpen(false);
        setSelectedCategory(null);
        setSelectedSubjects([]);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCategory(null);
        setSelectedSubjects([]);
    };

    return (
        <>
            <ProfileSettingsLayout activeTab="Subjects I Can Teach">
                {/* Tuition Fee Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{t('dashboard.tutor.subjectsICanTeach.tuitionFee.title')}</h3>
                    <p className="text-sm text-gray-600 mb-6">{t('dashboard.tutor.subjectsICanTeach.tuitionFee.description')}</p>

                    <form className="space-y-0">
                        <div className="flex items-center py-6 border-b border-gray-200">
                            <div className="w-48 text-left">
                                <label className="text-sm font-medium text-gray-700">
                                    {t('dashboard.tutor.subjectsICanTeach.tuitionFee.hourlyRate')} <span className="text-red-500">*</span>
                                </label>
                            </div>
                            <div className="flex-1 pl-4">
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">{currencySymbol}</span>
                                    <input
                                        type="number"
                                        value={tuitionFee}
                                        onChange={(e) => setTuitionFee(e.target.value)}
                                        placeholder={t('dashboard.tutor.subjectsICanTeach.tuitionFee.hourlyRatePlaceholder')}
                                        className="w-full bg-gray-100 border border-transparent rounded-lg pl-8 pr-4 py-2 text-gray-800 placeholder:text-gray-500 placeholder:font-thin hover:bg-white hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-0 focus:border-[#0b6459] transition-all duration-500 ease-in-out"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Subjects I Can Teach Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{t('dashboard.tutor.subjectsICanTeach.subjects.title')}</h3>
                            <p className="text-sm text-gray-600 mt-1">{t('dashboard.tutor.subjectsICanTeach.subjects.description')}</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2.25 bg-[#045A46] text-white text-sm rounded-lg hover:bg-[#03453a] transition-colors font-medium flex items-center gap-2"
                        >
                            <span>+</span>
                            {t('dashboard.tutor.subjectsICanTeach.subjects.addNew')}
                        </button>
                    </div>

                    {/* Empty state */}
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.tutor.subjectsICanTeach.subjects.emptyTitle')}</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {t('dashboard.tutor.subjectsICanTeach.subjects.emptyDescription')}
                            </p>
                        </div>
                    </div>
                </div>
            </ProfileSettingsLayout>

            {/* Add Subject Modal */}
            <ModalLayout
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                maxWidth="lg"
                showCloseButton={true}
            >
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">{t('dashboard.tutor.subjectsICanTeach.modal.title')}</h3>

                    <div className="space-y-6">
                        {/* Category Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('dashboard.tutor.subjectsICanTeach.modal.category')}
                            </label>
                            <CustomDropdownDashboard
                                options={categories.map(c => t('locale') === 'vi' ? c.nameVi : c.nameEn)}
                                selectedValue={selectedCategory ? (t('locale') === 'vi' ? selectedCategory.nameVi : selectedCategory.nameEn) : ''}
                                placeholder={t('dashboard.tutor.subjectsICanTeach.modal.categoryPlaceholder')}
                                onSelect={(categoryName) => {
                                    const category = categories.find(c =>
                                        (t('locale') === 'vi' ? c.nameVi : c.nameEn) === categoryName
                                    );
                                    if (category) handleCategorySelect(category);
                                }}
                                dropdownId="category"
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                            />
                        </div>

                        {/* Subject Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('dashboard.tutor.subjectsICanTeach.modal.subjects')} <span className="text-red-500">*</span>
                            </label>
                            <CustomDropdownDashboard
                                options={filteredSubjects
                                    .filter(subject => !selectedSubjects.some(s => s.id === subject.id))
                                    .map(subject => t('locale') === 'vi' ? subject.nameVi : subject.nameEn)}
                                selectedValue=""
                                placeholder={t('dashboard.tutor.subjectsICanTeach.modal.addSubject')}
                                onSelect={(value: string) => {
                                    const selectedSubject = filteredSubjects.find(s =>
                                        (t('locale') === 'vi' ? s.nameVi : s.nameEn) === value
                                    );
                                    if (selectedSubject && !selectedSubjects.some(s => s.id === selectedSubject.id)) {
                                        setSelectedSubjects(prev => [...prev, selectedSubject]);
                                    }
                                }}
                                dropdownId="subjects"
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                                hasSearch={true}
                            />
                            {/* Selected Subjects List */}
                            {selectedSubjects.length > 0 && (
                                <div className="mt-3">
                                    <div className="flex flex-wrap gap-2">
                                        {selectedSubjects.map((subject, index) => (
                                            <div key={index} className="bg-white border border-gray-200 shadow-xs rounded-lg px-2 py-0.75 text-xs font-normal flex items-center gap-2">
                                                <span>{t('locale') === 'vi' ? subject.nameVi : subject.nameEn}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedSubjects(prev => prev.filter(s => s.id !== subject.id));
                                                    }}
                                                    className="text-gray-400 hover:text-red-500"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Modal Actions */}
                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={handleCloseModal}
                            className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            {t('dashboard.tutor.subjectsICanTeach.modal.cancel')}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={selectedSubjects.length === 0}
                            className="px-4 py-2 text-sm font-semibold bg-[#045A46] text-white rounded-lg hover:bg-[#03453a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {t('dashboard.tutor.subjectsICanTeach.modal.addSubjects')}
                        </button>
                    </div>
                </div>
            </ModalLayout>
        </>
    );
};

export default SubjectICanTeachPage;