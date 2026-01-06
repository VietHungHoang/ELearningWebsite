import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { HiAcademicCap, HiLocationMarker, HiPencil, HiTrash, HiPlus } from 'react-icons/hi';
import ResumeItemModal from './ResumeItemModal';
import type { EducationItem, ExperienceItem, CertificationItem } from '../../../../../types/api';
import { generateUUID } from '../../../../../utils/uuidUtils';


// --- TYPE DEFINITIONS ---
export type ResumeItemData = EducationItem | ExperienceItem | CertificationItem;

// --- DELETE CONFIRM POPUP COMPONENT (from TutorOnboarding) ---
interface DeleteConfirmPopupProps {
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteConfirmPopup: React.FC<DeleteConfirmPopupProps> = ({ onConfirm, onCancel }) => {
    const { t } = useTranslation();
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onCancel();
            }
        };

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
            <p className="text-sm text-gray-700 mb-3">{t('onboarding.educationExperience.confirmDelete')}</p>
            <div className="flex gap-2 justify-end">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onCancel();
                    }}
                    className="px-2 py-1 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition"
                >
                    {t('onboarding.educationExperience.modal.cancel')}
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onConfirm();
                    }}
                    className="px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700 transition"
                >
                    {t('onboarding.educationExperience.delete')}
                </button>
            </div>
        </div>
    );
};

// Helper to format dates for display
const formatDateRange = (startDate: string, endDate: string | null | undefined): string => {
    const start = new Date(startDate).getFullYear().toString();
    const end = endDate ? new Date(endDate).getFullYear().toString() : 'Present';
    return `${start} - ${end}`;
};

// Helper to get title from certification
const getItemTitle = (item: ResumeItemData): string => {
    return 'name' in item ? item.name : item.title;
};

// Helper to get institution from certification
const getItemInstitution = (item: ResumeItemData): string => {
    return 'issuingOrganization' in item ? item.issuingOrganization : item.institution;
};

// --- RESUME ITEM COMPONENT (with inline delete popup) ---
const ResumeItem: React.FC<{ item: ResumeItemData; onEdit: () => void; onDelete: () => void; }> = ({ item, onEdit, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const description = ('description' in item ? item.description : undefined) || '';
    const canTruncate = description.length > 100;
    const truncatedDescription = `${description.substring(0, 100)}...`;

    const dateRange = 'issueDate' in item
        ? new Date(item.issueDate).getFullYear().toString()
        : formatDateRange(item.startDate, item.endDate);

    const title = getItemTitle(item);
    const institution = getItemInstitution(item);
    const location = ('location' in item ? item.location : undefined) || 'N/A';

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
        <div className="flex gap-6 group relative">
            <p className="text-sm font-semibold text-gray-600 w-24 flex-shrink-0 mt-1">{dateRange}</p>
            <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5"><HiAcademicCap className="w-4 h-4" /> {institution}</span>
                    <span className="flex items-center gap-1.5"><HiLocationMarker className="w-4 h-4" /> {location}</span>
                </div>
                {description && (
                    <>
                        <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                            {isExpanded ? description : truncatedDescription}
                        </p>
                        {canTruncate && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="mt-2 text-sm font-semibold text-[#0b6459] underline hover:text-[#084c43]"
                            >
                                {isExpanded ? 'Show less' : 'Show more'}
                            </button>
                        )}
                    </>
                )}
            </div>
            <div className="absolute top-0 right-0 flex items-center gap-1">
                <button
                    onClick={onEdit}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                >
                    <HiPencil className="w-4 h-4" />
                </button>
                <div className="relative">
                    <button
                        onClick={handleDeleteClick}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                    >
                        <HiTrash className="w-4 h-4" />
                    </button>
                    {showDeleteConfirm && (
                        <DeleteConfirmPopup
                            onConfirm={handleConfirmDelete}
                            onCancel={handleCancelDelete}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---
type Tab = 'Education' | 'Experience' | 'Certification & Awards';

interface ResumeHighlightsProps {
    educationItems: EducationItem[];
    experienceItems: ExperienceItem[];
    certificationItems: CertificationItem[];
    onEducationChange: (items: EducationItem[]) => void;
    onExperienceChange: (items: ExperienceItem[]) => void;
    onCertificationChange: (items: CertificationItem[]) => void;
}

const ResumeHighlights: React.FC<ResumeHighlightsProps> = ({
    educationItems,
    experienceItems,
    certificationItems,
    onEducationChange,
    onExperienceChange,
    onCertificationChange,
}) => {
    const [activeTab, setActiveTab] = useState<Tab>('Education');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ResumeItemData | null>(null);

    const dataMap: {
        [K in Tab]: {
            items: ResumeItemData[];
            setItems: (items: ResumeItemData[]) => void;
        };
    } = {
        'Education': { items: educationItems, setItems: (items) => onEducationChange(items as EducationItem[]) },
        'Experience': { items: experienceItems, setItems: (items) => onExperienceChange(items as ExperienceItem[]) },
        'Certification & Awards': { items: certificationItems, setItems: (items) => onCertificationChange(items as CertificationItem[]) },
    };

    const handleOpenModal = (item: ResumeItemData | null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleSaveItem = (itemData: Omit<ResumeItemData, 'id'> & { id?: string }) => {
        const { items, setItems } = dataMap[activeTab];

        let updatedItems: ResumeItemData[];
        if (itemData.id) { // Editing existing item
            updatedItems = items.map((item: ResumeItemData) =>
                item.id === itemData.id ? { ...item, ...itemData } as ResumeItemData : item
            );
        } else { // Adding new item
            // Generate UUID-like id
            const newId = `${activeTab.toLowerCase().substring(0, 4)}-${generateUUID()}`;
            updatedItems = [...items, { ...itemData, id: newId } as ResumeItemData];
        }

        setItems(updatedItems);
        setIsModalOpen(false);
    };

    const handleDeleteItem = (itemToDelete: ResumeItemData) => {
        const { items, setItems } = dataMap[activeTab];
        const updatedItems = items.filter((item: ResumeItemData) => item.id !== itemToDelete.id);
        setItems(updatedItems);
    };

    const renderContent = () => {
        const { items } = dataMap[activeTab];
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mt-8 px-6">
                {items.map(item =>
                    <ResumeItem
                        key={item.id}
                        item={item}
                        onEdit={() => handleOpenModal(item)}
                        onDelete={() => handleDeleteItem(item)}
                    />
                )}
            </div>
        );
    };

    return (
        <div>
            <ResumeItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveItem}
                itemToEdit={editingItem}
                sectionTitle={activeTab}
            />

            <div>
                <h2 className="text-2xl font-bold text-gray-800">Resume Highlights</h2>
                <p className="text-sm text-gray-500 mt-1">Showcase your educational background, work experience, and achievements to build trust with students</p>
            </div>

            <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-4">
                    {(['Education', 'Experience', 'Certification & Awards'] as Tab[]).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${activeTab === tab
                                ? 'bg-white text-gray-800 shadow-md'
                                : 'bg-transparent text-gray-500 hover:bg-white/50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <button onClick={() => handleOpenModal(null)} className="flex items-center gap-2 text-sm font-semibold text-white bg-[#0b6459] px-4 py-2 rounded-lg hover:bg-[#084c43] transition-colors">
                    <HiPlus className="w-4 h-4" /> Add New
                </button>
            </div>

            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default ResumeHighlights;
