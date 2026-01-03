import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { HiUpload, HiDocumentText, HiX, HiExternalLink } from 'react-icons/hi';
import ModalLayout from '../../../../../components/ui/ModalLayout';
import { uploadService } from '../../../../../services/uploadService';
import type { ResumeItemData } from './ResumeHighlights';

interface ResumeItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<ResumeItemData, 'id'> & { id?: string }) => void;
    itemToEdit: ResumeItemData | null;
    sectionTitle: string;
}

const ResumeItemModal: React.FC<ResumeItemModalProps> = ({ isOpen, onClose, onSave, itemToEdit, sectionTitle }) => {
    const { t } = useTranslation();
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

    // File upload states (for certification)
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

    useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                setFormData(itemToEdit);
                // Initialize uploadedFile when editing existing certification
                if (isCertification && 'credentialUrl' in itemToEdit && itemToEdit.credentialUrl) {
                    const urlParts = itemToEdit.credentialUrl.split('/');
                    const fileName = urlParts[urlParts.length - 1] || 'certificate';
                    setUploadedFile({ name: fileName, size: 0 });
                }
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
                setUploadedFile(null);
            }
        }
    }, [isOpen, itemToEdit, isCertification]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
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
                setFormData((prev: any) => ({ ...prev, credentialUrl: finalUrl }));
                setUploadedFile({
                    name: selectedFile.name,
                    size: selectedFile.size,
                });
            } catch (error) {
                console.error('Failed to upload file:', error);
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
        setFormData((prev: any) => ({ ...prev, credentialUrl: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }
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

    const inputStyles = 'w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-gray-800 placeholder:text-gray-300 hover:bg-white hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-0 focus:border-[#0b6459] transition-all duration-500 ease-in-out';

    const getModalTitle = () => {
        if (isCertification) {
            return itemToEdit
                ? t('onboarding.certifications.modal.editCertification')
                : t('onboarding.certifications.modal.addCertification');
        }
        return itemToEdit
            ? (sectionTitle === 'Education'
                ? t('onboarding.educationExperience.modal.editEducation')
                : t('onboarding.educationExperience.modal.editExperience'))
            : (sectionTitle === 'Education'
                ? t('onboarding.educationExperience.modal.addEducation')
                : t('onboarding.educationExperience.modal.addExperience'));
    };

    return (
        <ModalLayout isOpen={isOpen} onClose={onClose} maxWidth="2xl" showCloseButton={true}>
            <div className="max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header - Fixed */}
                <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <h3 className="text-xl font-bold text-gray-800">
                        {getModalTitle()}
                    </h3>
                </div>

                {/* Content - Scrollable */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="px-6 py-4 space-y-4">
                        {isCertification ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('onboarding.certifications.modal.certificationName')} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleChange}
                                        placeholder={t('onboarding.certifications.modal.certificationNamePlaceholder')}
                                        className={inputStyles}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('onboarding.certifications.modal.issuingOrganization')} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="issuingOrganization"
                                        value={formData.issuingOrganization || ''}
                                        onChange={handleChange}
                                        placeholder={t('onboarding.certifications.modal.issuingOrganizationPlaceholder')}
                                        className={inputStyles}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('onboarding.certifications.modal.issueDate')} <span className="text-red-500">*</span>
                                        </label>
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('onboarding.certifications.modal.expirationDate')}
                                        </label>
                                        <input
                                            name="expirationDate"
                                            type="date"
                                            value={formData.expirationDate || ''}
                                            onChange={handleChange}
                                            className={inputStyles}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">{t('onboarding.certifications.modal.expirationDateHint')}</p>
                                    </div>
                                </div>

                                {/* Upload Certificate Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('onboarding.certifications.modal.uploadCertificate')}
                                    </label>
                                    {!uploadedFile ? (
                                        <div
                                            onClick={handleUploadAreaClick}
                                            className={`border border-dashed rounded-lg p-6 transition ${uploading
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
                                                            {formData.credentialUrl ? (
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
                                                            ) : (
                                                                <span className="text-sm font-medium text-gray-700 truncate">{uploadedFile.name}</span>
                                                            )}
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
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {sectionTitle === 'Education'
                                            ? t('onboarding.educationExperience.modal.degreeField')
                                            : t('onboarding.educationExperience.modal.jobTitle')} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="title"
                                        value={formData.title || ''}
                                        onChange={handleChange}
                                        placeholder={sectionTitle === 'Education'
                                            ? t('onboarding.educationExperience.modal.degreePlaceholder')
                                            : t('onboarding.educationExperience.modal.jobTitlePlaceholder')}
                                        className={inputStyles}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {sectionTitle === 'Education'
                                            ? t('onboarding.educationExperience.modal.schoolUniversity')
                                            : t('onboarding.educationExperience.modal.companyOrganization')} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="institution"
                                        value={formData.institution || ''}
                                        onChange={handleChange}
                                        placeholder={sectionTitle === 'Education'
                                            ? t('onboarding.educationExperience.modal.schoolPlaceholder')
                                            : t('onboarding.educationExperience.modal.companyPlaceholder')}
                                        className={inputStyles}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('onboarding.educationExperience.modal.startDate')} <span className="text-red-500">*</span>
                                        </label>
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                                            {t('onboarding.educationExperience.modal.endDate')}
                                            <div className="relative group">
                                                <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                                                    {t('onboarding.educationExperience.modal.endDateHint')}
                                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                                        <div className="border-4 border-transparent border-t-gray-800"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                        <input
                                            name="endDate"
                                            type="date"
                                            value={formData.endDate || ''}
                                            onChange={handleChange}
                                            className={inputStyles}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('onboarding.educationExperience.modal.location')}
                                    </label>
                                    <input
                                        name="location"
                                        value={formData.location || ''}
                                        onChange={handleChange}
                                        placeholder={t('onboarding.educationExperience.modal.locationPlaceholder')}
                                        className={inputStyles}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('onboarding.educationExperience.modal.description')}
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description || ''}
                                        onChange={handleChange}
                                        rows={3}
                                        className={`${inputStyles} resize-none`}
                                        placeholder={t('onboarding.educationExperience.modal.descriptionPlaceholder')}
                                    ></textarea>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                        >
                            {t('onboarding.educationExperience.modal.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 px-4 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition font-semibold"
                        >
                            {t('onboarding.educationExperience.modal.save')}
                        </button>
                    </div>
                </form>
            </div>
        </ModalLayout>
    );
};

export default ResumeItemModal;
