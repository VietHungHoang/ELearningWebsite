import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { 
    FiChevronLeft, 
    FiUserPlus, 
    FiSearch, 
    FiBook, 
    FiTag, 
    FiUsers, 
    FiCreditCard, 
    FiFileText, 
    FiCalendar,
    FiClock,
    FiInfo,
    FiMessageCircle,
    FiTrash2,
    FiEdit2,
    FiSave,
    FiX
} from 'react-icons/fi';
import BirdLoading from '../../../../../components/ui/BirdLoading';
import ModalLayout from '../../../../../components/ui/ModalLayout';
import CustomDropdownDashboard from '../../../../../components/ui/CustomDropdownDashboard';
import Toast from '../../../../../components/ui/Toast';
import { type ClassData, classService } from '../../../../../services/classService';
import type { ClassTable } from '../../../../../types/class';
import { useTranslation } from 'react-i18next';
import { useBreadcrumb } from '../../../context/BreadcrumbContext';
import { useCurrency } from '../../../../../context/CurrencyContext';
import { formatCurrency, convertCurrency, convertToVND } from '../../../../../utils/currencyHelper';
import commonUtils from '../../../../../utils/commonUtils';
import type { Category, Subject } from '../../../../../types/common';

interface ClassInfoPageProps {
    isViewMode?: boolean;
    isStudentView?: boolean;
}

