import React, { useState } from 'react';
import { HiPlus, HiPencil, HiTrash, HiAcademicCap, HiBriefcase } from 'react-icons/hi';
import CustomDropdown from '../../../../components/ui/CustomDropdown';
import commonUtils from '../../../../utils/commonUtils';
import type { EducationItem, ExperienceItem, Tutor } from '../../../../types/api';

interface EducationExperienceStepProps {
    data: Partial<Tutor>;
    onChange: (data: Partial<Tutor>) => void;
}

const EducationExperienceStep: React.FC<EducationExperienceStepProps> = ({ data, onChange }) => {
    const [activeTab, setActiveTab] = useState<'education' | 'experience'>('education');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<EducationItem | ExperienceItem | null>(null);
    const [editingType, setEditingType] = useState<'education' | 'experience'>('education');

    const handleAdd = (type: 'education' | 'experience') => {
        setEditingType(type);
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: EducationItem | ExperienceItem, type: 'education' | 'experience') => {
        setEditingType(type);
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string, type: 'education' | 'experience') => {
        if (type === 'education') {
            onChange({ educations: (data.educations || []).filter(e => e.id !== id) });
        } else {
            onChange({ experiences: (data.experiences || []).filter(e => e.id !== id) });
        }
    };

    const handleSave = (item: any) => {
        if (editingType === 'education') {
            if (item.id) {
                onChange({ educations: (data.educations || []).map(e => e.id === item.id ? item : e) });
            } else {
                onChange({ educations: [...(data.educations || []), { ...item, id: `edu-${Date.now()}` }] });
            }
        } else {
            if (item.id) {
                onChange({ experiences: (data.experiences || []).map(e => e.id === item.id ? item : e) });
            } else {
                onChange({ experiences: [...(data.experiences || []), { ...item, id: `exp-${Date.now()}` }] });
            }
        }
        setIsModalOpen(false);
    };

    const inputStyles = 'w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-0 focus:border-[#0b6459] transition';

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-gray-800">Education & Experience</h3>
                <p className="text-sm text-gray-500 mt-1">
                    Add your educational background and work experience (optional)
                </p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('education')}
                    className={`px-4 py-3 font-semibold text-sm border-b-2 transition ${activeTab === 'education'
                        ? 'border-[#0b6459] text-[#0b6459]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <HiAcademicCap className="w-5 h-5" />
                        Education ({(data.educations || []).length})
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('experience')}
                    className={`px-4 py-3 font-semibold text-sm border-b-2 transition ${activeTab === 'experience'
                        ? 'border-[#0b6459] text-[#0b6459]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <HiBriefcase className="w-5 h-5" />
                        Experience ({(data.experiences || []).length})
                    </div>
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {activeTab === 'education' ? (
                    <>
                        {(data.educations || []).map(edu => (
                            <div key={edu.id} className="bg-white rounded-lg p-4 border border-gray-200 group hover:shadow-sm transition">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-grow min-w-0">
                                        <h4 className="text-base font-semibold text-gray-800">{edu.title}</h4>
                                        <p className="text-sm text-gray-600 mt-0.5">{edu.institution}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                                            {edu.location && ` • ${edu.location}`}
                                        </p>
                                        {edu.description && (
                                            <p className="text-sm text-gray-600 mt-2">{edu.description}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <button
                                            onClick={() => handleEdit(edu, 'education')}
                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                            title="Edit"
                                        >
                                            <HiPencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(edu.id, 'education')}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                            title="Delete"
                                        >
                                            <HiTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(data.educations || []).length === 0 && (
                            <div className="text-center py-6 text-gray-400 text-sm">
                                No education added yet
                            </div>
                        )}
                        <button
                            onClick={() => handleAdd('education')}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-[#0b6459] hover:text-[#0b6459] transition font-medium text-sm"
                        >
                            <HiPlus className="w-4 h-4" />
                            Add Education
                        </button>
                    </>
                ) : (
                    <>
                        {(data.experiences || []).map(exp => (
                            <div key={exp.id} className="bg-white rounded-lg p-4 border border-gray-200 group hover:shadow-sm transition">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-grow min-w-0">
                                        <h4 className="text-base font-semibold text-gray-800">{exp.title}</h4>
                                        <p className="text-sm text-gray-600 mt-0.5">{exp.institution}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                                            {exp.location && ` • ${exp.location}`}
                                        </p>
                                        {exp.description && (
                                            <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <button
                                            onClick={() => handleEdit(exp, 'experience')}
                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                            title="Edit"
                                        >
                                            <HiPencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(exp.id, 'experience')}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                            title="Delete"
                                        >
                                            <HiTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(data.experiences || []).length === 0 && (
                            <div className="text-center py-6 text-gray-400 text-sm">
                                No experience added yet
                            </div>
                        )}
                        <button
                            onClick={() => handleAdd('experience')}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-[#0b6459] hover:text-[#0b6459] transition font-medium text-sm"
                        >
                            <HiPlus className="w-4 h-4" />
                            Add Experience
                        </button>
                    </>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <ItemModal
                    type={editingType}
                    item={editingItem}
                    onSave={handleSave}
                    onClose={() => setIsModalOpen(false)}
                    inputStyles={inputStyles}
                />
            )}
        </div>
    );
};

// Modal Component
const ItemModal: React.FC<{
    type: 'education' | 'experience';
    item: any;
    onSave: (item: any) => void;
    onClose: () => void;
    inputStyles: string;
}> = ({ type, item, onSave, onClose, inputStyles }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [formData, setFormData] = useState(item || {
        title: '',
        institution: '',
        startDate: '',
        endDate: '',
        location: '',
        timezone: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: item?.id });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                    <h3 className="text-xl font-bold text-gray-800">
                        {item ? 'Edit' : 'Add'} {type === 'education' ? 'Education' : 'Experience'}
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {type === 'education' ? 'Degree / Field of Study' : 'Job Title'} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className={inputStyles}
                            placeholder={type === 'education' ? 'e.g., Bachelor of Science in Mathematics' : 'e.g., Senior Math Teacher'}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {type === 'education' ? 'School / University' : 'Company / Organization'} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.institution}
                            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                            className={inputStyles}
                            placeholder={type === 'education' ? 'e.g., Harvard University' : 'e.g., ABC High School'}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className={inputStyles}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={formData.endDate || ''}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className={inputStyles}
                            />
                            <p className="text-xs text-gray-500 mt-1">Leave empty if current</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                        </label>
                        <input
                            type="text"
                            value={formData.location || ''}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className={inputStyles}
                            placeholder="e.g., Boston, MA"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Timezone
                        </label>
                        <CustomDropdown
                            options={commonUtils.getAllTimezones().map(tz => tz.name)}
                            selectedValue={formData.timezone || ''}
                            placeholder="Select timezone"
                            onSelect={(value) => setFormData({ ...formData, timezone: value })}
                            dropdownId="timezone"
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            hasSearch={true}
                            searchPlaceholder="Search timezone..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            rows={4}
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={inputStyles}
                            placeholder="Describe your achievements, responsibilities, or coursework..."
                        />
                    </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 px-6 pb-6 border-t border-gray-200 flex-shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 px-4 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition font-semibold"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EducationExperienceStep;
