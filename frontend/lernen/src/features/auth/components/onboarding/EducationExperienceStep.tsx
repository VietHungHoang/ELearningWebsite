import React, { useState, useEffect, useRef } from 'react';
import { HiPlus, HiPencil, HiTrash, HiAcademicCap, HiBriefcase } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import ModalLayout from '../../../../components/ui/ModalLayout';
import type { EducationItem, ExperienceItem, TutorOnboardingData } from '../../../../types/tutor';

interface EducationExperienceStepProps {
    data: Partial<TutorOnboardingData>;
    onChange: (data: Partial<TutorOnboardingData>) => void;
}

// Delete Confirm Popup Component - tách riêng để quản lý state độc lập
interface DeleteConfirmPopupProps {
    onConfirm: () => void;
    onCancel: () => void;
    confirmText: string;
    cancelText: string;
    deleteText: string;
}

const DeleteConfirmPopup: React.FC<DeleteConfirmPopupProps> = ({
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    deleteText,
}) => {
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onCancel();
            }
        };

        // Delay để tránh close ngay khi click button mở
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 0);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onCancel]);

    return (
        <div
            ref={popupRef}
            className="absolute right-0 top-full mt-1 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[200px]"
        >
            <p className="text-sm text-gray-700 mb-3">{confirmText}</p>
            <div className="flex gap-2 justify-end">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onCancel();
                    }}
                    className="px-2 py-1 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition"
                >
                    {cancelText}
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onConfirm();
                    }}
                    className="px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700 transition"
                >
                    {deleteText}
                </button>
            </div>
        </div>
    );
};