const ClassInfoPage: React.FC<ClassInfoPageProps> = ({ isViewMode = false, isStudentView = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { classId } = useParams<{ classId: string }>();
    const { t, i18n } = useTranslation();
    const { setBreadcrumb } = useBreadcrumb();
    const { selectedCurrency } = useCurrency();

    const initialClassData = location.state?.classData as ClassTable | undefined;
    const viewModeFromState = location.state?.isViewMode as boolean | undefined;
    const studentViewFromState = location.state?.isStudentView as boolean | undefined;
    
    // Use props if provided, otherwise use state from location
    const isViewModeFinal = isViewMode || viewModeFromState || false;
    const isStudentViewFinal = isStudentView || studentViewFromState || false;

    const [classData, setClassData] = useState<ClassData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    
    // Form data for editing
    const [formData, setFormData] = useState({
        classTitle: '',
        subject: '',
        category: '',
        maxStudents: 0,
        tuitionFee: 0,
        description: ''
    });

    // Original form data to compare changes
    const [originalFormData, setOriginalFormData] = useState({
        classTitle: '',
        subject: '',
        category: '',
        maxStudents: 0,
        tuitionFee: 0,
        description: ''
    });

    // Dropdown options
    const [categories, setCategories] = useState<Category[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);

    // Helper function to convert day of week number to name
    const getDayName = (dayOfWeek: number): string => {
        const isVietnamese = i18n.language === 'vi';
        if (isVietnamese) {
            const vietnameseDays = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
            return vietnameseDays[dayOfWeek - 1] || 'Unknown';
        } else {
            const englishDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            return englishDays[dayOfWeek - 1] || 'Unknown';
        }
    };

    // Helper function to format date with i18n
    const formatDate = (isoDate: string): string => {
        try {
            const date = new Date(isoDate);
            const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
            return date.toLocaleDateString(locale, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return isoDate;
        }
    };

    // Format currency using selected currency from header
    const formatTuitionFee = (amount: number): string => {
        // Backend returns price in VND, convert to selected currency
        const convertedAmount = convertCurrency(amount, 'VND', selectedCurrency);
        return formatCurrency(convertedAmount, selectedCurrency);
    };

    // Helper to get localized name
    const getLocalizedName = (item: Category | Subject): string => {
        const isVietnamese = i18n.language === 'vi';
        return isVietnamese ? item.nameVi : item.nameEn;
    };

    // Load categories and subjects from localStorage first, then API if needed
    // Use useRef to track if we've already loaded to prevent multiple calls
    const optionsLoadedRef = useRef(false);
    
    useEffect(() => {
        // Only load once when component mounts
        if (optionsLoadedRef.current) return;
        
        const loadOptions = async () => {
            // Check localStorage first before calling API
            const cachedCategories = localStorage.getItem('categories');
            const cachedSubjects = localStorage.getItem('subjects');
            
            // If we have cached data, use it immediately
            if (cachedCategories && cachedSubjects) {
                try {
                    const parsedCategories = JSON.parse(cachedCategories);
                    const parsedSubjects = JSON.parse(cachedSubjects);
                    
                    // Handle both old format (array) and new format ({ data, timestamp })
                    const cats = Array.isArray(parsedCategories) 
                        ? parsedCategories 
                        : (parsedCategories?.data || []);
                    const subs = Array.isArray(parsedSubjects) 
                        ? parsedSubjects 
                        : (parsedSubjects?.data || []);
                    
                    if (cats.length > 0 && subs.length > 0) {
                        setCategories(cats);
                        setSubjects(subs);
                        optionsLoadedRef.current = true;
                        console.log('Loaded categories and subjects from localStorage');
                        // Don't call API here - let commonUtils handle background refresh if needed
                        return;
                    }
                } catch (error) {
                    console.warn('Error parsing cached categories/subjects:', error);
                }
            }
            
            // No cache or invalid cache, fetch from API (this will use localStorage internally)
            const cats = await commonUtils.getCategories();
            const subs = await commonUtils.getSubjects();
            setCategories(cats);
            setSubjects(subs);
            optionsLoadedRef.current = true;
        };
        
        loadOptions();
    }, []); // Only run once on mount

    useEffect(() => {
        setBreadcrumb([
            { label: 'Dashboard', path: '/dashboard' },
            { label: t('dashboard.tutor.myClass.title'), path: '/dashboard/my-class' },
            { label: classData?.classTitle || 'Class Details' }
        ]);
    }, [setBreadcrumb, t, classData]);

    // Helper function to get subjects and categories from state or localStorage
    const getSubjectsAndCategories = useCallback((): { subjects: Subject[]; categories: Category[] } => {
        // Try to use state first
        if (subjects.length > 0 && categories.length > 0) {
            return { subjects, categories };
        }
        
        // Fallback to localStorage
        const cachedCategories = localStorage.getItem('categories');
        const cachedSubjects = localStorage.getItem('subjects');
        
        if (cachedCategories && cachedSubjects) {
            try {
                const parsedCategories = JSON.parse(cachedCategories);
                const parsedSubjects = JSON.parse(cachedSubjects);
                
                const cats = Array.isArray(parsedCategories) 
                    ? parsedCategories 
                    : (parsedCategories?.data || []);
                const subs = Array.isArray(parsedSubjects) 
                    ? parsedSubjects 
                    : (parsedSubjects?.data || []);
                
                return { subjects: subs, categories: cats };
            } catch (error) {
                console.warn('Error parsing cached data:', error);
            }
        }
        
        return { subjects: [], categories: [] };
    }, [subjects, categories]);

    // Load class data from API - only depends on classId
    const loadClassData = useCallback(async () => {
        if (!classId) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            // Always call API to get latest data
            const data = await classService.getClassDetailForPage(classId);
            
            // Convert schedules dayOfWeek to day name
            const convertedSchedules = data.schedules.map(schedule => {
                // If schedule.day is already a name, use it; otherwise convert from dayOfWeek
                if (schedule.day) {
                    return schedule;
                }
                // Try to extract dayOfWeek from schedule if it exists
                const dayOfWeek = (schedule as any).dayOfWeek;
                if (typeof dayOfWeek === 'number') {
                    return {
                        day: getDayName(dayOfWeek),
                        time: schedule.time
                    };
                }
                return schedule;
            });

            // Convert subject and category names to current language
            // Get subjects and categories from state or localStorage
            const { subjects: currentSubjects, categories: currentCategories } = getSubjectsAndCategories();
            
            let localizedSubject = data.subject || '';
            let localizedCategory = data.category || '';
            
            // Localize subject and category names
            if (data.subject && currentSubjects.length > 0 && currentCategories.length > 0) {
                // Try to find subject by matching name (could be English or Vietnamese)
                const subject = currentSubjects.find(s => {
                    const nameEn = s.nameEn?.toLowerCase().trim();
                    const nameVi = s.nameVi?.toLowerCase().trim();
                    const searchName = data.subject?.toLowerCase().trim();
                    return nameEn === searchName || nameVi === searchName;
                });
                
                if (subject) {
                    const isVietnamese = i18n.language === 'vi';
                    localizedSubject = isVietnamese ? subject.nameVi : subject.nameEn;
                    
                    // Get category from subject
                    const category = currentCategories.find(c => c.id === subject.categoryId);
                    if (category) {
                        localizedCategory = isVietnamese ? category.nameVi : category.nameEn;
                    }
                }
            }

            const finalData: ClassData = {
                ...data,
                subject: localizedSubject,
                category: localizedCategory,
                schedules: convertedSchedules
            };

            const initialFormData = {
                classTitle: finalData.classTitle || '',
                subject: localizedSubject,
                category: localizedCategory,
                maxStudents: finalData.maxStudents || finalData.students.length,
                tuitionFee: finalData.tuitionFee || 0,
                description: finalData.description || ''
            };
            setClassData(finalData);
            setFormData(initialFormData);
            setOriginalFormData(initialFormData);
        } catch (error) {
            console.error('Failed to load class data:', error);
            // Fallback to initialClassData if API fails
            if (initialClassData) {
                const convertedData: ClassData = {
                    id: initialClassData.id,
                    classTitle: initialClassData.title,
                    students: initialClassData.students.map(student => ({
                        id: student.id,
                        name: student.fullName,
                        avatar: student.avatarUrl || `https://picsum.photos/seed/${student.id}/48/48`
                    })),
                    type: initialClassData.type === 'ONE_ON_ONE' ? '1-on-1' : 'Group',
                    status: initialClassData.status === 'ONGOING' ? 'Ongoing' : 
                            initialClassData.status === 'COMPLETED' ? 'Completed' : 
                            initialClassData.status === 'CANCELLED' ? 'Completed' : 'Opening',
                    schedules: initialClassData.schedules.map(schedule => ({
                        day: getDayName(schedule.dayOfWeek),
                        time: schedule.time
                    })),
                    startDate: initialClassData.startDate,
                    completedSessions: initialClassData.completedSessions,
                    totalSessions: initialClassData.totalSessions,
                    subject: (initialClassData as any).subject || '',
                    category: (initialClassData as any).category || '',
                    tuitionFee: (initialClassData as any).tuitionFee || 0,
                    description: (initialClassData as any).description || '',
                    quizzes: [],
                    materials: []
                };
                const initialFormData = {
                    classTitle: initialClassData.title || '',
                    subject: (initialClassData as any).subject || '',
                    category: (initialClassData as any).category || '',
                    maxStudents: (initialClassData as any).maxStudents || initialClassData.students.length,
                    tuitionFee: (initialClassData as any).tuitionFee || 0,
                    description: (initialClassData as any).description || ''
                };
                setClassData(convertedData);
                setFormData(initialFormData);
                setOriginalFormData(initialFormData);
            }
        } finally {
            setIsLoading(false);
        }
    }, [classId, getSubjectsAndCategories, i18n.language]); // Only depend on classId and helper function

    // Only reload class data when classId changes
    useEffect(() => {
        if (classId) {
            loadClassData();
        }
    }, [classId, loadClassData]); // Only depend on classId and loadClassData

    // Re-localize class data when subjects/categories or language changes (without calling API)
    useEffect(() => {
        if (!classData || subjects.length === 0 || categories.length === 0) return;
        
        // Only update localization, don't reload from API
        const currentSubject = classData.subject;
        const currentCategory = classData.category;
        
        if (currentSubject) {
            const subject = subjects.find(s => {
                const nameEn = s.nameEn?.toLowerCase().trim();
                const nameVi = s.nameVi?.toLowerCase().trim();
                const searchName = currentSubject.toLowerCase().trim();
                return nameEn === searchName || nameVi === searchName;
            });
            
            if (subject) {
                const localizedSubject = getLocalizedName(subject);
                const category = categories.find(c => c.id === subject.categoryId);
                const localizedCategory = category ? getLocalizedName(category) : (currentCategory || '');
                
                // Only update if names changed
                if (localizedSubject !== currentSubject || localizedCategory !== currentCategory) {
                    setClassData(prev => prev ? {
                        ...prev,
                        subject: localizedSubject,
                        category: localizedCategory
                    } : null);
                    
                    setFormData(prev => ({
                        ...prev,
                        subject: localizedSubject,
                        category: localizedCategory
                    }));
                }
            }
        }
    }, [subjects, categories, i18n.language, classData, getLocalizedName]); // Re-localize when these change

    // Filter subjects when category changes
    useEffect(() => {
        if (formData.category) {
            const selectedCategory = categories.find(cat => {
                const name = getLocalizedName(cat);
                return name === formData.category;
            });
            if (selectedCategory) {
                const filtered = subjects.filter(sub => sub.categoryId === selectedCategory.id);
                setFilteredSubjects(filtered);
            } else {
                setFilteredSubjects([]);
            }
        } else {
            setFilteredSubjects(subjects);
        }
    }, [formData.category, categories, subjects, i18n.language]);

    const handleBack = () => {
        navigate('/dashboard/my-class');
    };

    const handleEdit = () => {
        // Don't allow edit mode if in view mode
        if (isViewModeFinal || isStudentViewFinal) {
            return;
        }
        // Enter edit mode with current data (no API call)
        if (classData) {
            const initialFormData = {
                classTitle: classData.classTitle || '',
                subject: classData.subject || '',
                category: classData.category || '',
                maxStudents: classData.maxStudents ?? classData.students.length,
                tuitionFee: classData.tuitionFee || 0,
                description: classData.description || ''
            };
            setFormData(initialFormData);
            setOriginalFormData(initialFormData);
        }
        setIsEditMode(true);
    };

    const handleCancel = () => {
        setIsEditMode(false);
        // Reset form data to original
        setFormData(originalFormData);
    };

    // Check if form data has changed
    const hasChanges = () => {
        return (
            formData.classTitle !== originalFormData.classTitle ||
            formData.subject !== originalFormData.subject ||
            formData.category !== originalFormData.category ||
            formData.maxStudents !== originalFormData.maxStudents ||
            formData.tuitionFee !== originalFormData.tuitionFee ||
            formData.description !== originalFormData.description
        );
    };

    const handleSave = async () => {
        if (!classId || !classData) {
            setToast({ message: t('dashboard.tutor.myClass.infoPage.saveError'), type: 'error' });
            return;
        }

        try {
            setIsSaving(true);

            // Get subjectId from subject name (use state instead of calling API)
            let subjectId = '';
            const selectedSubject = subjects.find(sub => {
                const name = getLocalizedName(sub);
                return name === formData.subject;
            });
            if (selectedSubject) {
                subjectId = selectedSubject.id;
            } else {
                setToast({ message: t('dashboard.tutor.myClass.infoPage.invalidSubject'), type: 'error' });
                setIsSaving(false);
                return;
            }

            // Convert tuitionFee from selected currency to VND
            const tuitionFeeInVND = convertToVND(formData.tuitionFee, selectedCurrency);

            // Prepare update data
            const updateData = {
                title: formData.classTitle,
                subjectId: subjectId,
                maxStudents: formData.maxStudents,
                pricePerHour: tuitionFeeInVND,
                description: formData.description
            };

            // Call API to update class
            await classService.updateClass(classId, updateData);

            // Refresh class data
            const updatedData = await classService.getClassDetailForPage(classId);
            
            // Convert schedules dayOfWeek to day name
            const convertedSchedules = updatedData.schedules.map(schedule => {
                if (schedule.day) {
                    return schedule;
                }
                const dayOfWeek = (schedule as any).dayOfWeek;
                if (typeof dayOfWeek === 'number') {
                    return {
                        day: getDayName(dayOfWeek),
                        time: schedule.time
                    };
                }
                return schedule;
            });

            // Convert subject and category names to current language (use state instead of calling API)
            let localizedSubject = updatedData.subject || '';
            let localizedCategory = updatedData.category || '';
            
            if (updatedData.subject && subjects.length > 0 && categories.length > 0) {
                // Try to find subject by matching name (could be English or Vietnamese)
                const subject = subjects.find(s => {
                    const nameEn = s.nameEn?.toLowerCase().trim();
                    const nameVi = s.nameVi?.toLowerCase().trim();
                    const searchName = updatedData.subject?.toLowerCase().trim();
                    return nameEn === searchName || nameVi === searchName;
                });
                
                if (subject) {
                    localizedSubject = getLocalizedName(subject);
                    
                    // Get category from subject
                    const category = categories.find(c => c.id === subject.categoryId);
                    if (category) {
                        localizedCategory = getLocalizedName(category);
                    }
                }
            }

            const finalData: ClassData = {
                ...updatedData,
                subject: localizedSubject,
                category: localizedCategory,
                schedules: convertedSchedules
            };

            const updatedFormData = {
                classTitle: finalData.classTitle || '',
                subject: localizedSubject,
                category: localizedCategory,
                maxStudents: finalData.maxStudents ?? finalData.students.length,
                tuitionFee: finalData.tuitionFee || 0,
                description: finalData.description || ''
            };
            setClassData(finalData);
            setFormData(updatedFormData);
            setOriginalFormData(updatedFormData);

            setToast({ message: t('dashboard.tutor.myClass.infoPage.saveSuccess'), type: 'success' });
            setIsEditMode(false);
        } catch (error) {
            console.error('Failed to save class:', error);
            setToast({ message: t('dashboard.tutor.myClass.infoPage.saveError'), type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setSearchTerm('');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <BirdLoading title={t('dashboard.tutor.myClass.infoPage.loadingClassDetails')} size="md" />
            </div>
        );
    }

    if (!classData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Class not found</h2>
                    <p className="mt-2 text-gray-600">The class you're looking for doesn't exist.</p>
                    <button
                        onClick={handleBack}
                        className="mt-4 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43]"
                    >
                        Back to My Classes
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            {/* Header with Back Button */}
            <div className="mb-6">
                <div className="flex items-start gap-4 mb-4">
                    <button 
                        onClick={handleBack} 
                        className="mt-1 p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-600"
                    >
                        <FiChevronLeft />
                    </button>
                    <div className="flex-grow">
                        <div className="flex items-center justify-between gap-4">
                            <h1 className="text-2xl font-bold text-gray-800">{classData.classTitle}</h1>
                            {!isViewModeFinal && !isEditMode ? (
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#094d44] transition-colors font-semibold text-sm"
                                >
                                    <FiEdit2 className="w-4 h-4" />
                                    {t('dashboard.tutor.myClass.infoPage.edit')}
                                </button>
                            ) : !isViewModeFinal && isEditMode ? (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm"
                                    >
                                        <FiX className="w-4 h-4" />
                                        {t('dashboard.tutor.myClass.infoPage.cancel')}
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving || !hasChanges()}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#094d44] transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FiSave className="w-4 h-4" />
                                        {isSaving ? t('dashboard.tutor.myClass.infoPage.saving') : t('dashboard.tutor.myClass.infoPage.save')}
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* Basic Information Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <FiInfo className="w-5 h-5 text-[#0b6459]" />
                                <h2 className="text-xl font-bold text-gray-900">{t('dashboard.tutor.myClass.infoPage.classInformation')}</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-500">{t('dashboard.tutor.myClass.infoPage.createdWithColon')}</span>
                                <span className="text-sm font-semibold text-gray-900">{formatDate(classData.startDate)}</span>
                            </div>
                        </div>

                            {/* Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                                        <FiTag className="w-4 h-4" />
                                        <span>{t('dashboard.tutor.myClass.infoPage.category')}</span>
                                    </div>
                                    {isEditMode ? (
                                        <CustomDropdownDashboard
                                            options={categories.map(category => getLocalizedName(category))}
                                            selectedValue={formData.category || t('dashboard.tutor.myClass.infoPage.categoryPlaceholder')}
                                            placeholder={t('dashboard.tutor.myClass.infoPage.categoryPlaceholder')}
                                            onSelect={(value) => setFormData({ ...formData, category: value === t('dashboard.tutor.myClass.infoPage.categoryPlaceholder') ? '' : value, subject: '' })}
                                            dropdownId="category-dropdown"
                                            openDropdown={openDropdown}
                                            setOpenDropdown={setOpenDropdown}
                                            hasSearch={true}
                                            searchPlaceholder={t('dashboard.tutor.myClass.createModal.searchCategories')}
                                            maxVisibleItems={6}
                                        />
                                    ) : (
                                        <p className="text-base font-semibold text-gray-900 pl-6">
                                            {classData.category || <span className="text-gray-400">N/A</span>}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                                        <FiBook className="w-4 h-4" />
                                        <span>{t('dashboard.tutor.myClass.infoPage.subject')}</span>
                                    </div>
                                    {isEditMode ? (
                                        <CustomDropdownDashboard
                                            options={filteredSubjects.map(subject => getLocalizedName(subject))}
                                            selectedValue={formData.subject || t('dashboard.tutor.myClass.infoPage.subjectPlaceholder')}
                                            placeholder={t('dashboard.tutor.myClass.infoPage.subjectPlaceholder')}
                                            onSelect={(value) => setFormData({ ...formData, subject: value === t('dashboard.tutor.myClass.infoPage.subjectPlaceholder') ? '' : value })}
                                            dropdownId="subject-dropdown"
                                            openDropdown={openDropdown}
                                            setOpenDropdown={setOpenDropdown}
                                            hasSearch={true}
                                            searchPlaceholder={t('dashboard.tutor.myClass.createModal.searchSubjects')}
                                            maxVisibleItems={4}
                                        />
                                    ) : (
                                        <p className="text-base font-semibold text-gray-900 pl-6">
                                            {classData.subject || <span className="text-gray-400">N/A</span>}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                                        <FiUsers className="w-4 h-4" />
                                        <span>{t('dashboard.tutor.myClass.createModal.maxStudents')}</span>
                                    </div>
                                    {isEditMode ? (
                                        <input
                                            type="number"
                                            value={formData.maxStudents}
                                            onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) || 0 })}
                                            className="w-full pl-6 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6459] focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-base font-semibold text-gray-900 pl-6">
                                            {classData.maxStudents ?? classData.students.length}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                                        <FiCreditCard className="w-4 h-4" />
                                        <span>{t('dashboard.tutor.myClass.createModal.tuitionFee')}</span>
                                    </div>
                                    {isEditMode ? (
                                        <input
                                            type="number"
                                            value={formData.tuitionFee}
                                            onChange={(e) => setFormData({ ...formData, tuitionFee: parseFloat(e.target.value) || 0 })}
                                            step="10000"
                                            className="w-full pl-6 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6459] focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-base font-semibold text-gray-900 pl-6">
                                            {classData.tuitionFee ? formatTuitionFee(classData.tuitionFee) : <span className="text-gray-400">{formatCurrency(0, selectedCurrency)}</span>}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
                                    <FiFileText className="w-4 h-4" />
                                    <span>{t('dashboard.tutor.myClass.createModal.description')}</span>
                                </div>
                                {isEditMode ? (
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        className="w-full pl-6 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6459] focus:border-transparent resize-none"
                                        placeholder={t('dashboard.tutor.myClass.createModal.descriptionPlaceholder')}
                                    />
                                ) : (
                                    <p className="text-base text-gray-700 leading-relaxed pl-6">
                                        {classData.description || <span className="text-gray-400 italic">No description provided</span>}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Schedule Card - Simplified */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FiCalendar className="w-5 h-5 text-[#0b6459]" />
                                <h2 className="text-xl font-bold text-gray-900">{t('dashboard.tutor.myClass.infoPage.schedule')}</h2>
                            </div>
                            {classData.schedules.length === 0 ? (
                                <p className="text-gray-400 italic">{t('dashboard.tutor.myClass.infoPage.noSchedule')}</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {classData.schedules.map((schedule, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm font-medium text-gray-700"
                                        >
                                            <FiClock className="w-4 h-4 text-[#0b6459]" />
                                            {schedule.day} - {schedule.time}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Enrolled Students Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <FiUsers className="w-5 h-5 text-[#0b6459]" />
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {t('dashboard.tutor.myClass.infoPage.enrolledStudents', { count: classData.students.length })}
                                    </h2>
                                </div>
                                {!isViewModeFinal && !isStudentViewFinal && (
                                    <button
                                        onClick={openModal}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#094d44] transition-colors text-sm font-semibold"
                                    >
                                        <FiUserPlus className="w-4 h-4" />
                                        {t('dashboard.tutor.myClass.infoPage.addStudent')}
                                    </button>
                                )}
                            </div>

                            {classData.students.length === 0 ? (
                                <div className="p-8 text-center bg-gray-50 rounded-lg">
                                    <FiUserPlus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h4 className="text-gray-900 font-medium mb-2">{t('dashboard.tutor.myClass.infoPage.noStudents')}</h4>
                                    <p className="text-gray-600 text-sm">{t('dashboard.tutor.myClass.infoPage.addFirstStudent')}</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                                    {classData.students.map((student) => {
                                        const studentName = student.name || t('dashboard.tutor.myClass.infoPage.student', { id: student.id });
                                        const studentEmail = student.email || 
                                            `${studentName.toLowerCase().replace(/\s+/g, '.').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}@example.com`;
                                        
                                        return (
                                            <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-[#0b6459] rounded-full flex items-center justify-center text-white font-medium">
                                                            {studentName.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{studentName}</p>
                                                            <p className="text-sm text-gray-600">{studentEmail}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        {/* Ẩn nút nhắn tin nếu lớp đang chờ và chưa có học sinh */}
                                                        {!(classData.status === 'Opening' && classData.students.length === 0) && (
                                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title={t('dashboard.tutor.myClass.infoPage.sendMessage')}>
                                                                <FiMessageCircle className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title={t('dashboard.tutor.myClass.infoPage.removeStudent')}>
                                                            <FiTrash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
            </div>

            {/* Add Student Modal - Simplified like StudentsTab */}
            <ModalLayout
                isOpen={isModalOpen}
                onClose={closeModal}
                maxWidth="md"
                showCloseButton={true}
            >
                <div className="p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">{t('dashboard.tutor.myClass.infoPage.addStudent')}</h3>

                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder={t('dashboard.tutor.myClass.infoPage.searchStudent')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white rounded-lg pl-10 pr-4 py-2.5 text-sm border border-gray-200 hover:shadow-sm focus:outline-none focus:border-[#0b6459] transition-colors duration-300 w-full"
                        />
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {searchTerm && (
                            <div className="text-center py-8 text-gray-500">
                                <FiSearch className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p>{t('dashboard.tutor.myClass.infoPage.searchFeatureComing')}</p>
                                <p className="text-sm">{t('dashboard.tutor.myClass.infoPage.searchingFor', { term: searchTerm })}</p>
                            </div>
                        )}
                        {!searchTerm && (
                            <div className="text-center py-8 text-gray-500">
                                <FiUserPlus className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p>{t('dashboard.tutor.myClass.infoPage.enterToSearch')}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={closeModal}
                            className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm"
                        >
                            {t('dashboard.tutor.myClass.infoPage.cancel')}
                        </button>
                        <button className="flex-1 px-4 py-2.5 bg-[#0b6459] text-white rounded-lg hover:bg-[#094d44] transition-colors font-semibold text-sm">
                            {t('dashboard.tutor.myClass.infoPage.addSelected')}
                        </button>
                    </div>
                </div>
            </ModalLayout>
        </div>
    );
};

export default ClassInfoPage;