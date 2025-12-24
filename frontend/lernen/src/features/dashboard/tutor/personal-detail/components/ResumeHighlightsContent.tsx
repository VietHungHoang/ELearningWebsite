import React, { useState } from 'react';
import { HiAcademicCap, HiLocationMarker, HiPencil, HiTrash, HiPlus, HiOutlineAcademicCap, HiOutlineBriefcase, HiOutlineStar } from 'react-icons/hi';
import ConfirmationModal from '../../components/ConfirmationModal';
import ResumeItemModal from '../../components/profile-setting/ResumeItemModal';
import type { CertificationItem, EducationItem, ExperienceItem } from '../../../../../types/tutor';
import { useTutorProfile } from '../../../../../hooks/useTutorProfile';

// --- TYPE DEFINITIONS ---
export type ResumeItemData = EducationItem | ExperienceItem | CertificationItem;
export type Tab = 'Education' | 'Experience' | 'Certification & Awards';

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
}> = ({ label, icon, activeTab, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
            activeTab === label ? "bg-[#045A46] text-white shadow-md" : "hover:bg-gray-100 text-gray-600"
        }`}
    >
        <div className={`w-5 h-5 flex-shrink-0 flex items-center justify-center ${
            activeTab === label ? "text-white" : "text-gray-500"
        }`}>
            {icon}
        </div>
        <p className={`font-medium text-sm ${activeTab === label ? "text-white" : "text-gray-800"}`}>{label}</p>
    </button>
);

const ResumeNav: React.FC<ResumeNavProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="w-full lg:w-70 flex-shrink-0 pr-4 border-r border-gray-100 lg:min-h-[400px] bg-gray-50 rounded-lg p-4">
            <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 tracking-wide">Resume Highlights</h3>
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

// --- RESUME ITEM COMPONENT ---
const ResumeItem: React.FC<{ item: ResumeItemData; onEdit: () => void; onDelete: () => void; }> = ({ item, onEdit, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const description = ('description' in item ? item.description : undefined) || '';
    const canTruncate = description.length > 100;
    const truncatedDescription = `${description.substring(0, 100)}...`;

    const dateRange = 'issueDate' in item
        ? new Date(item.issueDate).getFullYear().toString()
        : formatDateRange(item.startDate, item.endDate);

    const title = getItemTitle(item);
    const institution = getItemInstitution(item);
    const location = ('location' in item ? item.location : undefined) || 'N/A';

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
                                className="mt-2 text-sm font-semibold text-[#045A46] underline hover:text-[#03453a]"
                            >
                                {isExpanded ? 'Show less' : 'Show more'}
                            </button>
                        )}
                    </>
                )}
            </div>
            <div className="absolute top-0 right-0 flex items-center gap-2">
                <button onClick={onEdit} className="p-1.5 text-gray-500 hover:text-blue-600 rounded-md hover:bg-blue-100"><HiPencil className="w-4 h-4" /></button>
                <button onClick={onDelete} className="p-1.5 text-gray-500 hover:text-red-600 rounded-md hover:bg-red-100"><HiTrash className="w-4 h-4" /></button>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
interface ResumeHighlightsContentProps {
}

const ResumeHighlightsContent: React.FC<ResumeHighlightsContentProps> = ({}) => {
    const { profile, loading, updateResume } = useTutorProfile();
    const [activeTab, setActiveTab] = useState<Tab>('Education');

    // Local state for resume data
    const [educationItems, setEducationItems] = useState<EducationItem[]>([]);
    const [experienceItems, setExperienceItems] = useState<ExperienceItem[]>([]);
    const [certificationItems, setCertificationItems] = useState<CertificationItem[]>([]);

    // Sync with profile
    React.useEffect(() => {
        if (profile) {
            setEducationItems(profile.education || []);
            setExperienceItems(profile.experience || []);
            setCertificationItems(profile.certifications || []);
        }
    }, [profile]);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ResumeItemData | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<ResumeItemData | null>(null);

    const dataMap: {
        [K in Tab]: {
            items: ResumeItemData[];
            setItems: (items: ResumeItemData[]) => void;
        };
    } = {
        'Education': { items: educationItems, setItems: (items) => setEducationItems(items as EducationItem[]) },
        'Experience': { items: experienceItems, setItems: (items) => setExperienceItems(items as ExperienceItem[]) },
        'Certification & Awards': { items: certificationItems, setItems: (items) => setCertificationItems(items as CertificationItem[]) },
    };

    const handleOpenModal = (item: ResumeItemData | null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleSaveItem = async (itemData: Omit<ResumeItemData, 'id'> & { id?: string }) => {
        const { items, setItems } = dataMap[activeTab];

        let updatedItems: ResumeItemData[];
        if (itemData.id) { // Editing existing item
            updatedItems = items.map((item: ResumeItemData) =>
                item.id === itemData.id ? { ...item, ...itemData } as ResumeItemData : item
            );
        } else { // Adding new item
            // Generate UUID-like id
            const newId = `${activeTab.toLowerCase().substring(0, 4)}-${crypto.randomUUID()}`;
            updatedItems = [...items, { ...itemData, id: newId } as ResumeItemData];
        }

        setItems(updatedItems);

        // Save to API
        try {
            await updateResume({
                education: activeTab === 'Education' ? updatedItems as EducationItem[] : educationItems,
                experience: activeTab === 'Experience' ? updatedItems as ExperienceItem[] : experienceItems,
                certifications: activeTab === 'Certification & Awards' ? updatedItems as CertificationItem[] : certificationItems,
            });
        } catch (err) {
            console.error('Failed to save resume', err);
        }

        setIsModalOpen(false);
    };

    const handleDeleteRequest = (item: ResumeItemData) => {
        setItemToDelete(item);
        setIsConfirmModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;
        const { items, setItems } = dataMap[activeTab];
        const updatedItems = items.filter((item: ResumeItemData) => item.id !== itemToDelete.id);
        setItems(updatedItems);

        // Save to API
        try {
            await updateResume({
                education: activeTab === 'Education' ? updatedItems as EducationItem[] : educationItems,
                experience: activeTab === 'Experience' ? updatedItems as ExperienceItem[] : experienceItems,
                certifications: activeTab === 'Certification & Awards' ? updatedItems as CertificationItem[] : certificationItems,
            });
        } catch (err) {
            console.error('Failed to delete resume item', err);
        }

        setIsConfirmModalOpen(false);
        setItemToDelete(null);
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
                        onDelete={() => handleDeleteRequest(item)}
                    />
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div>
                    <div className="h-8 bg-gray-300 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="space-y-4">
                    <div className="h-20 bg-gray-300 rounded"></div>
                    <div className="h-20 bg-gray-300 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <ResumeItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveItem}
                itemToEdit={editingItem}
                sectionTitle={activeTab}
            />
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title={`Delete ${activeTab} Entry`}
                message={`Are you sure you want to delete this entry? This action cannot be undone.`}
            />

            <div className="flex gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-70 flex-shrink-0 pr-4 border-r border-gray-100 lg:min-h-[600px]">
                    <ResumeNav activeTab={activeTab} onTabChange={setActiveTab} />
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">{activeTab}</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {activeTab === 'Education' && 'Showcase your educational background and qualifications'}
                            {activeTab === 'Experience' && 'Highlight your professional experience and expertise'}
                            {activeTab === 'Certification & Awards' && 'Display your certifications, awards, and achievements'}
                        </p>
                    </div>

                    <div className="flex justify-end mb-6">
                        <button onClick={() => handleOpenModal(null)} className="flex items-center gap-2 text-sm font-semibold text-white bg-[#045A46] px-4 py-2 rounded-lg hover:bg-[#03453a] transition-colors">
                            <HiPlus className="w-4 h-4" /> Add New
                        </button>
                    </div>

                    <div>
                        {renderContent()}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResumeHighlightsContent;