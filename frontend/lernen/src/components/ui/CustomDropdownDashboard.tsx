import React, { useState, useEffect, useRef } from 'react';

export interface CustomDropdownDashboardProps {
    label?: string; // Label is now optional
    options: string[];
    selectedValue: string;
    placeholder: string;
    onSelect: (option: string) => void;
    dropdownId: string;
    openDropdown: string | null;
    setOpenDropdown: React.Dispatch<React.SetStateAction<string | null>>;
    hasSearch?: boolean;
    searchPlaceholder?: string;
    loading?: boolean;
    position?: 'top' | 'bottom'; // Position of dropdown: 'top' = above, 'bottom' = below
    maxVisibleItems?: number; // Number of items to show without scrolling
}

const CustomDropdownDashboard: React.FC<CustomDropdownDashboardProps> = ({ label, options, selectedValue, placeholder, onSelect, dropdownId, openDropdown, setOpenDropdown, hasSearch = false, searchPlaceholder = "Search...", loading = false, position = 'bottom', maxVisibleItems = 4 }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const isOpen = openDropdown === dropdownId;
    const [searchTerm, setSearchTerm] = useState("");
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
        } else {
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 150); // Match animation duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        setOpenDropdown(isOpen ? null : dropdownId);
    };

    const handleSelect = (option: string) => {
        onSelect(option);
        setOpenDropdown(null);
        setSearchTerm("");
    };

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                 if(isOpen) {
                    setOpenDropdown(null);
                    setSearchTerm("");
                 }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, setOpenDropdown]);

    useEffect(() => {
        if (shouldRender && isOpen && hasSearch && searchInputRef.current) {
            // Focus after render completes
            const timer = setTimeout(() => {
                searchInputRef.current?.focus();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [shouldRender, isOpen, hasSearch]);

    const isPlaceholder = selectedValue === placeholder;
    
    // Calculate max height based on maxVisibleItems
    // Each item is approximately 40px (p-2 = 8px padding + ~32px content)
    // Search bar adds ~48px if present
    // space-y-1 adds 4px gaps between items
    const itemHeight = 40;
    const gapHeight = 4; // space-y-1 = 4px
    const searchBarHeight = hasSearch ? 48 : 0;
    const maxHeight = (maxVisibleItems * itemHeight) + searchBarHeight + 16; // +16 for padding

    return (
        <div className="relative" ref={dropdownRef}>
            <div className={`
                ${label ? 'bg-white rounded-lg border border-gray-200 shadow-sm p-3 min-h-[70px] flex flex-col justify-center' : 'bg-gray-100 border border-transparent rounded-lg'}
            `}>
                {label && <label className="text-xs text-[#585858] block mb-1.5">{label}</label>}
                <button 
                    type="button"
                    onClick={handleToggle}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`dropdown-button w-full flex justify-between items-center text-left ${label ? '' : 'px-4 py-2.5 h-[38px] text-gray-800 hover:bg-white hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-0 focus:border-[#0b6459] transition-all duration-500 ease-in-out'}`}
                >
                    <span className={`dropdown-label text-sm font-normal truncate ${isPlaceholder && label ? 'text-[rgba(88,88,88,0.4)]' : 'text-[#585858]'}`}>{selectedValue}</span>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 10 13 14 9"></polyline></svg>
                </button>
            </div>
            {shouldRender && (
                <div className={`
                    dropdown-modal absolute z-20 left-0 right-0 w-full bg-white rounded-xl shadow-lg border border-gray-200/80 p-2 
                    ${position === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'}
                    transition-opacity duration-150 ease-out
                    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                `} style={{ maxHeight: `${maxHeight}px` }}>
                    {hasSearch && (
                         <div className="p-1 mb-1">
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder={searchPlaceholder}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#065a46] placeholder:text-[rgba(88,88,88,0.4)]"
                                value={searchTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
                            />
                        </div>
                    )}
                    <ul className="space-y-1 overflow-y-auto" style={{ maxHeight: `${maxHeight - searchBarHeight - 16}px` }}>
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
                        ) : filteredOptions.length === 0 ? (
                            <li className="p-2 text-sm text-gray-500 text-center">
                                {searchTerm ? 'No results found' : 'No options available'}
                            </li>
                        ) : (
                            filteredOptions.map((option, index) => (
                                <li key={index} onClick={() => handleSelect(option)} className={`dropdown-option p-2 text-sm font-medium text-gray-800 rounded-lg cursor-pointer ${selectedValue === option ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}>
                                    {option}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CustomDropdownDashboard;

