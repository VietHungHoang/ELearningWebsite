import React, { useState } from 'react';
import { HiPlus, HiTrash } from 'react-icons/hi';

interface DynamicListInputProps {
    label: string;
    placeholder: string;
    items: string[];
    onItemsChange: (newItems: string[]) => void;
}

const DynamicListInput: React.FC<DynamicListInputProps> = ({ label, placeholder, items, onItemsChange }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAddItem = () => {
        if (inputValue.trim()) {
            onItemsChange([...items, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddItem();
        }
    };

    const handleDeleteItem = (indexToDelete: number) => {
        onItemsChange(items.filter((_, index) => index !== indexToDelete));
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-0 focus:border-[#0b6459] transition"
                />
                <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex-shrink-0 flex items-center gap-2 bg-[#0b6459] text-white font-semibold py-2.5 px-4 rounded-lg text-sm hover:bg-[#084c43] transition-colors"
                >
                    <HiPlus className="w-4 h-4" />
                    <span>Add</span>
                </button>
            </div>
            {items.length > 0 && (
                <ul className="mt-3 space-y-2">
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                            <span className="text-sm text-gray-700">{item}</span>
                            <button
                                type="button"
                                onClick={() => handleDeleteItem(index)}
                                className="p-1 text-gray-400 hover:text-red-500"
                            >
                                <HiTrash className="w-4 h-4" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DynamicListInput;
