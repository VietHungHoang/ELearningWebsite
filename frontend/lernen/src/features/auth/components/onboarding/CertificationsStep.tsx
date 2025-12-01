import React, { useState } from 'react';
import { HiPlus, HiPencil, HiTrash, HiDocumentText, HiUpload } from 'react-icons/hi';
import { uploadService } from '../../../../services/uploadService';
import type { Tutor, CertificationItem } from '../../../../types/api.ts';

interface CertificationsStepProps {
    data: Partial<Tutor>;
    onChange: (data: Partial<Tutor>) => void;
}

const CertificationsStep: React.FC<CertificationsStepProps> = ({ data, onChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCert, setEditingCert] = useState<CertificationItem | null>(null);

    const handleAdd = () => {
        setEditingCert(null);
        setIsModalOpen(true);
    };

    const handleEdit = (cert: CertificationItem) => {
        setEditingCert(cert);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        onChange({ certifications: (data.certifications || []).filter(c => c.id !== id) });
    };

    const handleSave = (cert: CertificationItem) => {
        if (cert.id) {
            onChange({ certifications: (data.certifications || []).map(c => c.id === cert.id ? cert : c) });
        } else {
            onChange({ certifications: [...(data.certifications || []), { ...cert, id: `cert-${Date.now()}` }] });
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
                {(data.certifications || []).map(cert => (
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
                                    {cert.credentialUrl && (
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

                {(data.certifications || []).length === 0 && (
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
    certification: CertificationItem | null;
    onSave: (cert: CertificationItem) => void;
    onClose: () => void;
}> = ({ certification, onSave, onClose }) => {
    const [formData, setFormData] = useState<CertificationItem>(certification || {
        id: '',
        name: '',
        issuingOrganization: '',
        issueDate: '',
        expirationDate: '',
        credentialId: '',
        credentialUrl: '',
    });
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.FormEvent<HTMLInputElement>) => {
        const selectedFile = e.currentTarget.files?.[0];
        if (selectedFile) {
            setUploading(true);
            try {
                // Get pre-signed URL
                const { uploadUrl, fileUrl } = await uploadService.getPreSignedUrl(selectedFile.name, selectedFile.type);

                // Upload to S3
                await uploadService.uploadFileToS3(uploadUrl, selectedFile);

                // Update formData with fileUrl
                setFormData({ ...formData, credentialUrl: fileUrl });
            } catch (error) {
                console.error('Failed to upload file:', error);
                // Handle error, maybe show toast
            } finally {
                setUploading(false);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const inputStyles = 'w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-0 focus:border-[#0b6459] transition';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800">
                        {certification ? 'Edit Certification' : 'Add Certification'}
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                                        {uploading ? 'Uploading...' : 'Choose file'}
                                    </span>
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                </label>
                                <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG (max 5MB)</p>
                                {formData.credentialUrl && (
                                    <p className="text-sm text-[#0b6459] font-medium mt-3">✓ File uploaded</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
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
