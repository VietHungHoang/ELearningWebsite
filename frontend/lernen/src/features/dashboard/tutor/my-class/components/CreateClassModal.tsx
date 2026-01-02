import React, { useState, useEffect } from 'react';
import ModalLayout from '../../../../../components/ui/ModalLayout';
import CustomDropdown2 from '../../../../../components/ui/CustomDropdown2';
import ConfirmModal from '../../../../../components/ui/ConfirmModal';
import Toast from '../../../../../components/ui/Toast';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../../../../context/CurrencyContext';
import commonUtils from '../../../../../utils/commonUtils';
import type { Category, Subject } from '../../../../../types/common';
import { classService } from '../../../../../services/classService';
import type { CreateClassRequest } from '../../../../../services/classService';

interface Schedule {
    day: string;
    time: string;
}

interface CreateClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (classData: ClassFormData) => void;
}

export interface ClassFormData {
    classTitle: string;
    subject: string; // Will store subject ID
    category: string;
    tuitionFee: number;
    maxStudents: number;
    description: string;
    schedules: Schedule[];
}

const CreateClassModal: React.FC<CreateClassModalProps> = ({
    isOpen,
    onClose,
    onSubmit
}) => {
    const { t, i18n } = useTranslation();
    const { currencyDisplay } = useCurrency();

    // Debug: Check if translations are loaded
    useEffect(() => {
        if (isOpen) {
            console.log('Current language:', i18n.language);
            console.log('Monday translation:', t('common.days.monday'));
            console.log('Tuesday translation:', t('common.days.tuesday'));
            console.log('All common.days keys:', {
                monday: t('common.days.monday'),
                tuesday: t('common.days.tuesday'),
                wednesday: t('common.days.wednesday'),
                thursday: t('common.days.thursday'),
                friday: t('common.days.friday'),
                saturday: t('common.days.saturday'),
                sunday: t('common.days.sunday')
            });
            // Check if key exists
            const resource = i18n.getResourceBundle(i18n.language, 'translation');
            console.log('common.days from resource:', resource?.common?.days);
        }
    }, [isOpen, i18n.language, t]);
    const [formData, setFormData] = useState<ClassFormData>({
        classTitle: '',
        subject: '',
        category: '',
        tuitionFee: 0,
        maxStudents: 1,
        description: '',
        schedules: [{ day: '', time: '' }]
    });

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [showConfirmClose, setShowConfirmClose] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Transform form data to API request format
    const transformFormDataToApiRequest = (formData: ClassFormData): CreateClassRequest => {
        // formData.subject now stores the subject ID directly

        // Map day names to numbers (Monday = 1, Tuesday = 2, etc.)
        const dayNameToNumber = (dayName: string): number => {
            const dayMap: Record<string, number> = {
                [t('common.days.monday')]: 1,
                [t('common.days.tuesday')]: 2,
                [t('common.days.wednesday')]: 3,
                [t('common.days.thursday')]: 4,
                [t('common.days.friday')]: 5,
                [t('common.days.saturday')]: 6,
                [t('common.days.sunday')]: 7,
            };
            return dayMap[dayName] || 1; // Default to Monday if not found
        };

        // Convert time from "10:00 AM" format to "10:00" (24h format)
        const convertTimeTo24Hour = (timeStr: string): string => {
            if (!timeStr) return '';
            
            // If already in 24h format (HH:mm), return as is
            if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
                return timeStr;
            }
            
            // Parse "10:00 AM" or "1:00 PM" format
            const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
            if (!match) return timeStr; // Return original if can't parse
            
            let hours = parseInt(match[1], 10);
            const minutes = match[2];
            const period = match[3].toUpperCase();
            
            if (period === 'PM' && hours !== 12) {
                hours += 12;
            } else if (period === 'AM' && hours === 12) {
                hours = 0;
            }
            
            return `${hours.toString().padStart(2, '0')}:${minutes}`;
        };

        return {
            title: formData.classTitle,
            subjectId: formData.subject || '',
            tuitionFee: formData.tuitionFee,
            maxStudents: formData.maxStudents,
            description: formData.description,
            schedules: formData.schedules
                .filter(schedule => schedule.day && schedule.time)
                .map(schedule => ({
                    dayOfWeek: Number(dayNameToNumber(schedule.day)), // Ensure it's a number, not string
                    time: convertTimeTo24Hour(schedule.time)
                }))
        };
    };

    // Load categories and subjects when modal opens
    useEffect(() => {
        if (isOpen) {
            const loadData = async () => {
                setLoadingCategories(true);
                setLoadingSubjects(true);

                try {
                    const [categoriesData, subjectsData] = await Promise.all([
                        commonUtils.getCategories(),
                        commonUtils.getSubjects()
                    ]);

                    setCategories(categoriesData);
                    setSubjects(subjectsData);
                } catch (error) {
                    console.error('Failed to load categories and subjects:', error);
                } finally {
                    setLoadingCategories(false);
                    setLoadingSubjects(false);
                }
            };

            loadData();
        }
    }, [isOpen]);

    // Check if any form data has been entered
    const hasFormData = () => {
        return (
            formData.classTitle.trim() !== '' ||
            formData.subject !== '' ||
            formData.category !== '' ||
            formData.tuitionFee !== 0 ||
            formData.maxStudents > 1 ||
            formData.description.trim() !== '' ||
            formData.schedules.some(schedule => schedule.day !== '' || schedule.time !== '')
        );
    };

    // Check if all required fields are filled
    const isFormValid = () => {
        const hasValidTitle = formData.classTitle.trim() !== '';
        const hasValidSubject = formData.subject !== '';
        const hasValidFee = formData.tuitionFee >= 0;
        const hasValidStudents = formData.maxStudents >= 1;
        const hasValidDescription = formData.description.trim() !== '';
        const hasValidSchedule = formData.schedules.some(schedule => schedule.day !== '' && schedule.time !== '');

        return hasValidTitle && hasValidSubject && hasValidFee && hasValidStudents && hasValidDescription && hasValidSchedule;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid()) return;

        setIsSubmitting(true);
        setToast(null);

        try {
            const apiRequest = transformFormDataToApiRequest(formData);
            const response = await classService.createClass(apiRequest);

            if (response.success) {
                // Call the parent onSubmit with the original form data
                onSubmit(formData);

                // Reset form
                setFormData({
                    classTitle: '',
                    subject: '',
                    category: '',
                    tuitionFee: 0,
                    maxStudents: 1,
                    description: '',
                    schedules: [{ day: '', time: '' }]
                });

                setToast({ message: t('dashboard.tutor.myClass.createModal.success') || 'Class created successfully', type: 'success' });
                setTimeout(() => {
                    onClose();
                }, 1000);
            } else {
                setToast({ message: response.message || t('dashboard.tutor.myClass.createModal.error') || 'Failed to create class', type: 'error' });
            }
        } catch (error: any) {
            console.error('Error creating class:', error);
            setToast({ message: error.response?.data?.message || t('dashboard.tutor.myClass.createModal.error') || 'Failed to create class. Please try again.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (hasFormData()) {
            setShowConfirmClose(true);
        } else {
            // Reset form when closing
            setFormData({
                classTitle: '',
                subject: '',
                category: '',
                tuitionFee: 0,
                maxStudents: 1,
                description: '',
                schedules: [{ day: '', time: '' }]
            });
            onClose();
        }
    };

    const confirmClose = () => {
        setShowConfirmClose(false);
        // Reset form when closing
        setFormData({
            classTitle: '',
            subject: '',
            category: '',
            tuitionFee: 0,
            maxStudents: 1,
            description: '',
            schedules: [{ day: '', time: '' }]
        });
        onClose();
    };

    const cancelClose = () => {
        setShowConfirmClose(false);
    };

    const addSchedule = () => {
        setFormData(prev => ({
            ...prev,
            schedules: [...prev.schedules, { day: '', time: '' }]
        }));
    };

    const updateSchedule = (index: number, field: 'day' | 'time', value: string) => {
        setFormData(prev => ({
            ...prev,
            schedules: prev.schedules.map((schedule, i) =>
                i === index ? { ...schedule, [field]: value } : schedule
            )
        }));
    };

    const removeSchedule = (index: number) => {
        if (formData.schedules.length > 1) {
            setFormData(prev => ({
                ...prev,
                schedules: prev.schedules.filter((_, i) => i !== index)
            }));
        }
    };

    return (
        <ModalLayout
            isOpen={isOpen}
            onClose={handleClose}
            maxWidth="2xl"
            showCloseButton={true}
        >
            <div className="flex flex-col h-full max-h-[80vh] rounded-2xl overflow-hidden relative z-10">
                <div className="p-6 flex-1 overflow-y-auto relative z-20">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">{t('dashboard.tutor.myClass.createModal.title')}</h2>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
                            <div className="md:col-span-7">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('dashboard.tutor.myClass.createModal.classTitle')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.classTitle}
                                    onChange={(e) => setFormData(prev => ({ ...prev, classTitle: e.target.value }))}
                                    className="w-full px-3 py-2 bg-[#f7f7f8] border border-transparent rounded-lg focus:outline-none focus:border-[#0b6459] focus:bg-white hover:border-gray-300 hover:bg-white transition-all duration-300 ease-in-out placeholder:text-gray-300"
                                    placeholder={t('dashboard.tutor.myClass.createModal.classTitlePlaceholder')}
                                    required
                                />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('dashboard.tutor.myClass.createModal.maxStudents')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.maxStudents}
                                    onChange={(e) => setFormData(prev => ({ ...prev, maxStudents: parseInt(e.target.value) || 1 }))}
                                    className="w-full px-3 py-2 bg-[#f7f7f8] border border-transparent rounded-lg focus:outline-none focus:border-[#0b6459] focus:bg-white hover:border-gray-300 hover:bg-white transition-all duration-300 ease-in-out placeholder:text-gray-300"
                                    placeholder={t('dashboard.tutor.myClass.createModal.maxStudentsPlaceholder')}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <CustomDropdown2
                                    label={t('dashboard.tutor.myClass.createModal.category')}
                                    options={categories.map(cat => i18n.language === 'vi' ? cat.nameVi : cat.nameEn)}
                                    selectedValue={formData.category 
                                        ? (categories.find(cat => cat.id === formData.category) 
                                            ? (i18n.language === 'vi' 
                                                ? categories.find(cat => cat.id === formData.category)!.nameVi 
                                                : categories.find(cat => cat.id === formData.category)!.nameEn)
                                            : '')
                                        : ''}
                                    placeholder={loadingCategories ? t('common.loading') : t('dashboard.tutor.myClass.createModal.categoryPlaceholder')}
                                    onSelect={(value: string) => {
                                        const selectedCategory = categories.find(cat => 
                                            (i18n.language === 'vi' ? cat.nameVi : cat.nameEn) === value
                                        );
                                        setFormData(prev => ({ 
                                            ...prev, 
                                            category: selectedCategory?.id || '',
                                            subject: '' // Reset subject when category changes
                                        }));
                                    }}
                                    dropdownId="category-dropdown"
                                    openDropdown={openDropdown}
                                    setOpenDropdown={setOpenDropdown}
                                    hasSearch={true}
                                    searchPlaceholder={t('dashboard.tutor.myClass.createModal.searchCategories')}
                                    maxVisibleItems={4}
                                />
                            </div>
                            <div>
                                <CustomDropdown2
                                    label={<>{t('dashboard.tutor.myClass.createModal.subject')} <span className="text-red-500">*</span></>}
                                    options={(() => {
                                        // Filter subjects by selected category
                                        const filteredSubjects = formData.category 
                                            ? subjects.filter(sub => sub.categoryId === formData.category)
                                            : subjects;
                                        return filteredSubjects.map(sub => i18n.language === 'vi' ? sub.nameVi : sub.nameEn);
                                    })()}
                                    selectedValue={formData.subject 
                                        ? (subjects.find(sub => sub.id === formData.subject) 
                                            ? (i18n.language === 'vi' 
                                                ? subjects.find(sub => sub.id === formData.subject)!.nameVi 
                                                : subjects.find(sub => sub.id === formData.subject)!.nameEn)
                                            : '')
                                        : ''}
                                    placeholder={loadingSubjects ? t('common.loading') : t('dashboard.tutor.myClass.createModal.subjectPlaceholder')}
                                    onSelect={(value: string) => {
                                        const filteredSubjects = formData.category 
                                            ? subjects.filter(sub => sub.categoryId === formData.category)
                                            : subjects;
                                        const selectedSubject = filteredSubjects.find(sub => 
                                            (i18n.language === 'vi' ? sub.nameVi : sub.nameEn) === value
                                        );
                                        setFormData(prev => ({ ...prev, subject: selectedSubject?.id || '' }));
                                    }}
                                    dropdownId="subject-dropdown"
                                    openDropdown={openDropdown}
                                    setOpenDropdown={setOpenDropdown}
                                    hasSearch={true}
                                    searchPlaceholder={t('dashboard.tutor.myClass.createModal.searchSubjects')}
                                    maxVisibleItems={4}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('dashboard.tutor.myClass.createModal.tuitionFee')} ({currencyDisplay}) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="10000"
                                    value={formData.tuitionFee || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFormData(prev => ({ 
                                            ...prev, 
                                            tuitionFee: value === '' ? 0 : parseInt(value) || 0 
                                        }));
                                    }}
                                    className="w-full px-3 py-2 bg-[#f7f7f8] border border-transparent rounded-lg focus:outline-none focus:border-[#0b6459] focus:bg-white hover:border-gray-300 hover:bg-white transition-all duration-300 ease-in-out placeholder:text-gray-300"
                                    placeholder={t('dashboard.tutor.myClass.createModal.tuitionFeePlaceholder')}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('dashboard.tutor.myClass.createModal.description')} <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full px-3 py-2 bg-[#f7f7f8] border border-transparent rounded-lg focus:outline-none focus:border-[#0b6459] focus:bg-white hover:border-gray-300 hover:bg-white transition-all duration-300 ease-in-out h-24 resize-none placeholder:text-gray-300"
                                placeholder={t('dashboard.tutor.myClass.createModal.descriptionPlaceholder')}
                                required
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    {t('dashboard.tutor.myClass.createModal.schedule')} <span className="text-red-500">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={addSchedule}
                                    className="text-[#0b6459] hover:text-[#0a5a4f] font-medium text-sm flex items-center gap-1"
                                >
                                    <span>+</span>
                                    {t('dashboard.tutor.myClass.createModal.addSchedule')}
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formData.schedules.map((schedule, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg">
                                        <div className="flex-1">
                                            <CustomDropdown2
                                                options={[
                                                    t('common.days.monday'),
                                                    t('common.days.tuesday'),
                                                    t('common.days.wednesday'),
                                                    t('common.days.thursday'),
                                                    t('common.days.friday'),
                                                    t('common.days.saturday'),
                                                    t('common.days.sunday')
                                                ]}
                                                selectedValue={schedule.day}
                                                placeholder={t('dashboard.tutor.myClass.createModal.selectDay')}
                                                onSelect={(value: string) => updateSchedule(index, 'day', value)}
                                                dropdownId={`day-dropdown-${index}`}
                                                openDropdown={openDropdown}
                                                setOpenDropdown={setOpenDropdown}
                                                hasSearch={false}
                                                position="top"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <CustomDropdown2
                                                options={["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"]}
                                                selectedValue={schedule.time}
                                                placeholder={t('dashboard.tutor.myClass.createModal.selectTime')}
                                                onSelect={(value: string) => updateSchedule(index, 'time', value)}
                                                dropdownId={`time-dropdown-${index}`}
                                                openDropdown={openDropdown}
                                                setOpenDropdown={setOpenDropdown}
                                                hasSearch={true}
                                                searchPlaceholder={t('dashboard.tutor.myClass.createModal.searchTimes')}
                                                position="top"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeSchedule(index)}
                                            disabled={formData.schedules.length === 1}
                                            className={`p-1 ${formData.schedules.length === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-700'}`}
                                            title={formData.schedules.length === 1 ? t('dashboard.tutor.myClass.createModal.cannotRemoveLastSchedule') : t('dashboard.tutor.myClass.createModal.removeSchedule')}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>
                </div>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                <div className="flex justify-end gap-3 p-4 mr-5 border-t border-gray-200 bg-white rounded-b-2xl">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        type="button"
                        disabled={!isFormValid() || isSubmitting}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${isFormValid() && !isSubmitting
                                ? 'bg-[#0b6459] text-white hover:bg-[#084c43]'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('common.loading')}
                            </>
                        ) : (
                            t('dashboard.tutor.myClass.createModal.createClass')
                        )}
                    </button>
                </div>
            </div>

            <ConfirmModal
                isOpen={showConfirmClose}
                title={t('dashboard.tutor.myClass.createModal.confirmClose.title')}
                message={t('dashboard.tutor.myClass.createModal.confirmClose.message')}
                confirmText={t('dashboard.tutor.myClass.createModal.confirmClose.confirmText')}
                onConfirm={confirmClose}
                onCancel={cancelClose}
                confirmButtonColor="red"
            />
        </ModalLayout>
    );
};

export default CreateClassModal;