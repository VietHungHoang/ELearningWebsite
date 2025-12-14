import React, { useState } from 'react';
import { FiMapPin } from 'react-icons/fi';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import type { TutorDetail } from '../../../../types/api';

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
const ResumeItem: React.FC<{ item: ResumeItemData }> = ({ item }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const canTruncate = item.description.length > 100;
    const truncatedDescription = `${item.description.substring(0, 100)}...`;

    return (
        <div className="flex gap-6">
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
        </div>
    );
};


// --- INITIAL MOCK DATA ---
// Removed, using tutor data instead

// --- MAIN COMPONENT ---
type Tab = 'Education' | 'Experience' | 'Certification & Awards';

const ResumeHighlights: React.FC<{ tutor: TutorDetail }> = ({ tutor }) => {
    const [activeTab, setActiveTab] = useState<Tab>('Education');

    const formatPeriod = (start: string, end?: string) => {
        const startYear = new Date(start).getFullYear();
        const endYear = end ? new Date(end).getFullYear() : 'Present';
        return `${startYear} - ${endYear}`;
    };

    const educationItems: ResumeItemData[] = tutor.educations.map(edu => ({
        id: parseInt(edu.id),
        period: formatPeriod(edu.startDate, edu.endDate),
        title: edu.title,
        institution: edu.institution,
        location: edu.location || '',
        description: edu.description || '',
    }));

    const experienceItems: ResumeItemData[] = tutor.experiences.map(exp => ({
        id: parseInt(exp.id),
        period: formatPeriod(exp.startDate, exp.endDate),
        title: exp.title,
        institution: exp.institution,
        location: exp.location || '',
        description: exp.description || '',
    }));

    const certificationItems: ResumeItemData[] = tutor.certifications.map(cert => ({
        id: parseInt(cert.id),
        period: new Date(cert.issueDate).getFullYear().toString(),
        title: cert.name,
        institution: cert.issuingOrganization,
        location: '',
        description: cert.credentialId ? `Credential ID: ${cert.credentialId}` : '',
    }));

    const dataMap = {
        'Education': educationItems,
        'Experience': experienceItems,
        'Certification & Awards': certificationItems,
    };

    const renderContent = () => {
        const items = dataMap[activeTab];
        if (items.length === 0) {
            return <p className="text-gray-500 mt-4">No {activeTab.toLowerCase()} information available.</p>;
        }
        return (
            <div className="mt-6 space-y-8">
                {items.map(item => (
                    <ResumeItem key={item.id} item={item} />
                ))}
            </div>
        );
    };

    return (
        <div className="py-8">
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
                <h2 className="text-2xl font-bold text-gray-800">{activeTab}</h2>
                {renderContent()}
            </div>
        </div>
    );
};

export default ResumeHighlights;
