import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    HiSparkles,
    HiChevronDown,
    HiCloudUpload,
    HiTrash,
    HiGlobe,
    HiVideoCamera,
    HiUser,
    HiDocumentText,
    HiCog,
    HiBell,
    HiCurrencyDollar,
} from "react-icons/hi";
import CustomDropdown from "../../../../components/ui/CustomDropdown";
import FileUpload from "../components/FileUpload";
import AccountSettingsForm from "../components/profile-setting/AccountSettingsForm";
import ResumeHighlights from "../components/profile-setting/ResumeHighlights";
import ClassConfiguration from "../components/profile-setting/ClassConfiguration";
import NotificationPreferences from "../components/profile-setting/NotificationPreferences";
import Toast from "../../../../components/ui/Toast";
import WriteWithAIModal from "./components/WriteWithAIModal";
import Breadcrumb from "../../components/Breadcrumb";
import { useTutorProfile } from "../../../../hooks/useTutorProfile";
import { getCountries, getLanguages, getSubjects, type Country, type Language, type Subject } from "../../../../services/commonService";
import type { SocialLink, Language as ApiLanguage, Subject as ApiSubject, EducationItem, ExperienceItem, CertificationItem } from "../../../../types/api";

type DetailTab =
    | "Personal Details"
    | "Resume Highlights"
    | "Class Configuration"
    | "Account Settings"
    | "Notification Preferences"
    | "Identity Verification";
type PersonalDetailsSubTab = "Basic Information" | "Professional Profile" | "Media & Portfolio" | "Social Links";

const GenderButton: React.FC<{
    label: string;
    selected: string;
    setSelected: (value: string) => void;
}> = ({ label, selected, setSelected }) => (
    <button
        type="button"
        onClick={() => setSelected(label)}
        className={`flex-1 px-2 py-2 text-sm font-medium transition-colors duration-200 rounded-lg focus:outline-none ${
            selected === label ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:bg-white/60"
        }`}
    >
        {label}
    </button>
);

