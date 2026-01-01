import React, { useState, useRef } from 'react';
import { HiPlus, HiPencil, HiTrash, HiDocumentText, HiUpload, HiX, HiExternalLink } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { uploadService } from '../../../../services/uploadService';
import type { TutorOnboardingData, CertificationItem } from '../../../../types/tutor';

interface CertificationsStepProps {
    data: Partial<TutorOnboardingData>;
    onChange: (data: Partial<TutorOnboardingData>) => void;
}

const CertificationsStep: React.FC<CertificationsStepProps> = ({ data, onChange }) => {
    const { t } = useTranslation();
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
        onChange({ certifications: (data.certifications || []).filter((c: CertificationItem) => c.id !== id) });
    };

    const handleSave = (cert: CertificationItem) => {
        if (cert.id) {
            onChange({ certifications: (data.certifications || []).map((c: CertificationItem) => c.id === cert.id ? cert : c) });
        } else {
            onChange({ certifications: [...(data.certifications || []), { ...cert, id: `cert-${Date.now()}` }] });
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">

            <div className="space-y-3">
                {(data.certifications || []).map((cert: CertificationItem) => (
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
                                    </div>
                                    {cert.credentialUrl && (
                                        <HiDocumentText className="w-5 h-5 text-[#0b6459] flex-shrink-0" title={t('onboarding.certifications.certificateAttached')} />
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                    onClick={() => handleEdit(cert)}
                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                    title={t('onboarding.educationExperience.edit')}
                                >
                                    <HiPencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(cert.id!)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                    title={t('onboarding.educationExperience.delete')}
                                >
                                    <HiTrash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {(data.certifications || []).length === 0 && (
                    <div className="text-center py-6 text-gray-400 text-sm">
                        {t('onboarding.certifications.noCertifications')}
                    </div>
                )}

                <button
                    onClick={handleAdd}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-[#0b6459] hover:text-[#0b6459] transition font-medium text-sm"
                >
                    <HiPlus className="w-4 h-4" />
                    {t('onboarding.certifications.addCertification')}
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
    const { t } = useTranslation();
    const [formData, setFormData] = useState<CertificationItem>(certification || {
        id: '',
        name: '',
        issuingOrganization: '',
        issueDate: '',
        expirationDate: '',
        credentialUrl: '',
    });
    const [uploading, setUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Format file size helper
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setUploading(true);
            try {
                // Get pre-signed URL
                const { presignedUrl, finalUrl } = await uploadService.getPreSignedUrl(selectedFile.type);

                // Upload to S3
                await uploadService.uploadFileToS3(presignedUrl, selectedFile);

                // Update formData with finalUrl and save file info
                setFormData({ ...formData, credentialUrl: finalUrl });
                setUploadedFile({
                    name: selectedFile.name,
                    size: selectedFile.size,
                });
            } catch (error) {
                console.error('Failed to upload file:', error);
                // Handle error, maybe show toast
            } finally {
                setUploading(false);
            }
        }
    };

    const handleUploadAreaClick = () => {
        if (!uploading && !uploadedFile) {
            fileInputRef.current?.click();
        }
    };

    const handleRemoveFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setUploadedFile(null);
        setFormData({ ...formData, credentialUrl: '' });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Initialize uploadedFile when editing existing certification
    React.useEffect(() => {
        if (certification?.credentialUrl && !uploadedFile) {
            // If editing and has credentialUrl, we don't have file info
            // So we'll show a placeholder or extract from URL
            const urlParts = certification.credentialUrl.split('/');
            const fileName = urlParts[urlParts.length - 1] || 'certificate';
            setUploadedFile({
                name: fileName,
                size: 0, // Unknown size when editing
            });
        } else if (!certification && uploadedFile) {
            // Reset when adding new certification
            setUploadedFile(null);
        }
    }, [certification]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const inputStyles = 'w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-gray-800 placeholder:text-gray-400 placeholder:font-thin hover:bg-white hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-0 focus:border-[#0b6459] transition-all duration-500 ease-in-out';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                    <h3 className="text-xl font-bold text-gray-800">
                        {certification ? t('onboarding.certifications.modal.editCertification') : t('onboarding.certifications.modal.addCertification')}
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('onboarding.certifications.modal.certificationName')} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={inputStyles}
                            placeholder={t('onboarding.certifications.modal.certificationNamePlaceholder')}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('onboarding.certifications.modal.issuingOrganization')} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.issuingOrganization}
                            onChange={(e) => setFormData({ ...formData, issuingOrganization: e.target.value })}
                            className={inputStyles}
                            placeholder={t('onboarding.certifications.modal.issuingOrganizationPlaceholder')}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('onboarding.certifications.modal.issueDate')} <span className="text-red-500">*</span>
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
                                {t('onboarding.certifications.modal.expirationDate')}
                            </label>
                            <input
                                type="date"
                                value={formData.expirationDate || ''}
                                onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                                className={inputStyles}
                            />
                            <p className="text-xs text-gray-500 mt-1">{t('onboarding.certifications.modal.expirationDateHint')}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('onboarding.certifications.modal.uploadCertificate')}
                        </label>
                        {!uploadedFile ? (
                            <div 
                                onClick={handleUploadAreaClick}
                                className={`border border-dashed rounded-lg p-6 transition ${
                                    uploading 
                                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                                        : 'border-gray-300 hover:border-[#0b6459] cursor-pointer'
                                }`}
                            >
                                <div className="flex flex-col items-center">
                                    {uploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#0b6459] border-t-transparent mb-3"></div>
                                            <span className="text-sm font-semibold text-[#0b6459]">
                                                {t('onboarding.certifications.modal.uploading')}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <HiUpload className="w-12 h-12 text-gray-400 mb-3" />
                                            <span className="text-sm font-semibold text-[#0b6459] hover:text-[#084c43]">
                                                {t('onboarding.certifications.modal.chooseFile')}
                                            </span>
                                        </>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                    {!uploading && (
                                        <p className="text-xs text-gray-500 mt-2">{t('onboarding.certifications.modal.fileFormat')}</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="border border-[#0b6459] rounded-lg p-4 bg-green-50">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 flex-grow min-w-0">
                                        <HiDocumentText className="w-8 h-8 text-[#0b6459] flex-shrink-0" />
                                        <div className="flex-grow min-w-0">
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={formData.credentialUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-medium text-[#0b6459] hover:text-[#084c43] hover:underline truncate flex items-center gap-1.5"
                                                    title={uploadedFile.name}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <span className="truncate">{uploadedFile.name}</span>
                                                    <HiExternalLink className="w-4 h-4 flex-shrink-0" />
                                                </a>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {uploadedFile.size > 0 ? formatFileSize(uploadedFile.size) : t('onboarding.certifications.modal.fileUploaded')}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition flex-shrink-0"
                                        title={t('onboarding.certifications.modal.removeFile')}
                                    >
                                        <HiX className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 px-6 pb-6 border-t border-gray-200 flex-shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                        >
                            {t('onboarding.certifications.modal.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 px-4 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition font-semibold"
                        >
                            {t('onboarding.certifications.modal.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CertificationsStep;
