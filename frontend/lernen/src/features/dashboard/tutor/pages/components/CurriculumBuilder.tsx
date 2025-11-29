import React, { useState, useRef } from 'react';
import { HiMenu, HiPencil, HiTrash, HiPlus, HiVideoCamera, HiDocumentText } from 'react-icons/hi';
import type { CurriculumSectionData, Lecture } from '../CreateCoursePage';
import EditLessonModal from './VideoUploadModal';
import ConfirmationModal from '../../components/ConfirmationModal';

interface CurriculumBuilderProps {
    value: CurriculumSectionData[];
    onChange: (newCurriculum: CurriculumSectionData[]) => void;
}

const CurriculumBuilder: React.FC<CurriculumBuilderProps> = ({ value, onChange }) => {
    const [editingSection, setEditingSection] = useState<{ id: number; title: string } | null>(null);
    const [editingLecture, setEditingLecture] = useState<{ sectionId: number, lectureId: number; title: string } | null>(null);
    const [itemToDelete, setItemToDelete] = useState<{ type: 'section' | 'lecture'; sectionId: number; lectureId?: number } | null>(null);
    const [addLectureMenu, setAddLectureMenu] = useState<number | null>(null);
    const [lessonToEdit, setLessonToEdit] = useState<{ sectionId: number, lecture: Lecture } | null>(null);

    const dragItem = useRef<any>(null);
    const dragOverItem = useRef<any>(null);

    const handleAddSection = () => {
        const newSection: CurriculumSectionData = {
            id: Date.now(),
            title: `New Section ${value.length + 1}`,
            lectures: [],
        };
        onChange([...value, newSection]);
    };

    const handleUpdateSectionTitle = (sectionId: number, newTitle: string) => {
        const newCurriculum = value.map(s => s.id === sectionId ? { ...s, title: newTitle } : s);
        onChange(newCurriculum);
    };
    
    const handleUpdateLectureTitle = (sectionId: number, lectureId: number, newTitle: string) => {
        const newCurriculum = value.map(s => {
            if (s.id === sectionId) {
                const newLectures = s.lectures.map(l => l.id === lectureId ? { ...l, title: newTitle } : l);
                return { ...s, lectures: newLectures };
            }
            return s;
        });
        onChange(newCurriculum);
    };

    const handleAddLecture = (sectionId: number, type: 'video' | 'article') => {
        const newLecture: Lecture = {
            id: Date.now(),
            title: `New ${type === 'video' ? 'Video' : 'Article'}`,
            type: type,
        };
        // We update the state first to get the new lecture into the list
        const newCurriculum = value.map(s => {
            if (s.id === sectionId) {
                return { ...s, lectures: [...s.lectures, newLecture] };
            }
            return s;
        });
        onChange(newCurriculum);
        setAddLectureMenu(null);
        // Then we open the modal to edit this newly created lecture
        setLessonToEdit({ sectionId, lecture: newLecture });
    };
    
    const handleConfirmDelete = () => {
        if (!itemToDelete) return;
        let newCurriculum;
        if (itemToDelete.type === 'section') {
            newCurriculum = value.filter(s => s.id !== itemToDelete.sectionId);
        } else {
            newCurriculum = value.map(s => {
                if (s.id === itemToDelete.sectionId) {
                    const newLectures = s.lectures.filter(l => l.id !== itemToDelete.lectureId);
                    return { ...s, lectures: newLectures };
                }
                return s;
            });
        }
        onChange(newCurriculum);
        setItemToDelete(null);
    };
    
    const handleSaveLesson = (updates: { title: string, videoFile?: File, articleContent?: string }) => {
        if (!lessonToEdit) return;

        const { sectionId, lecture } = lessonToEdit;

        const newCurriculum = value.map(s => {
            if (s.id === sectionId) {
                const newLectures = s.lectures.map(l => {
                    if (l.id === lecture.id) {
                        return {
                            ...l,
                            title: updates.title,
                            videoFileName: updates.videoFile ? updates.videoFile.name : l.videoFileName,
                            articleContent: updates.articleContent !== undefined ? updates.articleContent : l.articleContent,
                        };
                    }
                    return l;
                });
                return { ...s, lectures: newLectures };
            }
            return s;
        });

        onChange(newCurriculum);
        setLessonToEdit(null); // Close modal
    };


    // Drag and Drop Handlers
    const handleSectionDragSort = () => {
        if (!dragOverItem.current || dragItem.current.type !== 'section' || dragOverItem.current.type !== 'section') return;
        const curriculumClone = [...value];
        const draggedItemContent = curriculumClone.splice(dragItem.current.index, 1)[0];
        curriculumClone.splice(dragOverItem.current.index, 0, draggedItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        onChange(curriculumClone);
    };
    
    const handleLectureDragSort = () => {
        if (!dragOverItem.current || dragItem.current.type !== 'lecture' || dragOverItem.current.type !== 'lecture') return;
        const curriculumClone = [...value];
        const section = curriculumClone.find(s => s.id === dragItem.current.sectionId);
        if (!section || dragItem.current.sectionId !== dragOverItem.current.sectionId) {
             dragItem.current = null;
             dragOverItem.current = null;
             return;
        }

        const lecturesClone = [...section.lectures];
        const draggedItemContent = lecturesClone.splice(dragItem.current.index, 1)[0];
        lecturesClone.splice(dragOverItem.current.index, 0, draggedItemContent);
        
        const newCurriculum = curriculumClone.map(s => s.id === section.id ? { ...s, lectures: lecturesClone } : s);
        dragItem.current = null;
        dragOverItem.current = null;
        onChange(newCurriculum);
    };

    return (
        <div>
            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleConfirmDelete}
                title={`Delete ${itemToDelete?.type}`}
                message={`Are you sure you want to delete this ${itemToDelete?.type}? This action cannot be undone.`}
            />
            <EditLessonModal
                isOpen={!!lessonToEdit}
                onClose={() => setLessonToEdit(null)}
                onSave={handleSaveLesson}
                lecture={lessonToEdit?.lecture || null}
            />

            <p className="text-sm text-gray-500 mb-6">Structure your course content by adding sections and lectures.</p>
            <div className="space-y-4">
                {value.map((section, sectionIndex) => (
                    <div 
                        key={section.id} 
                        className="bg-gray-50/70 border border-gray-200/80 rounded-lg"
                        draggable
                        onDragStart={() => dragItem.current = { type: 'section', index: sectionIndex }}
                        onDragEnter={() => {
                            if (dragItem.current?.type === 'lecture') return;
                            dragOverItem.current = { type: 'section', index: sectionIndex };
                        }}
                        onDragEnd={handleSectionDragSort}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        {/* Section Header */}
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 hover:text-gray-600 cursor-grab"><HiMenu className="w-4 h-4" /></span>
                                {editingSection && editingSection?.id === section.id ? (
                                    <input
                                        type="text"
                                        value={editingSection.title}
                                        onChange={(e) => setEditingSection({...editingSection, title: e.target.value})}
                                        onBlur={() => { handleUpdateSectionTitle(section.id, editingSection.title); setEditingSection(null); }}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { handleUpdateSectionTitle(section.id, editingSection.title); setEditingSection(null); }}}
                                        autoFocus
                                        className="font-bold text-gray-800 bg-white border border-gray-300 rounded-md px-2 py-1"
                                    />
                                ) : (
                                    <h3 className="font-bold text-gray-800">{section.title}</h3>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setEditingSection({id: section.id, title: section.title})} className="p-1.5 text-gray-500 hover:text-gray-800 rounded-md hover:bg-gray-200"><HiPencil className="w-4 h-4" /></button>
                                <button onClick={() => setItemToDelete({type: 'section', sectionId: section.id})} className="p-1.5 text-gray-500 hover:text-red-600 rounded-md hover:bg-red-100"><HiTrash className="w-4 h-4" /></button>
                            </div>
                        </div>
                        {/* Lectures */}
                        <div className="pl-12 pr-4 pb-4 space-y-2">
                            {section.lectures.map((lecture: any, lectureIndex: any) => (
                                <div 
                                    key={lecture.id} 
                                    className="bg-white border border-gray-200 rounded-md p-3 flex items-center justify-between"
                                    draggable
                                    onDragStart={(e) => { e.stopPropagation(); dragItem.current = { type: 'lecture', sectionId: section.id, index: lectureIndex }; }}
                                    onDragEnter={(e) => { e.stopPropagation(); dragOverItem.current = { type: 'lecture', sectionId: section.id, index: lectureIndex }; }}
                                    onDragEnd={(e) => { e.stopPropagation(); handleLectureDragSort(); }}
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                >
                                     <div className="flex items-center gap-3 flex-grow min-w-0">
                                        <span className="text-gray-400 hover:text-gray-600 cursor-grab"><HiMenu className="w-4 h-4" /></span>
                                        <div className="text-gray-500 flex-shrink-0">{lecture.type === 'video' ? <HiVideoCamera className="w-4 h-4" /> : <HiDocumentText className="w-4 h-4" />}</div>
                                        {editingLecture && editingLecture?.lectureId === lecture.id ? (
                                             <input
                                                type="text"
                                                value={editingLecture.title}
                                                onChange={(e) => setEditingLecture({...editingLecture, title: e.target.value})}
                                                onBlur={() => { handleUpdateLectureTitle(section.id, lecture.id, editingLecture.title); setEditingLecture(null); }}
                                                onKeyDown={(e) => { if (e.key === 'Enter') { handleUpdateLectureTitle(section.id, lecture.id, editingLecture.title); setEditingLecture(null); }}}
                                                autoFocus
                                                className="text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md px-2 py-0.5"
                                            />
                                        ) : (
                                            <div className="flex-grow min-w-0">
                                                <p onClick={() => setEditingLecture({ sectionId: section.id, lectureId: lecture.id, title: lecture.title })} className="text-sm font-medium text-gray-700 truncate cursor-pointer">{lecture.title}</p>
                                                {lecture?.type === 'video' && lecture.videoFileName && (
                                                    <p className="text-xs text-gray-500 truncate mt-1">{lecture.videoFileName}</p>
                                                )}
                                                {lecture?.type === 'article' && lecture.articleContent && (
                                                    <p className="text-xs text-gray-500 mt-1">Content added</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                        <button onClick={() => setLessonToEdit({ sectionId: section.id, lecture: lecture })} className="p-1.5 text-gray-500 hover:text-gray-800 rounded-md hover:bg-gray-200"><HiPencil className="w-4 h-4" /></button>
                                        <button onClick={() => setItemToDelete({ type: 'lecture', sectionId: section.id, lectureId: lecture.id })} className="p-1.5 text-gray-500 hover:text-red-600 rounded-md hover:bg-red-100"><HiTrash className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                             <div className="relative">
                                <button onClick={() => setAddLectureMenu(addLectureMenu === section.id ? null : section.id)} className="flex items-center gap-2 text-sm font-semibold text-[#0b6459] hover:text-[#084c43] pt-2">
                                    <HiPlus className="w-4 h-4" /> Add Lecture
                                </button>
                                {addLectureMenu === section.id && (
                                    <div className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-2 space-y-1 w-40">
                                        <button onClick={() => handleAddLecture(section.id, 'video')} className="w-full flex items-center gap-2 text-left p-2 rounded-md hover:bg-gray-100 text-sm">
                                            <HiVideoCamera className="w-4 h-4" /> Video
                                        </button>
                                        <button onClick={() => handleAddLecture(section.id, 'article')} className="w-full flex items-center gap-2 text-left p-2 rounded-md hover:bg-gray-100 text-sm">
                                            <HiDocumentText className="w-4 h-4" /> Article
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={handleAddSection} className="mt-6 flex items-center gap-2 text-sm font-semibold text-white bg-[#0b6459] px-4 py-2.5 rounded-lg hover:bg-[#084c43] transition-colors">
                <HiPlus className="w-4 h-4" /> Add Section
            </button>
        </div>
    );
};

export default CurriculumBuilder;