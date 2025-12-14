import React, { useState, useEffect } from 'react';
import type { ResumeItemData } from './ResumeHighlights';
import { FiX } from 'react-icons/fi';

interface ResumeItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<ResumeItemData, 'id'> & { id?: number }) => void;
  itemToEdit: ResumeItemData | null;
  sectionTitle: string;
}

const ResumeItemModal: React.FC<ResumeItemModalProps> = ({ isOpen, onClose, onSave, itemToEdit, sectionTitle }) => {
    const [formData, setFormData] = useState({
        period: '',
        title: '',
        institution: '',
        location: '',
        description: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                setFormData(itemToEdit);
            } else {
                setFormData({ period: '', title: '', institution: '', location: '', description: '' });
            }
        }
    }, [isOpen, itemToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave({ ...formData, id: itemToEdit?.id });
    };

    if (!isOpen) return null;

    const inputStyles = "w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-0 focus:border-[#0b6459] transition";
    const modalTitle = `${itemToEdit ? 'Edit' : 'Add'} ${sectionTitle.replace(' & Awards', '')} Entry`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h2 className="font-bold text-lg text-gray-800">{modalTitle}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                        <FiX />
                    </button>
                </div>
                
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                        <input name="period" value={formData.period} onChange={handleChange} placeholder="e.g., 2015 - 2019" className={inputStyles} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Bachelor of Computer Science" className={inputStyles} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                        <input name="institution" value={formData.institution} onChange={handleChange} placeholder="e.g., ABC University" className={inputStyles} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Cacuaco, Angola" className={inputStyles} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className={`${inputStyles} resize-vertical`}></textarea>
                    </div>
                </div>

                <div className="flex justify-end items-center gap-3 p-4 bg-gray-50 border-t border-gray-100">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
                    <button onClick={handleSave} className="px-5 py-2.5 text-sm font-semibold bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43]">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default ResumeItemModal;
