import { useEffect, useRef } from "react";

// --- Type Definitions ---
interface MultiSelectDropdownProps {
    label: string;
    options: string[];
    selectedOptions: string[];
    placeholder: string;
    onToggleOption: (option: string) => void;
    dropdownId: string;
    openDropdown: string | null;
    setOpenDropdown: React.Dispatch<React.SetStateAction<string | null>>;
}
export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ label, options, selectedOptions, placeholder, onToggleOption, dropdownId, openDropdown, setOpenDropdown }) => {
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
                            <span className="text-sm font-medium text-[rgba(88,88,88,0.4)]">{placeholder}</span>
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
                        {options.map((option, index) => {
                            const isSelected = selectedOptions.includes(option);
                            return (
                                <li key={index} onClick={() => onToggleOption(option)} className={`dropdown-option p-2 text-sm font-medium rounded-lg cursor-pointer flex justify-between items-center ${isSelected ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-800 hover:bg-gray-50'}`}>
                                    <span>{option}</span>
                                    {isSelected && (
                                        <svg className="w-4 h-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};