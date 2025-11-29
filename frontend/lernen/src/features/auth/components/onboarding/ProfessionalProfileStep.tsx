import React, { useState, useEffect, useMemo } from 'react';
import { HiSparkles, HiChevronDown } from 'react-icons/hi';
import CustomDropdown from '../../../../components/ui/CustomDropdown';
import { getSubjects, type Subject } from '../../../../services/commonService';
import type { Subject as ApiSubject } from '../../../../types/api';

interface ProfessionalProfileData {
    headline: string;
    subjects: ApiSubject[];
    introduction: string;
}

interface ProfessionalProfileStepProps {
    data: ProfessionalProfileData;
    onChange: (data: Partial<ProfessionalProfileData>) => void;
}

const ProfessionalProfileStep: React.FC<ProfessionalProfileStepProps> = ({ data, onChange }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [subjectOptions, setSubjectOptions] = useState<Subject[]>([]);
    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
    });

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const subjects = await getSubjects();
                setSubjectOptions(subjects);
            } catch (error) {
                console.error('Failed to fetch subjects:', error);
            }
        };
        fetchSubjects();
    }, []);

    const availableSubjects = useMemo(
        () => subjectOptions.filter((s) => !data.subjects.some(subj => subj.id === s.id)),
        [subjectOptions, data.subjects]
    );

    const handleAddSubject = (subject: Subject) => {
        if (!data.subjects.some(s => s.id === subject.id)) {
            onChange({ subjects: [...data.subjects, subject] });
        }
    };

    const toggleFormat = (format: keyof typeof activeFormats) => {
        setActiveFormats((prev) => ({ ...prev, [format]: !prev[format] }));
    };

    const inputStyles =
        'w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-0 focus:border-[#0b6459] transition';

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-bold text-gray-800">Professional Profile</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                    Showcase your expertise and teaching experience
                </p>
            </div>

            {/* Professional Headline */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Headline
                </label>
                <input
                    type="text"
                    value={data.headline}
                    onChange={(e) => onChange({ headline: e.target.value })}
                    placeholder="e.g. Certified Math Tutor with 5 years of experience"
                    className={inputStyles}
                />
                <p className="text-xs text-gray-500 mt-0.5">
                    This will be displayed under your name on your profile card.
                </p>
            </div>

            {/* Subjects I Teach */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subjects I Teach <span className="text-red-500">*</span>
                </label>
                {data.subjects.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1.5">
                        {data.subjects.map((subject) => (
                            <span
                                key={subject.id}
                                className="bg-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 border border-gray-200"
                            >
                                {subject.name}
                                <button
                                    type="button"
                                    onClick={() =>
                                        onChange({
                                            subjects: data.subjects.filter((item) => item.id !== subject.id)
                                        })
                                    }
                                    className="text-gray-400 hover:text-gray-600 text-sm"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                )}
                <CustomDropdown
                    options={availableSubjects.map(s => s.name)}
                    selectedValue="Add a subject..."
                    placeholder="Add a subject..."
                    onSelect={(value) => {
                        const subj = availableSubjects.find(s => s.name === value);
                        if (subj) handleAddSubject(subj);
                    }}
                    dropdownId="subjects"
                    openDropdown={openDropdown}
                    setOpenDropdown={setOpenDropdown}
                    hasSearch={true}
                    searchPlaceholder="Search subject..."
                />
            </div>

            {/* A brief introduction */}
            <div className="relative">
                <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                        A brief introduction
                    </label>
                    <button
                        type="button"
                        className="flex items-center gap-1.5 text-xs font-semibold bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md hover:bg-purple-200"
                    >
                        <HiSparkles className="w-3.5 h-3.5" />
                        Write with AI
                    </button>
                </div>
                <div className="border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 p-2 border-b border-gray-200">
                        <button
                            type="button"
                            onClick={() => toggleFormat('bold')}
                            className={`font-bold p-1 rounded text-xs ${activeFormats.bold ? 'bg-gray-200' : ''
                                }`}
                        >
                            <span className="font-bold">B</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => toggleFormat('italic')}
                            className={`italic p-1 rounded text-xs ${activeFormats.italic ? 'bg-gray-200' : ''
                                }`}
                        >
                            <span className="italic">I</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => toggleFormat('underline')}
                            className={`underline p-1 rounded text-xs ${activeFormats.underline ? 'bg-gray-200' : ''
                                }`}
                        >
                            <span className="underline">U</span>
                        </button>
                        <button
                            type="button"
                            className="flex items-center gap-0.5 text-xs p-1 rounded hover:bg-gray-100"
                        >
                            14 <HiChevronDown className="w-3 h-3" />
                        </button>
                        <button
                            type="button"
                            className="p-1 rounded hover:bg-gray-100 text-xs"
                        >
                            <span>•</span>
                        </button>
                        <button
                            type="button"
                            className="p-1 rounded hover:bg-gray-100 text-xs"
                        >
                            <span>1.</span>
                        </button>
                    </div>
                    <textarea
                        rows={4}
                        value={data.introduction}
                        onChange={(e) => onChange({ introduction: e.target.value })}
                        className="w-full p-2.5 text-sm focus:outline-none resize-none"
                        placeholder="Tell students about yourself, your teaching style, experience, and what makes you unique..."
                    ></textarea>
                </div>
                <p className="text-xs text-gray-500 text-right mt-0.5">
                    Characters count: {data.introduction.length}
                </p>
            </div>
        </div>
    );
};

export default ProfessionalProfileStep;
