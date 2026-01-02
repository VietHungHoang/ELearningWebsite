import React, { useState, useMemo } from 'react';
import { FiMapPin } from 'react-icons/fi';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import type { TutorDetail } from '../../../../types/tutor';
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();
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
                        {isExpanded ? t('tutorDetail.resume.showLess') : t('tutorDetail.resume.showMore')}
                    </button>
                )}
            </div>
        </div>
    );
};

type Tab = 'Education' | 'Experience' | 'Certification & Awards';

const ResumeHighlights: React.FC<{ tutor: TutorDetail }> = ({ tutor }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<Tab>('Education');

    const getTranslatedTab = (tab: Tab) => {
        switch (tab) {
            case 'Education': return t('tutorDetail.resume.education');
            case 'Experience': return t('tutorDetail.resume.experience');
            case 'Certification & Awards': return t('tutorDetail.resume.certifications');
            default: return tab;
        }
    };

    const formatPeriod = (start: string, end?: string) => {
        const startYear = new Date(start).getFullYear();
        const endYear = end ? new Date(end).getFullYear() : 'Present';
        return `${startYear} - ${endYear}`;
    };

    const educationItems: ResumeItemData[] = useMemo(() => {
        return tutor?.educations?.map(edu => ({
            id: parseInt(edu.id),
            period: formatPeriod(edu.startDate, edu.endDate),
            title: edu.title,
            institution: edu.institution,
            location: edu.location || '',
            description: edu.description || '',
        })) || [];
    }, [tutor?.educations]);

    const experienceItems: ResumeItemData[] = useMemo(() => {
        return tutor?.experiences?.map(exp => ({
            id: parseInt(exp.id),
            period: formatPeriod(exp.startDate, exp.endDate),
            title: exp.title,
            institution: exp.institution,
            location: exp.location || '',
            description: exp.description || '',
        })) || [];
    }, [tutor?.experiences]);

    const certificationItems: ResumeItemData[] = useMemo(() => {
        return tutor?.certifications?.map(cert => ({
            id: parseInt(cert.id),
            period: new Date(cert.issueDate).getFullYear().toString(),
            title: cert.name,
            institution: cert.issuingOrganization,
            location: '',
            description: cert.credentialId ? `Credential ID: ${cert.credentialId}` : '',
        })) || [];
    }, [tutor?.certifications]);

    const dataMap = useMemo(() => ({
        'Education': educationItems,
        'Experience': experienceItems,
        'Certification & Awards': certificationItems,
    }), [educationItems, experienceItems, certificationItems]);

    const renderContent = () => {
        const items = dataMap[activeTab];
        if (items.length === 0) {
            return <p className="text-gray-500 mt-4">{t('tutorDetail.resume.noInfo', { section: activeTab.toLowerCase() })}</p>;
        }
        return (
            <div className="mt-6 space-y-8">
                {items.map((item, index) => (
                    <ResumeItem key={`${activeTab}-${item.id}-${index}`} item={item} />
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
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${activeTab === tab
                                ? 'bg-white text-gray-800 shadow-md'
                                : 'bg-transparent text-gray-500 hover:bg-white/50'
                            }`}
                    >
                        {getTranslatedTab(tab)}
                    </button>
                ))}
            </div>

            <div className="mt-6">
                <h2 className="text-2xl font-bold text-gray-800">{getTranslatedTab(activeTab)}</h2>
                {renderContent()}
            </div>
        </div>
    );
};

export default ResumeHighlights;
