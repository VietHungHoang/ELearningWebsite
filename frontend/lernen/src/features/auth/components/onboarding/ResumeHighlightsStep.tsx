import React from 'react';
import ResumeHighlights from '../../../../features/dashboard/tutor/components/profile-setting/ResumeHighlights';
import type { EducationItem, ExperienceItem, CertificationItem } from '../../../../types/api';

interface ResumeHighlightsData {
    education: EducationItem[];
    experience: ExperienceItem[];
    certifications: CertificationItem[];
}

interface ResumeHighlightsStepProps {
    data: ResumeHighlightsData;
    onChange: (data: Partial<ResumeHighlightsData>) => void;
}

const ResumeHighlightsStep: React.FC<ResumeHighlightsStepProps> = ({ data, onChange }) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-gray-800">Resume Highlights</h3>
                <p className="text-sm text-gray-500 mt-1">
                    Add your education, experience, and certifications (you can skip and complete this later)
                </p>
            </div>

            <ResumeHighlights
                educationItems={data.education}
                experienceItems={data.experience}
                certificationItems={data.certifications}
                onEducationChange={(items: EducationItem[]) => onChange({ education: items })}
                onExperienceChange={(items: ExperienceItem[]) => onChange({ experience: items })}
                onCertificationChange={(items: CertificationItem[]) => onChange({ certifications: items })}
            />
        </div>
    );
};

export default ResumeHighlightsStep;
