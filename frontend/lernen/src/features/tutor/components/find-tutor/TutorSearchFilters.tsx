import React, { useState, useEffect, useRef } from 'react';
import CustomDropdown from '../../../../components/ui/CustomDropdown';
import { tutorService } from '../../../../services/tutorService';
import type { Category, Subcategory, Location, Language, TutorSearchFilters as IFilters } from '../../../../types/api';

// --- Type Definitions ---
interface TutorSearchFiltersProps {
  onFilterChange: (filters: IFilters) => void;
}

interface MultiSelectDropdownProps {
    label: string;
    options: string[];
    selectedOptions: string[];
    placeholder: string;
    onToggleOption: (option: string) => void;
    dropdownId: string;
    openDropdown: string | null;
    setOpenDropdown: React.Dispatch<React.SetStateAction<string | null>>;
    loading?: boolean;
}

interface MultiSelectDropdownWithSearchProps {
    label: string;
    options: string[];
    selectedOptions: string[];
    placeholder: string;
    onToggleOption: (option: string) => void;
    dropdownId: string;
    openDropdown: string | null;
    setOpenDropdown: React.Dispatch<React.SetStateAction<string | null>>;
    searchPlaceholder?: string;
    loading?: boolean;
}

// --- Reusable Multi-Select Dropdown Component ---
const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ label, options, selectedOptions, placeholder, onToggleOption, dropdownId, openDropdown, setOpenDropdown, loading = false }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const tagsContainerRef = useRef<HTMLDivElement>(null);
    const isOpen = openDropdown === dropdownId;

    const handleToggle = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setOpenDropdown(isOpen ? null : dropdownId);
    };

    const handleRemoveOption = (option: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // Ngăn dropdown mở/đóng khi xóa tag
        onToggleOption(option);
    };
    
    useEffect(() => {
        if (tagsContainerRef.current) {
            // Scroll to the end to show the latest added item
            tagsContainerRef.current.scrollLeft = tagsContainerRef.current.scrollWidth;
        }
    }, [selectedOptions]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                if(isOpen) {
                   setOpenDropdown(null);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, setOpenDropdown]);

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={handleToggle} className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-sm min-h-[70px] cursor-pointer flex flex-col justify-center">
                <label className="text-xs text-[#585858] block mb-1.5">{label}</label>
                <div className="flex items-center justify-between">
                    <div ref={tagsContainerRef} className="flex-1 min-w-0 flex flex-nowrap gap-1 items-center overflow-x-auto no-scrollbar">
                        {selectedOptions.length === 0 ? (
                            <span className="text-sm font-normal text-[rgba(88,88,88,0.4)]">{placeholder}</span>
                        ) : (
                            selectedOptions.map(option => (
                                <div key={option} className="flex-shrink-0 bg-gray-100 text-gray-800 text-xs font-semibold pl-2.5 pr-1 py-1 rounded-full flex items-center gap-1.5">
                                    <span>{option}</span>
                                    <button onClick={(e) => handleRemoveOption(option, e)} className="bg-gray-300 hover:bg-gray-400 text-gray-600 hover:text-black rounded-full h-4 w-4 flex items-center justify-center focus:outline-none transition-colors">
                                        <svg className="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M1 1l6 6m0 0l6 6M7 7L1 13m6-6l6-6"/></svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    <svg className={`flex-shrink-0 ml-2 w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 10 13 14 9"></polyline></svg>
                </div>
            </div>
            {isOpen && (
                <div className="dropdown-modal absolute z-20 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200/80 p-2">
                    <ul className="space-y-1 max-h-60 overflow-y-auto">
                        {loading ? (
                            <li className="p-2 text-sm text-gray-500 text-center">
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading...
                                </div>
                            </li>
                        ) : (
                            options.map((option, index) => {
                                const isSelected = selectedOptions.includes(option);
                                return (
                                    <li key={index} onClick={() => onToggleOption(option)} className={`dropdown-option p-2 text-sm font-medium rounded-lg cursor-pointer flex justify-between items-center ${isSelected ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-800 hover:bg-gray-50'}`}>
                                        <span>{option}</span>
                                        {isSelected && (
                                            <svg className="w-4 h-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        )}
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

// --- Reusable Multi-Select Dropdown with Search Component ---
const MultiSelectDropdownWithSearch: React.FC<MultiSelectDropdownWithSearchProps> = ({ label, options, selectedOptions, placeholder, onToggleOption, dropdownId, openDropdown, setOpenDropdown, searchPlaceholder = "Search...", loading = false }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const tagsContainerRef = useRef<HTMLDivElement>(null);
    const isOpen = openDropdown === dropdownId;
    const [searchTerm, setSearchTerm] = useState("");

    const handleToggle = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setOpenDropdown(isOpen ? null : dropdownId);
    };

    const handleRemoveOption = (option: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onToggleOption(option);
    };

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    useEffect(() => {
        if (tagsContainerRef.current) {
            tagsContainerRef.current.scrollLeft = tagsContainerRef.current.scrollWidth;
        }
    }, [selectedOptions]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                if (isOpen) {
                    setOpenDropdown(null);
                    setSearchTerm("");
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, setOpenDropdown]);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={handleToggle} className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-sm min-h-[70px] cursor-pointer flex flex-col justify-center">
                <label className="text-xs text-[#585858] block mb-1.5">{label}</label>
                <div className="flex items-center justify-between">
                    <div ref={tagsContainerRef} className="flex-1 min-w-0 flex flex-nowrap gap-1 items-center overflow-x-auto no-scrollbar">
                        {selectedOptions.length === 0 ? (
                            <span className="text-sm font-normal text-[rgba(88,88,88,0.4)]">{placeholder}</span>
                        ) : (
                            selectedOptions.map(option => (
                                <div key={option} className="flex-shrink-0 bg-gray-100 text-gray-800 text-xs font-semibold pl-2.5 pr-1 py-1 rounded-full flex items-center gap-1.5">
                                    <span>{option}</span>
                                    <button onClick={(e) => handleRemoveOption(option, e)} className="bg-gray-300 hover:bg-gray-400 text-gray-600 hover:text-black rounded-full h-4 w-4 flex items-center justify-center focus:outline-none transition-colors">
                                        <svg className="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M1 1l6 6m0 0l6 6M7 7L1 13m6-6l6-6" /></svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    <svg className={`flex-shrink-0 ml-2 w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 10 13 14 9"></polyline></svg>
                </div>
            </div>
            {isOpen && (
                <div className="dropdown-modal absolute z-20 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200/80 p-2">
                    <div className="p-1 mb-1">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder={searchPlaceholder}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#065a46] text-[rgba(88,88,88,0.4)]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <ul className="space-y-1 max-h-60 overflow-y-auto">
                        {loading ? (
                            <li className="p-2 text-sm text-gray-500 text-center">
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading...
                                </div>
                            </li>
                        ) : (
                            filteredOptions.map((option, index) => {
                                const isSelected = selectedOptions.includes(option);
                                return (
                                    <li key={index} onClick={() => onToggleOption(option)} className={`dropdown-option p-2 text-sm font-medium rounded-lg cursor-pointer flex justify-between items-center ${isSelected ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-800 hover:bg-gray-50'}`}>
                                        <span>{option}</span>
                                        {isSelected && (
                                            <svg className="w-4 h-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        )}
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};


// --- Main Filters Component ---
export default function TutorSearchFilters({ onFilterChange }: TutorSearchFiltersProps): React.ReactElement {
    const [activeTab, setActiveTab] = useState<string>('All Sessions');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [feeRange, setFeeRange] = useState([20, 150]);
    const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
    const [keyword, setKeyword] = useState<string>('');
    const availabilityRef = useRef<HTMLDivElement>(null);


    const MIN_FEE = 0;
    const MAX_FEE = 200;
    const FEE_GAP = 10;

    // Category cache states with loading flags
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [timezones, setTimezones] = useState<Location[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    
    // Loading states for lazy loading
    const [loadingFilterData, setLoadingFilterData] = useState<boolean>(false);
    const [loadingSubcategories, setLoadingSubcategories] = useState<boolean>(false);

    const placeholders = {
        category: 'Choose category',
        subcategory: 'Choose subcategory',
        languages: 'Select languages',
        sortBy: 'Sort by',
        timezone: 'Select timezone',
    };
    
    const [selectedValues, setSelectedValues] = useState({
        category: placeholders.category,
        sortBy: placeholders.sortBy,
        timezone: placeholders.timezone,
    });
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

    const tabs: string[] = ['All Sessions', 'Private Sessions', 'Group Sessions'];
    const activeShadowClass = 'shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),_0px_1px_2px_0px_rgba(16,24,40,0.06)]';

    // Lazy load filter data on mount with caching - load once and cache to avoid repeated API calls
    useEffect(() => {
        const fetchFilterData = async () => {
            // Fetch all filter data (timezones, languages, categories) in one API call
            if ((categories.length === 0 || timezones.length === 0 || languages.length === 0) && !loadingFilterData) {
                setLoadingFilterData(true);
                try {
                    const response = await tutorService.getFilterData();
                    if (response.success) {
                        const { timezones: fetchedTimezones, languages: fetchedLanguages, categories: fetchedCategories } = response.data;
                        setTimezones(fetchedTimezones);
                        setLanguages(fetchedLanguages);
                        setCategories(fetchedCategories);
                    }
                } catch (error) {
                    console.error('Failed to fetch filter data:', error);
                } finally {
                    setLoadingFilterData(false);
                }
            }

            // Fetch subcategories only when a category is selected
            // This is handled in handleSelect when category changes
        };

        fetchFilterData();
    }, []); // Empty dependency array - only run once on mount

    // Convert to string arrays for dropdowns
    const categoryOptions: string[] = categories.map(cat => cat.name);
    const subcategoryOptions: string[] = subcategories.map(sub => sub.name);
    const timezoneOptions: string[] = timezones.map(tz => tz.name);
    const sortByOptions: string[] = ['Relevance', 'Newest First', 'Oldest First'];
    const languageOptions: string[] = languages.map(lang => lang.name);
    const availabilityDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const availabilityTimes = ['Morning', 'Afternoon', 'Evening'];


    const handleSelect = (dropdownId: keyof typeof selectedValues, value: string) => {
        setSelectedValues(prev => ({ ...prev, [dropdownId]: value }));
        
        // When category is selected, fetch subcategories for that category
        if (dropdownId === 'category' && value !== placeholders.category) {
            const selectedCategory = categories.find(cat => cat.name === value);
            if (selectedCategory) {
                fetchSubcategoriesForCategory(selectedCategory.id);
            }
        }
    };

    const fetchSubcategoriesForCategory = async (categoryId: string) => {
        if (loadingSubcategories) return; // Prevent multiple calls
        
        setLoadingSubcategories(true);
        try {
            const response = await tutorService.getSubcategories(categoryId);
            if (response.success) {
                setSubcategories(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch subcategories for category:', error);
        } finally {
            setLoadingSubcategories(false);
        }
    };

    const handleSubcategoryToggle = (subcategory: string) => {
        setSelectedSubcategories(prev => prev.includes(subcategory) ? prev.filter(s => s !== subcategory) : [...prev, subcategory]);
    };
    
    const handleLanguageToggle = (language: string) => {
        setSelectedLanguages(prev => prev.includes(language) ? prev.filter(l => l !== language) : [...prev, language]);
    };

    const handleAvailabilityToggle = (slot: string) => {
        setSelectedAvailability(prev => prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (availabilityRef.current && !availabilityRef.current.contains(event.target as Node)) {
                if(openDropdown === 'availability') {
                   setOpenDropdown(null);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openDropdown, setOpenDropdown]);

    // Trigger filter change when any filter updates (debounced)
    useEffect(() => {
        const filters: IFilters = {
            category: selectedValues.category !== placeholders.category ? selectedValues.category : undefined,
            subcategories: selectedSubcategories.length > 0 ? selectedSubcategories : undefined,
            languages: selectedLanguages.length > 0 ? selectedLanguages : undefined,
            timezone: selectedValues.timezone !== placeholders.timezone ? selectedValues.timezone : undefined,
            sortBy: selectedValues.sortBy !== placeholders.sortBy ? selectedValues.sortBy : undefined,
            sessionType: activeTab === 'Online' ? 'online' : activeTab === 'Offline' ? 'offline' : undefined,
            keyword: keyword.trim() || undefined,
            minFee: feeRange[0],
            maxFee: feeRange[1],
        };
            onFilterChange(filters);

    }, [selectedValues, selectedSubcategories, selectedLanguages, feeRange, activeTab, keyword]);

    return (
        <>
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
            <div>
                <div>
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[#FBF6EE] rounded-t-xl">
                        {tabs.map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-button px-6 py-2 text-sm font-bold text-[#585858] rounded-[10px] transition-all duration-200 ${activeTab === tab ? `bg-white ${activeShadowClass}` : 'hover:bg-white/60'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 bg-[#FBF6EE] rounded-b-xl rounded-tr-xl">
                        <div className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <CustomDropdown 
                                label="Category"
                                options={categoryOptions}
                                selectedValue={selectedValues.category}
                                placeholder={placeholders.category}
                                onSelect={(value) => handleSelect('category', value)}
                                dropdownId="category" openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                                hasSearch={true}
                                searchPlaceholder="Search..."
                                loading={loadingFilterData}
                            />
                            <MultiSelectDropdown 
                                label="Choose subcategory"
                                options={subcategoryOptions}
                                selectedOptions={selectedSubcategories}
                                onToggleOption={handleSubcategoryToggle}
                                placeholder={placeholders.subcategory}
                                dropdownId="subcategory"
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                                loading={loadingSubcategories}
                            />
                            <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-sm min-h-[70px] flex flex-col justify-center">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs text-[#585858]">Fee per session</label>
                                    <span className="text-sm font-semibold text-gray-800">${feeRange[0]} - ${feeRange[1]}</span>
                                </div>
                                <div className="relative h-5 flex items-center">
                                    <div className="relative w-full h-1 bg-gray-200 rounded-full">
                                        <div 
                                            className="absolute h-1 bg-[#0b6459] rounded-full z-0"
                                            style={{
                                                left: `${(feeRange[0] / MAX_FEE) * 100}%`,
                                                width: `${((feeRange[1] - feeRange[0]) / MAX_FEE) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                    <input
                                        type="range"
                                        min={MIN_FEE}
                                        max={MAX_FEE}
                                        value={feeRange[0]}
                                        onChange={(e) => {
                                            const value = Math.min(Number(e.target.value), feeRange[1] - FEE_GAP);
                                            setFeeRange([value, feeRange[1]]);
                                        }}
                                        className="range-input"
                                        style={{ zIndex: 3 }}
                                    />
                                    <input
                                        type="range"
                                        min={MIN_FEE}
                                        max={MAX_FEE}
                                        value={feeRange[1]}
                                        onChange={(e) => {
                                            const value = Math.max(Number(e.target.value), feeRange[0] + FEE_GAP);
                                            setFeeRange([feeRange[0], value]);
                                        }}
                                        className="range-input"
                                        style={{ zIndex: 4 }}
                                    />
                                </div>
                            </div>
                            <MultiSelectDropdownWithSearch 
                                label="Tutor languages"
                                options={languageOptions}
                                selectedOptions={selectedLanguages}
                                onToggleOption={handleLanguageToggle}
                                placeholder={placeholders.languages}
                                dropdownId="languages"
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                                searchPlaceholder="Search by language..."
                                loading={loadingFilterData}
                            />

                            {/* Availability Filter */}
                            <div className="relative" ref={availabilityRef}>
                                <div onClick={() => setOpenDropdown(openDropdown === 'availability' ? null : 'availability')} className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-sm min-h-[70px] cursor-pointer flex flex-col justify-center">
                                    <label className="text-xs text-[#585858] block mb-1.5">Availability</label>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm font-normal  ${selectedAvailability.length === 0 ? 'text-[rgba(88,88,88,0.4)]' : 'text-gray-800'}`}>
                                            {selectedAvailability.length === 0 ? 'Anytime' : `${selectedAvailability.length} slots selected`}
                                        </span>
                                        <svg className={`flex-shrink-0 ml-2 w-4 h-4 text-gray-500 transition-transform duration-200 ${openDropdown === 'availability' ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 10 13 14 9"></polyline></svg>
                                    </div>
                                </div>
                                {openDropdown === 'availability' && (
                                    <div className="absolute z-20 mt-1 w-full max-w-sm bg-white rounded-xl shadow-lg border border-gray-200/80 p-4">
                                        <p className="font-semibold text-sm mb-3">Select available slots</p>
                                        <div className="grid grid-cols-4 gap-2 text-center">
                                            <div></div>
                                            {availabilityTimes.map(time => <div key={time} className="text-xs font-bold text-gray-500">{time}</div>)}
                                            
                                            {availabilityDays.map(day => (
                                                <React.Fragment key={day}>
                                                    <div className="text-xs font-bold text-gray-500 flex items-center justify-start">{day}</div>
                                                    {availabilityTimes.map(time => {
                                                        const slot = `${day}-${time}`;
                                                        const isSelected = selectedAvailability.includes(slot);
                                                        return (
                                                            <button key={slot} onClick={() => handleAvailabilityToggle(slot)} className={`h-8 rounded-md transition-colors text-xs ${isSelected ? 'bg-[#0b6459] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                                            </button>
                                                        );
                                                    })}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center mt-4">
                                            <button onClick={() => setSelectedAvailability([])} className="text-xs font-semibold text-gray-600 hover:underline">Clear</button>
                                            <button onClick={() => setOpenDropdown(null)} className="text-xs font-semibold bg-[#0b6459] text-white px-3 py-1.5 rounded-md">Apply</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* New Controls Section - Moved to a separate div */}
                <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-grow">
                        <div className="relative flex-grow max-w-xs">
                            <input 
                                type="text" 
                                placeholder="Search by keyword" 
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full bg-white p-2.5 pl-10 text-sm font-medium text-gray-800 rounded-xl border border-gray-200/80 shadow-sm focus:border-[#065a46] focus:outline-none placeholder:text-[rgba(88,88,88,0.4)]"
                            />
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                        <div className="w-48">
                            <CustomDropdown
                                options={sortByOptions}
                                selectedValue={selectedValues.sortBy}
                                placeholder={placeholders.sortBy}
                                onSelect={(value) => handleSelect('sortBy', value)}
                                dropdownId="sortBy"
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                            />
                        </div>
                    </div>
                    <div className="w-48">
                        <CustomDropdown options={timezoneOptions} selectedValue={selectedValues.timezone} placeholder={placeholders.timezone} onSelect={(value) => handleSelect('timezone', value)} dropdownId="timezone" openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} loading={loadingFilterData} />
                    </div>
                </div>
            </div>
        </>
    );
}