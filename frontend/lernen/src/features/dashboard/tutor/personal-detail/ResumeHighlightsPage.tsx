import React, { useState, useEffect, useRef } from 'react';
import { HiPlus, HiOutlineAcademicCap, HiOutlineBriefcase, HiOutlineStar, HiOutlineLocationMarker, HiOutlineCalendar, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { useBreadcrumb } from '../../context/BreadcrumbContext';
import ProfileSettingsLayout from './ProfileSettingsLayout';
import ResumeItemModal from '../components/profile-setting/ResumeItemModal';
import { useProfileSettings } from './context/ProfileSettingsContext';
import type { CertificationItem, EducationItem, ExperienceItem } from '../../../../types/tutor';

// --- TYPE DEFINITIONS ---
export type ResumeItemData = EducationItem | ExperienceItem | CertificationItem;
export type Tab = 'Education' | 'Experience' | 'Certification & Awards';

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

// --- RESUME NAVIGATION COMPONENT ---
interface ResumeNavProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

const ResumeNavItem: React.FC<{
    label: Tab;
    icon: React.ReactNode;
    activeTab: Tab;
    onClick: () => void
}> = ({ label, icon, activeTab, onClick }) => {
    const { t } = useTranslation();
    const tabLabels: Record<Tab, string> = {
        'Education': t('dashboard.tutor.resumeHighlights.tabs.education'),
        'Experience': t('dashboard.tutor.resumeHighlights.tabs.experience'),
        'Certification & Awards': t('dashboard.tutor.resumeHighlights.tabs.certificationAwards')
    };
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${activeTab === label ? "bg-[#045A46] text-white shadow-md" : "hover:bg-gray-100 text-gray-600"
                }`}
        >
            <div className={`w-5 h-5 flex-shrink-0 flex items-center justify-center ${activeTab === label ? "text-white" : "text-gray-500"
                }`}>
                {icon}
            </div>
            <p className={`font-medium text-sm ${activeTab === label ? "text-white" : "text-gray-800"}`}>{tabLabels[label]}</p>
        </button>
    );
};

const ResumeNav: React.FC<ResumeNavProps> = ({ activeTab, onTabChange }) => {
    const { t } = useTranslation();
    return (
        <div className="w-full lg:w-70 flex-shrink-0 pr-4 border-r border-gray-100 bg-gray-50 rounded-xl p-4 h-full">
            <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 tracking-wide">{t('dashboard.tutor.resumeHighlights.title')}</h3>
                <div className="w-full h-px bg-gray-200 mt-3"></div>
            </div>
            <nav className="space-y-2">
                <ResumeNavItem
                    label="Education"
                    icon={<HiOutlineAcademicCap />}
                    activeTab={activeTab}
                    onClick={() => onTabChange("Education")}
                />
                <ResumeNavItem
                    label="Experience"
                    icon={<HiOutlineBriefcase />}
                    activeTab={activeTab}
                    onClick={() => onTabChange("Experience")}
                />
                <ResumeNavItem
                    label="Certification & Awards"
                    icon={<HiOutlineStar />}
                    activeTab={activeTab}
                    onClick={() => onTabChange("Certification & Awards")}
                />
            </nav>
        </div>
    );
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
const ResumeItem: React.FC<{ item: ResumeItemData; onEdit: () => void; onDelete: () => void; activeTab: Tab; }> = ({ item, onEdit, onDelete, activeTab }) => {
    const { t } = useTranslation();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const title = getItemTitle(item);
    const institution = getItemInstitution(item);
    const location = ('location' in item ? item.location : undefined) || 'N/A';

    // Format dates based on item type
    const getDateDisplay = () => {
        if ('issueDate' in item) {
            // Certification
            const dateObj = new Date(item.issueDate);
            return `${dateObj.toLocaleString('default', { month: 'long' })} ${dateObj.getFullYear()}`;
        } else if ('startDate' in item) {
            // Education or Experience
            const startDate = activeTab === 'Education'
                ? new Date(item.startDate).getFullYear().toString()
                : `${new Date(item.startDate).toLocaleString('default', { month: 'long' })} ${new Date(item.startDate).getFullYear()}`;

            const endDate = item.endDate
                ? (activeTab === 'Education'
                    ? new Date(item.endDate).getFullYear().toString()
                    : `${new Date(item.endDate).toLocaleString('default', { month: 'long' })} ${new Date(item.endDate).getFullYear()}`)
                : t('dashboard.tutor.resumeHighlights.present');

            return `${startDate} - ${endDate}`;
        }
        return '';
    };

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
        <div className="bg-[#f7f7f8] rounded-2xl p-4 group relative">
            <div className="flex-grow">
                <h3 className="text-base font-medium text-gray-800">{title}</h3>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-600">
                    <span className="flex items-center gap-1.5">
                        <HiOutlineAcademicCap className="w-4 h-4" /> {institution}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <HiOutlineLocationMarker className="w-4 h-4" /> {location}
                    </span>
                    {getDateDisplay() && (
                        <span className="flex items-center gap-1.5">
                            <HiOutlineCalendar className="w-4 h-4" /> {getDateDisplay()}
                        </span>
                    )}
                </div>
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1">
                <button
                    onClick={onEdit}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                >
                    <HiOutlinePencil className="w-4 h-4" />
                </button>
                <div className="relative">
                    <button
                        onClick={handleDeleteClick}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                    >
                        <HiOutlineTrash className="w-4 h-4" />
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

const ResumeHighlightsPage: React.FC = () => {
    const { t } = useTranslation();
    const { setBreadcrumb } = useBreadcrumb();
    const [activeTab, setActiveTab] = useState<Tab>('Education');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ResumeItemData | null>(null);

    // Get tutor data from shared context
    const { tutorData } = useProfileSettings();

    // Use real data from context
    const educationItems: EducationItem[] = tutorData?.educations || [];
    const experienceItems: ExperienceItem[] = tutorData?.experiences || [];
    const certificationItems: CertificationItem[] = tutorData?.certifications || [];

    // Simplified data access for rendering
    const getCurrentItems = () => {
        switch (activeTab) {
            case 'Education':
                return educationItems;
            case 'Experience':
                return experienceItems;
            case 'Certification & Awards':
                return certificationItems;
            default:
                return [];
        }
    };

    React.useEffect(() => {
        setBreadcrumb([
            { label: t('dashboard.header.breadcrumb.dashboard'), path: '/dashboard' },
            { label: t('dashboard.tutor.profileSettings.breadcrumb.profileSettings'), path: '/dashboard/profile-settings/personal-details' },
            { label: t('dashboard.tutor.profileSettings.tabs.resumeHighlights'), path: '/dashboard/profile-settings/resume-highlights' },
        ]);
    }, [setBreadcrumb, t]);

    const handleOpenModal = (item: ResumeItemData | null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleSaveItem = async (_itemData: any) => {
        // Mock save - just close modal for demonstration
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleDeleteItem = (item: ResumeItemData) => {
        // Mock delete for demonstration
        console.log('Delete item:', item);
    };

    const renderContent = () => {
        const items = getCurrentItems();
        return (
            <div className="grid grid-cols-1 gap-y-4 mt-8 px-6">
                {items.map((item: ResumeItemData) =>
                    <ResumeItem
                        key={item.id}
                        item={item}
                        activeTab={activeTab}
                        onEdit={() => handleOpenModal(item)}
                        onDelete={() => handleDeleteItem(item)}
                    />
                )}
            </div>
        );
    };

    return (
        <ProfileSettingsLayout activeTab="Resume Highlights" maxWidth="7xl">
            <ResumeItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveItem}
                itemToEdit={editingItem}
                sectionTitle={activeTab}
            />

            <div className="flex gap-8 h-full pb-12">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-70 flex-shrink-0 pr-4 border-r border-gray-100 h-full">
                    <ResumeNav activeTab={activeTab} onTabChange={setActiveTab} />
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {activeTab === 'Education' && t('dashboard.tutor.resumeHighlights.tabs.education')}
                                {activeTab === 'Experience' && t('dashboard.tutor.resumeHighlights.tabs.experience')}
                                {activeTab === 'Certification & Awards' && t('dashboard.tutor.resumeHighlights.tabs.certificationAwards')}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {activeTab === 'Education' && t('dashboard.tutor.resumeHighlights.descriptions.education')}
                                {activeTab === 'Experience' && t('dashboard.tutor.resumeHighlights.descriptions.experience')}
                                {activeTab === 'Certification & Awards' && t('dashboard.tutor.resumeHighlights.descriptions.certificationAwards')}
                            </p>
                        </div>

                        <button onClick={() => handleOpenModal(null)} className="flex items-center gap-2 text-sm font-semibold text-white bg-[#045A46] px-4 py-2 rounded-lg hover:bg-[#03453a] transition-colors">
                            <HiPlus className="w-4 h-4" /> {t('dashboard.tutor.resumeHighlights.addNew')}
                        </button>
                    </div>

                    <div>
                        {renderContent()}
                    </div>
                </div>
            </div>
        </ProfileSettingsLayout>
    );
};

export default ResumeHighlightsPage;