import React, { useState } from 'react';
import { HiPlus, HiPencil, HiTrash, HiDocumentText, HiUpload } from 'react-icons/hi';

interface CertificationWithFile {
    id?: string;
    name: string;
    issuingOrganization: string;
    issueDate: string;
    expirationDate?: string;
    credentialId?: string;
    credentialUrl?: string;
    file?: File;
    fileUrl?: string;
}

interface CertificationsStepProps {
    data: {
        certifications: CertificationWithFile[];
    };
    onChange: (data: { certifications: CertificationWithFile[] }) => void;
}

const CertificationsStep: React.FC<CertificationsStepProps> = ({ data, onChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCert, setEditingCert] = useState<CertificationWithFile | null>(null);

    const handleAdd = () => {
        setEditingCert(null);
        setIsModalOpen(true);
    };

    const handleEdit = (cert: CertificationWithFile) => {
        setEditingCert(cert);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        onChange({ certifications: data.certifications.filter(c => c.id !== id) });
    };

    const handleSave = (cert: CertificationWithFile) => {
        if (cert.id) {
            onChange({ certifications: data.certifications.map(c => c.id === cert.id ? cert : c) });
        } else {
            onChange({ certifications: [...data.certifications, { ...cert, id: `cert-${Date.now()}` }] });
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-gray-800">Certifications & Awards</h3>
                <p className="text-sm text-gray-500 mt-1">
                    Showcase your professional qualifications and achievements (optional)
                </p>
            </div>

            <div className="space-y-3">
                {data.certifications.map(cert => (
                    <div key={cert.id} className="bg-white rounded-lg p-4 border border-gray-200 group hover:shadow-sm transition">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-grow min-w-0">
                                <div className="flex items-start gap-2">
                                    <div className="flex-grow">
                                        <h4 className="text-base font-semibold text-gray-800">{cert.name}</h4>
                                        <p className="text-sm text-gray-600 mt-0.5">{cert.issuingOrganization}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(cert.issueDate).getFullYear()}
                                            {cert.expirationDate && ` - ${new Date(cert.expirationDate).getFullYear()}`}
                                        </p>
                                        {cert.credentialId && (
                                            <p className="text-xs text-gray-400 mt-1">ID: {cert.credentialId}</p>
                                        )}
                                    </div>
                                    {(cert.file || cert.fileUrl) && (
                                        <HiDocumentText className="w-5 h-5 text-[#0b6459] flex-shrink-0" title="Certificate attached" />
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                    onClick={() => handleEdit(cert)}
                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                    title="Edit"
                                >
                                    <HiPencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(cert.id!)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                    title="Delete"
                                >
                                    <HiTrash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {data.certifications.length === 0 && (
                    <div className="text-center py-6 text-gray-400 text-sm">
                        No certifications added yet
                    </div>
                )}

                <button
                    onClick={handleAdd}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-[#0b6459] hover:text-[#0b6459] transition font-medium text-sm"
                >
                    <HiPlus className="w-4 h-4" />
                    Add Certification
                </button>
            </div>

            {isModalOpen && (
                <CertModal
                    certification={editingCert}
                    onSave={handleSave}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

// Modal Component
const CertModal: React.FC<{
    certification: CertificationWithFile | null;
    onSave: (cert: CertificationWithFile) => void;
    onClose: () => void;
}> = ({ certification, onSave, onClose }) => {
    const [formData, setFormData] = useState<CertificationWithFile>(certification || {
        name: '',
        issuingOrganization: '',
        issueDate: '',
        expirationDate: '',
        credentialId: '',
        credentialUrl: '',
    });
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
        if (e.currentTarget.files && e.currentTarget.files[0]) {
            setFile(e.currentTarget.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, file: file || formData.file });
    };

    const inputStyles = 'w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-0 focus:border-[#0b6459] transition';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                    <h3 className="text-xl font-bold text-gray-800">
                        {certification ? 'Edit Certification' : 'Add Certification'}
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Certification Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={inputStyles}
                            placeholder="e.g., TEFL Certificate, Certified Math Teacher"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Issuing Organization <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.issuingOrganization}
                            onChange={(e) => setFormData({ ...formData, issuingOrganization: e.target.value })}
                            className={inputStyles}
                            placeholder="e.g., International TEFL Academy"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Issue Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.issueDate}
                                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                                className={inputStyles}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expiration Date
                            </label>
                            <input
                                type="date"
                                value={formData.expirationDate || ''}
                                onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                                className={inputStyles}
                            />
                            <p className="text-xs text-gray-500 mt-1">Leave empty if no expiration</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Credential ID / License Number
                        </label>
                        <input
                            type="text"
                            value={formData.credentialId || ''}
                            onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                            className={inputStyles}
                            placeholder="Certificate ID or license number"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Credential URL
                        </label>
                        <input
                            type="url"
                            value={formData.credentialUrl || ''}
                            onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                            className={inputStyles}
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Certificate Document
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#0b6459] transition">
                            <div className="flex flex-col items-center">
                                <HiUpload className="w-12 h-12 text-gray-400 mb-3" />
                                <label className="cursor-pointer">
                                    <span className="text-sm font-semibold text-[#0b6459] hover:text-[#084c43]">
                                        Choose file
                                    </span>
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                                <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG (max 5MB)</p>
                                {file && (
                                    <p className="text-sm text-[#0b6459] font-medium mt-3">✓ {file.name}</p>
                                )}
                            </div>
                        </div>
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

export default CertificationsStep;