const SubTabButton: React.FC<{
    label: PersonalDetailsSubTab;
    active: boolean;
    onClick: () => void;
}> = ({ label, active, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${
            active ? "bg-white text-gray-800 shadow-md" : "bg-transparent text-gray-500 hover:bg-white/50"
        }`}
    >
        {label}
    </button>
);

const PersonalDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<DetailTab>("Personal Details");
    const [personalDetailsSubTab, setPersonalDetailsSubTab] = useState<PersonalDetailsSubTab>("Basic Information");

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
    });

    // Use the tutor profile hook for API integration
    const { profile, loading, error, updateProfile, uploadPhoto, uploadVideo } = useTutorProfile();

    // Local state for form inputs (will be synced with API data)
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        gender: "",
        country: "",
        city: "",
        nativeLanguage: null as ApiLanguage | null,
        languages: [] as ApiLanguage[],
        headline: "",
        subjects: [] as ApiSubject[],
        introduction: "",
        socialLinks: [] as SocialLink[],
        profilePhoto: null as { name: string; url: string } | null,
        introVideo: null as File | null,
    });

    // Store original data to compare for changes
    const [originalData, setOriginalData] = useState({
        fullName: "",
        phoneNumber: "",
        gender: "",
        country: "",
        city: "",
        nativeLanguage: null as ApiLanguage | null,
        languages: [] as ApiLanguage[],
        headline: "",
        subjects: [] as ApiSubject[],
        introduction: "",
        socialLinks: [] as SocialLink[],
        profilePhoto: null as { name: string; url: string } | null,
        introVideo: null as File | null,
    });

    // Resume data state
    const [resumeData, setResumeData] = useState({
        education: [] as EducationItem[],
        experience: [] as ExperienceItem[],
        certifications: [] as CertificationItem[],
    });

    // Store original resume data to compare for changes
    const [originalResumeData, setOriginalResumeData] = useState({
        education: [] as EducationItem[],
        experience: [] as ExperienceItem[],
        certifications: [] as CertificationItem[],
    });

    // Sync form data with API profile data when loaded
    useEffect(() => {
        if (profile) {
            const initialData = {
                fullName: profile.fullName || "",
                phoneNumber: profile.phone || "",
                gender: profile.gender || "",
                country: profile.country || "",
                city: profile.city || "",
                nativeLanguage: profile.nativeLanguage || null,
                languages: profile.languages || [],
                headline: profile.headline || "",
                subjects: profile.subjects || [],
                introduction: profile.introduction || "",
                socialLinks: profile.socialLinks || [],
                profilePhoto: profile.avatarUrl ? { name: "Profile Photo", url: profile.avatarUrl } : null,
                introVideo: null, // File objects can't be stored in API
            };
            setFormData(initialData);
            setOriginalData(initialData);

            // Sync resume data
            const initialResumeData = {
                education: profile.education || [],
                experience: profile.experience || [],
                certifications: profile.certifications || [],
            };
            setResumeData(initialResumeData);
            setOriginalResumeData(initialResumeData);
        }
    }, [profile]);

    const breadcrumbItems = [
        { label: "Dashboard", onClick: () => navigate("/dashboard") },
        { label: "Profile", onClick: () => navigate("/dashboard/profile") },
        { label: "Personal Details", isActive: true },
    ];

    const handleSocialLinkChange = (socialLinkId: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            socialLinks: prev.socialLinks.map(link =>
                link.id === socialLinkId ? { ...link, url: value } : link
            ),
        }));
    };

    const toggleFormat = (format: keyof typeof activeFormats) => {
        setActiveFormats((prev) => ({ ...prev, [format]: !prev[format] }));
    };

    // State for dropdown options from API
    const [countryOptions, setCountryOptions] = useState<Country[]>([]);
    const [languageOptions, setLanguageOptions] = useState<Language[]>([]);
    const [subjectOptions, setSubjectOptions] = useState<Subject[]>([]);

    // Fetch dropdown options from API
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [countries, languages, subjects] = await Promise.all([
                    getCountries(),
                    getLanguages(),
                    getSubjects(),
                ]);
                setCountryOptions(countries);
                setLanguageOptions(languages);
                setSubjectOptions(subjects);
            } catch (error) {
                console.error('Failed to fetch dropdown options:', error);
            }
        };
        fetchOptions();
    }, []);

    const availableLanguages = useMemo(
        () => languageOptions.filter((l) => !formData.languages.some(lang => lang.id === l.id)),
        [languageOptions, formData.languages]
    );

    const availableSubjects = useMemo(
        () => subjectOptions.filter((s) => !formData.subjects.some(subj => subj.id === s.id)),
        [subjectOptions, formData.subjects]
    );

    // Helper function to get ID from name
    const getCountryId = (countryName: string) => {
        return countryOptions.find(c => c.name === countryName)?.id || '';
    };

    const getLanguageId = (languageName: string) => {
        return languageOptions.find(l => l.name === languageName)?.id || '';
    };

    const getSubjectId = (subjectName: string) => {
        return subjectOptions.find(s => s.name === subjectName)?.id || '';
    };

    // Check if form data has changed
    const hasPersonalChanges = useMemo(() => {
        return (
            formData.fullName !== originalData.fullName ||
            formData.phoneNumber !== originalData.phoneNumber ||
            formData.gender !== originalData.gender ||
            formData.country !== originalData.country ||
            formData.city !== originalData.city ||
            formData.nativeLanguage !== originalData.nativeLanguage ||
            JSON.stringify(formData.languages) !== JSON.stringify(originalData.languages) ||
            formData.headline !== originalData.headline ||
            JSON.stringify(formData.subjects) !== JSON.stringify(originalData.subjects) ||
            formData.introduction !== originalData.introduction ||
            JSON.stringify(formData.socialLinks) !== JSON.stringify(originalData.socialLinks) ||
            formData.introVideo !== originalData.introVideo ||
            formData.profilePhoto?.url !== originalData.profilePhoto?.url
        );
    }, [formData, originalData]);

    // Check if resume data has changed
    const hasResumeChanges = useMemo(() => {
        return (
            JSON.stringify(resumeData.education) !== JSON.stringify(originalResumeData.education) ||
            JSON.stringify(resumeData.experience) !== JSON.stringify(originalResumeData.experience) ||
            JSON.stringify(resumeData.certifications) !== JSON.stringify(originalResumeData.certifications)
        );
    }, [resumeData, originalResumeData]);

    // Check if ANY data has changed
    const hasChanges = hasPersonalChanges || hasResumeChanges;

    const handleAddLanguage = (lang: Language) => {
        if (!formData.languages.some(l => l.id === lang.id)) {
            setFormData((prev) => ({
                ...prev,
                languages: [...prev.languages, lang],
            }));
        }
    };

    const handleAddSubject = (subject: Subject) => {
        if (!formData.subjects.some(s => s.id === subject.id)) {
            setFormData((prev) => ({
                ...prev,
                subjects: [...prev.subjects, subject],
            }));
        }
    };

    const handleSave = async () => {
        try {
            // Save everything in one API call (except photo/video which are handled separately)
            await updateProfile({
                fullName: formData.fullName,
                phone: formData.phoneNumber,
                gender: formData.gender as "Male" | "Female" | "Not specified",
                country: formData.country,
                city: formData.city,
                nativeLanguage: formData.nativeLanguage || undefined,
                languages: formData.languages,
                headline: formData.headline,
                subjects: formData.subjects,
                introduction: formData.introduction,
                socialLinks: formData.socialLinks,
                education: resumeData.education,
                experience: resumeData.experience,
                certifications: resumeData.certifications,
            });

            // Update original data after successful save
            setOriginalData(formData);
            setOriginalResumeData(resumeData);
            setToast({ message: "Changes saved successfully!", type: "success" });
        } catch (err) {
            setToast({ message: "Failed to save changes. Please try again.", type: "error" });
        }
    };

    const inputStyles =
        "w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-0 focus:border-[#0b6459] transition";
    const disabledInputStyles =
        "w-full bg-gray-100/60 border-transparent rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed";

    const NavItem: React.FC<{ label: DetailTab; icon: React.ReactNode; description: string }> = ({
        label,
        icon,
        description,
    }) => (
        <button
            onClick={() => setActiveTab(label)}
            className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                activeTab === label ? "bg-[#0b6459] text-white shadow-md" : "hover:bg-gray-100 text-gray-600"
            }`}
        >
            <div
                className={`mt-1 w-6 h-6 flex-shrink-0 flex items-center justify-center ${
                    activeTab === label ? "text-white" : "text-gray-500"
                }`}
            >
                {icon}
            </div>
            <div>
                <p className={`font-bold text-sm ${activeTab === label ? "text-white" : "text-gray-800"}`}>{label}</p>
                <p className={`text-xs mt-0.5 ${activeTab === label ? "text-teal-100" : "text-gray-500"}`}>
                    {description}
                </p>
            </div>
        </button>
    );

    return (
        <>
            {/* Breadcrumb outside the main container */}
            <div className="mb-6">
                <Breadcrumb items={breadcrumbItems} className="mb-6" />
            </div>

            {/* Main Container - Single unified block */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden py-3">
                {/* Main Content Layout */}
                <div className="flex flex-col lg:flex-row">
                    {/* Left Sidebar Navigation */}
                    <div className="w-full lg:w-80 flex-shrink-0 p-4 border-r border-gray-100 lg:min-h-[600px]">
                        <nav className="space-y-2">
                            <NavItem
                                label="Personal Details"
                                icon={<HiUser />}
                                description="Basic information & profile"
                            />
                            <NavItem
                                label="Resume Highlights"
                                icon={<HiDocumentText />}
                                description="Experience & achievements"
                            />
                            <NavItem
                                label="Class Configuration"
                                icon={<HiCurrencyDollar />}
                                description="Pricing & scheduling"
                            />
                            <NavItem label="Account Settings" icon={<HiCog />} description="Security & preferences" />
                            <NavItem
                                label="Notification Preferences"
                                icon={<HiBell />}
                                description="Email & push alerts"
                            />
                        </nav>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-grow w-full min-w-0">
                        <div className="p-6 space-y-6">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0b6459]"></div>
                                    <span className="ml-2 text-gray-600">Loading profile data...</span>
                                </div>
                            ) : error ? (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-red-800">{error}</p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                                    >
                                        Try again
                                    </button>
                                </div>
                            ) : (
                                activeTab === "Personal Details" && (
                                    <>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800">Personal Details</h2>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Please provide your personal information below to complete your profile
                                            </p>
                                        </div>

                                        {/* Horizontal Sub-Tabs */}
                                        <div className="flex items-center justify-between mt-6">
                                            <div className="flex items-center gap-4">
                                                <SubTabButton
                                                    label="Basic Information"
                                                    active={personalDetailsSubTab === "Basic Information"}
                                                    onClick={() => setPersonalDetailsSubTab("Basic Information")}
                                                />
                                                <SubTabButton
                                                    label="Professional Profile"
                                                    active={personalDetailsSubTab === "Professional Profile"}
                                                    onClick={() => setPersonalDetailsSubTab("Professional Profile")}
                                                />
                                                <SubTabButton
                                                    label="Media & Portfolio"
                                                    active={personalDetailsSubTab === "Media & Portfolio"}
                                                    onClick={() => setPersonalDetailsSubTab("Media & Portfolio")}
                                                />
                                                <SubTabButton
                                                    label="Social Links"
                                                    active={personalDetailsSubTab === "Social Links"}
                                                    onClick={() => setPersonalDetailsSubTab("Social Links")}
                                                />
                                            </div>
                                        </div>

                                        <form className="mt-6 space-y-6">
                                            {/* Basic Information Tab */}
                                            {personalDetailsSubTab === "Basic Information" && (
                                                <>
                                                    {/* Full Name and Gender in 2 columns */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Full Name <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={formData.fullName}
                                                                onChange={(e) =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        fullName: e.target.value,
                                                                    }))
                                                                }
                                                                className={inputStyles}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Gender <span className="text-red-500">*</span>
                                                            </label>
                                                            <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1">
                                                                <GenderButton
                                                                    label="Male"
                                                                    selected={formData.gender}
                                                                    setSelected={(value) =>
                                                                        setFormData((prev) => ({
                                                                            ...prev,
                                                                            gender: value,
                                                                        }))
                                                                    }
                                                                />
                                                                <GenderButton
                                                                    label="Female"
                                                                    selected={formData.gender}
                                                                    setSelected={(value) =>
                                                                        setFormData((prev) => ({
                                                                            ...prev,
                                                                            gender: value,
                                                                        }))
                                                                    }
                                                                />
                                                                <GenderButton
                                                                    label="Not specified"
                                                                    selected={formData.gender}
                                                                    setSelected={(value) =>
                                                                        setFormData((prev) => ({
                                                                            ...prev,
                                                                            gender: value,
                                                                        }))
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Email & Phone Number */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Email <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="email"
                                                                value={profile?.email || ""}
                                                                disabled
                                                                className={disabledInputStyles}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Phone number <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="tel"
                                                                value={formData.phoneNumber}
                                                                onChange={(e) =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        phoneNumber: e.target.value,
                                                                    }))
                                                                }
                                                                className={inputStyles}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Address */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Address <span className="text-red-500">*</span>
                                                        </label>
                                                        <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <label className="text-xs text-gray-500 block mb-1.5 ml-1">
                                                                    Country
                                                                </label>
                                                                <CustomDropdown
                                                                    options={countryOptions.map(c => c.name)}
                                                                    selectedValue={formData.country || "Select country"}
                                                                    placeholder="Select country"
                                                                    onSelect={(value) =>
                                                                        setFormData((prev) => ({
                                                                            ...prev,
                                                                            country: value,
                                                                        }))
                                                                    }
                                                                    dropdownId="country"
                                                                    openDropdown={openDropdown}
                                                                    setOpenDropdown={setOpenDropdown}
                                                                    hasSearch={true}
                                                                    searchPlaceholder="Search country..."
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs text-gray-500 block mb-1.5 ml-1">
                                                                    City
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.city}
                                                                    onChange={(e) =>
                                                                        setFormData((prev) => ({
                                                                            ...prev,
                                                                            city: e.target.value,
                                                                        }))
                                                                    }
                                                                    className={inputStyles}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs text-gray-500 block mb-1.5 ml-1">
                                                                    Native Language
                                                                </label>
                                                                <CustomDropdown
                                                                    options={languageOptions.map(l => l.name)}
                                                                    selectedValue={
                                                                        formData.nativeLanguage?.name || "Select language"
                                                                    }
                                                                    placeholder="Select language"
                                                                    onSelect={(value) => {
                                                                        const lang = languageOptions.find(l => l.name === value);
                                                                        if (lang) {
                                                                            setFormData((prev) => ({
                                                                                ...prev,
                                                                                nativeLanguage: lang,
                                                                            }));
                                                                        }
                                                                    }}
                                                                    dropdownId="native-language-address"
                                                                    openDropdown={openDropdown}
                                                                    setOpenDropdown={setOpenDropdown}
                                                                    hasSearch={true}
                                                                    searchPlaceholder="Search language..."
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Languages I know */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Languages I know <span className="text-red-500">*</span>
                                                        </label>
                                                        <div className="p-2 bg-gray-100 border border-transparent rounded-lg flex flex-wrap gap-2 items-center focus-within:border-[#0b6459] transition-colors">
                                                            {formData.languages.map((lang) => (
                                                                <span
                                                                    key={lang.id}
                                                                    className="bg-white px-3 py-1 rounded-md text-sm font-medium flex items-center gap-2 border border-gray-200"
                                                                >
                                                                    {lang.name}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setFormData((prev) => ({
                                                                                ...prev,
                                                                                languages: prev.languages.filter(
                                                                                    (l) => l.id !== lang.id
                                                                                ),
                                                                            }))
                                                                        }
                                                                        className="text-gray-400 hover:text-gray-600"
                                                                    >
                                                                        &times;
                                                                    </button>
                                                                </span>
                                                            ))}
                                                            <div className="flex-grow min-w-[150px]">
                                                                <CustomDropdown
                                                                    options={availableLanguages.map(l => l.name)}
                                                                    selectedValue="Add a language..."
                                                                    placeholder="Add a language..."
                                                                    onSelect={(value) => {
                                                                        const lang = availableLanguages.find(l => l.name === value);
                                                                        if (lang) handleAddLanguage(lang);
                                                                    }}
                                                                    dropdownId="languages"
                                                                    openDropdown={openDropdown}
                                                                    setOpenDropdown={setOpenDropdown}
                                                                    hasSearch={true}
                                                                    searchPlaceholder="Search language..."
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {/* Professional Profile Tab */}
                                            {personalDetailsSubTab === "Professional Profile" && (
                                                <>
                                                    {/* Professional Headline */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Professional Headline{" "}
                                                            <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={formData.headline}
                                                            onChange={(e) =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    headline: e.target.value,
                                                                }))
                                                            }
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
                                                        <div className="p-2 bg-gray-100 border border-transparent rounded-lg flex flex-wrap gap-2 items-center focus-within:border-[#0b6459] transition-colors">
                                                            {formData.subjects.map((subject) => (
                                                                <span
                                                                    key={subject.id}
                                                                    className="bg-white px-3 py-1 rounded-md text-sm font-medium flex items-center gap-2 border border-gray-200"
                                                                >
                                                                    {subject.name}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setFormData((prev) => ({
                                                                                ...prev,
                                                                                subjects: prev.subjects.filter(
                                                                                    (item) => item.id !== subject.id
                                                                                ),
                                                                            }))
                                                                        }
                                                                        className="text-gray-400 hover:text-gray-600"
                                                                    >
                                                                        &times;
                                                                    </button>
                                                                </span>
                                                            ))}
                                                            <div className="flex-grow min-w-[150px]">
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
                                                        </div>
                                                    </div>

                                                    {/* A brief introduction */}
                                                    <div className="relative">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            A brief introduction <span className="text-red-500">*</span>
                                                        </label>
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsAiModalOpen(true)}
                                                            className="absolute top-0 right-0 flex items-center gap-2 text-sm font-semibold bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-200"
                                                        >
                                                            <HiSparkles className="w-4 h-4" />
                                                            Write with AI
                                                        </button>
                                                        <div className="mt-1 border border-gray-200 rounded-lg">
                                                            <div className="flex items-center gap-4 p-3 border-b border-gray-200">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleFormat("bold")}
                                                                    className={`font-bold p-1 rounded ${
                                                                        activeFormats.bold ? "bg-gray-200" : ""
                                                                    }`}
                                                                >
                                                                    <span className="font-bold">B</span>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleFormat("italic")}
                                                                    className={`italic p-1 rounded ${
                                                                        activeFormats.italic ? "bg-gray-200" : ""
                                                                    }`}
                                                                >
                                                                    <span className="italic">I</span>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleFormat("underline")}
                                                                    className={`underline p-1 rounded ${
                                                                        activeFormats.underline ? "bg-gray-200" : ""
                                                                    }`}
                                                                >
                                                                    <span className="underline">U</span>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="flex items-center gap-1 text-sm p-1 rounded hover:bg-gray-100"
                                                                >
                                                                    14 <HiChevronDown className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="p-1 rounded hover:bg-gray-100"
                                                                >
                                                                    <span>•</span>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="p-1 rounded hover:bg-gray-100"
                                                                >
                                                                    <span>1.</span>
                                                                </button>
                                                            </div>
                                                            <textarea
                                                                rows={6}
                                                                value={formData.introduction}
                                                                onChange={(e) =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        introduction: e.target.value,
                                                                    }))
                                                                }
                                                                className="w-full p-3 focus:outline-none resize-none"
                                                            ></textarea>
                                                        </div>
                                                        <p className="text-xs text-gray-500 text-right mt-1">
                                                            Characters count: {formData.introduction.length}
                                                        </p>
                                                    </div>
                                                </>
                                            )}

                                            {/* Media & Portfolio Tab */}
                                            {personalDetailsSubTab === "Media & Portfolio" && (
                                                <>
                                                    {/* Profile Photo */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Profile Photo <span className="text-red-500">*</span>
                                                        </label>
                                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-gray-400 transition-colors">
                                                            <div className="space-y-1 text-center">
                                                                <div className="mx-auto h-12 w-12 text-gray-400 bg-gray-100 rounded-lg flex items-center justify-center">
                                                                    <HiCloudUpload className="w-5 h-5" />
                                                                </div>
                                                                <div className="flex text-sm text-gray-600">
                                                                    <p className="pl-1">
                                                                        Drop a file here or{" "}
                                                                        <span className="font-semibold text-[#0b6459]">
                                                                            click here to upload
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                                <p className="text-xs text-gray-500">
                                                                    jpg, jpeg, gif, png (max. 5 mb)
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {formData.profilePhoto && (
                                                            <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                                <div className="flex items-center gap-3">
                                                                    <img
                                                                        src={formData.profilePhoto.url}
                                                                        alt={formData.profilePhoto.name}
                                                                        className="w-10 h-10 rounded-md object-cover"
                                                                    />
                                                                    <span className="text-sm font-medium text-gray-700">
                                                                        {formData.profilePhoto.name}
                                                                    </span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setFormData((prev) => ({
                                                                            ...prev,
                                                                            profilePhoto: null,
                                                                        }))
                                                                    }
                                                                    className="text-gray-400 hover:text-red-500"
                                                                >
                                                                    <HiTrash className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Introduction Video */}
                                                    <div>
                                                        <FileUpload
                                                            title="Your Introduction Video"
                                                            description="Upload a short video to introduce yourself. This will be displayed on your public profile."
                                                            file={formData.introVideo}
                                                            onFileChange={(file) =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    introVideo: file,
                                                                }))
                                                            }
                                                            acceptedFileTypes="video/*"
                                                            fileTypeDescription="MP4, MOV, AVI up to 100MB"
                                                            icon={<HiVideoCamera className="w-8 h-8" />}
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {/* Social Links Tab */}
                                            {personalDetailsSubTab === "Social Links" && (
                                                <>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Social Media Links
                                                        </label>
                                                        <div className="mt-2 space-y-4">
                                                            {formData.socialLinks.map((link) => (
                                                                <div key={link.id} className="relative">
                                                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                                        <HiGlobe className="w-4 h-4" />
                                                                    </span>
                                                                    <input
                                                                        type="url"
                                                                        placeholder={`https://${link.platform.toLowerCase()}.com/username`}
                                                                        value={link.url}
                                                                        onChange={(e) =>
                                                                            handleSocialLinkChange(
                                                                                link.id,
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className="w-full px-3 py-2.5 pl-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b6459] focus:border-transparent"
                                                                    />
                                                                    <label className="absolute left-10 -top-2 bg-white px-1 text-xs text-gray-500">
                                                                        {link.platform}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </form>

                                        <div className="mt-8 flex justify-end items-center gap-4 border-t border-gray-100 pt-6">
                                            <p className="text-sm text-gray-500">
                                                Save & update the latest changes to the live
                                            </p>
                                            <button
                                                onClick={handleSave}
                                                type="button"
                                                disabled={!hasChanges}
                                                className={`font-semibold py-2.5 px-5 rounded-lg text-sm transition-colors ${
                                                    hasChanges
                                                        ? "bg-[#0b6459] text-white hover:bg-[#084c43] cursor-pointer"
                                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                }`}
                                            >
                                                Save & Update
                                            </button>
                                        </div>
                                    </>
                                )
                            )}
                            {activeTab === "Resume Highlights" && (
                                <ResumeHighlights
                                    educationItems={resumeData.education}
                                    experienceItems={resumeData.experience}
                                    certificationItems={resumeData.certifications}
                                    onEducationChange={(items) => setResumeData(prev => ({ ...prev, education: items }))}
                                    onExperienceChange={(items) => setResumeData(prev => ({ ...prev, experience: items }))}
                                    onCertificationChange={(items) => setResumeData(prev => ({ ...prev, certifications: items }))}
                                />
                            )}
                            {activeTab === "Class Configuration" && <ClassConfiguration />}
                            {activeTab === "Account Settings" && <AccountSettingsForm />}
                            {activeTab === "Notification Preferences" && <NotificationPreferences />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <WriteWithAIModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
        </>
    );
};

export default PersonalDetailsPage;