// Item Card Component với state popup riêng
interface ItemCardProps {
    item: EducationItem | ExperienceItem;
    onEdit: () => void;
    onDelete: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onEdit, onDelete }) => {
    const { t } = useTranslation();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        setShowDeleteConfirm(false);
        onDelete();
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    return (
        <div className="bg-white rounded-lg p-4 border border-gray-200 group hover:shadow-sm transition">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-grow min-w-0">
                    <h4 className="text-base font-semibold text-gray-800">{item.title}</h4>
                    <p className="text-sm text-gray-600 mt-0.5">{item.institution}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.startDate).getFullYear()} - {item.endDate ? new Date(item.endDate).getFullYear() : t('onboarding.educationExperience.present')}
                        {item.location && ` • ${item.location}`}
                    </p>
                    {item.description && (
                        <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                    )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onEdit}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                        title={t('onboarding.educationExperience.edit')}
                    >
                        <HiPencil className="w-4 h-4" />
                    </button>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={handleDeleteClick}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                            title={t('onboarding.educationExperience.delete')}
                        >
                            <HiTrash className="w-4 h-4" />
                        </button>
                        {showDeleteConfirm && (
                            <DeleteConfirmPopup
                                onConfirm={handleConfirmDelete}
                                onCancel={handleCancelDelete}
                                confirmText={t('onboarding.educationExperience.confirmDelete')}
                                cancelText={t('onboarding.educationExperience.modal.cancel')}
                                deleteText={t('onboarding.educationExperience.delete')}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const EducationExperienceStep: React.FC<EducationExperienceStepProps> = ({ data, onChange }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'education' | 'experience'>('education');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<EducationItem | ExperienceItem | null>(null);
    const [editingType, setEditingType] = useState<'education' | 'experience'>('education');

    const handleAdd = (type: 'education' | 'experience') => {
        setEditingType(type);
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: EducationItem | ExperienceItem, type: 'education' | 'experience') => {
        setEditingType(type);
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string, type: 'education' | 'experience') => {
        if (type === 'education') {
            onChange({ educations: (data.educations || []).filter((e: EducationItem) => e.id !== id) });
        } else {
            onChange({ experiences: (data.experiences || []).filter((e: ExperienceItem) => e.id !== id) });
        }
    };

    // Helper function to check if ID is old format (edu-xxx or exp-xxx)
    const isOldIdFormat = (id: string | undefined): boolean => {
        if (!id) return true;
        return id.startsWith('edu-') || id.startsWith('exp-');
    };

    // Helper function to ensure UUID format
    const ensureUUID = (id: string | undefined): string => {
        if (!id || isOldIdFormat(id)) {
            return crypto.randomUUID();
        }
        return id;
    };

    const handleSave = (item: EducationItem | ExperienceItem) => {
        const newId = ensureUUID(item.id);
        const itemWithUUID = { ...item, id: newId };

        if (editingType === 'education') {
            if (item.id) {
                // Edit existing item - find by old ID and replace with new UUID
                onChange({ 
                    educations: (data.educations || []).map((e: EducationItem) => 
                        e.id === item.id ? itemWithUUID : e
                    ) 
                });
            } else {
                // Add new item with UUID
                onChange({ educations: [...(data.educations || []), itemWithUUID] });
            }
        } else {
            if (item.id) {
                // Edit existing item - find by old ID and replace with new UUID
                onChange({ 
                    experiences: (data.experiences || []).map((e: ExperienceItem) => 
                        e.id === item.id ? itemWithUUID : e
                    ) 
                });
            } else {
                // Add new item with UUID
                onChange({ experiences: [...(data.experiences || []), itemWithUUID] });
            }
        }
        setIsModalOpen(false);
    };

    const inputStyles = 'w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-gray-800 placeholder:text-gray-400 placeholder:font-thin hover:bg-white hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-0 focus:border-[#0b6459] transition-all duration-500 ease-in-out';

    return (
        <div className="space-y-6">

            {/* Tabs */}
            <div className="flex items-center gap-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('education')}
                    className={`px-4 py-3 font-semibold text-sm border-b-2 transition ${activeTab === 'education'
                        ? 'border-[#0b6459] text-[#0b6459]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <HiAcademicCap className="w-5 h-5" />
                        {t('onboarding.educationExperience.education')} ({(data.educations || []).length})
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('experience')}
                    className={`px-4 py-3 font-semibold text-sm border-b-2 transition ${activeTab === 'experience'
                        ? 'border-[#0b6459] text-[#0b6459]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <HiBriefcase className="w-5 h-5" />
                        {t('onboarding.educationExperience.experience')} ({(data.experiences || []).length})
                    </div>
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {activeTab === 'education' ? (
                    <>
                        {(data.educations || []).map((edu: EducationItem) => (
                            <ItemCard
                                key={edu.id}
                                item={edu}
                                onEdit={() => handleEdit(edu, 'education')}
                                onDelete={() => handleDelete(edu.id, 'education')}
                            />
                        ))}
                        {(data.educations || []).length === 0 && (
                            <div className="text-center py-6 text-gray-400 text-sm">
                                {t('onboarding.educationExperience.noEducation')}
                            </div>
                        )}
                        <button
                            onClick={() => handleAdd('education')}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-[#0b6459] hover:text-[#0b6459] transition font-medium text-sm"
                        >
                            <HiPlus className="w-4 h-4" />
                            {t('onboarding.educationExperience.addEducation')}
                        </button>
                    </>
                ) : (
                    <>
                        {(data.experiences || []).map((exp: ExperienceItem) => (
                            <ItemCard
                                key={exp.id}
                                item={exp}
                                onEdit={() => handleEdit(exp, 'experience')}
                                onDelete={() => handleDelete(exp.id, 'experience')}
                            />
                        ))}
                        {(data.experiences || []).length === 0 && (
                            <div className="text-center py-6 text-gray-400 text-sm">
                                {t('onboarding.educationExperience.noExperience')}
                            </div>
                        )}
                        <button
                            onClick={() => handleAdd('experience')}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-[#0b6459] hover:text-[#0b6459] transition font-medium text-sm"
                        >
                            <HiPlus className="w-4 h-4" />
                            {t('onboarding.educationExperience.addExperience')}
                        </button>
                    </>
                )}
            </div>

            {/* Modal */}
            <ItemModal
                type={editingType}
                item={editingItem}
                isOpen={isModalOpen}
                onSave={handleSave}
                onClose={() => setIsModalOpen(false)}
                inputStyles={inputStyles}
            />
        </div>
    );
};

// Modal Component
const ItemModal: React.FC<{
    type: 'education' | 'experience';
    item: EducationItem | ExperienceItem | null;
    isOpen: boolean;
    onSave: (item: EducationItem | ExperienceItem) => void;
    onClose: () => void;
    inputStyles: string;
}> = ({ type, item, isOpen, onSave, onClose, inputStyles }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        title: '',
        institution: '',
        startDate: '',
        endDate: '',
        location: '',
        description: '',
    });

    // Update formData when item changes (when editing)
    useEffect(() => {
        if (item) {
            setFormData({
                title: item.title || '',
                institution: item.institution || '',
                startDate: item.startDate || '',
                endDate: item.endDate || '',
                location: item.location || '',
                description: item.description || '',
            });
        } else {
            // Reset form when adding new item
            setFormData({
                title: '',
                institution: '',
                startDate: '',
                endDate: '',
                location: '',
                description: '',
            });
        }
    }, [item, isOpen]);

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }
        onSave({ ...formData, id: item?.id || '' } as EducationItem | ExperienceItem);
    };

    return (
        <ModalLayout isOpen={isOpen} onClose={onClose} maxWidth="2xl" showCloseButton={true}>
            <div className="max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header - Fixed */}
                <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <h3 className="text-xl font-bold text-gray-800">
                        {item ? (type === 'education' ? t('onboarding.educationExperience.modal.editEducation') : t('onboarding.educationExperience.modal.editExperience')) : (type === 'education' ? t('onboarding.educationExperience.modal.addEducation') : t('onboarding.educationExperience.modal.addExperience'))}
                    </h3>
                </div>

                {/* Content - Scrollable */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="px-6 py-4 space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {type === 'education' ? t('onboarding.educationExperience.modal.degreeField') : t('onboarding.educationExperience.modal.jobTitle')} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className={inputStyles}
                            placeholder={type === 'education' ? t('onboarding.educationExperience.modal.degreePlaceholder') : t('onboarding.educationExperience.modal.jobTitlePlaceholder')}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {type === 'education' ? t('onboarding.educationExperience.modal.schoolUniversity') : t('onboarding.educationExperience.modal.companyOrganization')} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.institution}
                            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                            className={inputStyles}
                            placeholder={type === 'education' ? t('onboarding.educationExperience.modal.schoolPlaceholder') : t('onboarding.educationExperience.modal.companyPlaceholder')}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('onboarding.educationExperience.modal.startDate')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className={inputStyles}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                                {t('onboarding.educationExperience.modal.endDate')}
                                <div className="relative group">
                                    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                                        {t('onboarding.educationExperience.modal.endDateHint')}
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                            <div className="border-4 border-transparent border-t-gray-800"></div>
                                        </div>
                                    </div>
                                </div>
                            </label>
                            <input
                                type="date"
                                value={formData.endDate || ''}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className={inputStyles}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('onboarding.educationExperience.modal.location')}
                        </label>
                        <input
                            type="text"
                            value={formData.location || ''}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className={inputStyles}
                            placeholder={t('onboarding.educationExperience.modal.locationPlaceholder')}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('onboarding.educationExperience.modal.description')}
                        </label>
                        <textarea
                            rows={3}
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={`${inputStyles} resize-none`}
                            placeholder={t('onboarding.educationExperience.modal.descriptionPlaceholder')}
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                        >
                            {t('onboarding.educationExperience.modal.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 px-4 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition font-semibold"
                        >
                            {t('onboarding.educationExperience.modal.save')}
                        </button>
                    </div>
                    </div>
                </form>
            </div>
        </ModalLayout>
    );
};

export default EducationExperienceStep;
