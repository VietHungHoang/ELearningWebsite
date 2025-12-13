import React, { useState, useEffect, useMemo } from "react";
import { HiSparkles, HiChevronDown } from "react-icons/hi";
import CustomDropdown from "../../../../components/ui/CustomDropdown";
import * as commonService from "../../../../services/commonService";
import type { Subject, Tutor, Category } from "../../../../types/api.ts";

interface ProfessionalProfileStepProps {
    data: Partial<Tutor>;
    onChange: (data: Partial<Tutor>) => void;
}

const ProfessionalProfileStep: React.FC<ProfessionalProfileStepProps> = ({ data, onChange }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [subjectOptions, setSubjectOptions] = useState<Subject[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
    });

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const subjects = await commonService.getSubjects();
                setSubjectOptions(subjects);
            } catch (error) {
                console.error("Failed to fetch subjects:", error);
            }
        };
        fetchSubjects();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await commonService.getCategories();
                setCategoryOptions(categories);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const availableSubjects = useMemo(
        () =>
            subjectOptions
                .filter((s) => !(data.subjects || []).some((subj) => subj.id === s.id))
                .filter((s) => !selectedCategory || s.categoryId === selectedCategory),
        [subjectOptions, data.subjects, selectedCategory]
    );

    const handleAddSubject = (subject: Subject) => {
        if (!(data.subjects || []).some((s) => s.id === subject.id)) {
            onChange({ subjects: [...(data.subjects || []), subject] });
        }
    };

    const toggleFormat = (format: keyof typeof activeFormats) => {
        setActiveFormats((prev) => ({ ...prev, [format]: !prev[format] }));
    };

    const inputStyles =
        "w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-0 focus:border-[#0b6459] transition";

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-gray-800">Professional Profile</h3>
                <p className="text-sm text-gray-500 mt-1">Showcase your expertise and teaching experience</p>
            </div>

            {/* Professional Headline */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Headline</label>
                <input
                    type="text"
                    value={data.headline}
                    onChange={(e) => onChange({ headline: e.target.value })}
                    placeholder="e.g. Certified Math Tutor with 5 years of experience"
                    className={inputStyles}
                />
                <p className="text-xs text-gray-500 mt-1">
                    This will be displayed under your name on your profile card.
                </p>
            </div>

            {/* Subjects I Teach */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subjects I Teach <span className="text-red-500">*</span>
                </label>
                <div className="mb-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Filter by Category</label>
                    <CustomDropdown
                        options={["All Categories", ...categoryOptions.map((c) => c.name)]}
                        selectedValue={selectedCategory ? categoryOptions.find((c) => c.id === selectedCategory)?.name || "All Categories" : "All Categories"}
                        placeholder="Select category..."
                        onSelect={(value) => {
                            if (value === "All Categories") {
                                setSelectedCategory("");
                            } else {
                                const cat = categoryOptions.find((c) => c.name === value);
                                if (cat) setSelectedCategory(cat.id);
                            }
                        }}
                        dropdownId="categories"
                        openDropdown={openDropdown}
                        setOpenDropdown={setOpenDropdown}
                        hasSearch={false}
                    />
                </div>
                <div className="p-2 bg-gray-100 border border-transparent rounded-lg flex flex-wrap gap-2 items-center focus-within:border-[#0b6459] transition-colors">
                    {(data.subjects || []).map((subject) => (
                        <span
                            key={subject.id}
                            className="bg-white px-3 py-1 rounded-md text-sm font-medium flex items-center gap-2 border border-gray-200"
                        >
                            {subject.name}
                            <button
                                type="button"
                                onClick={() =>
                                    onChange({
                                        subjects: (data.subjects || []).filter((item) => item.id !== subject.id),
                                    })
                                }
                                className="text-gray-400 hover:text-gray-600"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                    <div className="flex-grow min-w-[150px]">
                        <CustomDropdown
                            options={availableSubjects.map((s) => s.name)}
                            selectedValue="Add a subject..."
                            placeholder="Add a subject..."
                            onSelect={(value) => {
                                const subj = availableSubjects.find((s) => s.name === value);
                                if (subj) handleAddSubject(subj);
                            }}
                            dropdownId="subjects"
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            hasSearch={true}
                            searchPlaceholder="Search subject..."
                        />
                    </div>
                </div>
            </div>

            {/* A brief introduction */}
            <div>
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
                            onClick={() => toggleFormat("bold")}
                            className={`font-bold p-1 rounded ${activeFormats.bold ? "bg-gray-200" : ""}`}
                        >
                            <span className="font-bold">B</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => toggleFormat("italic")}
                            className={`italic p-1 rounded ${activeFormats.italic ? "bg-gray-200" : ""}`}
                        >
                            <span className="italic">I</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => toggleFormat("underline")}
                            className={`underline p-1 rounded ${activeFormats.underline ? "bg-gray-200" : ""}`}
                        >
                            <span className="underline">U</span>
                        </button>
                        <button type="button" className="flex items-center gap-1 text-sm p-1 rounded hover:bg-gray-100">
                            14 <HiChevronDown className="w-4 h-4" />
                        </button>
                        <button type="button" className="p-1 rounded hover:bg-gray-100">
                            <span>•</span>
                        </button>
                        <button type="button" className="p-1 rounded hover:bg-gray-100">
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
                <p className="text-xs text-gray-500 text-right mt-1">
                    Characters count: {(data.introduction || "").length}
                </p>
            </div>
        </div>
    );
};

export default ProfessionalProfileStep;
