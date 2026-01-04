import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiSparkles,
  HiChevronDown,
  HiPhotograph,
  HiVideoCamera,
  HiDocument,
  HiChevronLeft,
  HiInformationCircle
} from 'react-icons/hi';
import CustomDropdownDashboard from '../../../../components/ui/CustomDropdownDashboard';
import DynamicListInput from '../components/DynamicListInput';
import CurriculumBuilder from '../components/CurriculumBuilder';
import FileUpload from '../components/FileUpload';
import ToggleSwitch from '../components/ToggleSwitch';
import CourseValidationModal from '../components/CourseValidationModal';
import CourseSuccessModal from '../components/CourseSuccessModal';

type CourseCreationTab = 'Basic Information' | 'Curriculum' | 'Media' | 'Pricing' | 'Settings';

const TABS: CourseCreationTab[] = ['Basic Information', 'Curriculum', 'Media', 'Pricing', 'Settings'];

export interface Lecture {
    id: number;
    title: string;
    type: 'video' | 'article';
    videoFileName?: string;
    articleContent?: string;
}

export interface CurriculumSectionData {
    id: number;
    title: string;
    lectures: Lecture[];
}

interface CourseData {
    title: string;
    category: string;
    level: string;
    language: string;
    description: string;
    whatYoullLearn: string[];
    prerequisites: string[];
    thumbnail: File | null;
    introVideo: File | null;
    courseDocuments: File | null;
    curriculum: CurriculumSectionData[];
    price: number | string;
    maxStudents: number | string;
    enableQandA: boolean;
    welcomeMessage: string;
}

