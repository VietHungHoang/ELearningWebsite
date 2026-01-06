import React, { useState, useRef } from 'react';
import { FiFolder, FiPlus, FiDownload, FiTrash, FiFile, FiVideo, FiArchive } from 'react-icons/fi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import type { ClassData } from '../../../../../../services/classService';
import { classService } from '../../../../../../services/classService';
import { uploadService } from '../../../../../../services/uploadService';
import Toast from '../../../../../../components/ui/Toast';
import { t } from 'i18next';
import { useAuth } from '../../../../../../context/AuthContext';

interface MaterialsTabProps {
    classData: ClassData;
    onUpdate?: () => void; // Callback to refresh data after changes
}

interface Material {
    id: string;
    name: string;
    type: string; // Changed to string to support more types from BE
    url?: string; // S3 URL
    s3Url?: string; // Mapped from BE response
    date?: string; // Display date
    uploadDate?: string; // Mapped from BE response
    size?: string;
    fileSize?: number; // Mapped from BE response
}

const MaterialsTab: React.FC<MaterialsTabProps> = ({ classData, onUpdate }) => {
    const { state } = useAuth();
    const isStudent = state.user?.role === 'student';

    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Map backend data to frontend model if necessary
    const mapMaterial = (m: any): Material => ({
        id: m.id,
        name: m.name,
        type: m.type,
        date: m.uploadDate || m.date,
        size: m.size || (m.fileSize ? formatFileSize(m.fileSize) : 'Unknown'),
        url: m.s3Url || m.url
    });

    // Use materials from classData, mockData removed
    const materials = classData?.materials?.map(mapMaterial) || [];

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset inputs
        setUploadError(null);
        setSuccessMessage(null);
        setIsUploading(true);

        try {
            // Determine file type category
            let fileType = 'Document';
            if (file.type.startsWith('image/')) fileType = 'Image';
            else if (file.type.startsWith('video/')) fileType = 'Video';
            else if (file.type.includes('pdf')) fileType = 'PDF';
            else if (file.type.includes('zip') || file.type.includes('compressed')) fileType = 'ZIP';

            // 1. Get Presigned URL
            let uploadInfo;
            if (fileType === 'Video') {
                uploadInfo = await uploadService.getPreSignedVideoUrl(file.type);
            } else {
                uploadInfo = await uploadService.getPreSignedUrl(file.type);
            }

            // 2. Upload to S3
            await uploadService.uploadFileToS3(uploadInfo.presignedUrl, file);

            // 3. Save metadata to backend
            const s3Url = uploadInfo.presignedUrl.split('?')[0];
            await classService.addMaterial(classData.id, {
                name: file.name,
                type: fileType,
                s3Url: s3Url,
                fileSize: file.size,
                description: `Uploaded on ${new Date().toLocaleDateString()}`
            });

            setSuccessMessage('Material uploaded successfully');
            if (onUpdate) onUpdate(); // Refresh list

        } catch (error: any) {
            console.error('Upload failed:', error);
            setUploadError(error.message || 'Failed to upload material');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (materialId: string) => {
        if (!window.confirm('Are you sure you want to delete this material?')) return;

        try {
            await classService.deleteMaterial(classData.id, materialId);
            setSuccessMessage('Material deleted successfully');
            if (onUpdate) onUpdate();
        } catch (error: any) {
            console.error('Delete failed:', error);
            setUploadError(error.message || 'Failed to delete material');
        }
    };

    const handleDownload = (name: string, url?: string) => {
        if (!url) return;

        // Create a temporary anchor to trigger download
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.download = name; // Hint filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getIconForType = (type: string) => {
        const t = type.toLowerCase();
        if (t.includes('pdf') || t.includes('document')) return <HiOutlineDocumentText />;
        if (t.includes('video')) return <FiVideo />;
        if (t.includes('zip') || t.includes('archive')) return <FiArchive />;
        return <FiFile />;
    };

    if (!classData) {
        return (
            <div className="bg-gray-50 rounded-xl overflow-hidden">
                <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400 mb-4">
                        <FiFolder />
                    </div>
                    <h4 className="text-gray-800 font-bold">{t('dashboard.tutor.myClass.detail.materialsTab.loading')}</h4>
                    <p className="text-gray-500 text-sm mt-1">{t('dashboard.tutor.myClass.detail.materialsTab.loadingDescription')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {uploadError && <Toast message={uploadError} type="error" onClose={() => setUploadError(null)} />}
            {successMessage && <Toast message={successMessage} type="success" onClose={() => setSuccessMessage(null)} />}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {t(`dashboard.tutor.myClass.detail.materialsTab.${isStudent ? 'student' : 'tutor'}.title`, { count: materials.length })}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {t(`dashboard.tutor.myClass.detail.materialsTab.${isStudent ? 'student' : 'tutor'}.description`)}
                    </p>
                </div>
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={handleUploadClick}
                        disabled={isUploading}
                        className={`flex items-center gap-2 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#094d44] transition-colors text-sm font-semibold ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isUploading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <FiPlus className="w-4 h-4" />
                                {t('dashboard.tutor.myClass.detail.materialsTab.tutor.uploadMaterial')}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Materials List */}
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                {materials && materials.length > 0 ? materials.map((material: Material) => (
                    <div key={material.id} className="p-5 hover:bg-gray-100 transition-colors bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-4 items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex-shrink-0 flex items-center justify-center border border-indigo-100 text-lg">
                                    {getIconForType(material.type)}
                                </div>
                                <div className="min-w-0">
                                    <a
                                        href={material.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-bold text-gray-800 truncate hover:text-[#0b6459] block"
                                    >
                                        {material.name}
                                    </a>
                                    <p className="text-xs text-gray-500">{material.type} • {material.size}</p>
                                </div>
                            </div>

                            <div className="hidden md:block text-sm text-gray-500">
                                {t('dashboard.tutor.myClass.detail.materialsTab.uploadedOn', { date: material.date })}
                            </div>

                            <div className="flex items-center gap-2 justify-end">
                                <button
                                    onClick={() => handleDownload(material.name, material.url)}
                                    className="p-2 text-gray-500 hover:text-[#0b6459] hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Download"
                                >
                                    <FiDownload />
                                </button>
                                <button
                                    onClick={() => handleDelete(material.id)}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <FiTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="p-12 text-center bg-white">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400 mb-4">
                            <FiFolder />
                        </div>
                        <h4 className="text-gray-800 font-bold">{t(`dashboard.tutor.myClass.detail.materialsTab.${isStudent ? 'student' : 'tutor'}.noMaterials`)}</h4>
                        <p className="text-gray-500 text-sm mt-1">{t(`dashboard.tutor.myClass.detail.materialsTab.${isStudent ? 'student' : 'tutor'}.noMaterialsDescription`)}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
export default MaterialsTab;