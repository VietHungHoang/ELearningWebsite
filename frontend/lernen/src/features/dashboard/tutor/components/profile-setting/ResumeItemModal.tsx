import React, { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import type { ResumeItemData } from './ResumeHighlights';

interface ResumeItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<ResumeItemData, 'id'> & { id?: string }) => void;
  itemToEdit: ResumeItemData | null;
  sectionTitle: string;
}

const ResumeItemModal: React.FC<ResumeItemModalProps> = ({ isOpen, onClose, onSave, itemToEdit, sectionTitle }) => {
    const isCertification = sectionTitle === 'Certification & Awards';
    
    const [formData, setFormData] = useState<any>({
        title: '',
        institution: '',
        startDate: '',
        endDate: '',
        location: '',
        description: '',
        // Certification specific fields
        name: '',
        issuingOrganization: '',
        issueDate: '',
        expirationDate: '',
        credentialId: '',
        credentialUrl: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                setFormData(itemToEdit);
            } else {
                // Reset form based on section type
                if (isCertification) {
                    setFormData({ 
                        name: '', 
                        issuingOrganization: '', 
                        issueDate: '', 
                        expirationDate: '', 
                        credentialId: '', 
                        credentialUrl: '' 
                    });
                } else {
                    setFormData({ 
                        title: '', 
                        institution: '', 
                        startDate: '', 
                        endDate: '', 
                        location: '', 
                        description: '' 
                    });
                }
            }
        }
    }, [isOpen, itemToEdit, isCertification]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const dataToSave: any = { id: itemToEdit?.id };
        
        if (isCertification) {
            dataToSave.name = formData.name;
            dataToSave.issuingOrganization = formData.issuingOrganization;
            dataToSave.issueDate = formData.issueDate;
            dataToSave.expirationDate = formData.expirationDate || undefined;
            dataToSave.credentialId = formData.credentialId || undefined;
            dataToSave.credentialUrl = formData.credentialUrl || undefined;
        } else {
            dataToSave.title = formData.title;
            dataToSave.institution = formData.institution;
            dataToSave.startDate = formData.startDate;
            dataToSave.endDate = formData.endDate || undefined;
            dataToSave.location = formData.location || undefined;
            dataToSave.description = formData.description || undefined;
        }
        
        onSave(dataToSave);
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
                        <HiX className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {isCertification ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Name *</label>
                                <input 
                                    name="name" 
                                    value={formData.name || ''} 
                                    onChange={handleChange} 
                                    placeholder="e.g., Certified Educator" 
                                    className={inputStyles}
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization *</label>
                                <input 
                                    name="issuingOrganization" 
                                    value={formData.issuingOrganization || ''} 
                                    onChange={handleChange} 
                                    placeholder="e.g., National Tutoring Association" 
                                    className={inputStyles}
                                    required 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date *</label>
                                    <input 
                                        name="issueDate" 
                                        type="date" 
                                        value={formData.issueDate || ''} 
                                        onChange={handleChange} 
                                        className={inputStyles}
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                                    <input 
                                        name="expirationDate" 
                                        type="date" 
                                        value={formData.expirationDate || ''} 
                                        onChange={handleChange} 
                                        className={inputStyles} 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Credential ID</label>
                                <input 
                                    name="credentialId" 
                                    value={formData.credentialId || ''} 
                                    onChange={handleChange} 
                                    placeholder="e.g., NTA-CE-2021-12345" 
                                    className={inputStyles} 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Credential URL</label>
                                <input 
                                    name="credentialUrl" 
                                    type="url" 
                                    value={formData.credentialUrl || ''} 
                                    onChange={handleChange} 
                                    placeholder="e.g., https://verify.example.com/..." 
                                    className={inputStyles} 
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                                    <input 
                                        name="startDate" 
                                        type="date" 
                                        value={formData.startDate || ''} 
                                        onChange={handleChange} 
                                        className={inputStyles}
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input 
                                        name="endDate" 
                                        type="date" 
                                        value={formData.endDate || ''} 
                                        onChange={handleChange} 
                                        className={inputStyles}
                                        placeholder="Leave blank if ongoing" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                <input 
                                    name="title" 
                                    value={formData.title || ''} 
                                    onChange={handleChange} 
                                    placeholder="e.g., Bachelor of Computer Science" 
                                    className={inputStyles}
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Institution *</label>
                                <input 
                                    name="institution" 
                                    value={formData.institution || ''} 
                                    onChange={handleChange} 
                                    placeholder="e.g., ABC University" 
                                    className={inputStyles}
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input 
                                    name="location" 
                                    value={formData.location || ''} 
                                    onChange={handleChange} 
                                    placeholder="e.g., Cacuaco, Angola" 
                                    className={inputStyles} 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea 
                                    name="description" 
                                    value={formData.description || ''} 
                                    onChange={handleChange} 
                                    rows={4} 
                                    className={`${inputStyles} resize-vertical`}
                                    placeholder="Describe your achievements..."
                                ></textarea>
                            </div>
                        </>
                    )}
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