const CreateCoursePage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false, underline: false });

    const handleBackToMyCourses = () => {
        navigate('/dashboard/my-courses');
    };

    const [courseData, setCourseData] = useState<CourseData>({
        title: '',
        category: 'Select course category',
        level: 'Select course level',
        language: 'Select language',
        description: '',
        whatYoullLearn: [],
        prerequisites: [],
        thumbnail: null,
        introVideo: null,
        courseDocuments: null,
        curriculum: [
            {
                id: 1,
                title: 'Introduction to Design',
                lectures: [
                    { id: 1, title: 'Welcome to the class', type: 'video' as const },
                    { id: 2, title: 'What is design?', type: 'article' as const },
                ]
            },
            {
                id: 2,
                title: 'Core Concepts of Visual Design',
                lectures: [
                    { id: 3, title: 'The color theory basics', type: 'video' as const },
                    { id: 4, title: 'Typography and Font Pairing', type: 'article' as const },
                    { id: 5, title: 'Principles of Composition', type: 'video' as const },
                ]
            }
        ],
        price: '',
        maxStudents: 0,
        enableQandA: true,
        welcomeMessage: ''
    });

    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [missingFields, setMissingFields] = useState<string[]>([]);
    
    const handleDataChange = (field: keyof CourseData, value: any) => {
        setCourseData(prev => ({...prev, [field]: value}));
    };
    
    const handleContinue = () => {
        if (activeTabIndex < TABS.length - 1) {
            setActiveTabIndex(prev => prev + 1);
        }
    };
    
    const handlePublish = () => {
        const errors: string[] = [];
        if (!courseData.title.trim()) errors.push('Course Title (in Basic Information)');
        if (courseData.category === 'Select course category') errors.push('Category (in Basic Information)');
        if (!courseData.description.trim()) errors.push('Course Description (in Basic Information)');
        if (courseData.whatYoullLearn.length === 0) errors.push("At least one learning objective (in Basic Information)");
        if (courseData.prerequisites.length === 0) errors.push("At least one prerequisite (in Basic Information)");
        if (!courseData.thumbnail) errors.push('Course Thumbnail (in Media)');
        if (!courseData.introVideo) errors.push('Introduction Video (in Media)');
        if (!courseData.courseDocuments) errors.push('Course Documents (in Media)');
        if (courseData.curriculum.length === 0) {
            errors.push('At least one section (in Curriculum)');
        } else if (courseData.curriculum.some(section => section.lectures.length === 0)) {
            errors.push('Each section must have at least one lecture (in Curriculum)');
        }
        const priceValue = Number(courseData.price);
        if (isNaN(priceValue) || priceValue <= 0) errors.push('A valid price (in Pricing)');
        
        const maxStudentsValue = Number(courseData.maxStudents);
        if (isNaN(maxStudentsValue) || maxStudentsValue < 0) errors.push('A valid number for Maximum Students (in Settings)');

        if (errors.length > 0) {
            setMissingFields(errors);
            setIsValidationModalOpen(true);
        } else {
            setIsSuccessModalOpen(true);
        }
    };

    const handleSuccessNavigation = () => {
        setIsSuccessModalOpen(false);
        navigate('/dashboard/my-courses');
    };

    const toggleFormat = (format: keyof typeof activeFormats) => {
        setActiveFormats(prev => ({ ...prev, [format]: !prev[format] }));
    };

    const inputStyles = "w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-0 focus:border-[#0b6459] transition";

    const TabButton: React.FC<{ label: CourseCreationTab; index: number }> = ({ label, index }) => (
        <button
            onClick={() => setActiveTabIndex(index)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeTabIndex === index ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:bg-white/50'
            }`}
        >
            {label}
        </button>
    );

    const renderActiveTabContent = () => {
        const activeTab = TABS[activeTabIndex];
        switch(activeTab) {
            case 'Basic Information':
                return (
                     <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Course Title <span className="text-red-500">*</span>
                            </label>
                            <input type="text" placeholder="e.g., Introduction to Python" value={courseData.title} onChange={e => handleDataChange('title', e.target.value)} className={inputStyles} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <CustomDropdownDashboard
                                    options={['Productivity', 'Web Development', 'Marketing']}
                                    selectedValue={courseData.category}
                                    placeholder="Select course category"
                                    onSelect={(val) => handleDataChange('category', val)}
                                    dropdownId="course-category"
                                    openDropdown={openDropdown}
                                    setOpenDropdown={setOpenDropdown}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                                 <CustomDropdownDashboard
                                    options={['Beginner', 'Intermediate', 'Expert']}
                                    selectedValue={courseData.level}
                                    placeholder="Select course level"
                                    onSelect={(val: string) => handleDataChange('level', val)}
                                    dropdownId="course-level"
                                    openDropdown={openDropdown}
                                    setOpenDropdown={setOpenDropdown}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                                 <CustomDropdownDashboard
                                    options={['English', 'Spanish', 'French']}
                                    selectedValue={courseData.language}
                                    placeholder="Select language"
                                    onSelect={(val: string) => handleDataChange('language', val)}
                                    dropdownId="course-language"
                                    openDropdown={openDropdown}
                                    setOpenDropdown={setOpenDropdown}
                                />
                            </div>
                        </div>
                        
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Course Description <span className="text-red-500">*</span></label>
                            <button type="button" className="absolute top-0 right-0 flex items-center gap-2 text-sm font-semibold bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-200">
                                <HiSparkles className="w-4 h-4" /> Write with AI
                            </button>
                            <div className="mt-1 border border-gray-200 rounded-lg">
                                <div className="flex items-center gap-4 p-3 border-b border-gray-200">
                                    <button type="button" onClick={() => toggleFormat('bold')} className={`font-bold p-1 rounded ${activeFormats.bold ? 'bg-gray-200' : ''}`}>
                                        <span className="font-bold">B</span>
                                    </button>
                                    <button type="button" onClick={() => toggleFormat('italic')} className={`italic p-1 rounded ${activeFormats.italic ? 'bg-gray-200' : ''}`}>
                                        <span className="italic">I</span>
                                    </button>
                                    <button type="button" onClick={() => toggleFormat('underline')} className={`underline p-1 rounded ${activeFormats.underline ? 'bg-gray-200' : ''}`}>
                                        <span className="underline">U</span>
                                    </button>
                                    <button type="button" className="flex items-center gap-1 text-sm p-1 rounded hover:bg-gray-100">
                                        Paragraph <HiChevronDown className="w-4 h-4" />
                                    </button>
                                    <button type="button" className="p-1 rounded hover:bg-gray-100">
                                        <span>•</span>
                                    </button>
                                    <button type="button" className="p-1 rounded hover:bg-gray-100">
                                        <span>1.</span>
                                    </button>
                                </div>
                                <textarea 
                                    rows={8}
                                    placeholder="Describe your course..."
                                    value={courseData.description}
                                    onChange={e => handleDataChange('description', e.target.value)}
                                    className="w-full p-3 focus:outline-none resize-none"
                                ></textarea>
                            </div>
                        </div>

                        <DynamicListInput
                            label="What you'll learn"
                            placeholder="e.g., Master Python from scratch"
                            items={courseData.whatYoullLearn}
                            onItemsChange={(items) => handleDataChange('whatYoullLearn', items)}
                        />

                        <DynamicListInput
                            label="Prerequisites"
                            placeholder="e.g., Basic computer literacy"
                            items={courseData.prerequisites}
                            onItemsChange={(items) => handleDataChange('prerequisites', items)}
                        />
                    </form>
                );
            case 'Curriculum':
                return (
                    <CurriculumBuilder 
                        value={courseData.curriculum}
                        onChange={(newCurriculum) => handleDataChange('curriculum', newCurriculum)}
                    />
                );
             case 'Media':
                return (
                    <div className="space-y-8">
                        <FileUpload
                            title="Course Thumbnail"
                            description="Upload an attractive thumbnail image for your course. Recommended size: 720x405 pixels."
                            file={courseData.thumbnail}
                            onFileChange={(file) => handleDataChange('thumbnail', file)}
                            acceptedFileTypes="image/jpeg, image/png, image/gif"
                            fileTypeDescription="PNG, JPG, GIF up to 10MB"
                            icon={<HiPhotograph className="w-8 h-8" />}
                        />
                        <FileUpload
                            title="Course Introduction Video"
                            description="Upload a compelling video to give students a preview of your course. Recommended aspect ratio: 16:9."
                            file={courseData.introVideo}
                            onFileChange={(file) => handleDataChange('introVideo', file)}
                            acceptedFileTypes="video/*"
                            fileTypeDescription="MP4, MOV, AVI, etc. up to 1GB."
                            icon={<HiVideoCamera className="w-8 h-8" />}
                        />
                        <FileUpload
                            title="Course Documents"
                            description="Upload any supplementary materials for your course as a single compressed file (e.g., worksheets, project files)."
                            file={courseData.courseDocuments}
                            onFileChange={(file) => handleDataChange('courseDocuments', file)}
                            acceptedFileTypes=".zip,.rar,.7z"
                            fileTypeDescription="ZIP, RAR, 7z up to 500MB."
                            icon={<HiDocument className="w-8 h-8" />}
                        />
                    </div>
                );
            case 'Pricing':
                return (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Course Price ($) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                           <input 
                                type="number" 
                                placeholder="0.00" 
                                value={courseData.price}
                                onChange={e => handleDataChange('price', e.target.value)}
                                className={`${inputStyles} pl-7`} 
                            />
                        </div>
                    </div>
                );
            case 'Settings':
                 return (
                    <div className="space-y-8 max-w-2xl">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Students</label>
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-500">
                                    Set the maximum number of students that can enroll in this course.
                                </p>
                                <div className="relative group">
                                    <HiInformationCircle className="w-4 h-4 text-gray-400" />
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        Set to 0 for unlimited students.
                                    </span>
                                </div>
                            </div>
                            <input
                                type="number"
                                min="0"
                                value={courseData.maxStudents}
                                onChange={e => handleDataChange('maxStudents', Math.max(0, parseInt(e.target.value, 10) || 0))}
                                className={inputStyles + " mt-2 w-48"}
                            />
                        </div>
                        
                        <div className="border-t border-gray-100 pt-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-800">Enable Q&A Section</h4>
                                    <p className="text-sm text-gray-500">Allow students to ask questions in a dedicated Q&A section.</p>
                                </div>
                                <ToggleSwitch
                                    enabled={courseData.enableQandA}
                                    onChange={(enabled) => handleDataChange('enableQandA', enabled)}
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-8">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Welcome Message (Optional)
                            </label>
                            <p className="text-sm text-gray-500 mb-3">
                                This message will be automatically sent to students upon their enrollment in the course.
                            </p>
                            <textarea
                                rows={5}
                                placeholder="Welcome to the course! We're excited to have you..."
                                value={courseData.welcomeMessage}
                                onChange={e => handleDataChange('welcomeMessage', e.target.value)}
                                className="w-full p-3 focus:outline-none resize-vertical border border-gray-200 rounded-lg text-sm"
                            ></textarea>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div>
             <CourseValidationModal isOpen={isValidationModalOpen} onClose={() => setIsValidationModalOpen(false)} missingFields={missingFields} />
             <CourseSuccessModal isOpen={isSuccessModalOpen} onNavigate={handleSuccessNavigation} />

            <div className="flex items-center gap-4 mb-8">
                <button onClick={handleBackToMyCourses} className="p-2 bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-100">
                    <HiChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Create New Course</h1>
                    <p className="text-gray-600 mt-1">Fill out the details below to create your new course.</p>
                </div>
            </div>

            <div className="bg-gray-100 p-1 rounded-xl inline-flex items-center flex-wrap">
                {TABS.map((tab, index) => <TabButton key={tab} label={tab} index={index} />)}
            </div>

            <div className="mt-6 bg-white p-8 rounded-2xl shadow-sm">
                {renderActiveTabContent()}

                <div className="mt-8 flex justify-end items-center gap-4 border-t border-gray-100 pt-6">
                    <button type="button" className="bg-gray-100 text-gray-700 font-semibold py-2.5 px-5 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                        Save as Draft
                    </button>
                    {activeTabIndex < TABS.length - 1 ? (
                         <button onClick={handleContinue} type="button" className="bg-[#0b6459] text-white font-semibold py-2.5 px-5 rounded-lg text-sm hover:bg-[#084c43] transition-colors">
                            Continue
                        </button>
                    ) : (
                         <button onClick={handlePublish} type="button" className="bg-[#0b6459] text-white font-semibold py-2.5 px-5 rounded-lg text-sm hover:bg-[#084c43] transition-colors">
                            Save & Publish
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateCoursePage;