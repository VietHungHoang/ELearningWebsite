import React, { useState, useEffect } from 'react';
import { HiX, HiCloudUpload, HiVideoCamera, HiTrash, HiChevronDown } from 'react-icons/hi';
import type { Lecture } from '../pages/CreateCoursePage';

interface EditLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: { title: string, videoFile?: File, articleContent?: string }) => void;
  lecture: Lecture | null;
}

const EditLessonModal: React.FC<EditLessonModalProps> = ({ isOpen, onClose, onSave, lecture }) => {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [title, setTitle] = useState('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [existingVideoFileName, setExistingVideoFileName] = useState<string | undefined>(undefined);
    const [articleContent, setArticleContent] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    
    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            if (lecture) {
                setTitle(lecture.title);
                if (lecture.type === 'video') {
                    setExistingVideoFileName(lecture.videoFileName);
                    setVideoFile(null); // Reset file input
                } else if (lecture.type === 'article') {
                    setArticleContent(lecture.articleContent || '');
                }
            }
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => {
                setShouldRender(false);
                document.body.style.overflow = 'auto';
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen, lecture]);

    if (!shouldRender || !lecture) return null;

    const handleFileChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            if (files[0].type.startsWith('video/')) {
                setVideoFile(files[0]);
                setExistingVideoFileName(undefined); // Clear existing file name when new one is selected
            } else {
                alert('Please select a valid video file.');
            }
        }
    };
    
    // Drag and drop handlers
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    };

    const handleSaveClick = () => {
        onSave({ title, videoFile: videoFile || undefined, articleContent });
    };

    const renderContentEditor = () => {
        if (lecture.type === 'video') {
            return (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Video</label>
                    { !videoFile && !existingVideoFileName ? (
                        <div
                            onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
                            className={`flex flex-col items-center justify-center px-6 py-10 border-2 border-dashed rounded-md transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
                        >
                            <div className="mx-auto h-12 w-12 text-gray-400 bg-gray-100 rounded-lg flex items-center justify-center"><HiCloudUpload className="w-6 h-6" /></div>
                            <label htmlFor="file-upload" className="mt-4 relative cursor-pointer text-sm text-gray-600">
                                <span>Drop a video here or </span>
                                <span className="font-semibold text-[#0b6459]">click here to browse</span>
                                <input id="file-upload" type="file" accept="video/*" className="sr-only" onChange={(e) => handleFileChange(e.target.files)} />
                            </label>
                            <p className="mt-1 text-xs text-gray-500">MP4, MOV, AVI up to 1GB</p>
                        </div>
                    ) : (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gray-200 rounded-md text-gray-500"><HiVideoCamera className="w-5 h-5" /></div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-700 truncate">{videoFile?.name || existingVideoFileName}</p>
                                        {videoFile && <p className="text-xs text-gray-500">{Math.round(videoFile.size / 1024 / 1024)} MB</p>}
                                    </div>
                                </div>
                                <button type="button" onClick={() => { setVideoFile(null); setExistingVideoFileName(undefined); }} className="text-gray-400 hover:text-red-500 flex-shrink-0 ml-2"><HiTrash className="w-4 h-4" /></button>
                            </div>
                        </div>
                    )}
                </div>
            );
        } else if (lecture.type === 'article') {
            return (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Article Content</label>
                    <div className="border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4 p-3 border-b border-gray-200 bg-gray-50">
                            {/* Dummy toolbar */}
                            <button type="button" className="font-bold p-1 rounded hover:bg-gray-200 text-sm">B</button>
                            <button type="button" className="italic p-1 rounded hover:bg-gray-200 text-sm">I</button>
                            <button type="button" className="underline p-1 rounded hover:bg-gray-200 text-sm">U</button>
                            <button type="button" className="flex items-center gap-1 text-sm p-1 rounded hover:bg-gray-200">Paragraph <HiChevronDown className="w-4 h-4" /></button>
                            <button type="button" className="p-1 rounded hover:bg-gray-200 text-sm">•</button>
                            <button type="button" className="p-1 rounded hover:bg-gray-200 text-sm">1.</button>
                        </div>
                        <textarea 
                            rows={10}
                            placeholder="Write your article content here..."
                            value={articleContent}
                            onChange={e => setArticleContent(e.target.value)}
                            className="w-full p-4 focus:outline-none resize-vertical text-sm leading-relaxed"
                        ></textarea>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div 
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'bg-black/50 opacity-100' : 'opacity-0'}`}
            onClick={onClose}
        >
            <div 
                className={`bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h2 className="font-bold text-lg text-gray-800">Edit Lesson</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"><HiX className="w-5 h-5" /></button>
                </div>
                
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-0 focus:border-[#0b6459] transition"
                        />
                    </div>
                    {renderContentEditor()}
                </div>

                <div className="flex justify-end items-center gap-3 p-4 bg-gray-50 border-t border-gray-100">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
                    <button onClick={handleSaveClick} className="px-5 py-2.5 text-sm font-semibold bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43]">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default EditLessonModal;
