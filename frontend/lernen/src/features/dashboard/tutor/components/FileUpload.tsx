import React, { useState, useEffect } from 'react';
import { HiCloudUpload, HiTrash } from 'react-icons/hi';

interface FileUploadProps {
    title?: string;
    description?: string;
    file: File | null;
    onFileChange: (file: File | null) => void;
    acceptedFileTypes: string;
    fileTypeDescription: string;
    icon: React.ReactNode;
}

const FileUpload: React.FC<FileUploadProps> = ({ title, description, file, onFileChange, acceptedFileTypes, fileTypeDescription, icon }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        let objectUrl: string | null = null;
        if (file && file.type.startsWith('image/')) {
            objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        } else {
            setPreviewUrl(null);
        }

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [file]);

    const handleFileChangeInternal = (files: FileList | null) => {
        if (files && files.length > 0) {
            onFileChange(files[0]);
        }
    };
    
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileChangeInternal(e.dataTransfer.files);
    };


    return (
        <div>
            {title && <h3 className="text-lg font-bold text-gray-800">{title}</h3>}
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            
            <div className={title || description ? 'mt-4' : ''}>
                { !file ? (
                    <div
                        onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
                        className={`flex flex-col items-center justify-center px-6 py-10 border-2 border-dashed rounded-md transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
                    >
                        <div className="mx-auto h-12 w-12 text-gray-400 bg-gray-100 rounded-lg flex items-center justify-center"><HiCloudUpload className="w-6 h-6" /></div>
                        <label htmlFor={`file-upload-${title?.replace(/\s/g, '-')}`} className="mt-4 relative cursor-pointer text-sm text-gray-600">
                            <span>Drop file here or </span>
                            <span className="font-semibold text-[#0b6459]">click to upload</span>
                            <input id={`file-upload-${title?.replace(/\s/g, '-')}`} type="file" accept={acceptedFileTypes} className="sr-only" onChange={(e) => handleFileChangeInternal(e.target.files)} />
                        </label>
                        <p className="mt-1 text-xs text-gray-500">{fileTypeDescription}</p>
                    </div>
                ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-10 h-10 flex-shrink-0 rounded-md object-cover" />
                                ) : (
                                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gray-200 rounded-md text-gray-500">{icon}</div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button type="button" onClick={() => onFileChange(null)} className="text-gray-400 hover:text-red-500 flex-shrink-0 ml-2"><HiTrash className="w-4 h-4" /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;