import React, { useState } from 'react';
import { FiMapPin, FiEdit, FiTrash, FiPlus } from 'react-icons/fi';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import ResumeItemModal from './ResumeItemModal';
import ConfirmationModal from './ConfirmationModal';

// --- ICONS (kept inside for simplicity) ---

// --- TYPE DEFINITIONS ---
export interface ResumeItemData {
    id: number;
    period: string;
    title: string;
    institution: string;
    location: string;
    description: string;
}

// --- RESUME ITEM COMPONENT ---
const ResumeItem: React.FC<{ item: ResumeItemData; onEdit: () => void; onDelete: () => void; }> = ({ item, onEdit, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const canTruncate = item.description.length > 100;
    const truncatedDescription = `${item.description.substring(0, 100)}...`;

    return (
        <div className="flex gap-6 group relative">
            <p className="text-sm font-semibold text-gray-600 w-24 flex-shrink-0 mt-1">{item.period}</p>
            <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5"><HiOutlineOfficeBuilding /> {item.institution}</span>
                    <span className="flex items-center gap-1.5"><FiMapPin /> {item.location}</span>
                </div>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                    {isExpanded ? item.description : truncatedDescription}
                </p>
                {canTruncate && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-2 text-sm font-semibold text-[#0b6459] underline hover:text-[#084c43]"
                    >
                        {isExpanded ? 'Show less' : 'Show more'}
                    </button>
                )}
            </div>
             <div className="absolute top-0 right-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onEdit} className="p-1.5 text-gray-500 hover:text-blue-600 rounded-md hover:bg-blue-100"><FiEdit /></button>
                <button onClick={onDelete} className="p-1.5 text-gray-500 hover:text-red-600 rounded-md hover:bg-red-100"><FiTrash /></button>
            </div>
        </div>
    );
};


// --- INITIAL MOCK DATA ---
const initialEducationData: ResumeItemData[] = [
    { id: 1, period: '2015 - 2019', title: 'Bachelor of Computer Science', institution: 'ABC University', location: 'Cacuaco, Angola', description: 'Focused on software development and cybersecurity, I build innovative software solutions and...' },
    { id: 2, period: '2020 - 2022', title: 'Master of Information Technology', institution: 'XYZ Institute', location: 'West End, Anguilla', description: 'Specialized in advanced IT management and data analysis, I manage complex IT infrastructures and use...' },
];

const initialExperienceData: ResumeItemData[] = [
     { id: 3, period: '2022 - Present', title: 'Lead Math Tutor', institution: 'Lernen Platform', location: 'Remote', description: 'Provide expert tutoring in advanced mathematics subjects, including calculus and algebra. Develop personalized learning plans that have improved student grades by an average of 25%.' },
];

const initialCertificationData: ResumeItemData[] = [
    { id: 4, period: '2021', title: 'Certified Educator', institution: 'National Tutoring Association', location: 'Online', description: 'Completed a comprehensive certification program covering advanced pedagogical techniques, student assessment, and online teaching best practices.' },
];

// --- MAIN COMPONENT ---
type Tab = 'Education' | 'Experience' | 'Certification & Awards';

const ResumeHighlights: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('Education');
    
    // Data states
    const [educationItems, setEducationItems] = useState(initialEducationData);
    const [experienceItems, setExperienceItems] = useState(initialExperienceData);
    const [certificationItems, setCertificationItems] = useState(initialCertificationData);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ResumeItemData | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<ResumeItemData | null>(null);

    const dataMap = {
        'Education': { items: educationItems, setItems: setEducationItems },
        'Experience': { items: experienceItems, setItems: setExperienceItems },
        'Certification & Awards': { items: certificationItems, setItems: setCertificationItems },
    };

    const handleOpenModal = (item: ResumeItemData | null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleSaveItem = (itemData: Omit<ResumeItemData, 'id'> & { id?: number }) => {
        const { setItems } = dataMap[activeTab];
        setItems(prevItems => {
            if (itemData.id) { // Editing existing item
                return prevItems.map(item => item.id === itemData.id ? { ...item, ...itemData } : item);
            } else { // Adding new item
                return [...prevItems, { ...itemData, id: Date.now() }];
            }
        });
        setIsModalOpen(false);
    };

    const handleDeleteRequest = (item: ResumeItemData) => {
        setItemToDelete(item);
        setIsConfirmModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!itemToDelete) return;
        const { setItems } = dataMap[activeTab];
        setItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
        setIsConfirmModalOpen(false);
        setItemToDelete(null);
    };


    const renderContent = () => {
        const { items } = dataMap[activeTab];
        return (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mt-8">
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

    return (
        <div className="py-8">
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

            <div className="flex items-center gap-4">
                {(['Education', 'Experience', 'Certification & Awards'] as Tab[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                            activeTab === tab 
                                ? 'bg-white text-gray-800 shadow-md' 
                                : 'bg-transparent text-gray-500 hover:bg-white/50'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="mt-6">
                 <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">{activeTab}</h2>
                    <button onClick={() => handleOpenModal(null)} className="flex items-center gap-2 text-sm font-semibold text-white bg-[#0b6459] px-4 py-2 rounded-lg hover:bg-[#084c43] transition-colors">
                        <FiPlus /> Add New
                    </button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default ResumeHighlights;
