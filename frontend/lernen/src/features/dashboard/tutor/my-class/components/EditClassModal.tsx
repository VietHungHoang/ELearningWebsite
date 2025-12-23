import React, { useState, useEffect } from 'react';
import ModalLayout from '../../../../../components/ui/ModalLayout';
import CustomDropdown2 from '../../../../../components/ui/CustomDropdown2';

interface Schedule {
    day: string;
    time: string;
}

interface EditClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (classData: ClassFormData) => void;
    classData: ClassData | null;
}

export interface ClassFormData {
    classTitle: string;
    subject: string;
    category: string;
    tuitionFee: number;
    maxStudents: number;
    description: string;
    schedules: Schedule[];
}

export interface ClassData {
    id: string;
    classTitle: string;
    students: StudentInfo[];
    type: ClassType;
    status: ClassStatus;
    schedules: Schedule[];
    startDate: string;
    completedSessions: number;
    totalSessions: number;
    quizzes: { id: string; title: string; status: 'Completed' | 'Pending' }[];
    materials: { id: string; name: string; type: 'PDF' | 'Video' | 'ZIP'; date: string }[];
    subject?: string;
    category?: string;
    tuitionFee?: number;
    description?: string;
}

export type ClassType = '1-on-1' | 'Group';
export type ClassStatus = 'Ongoing' | 'Opening' | 'Completed';

export interface StudentInfo {
    id: string;
    name: string;
    avatar: string;
}

const EditClassModal: React.FC<EditClassModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    classData
}) => {
    const [formData, setFormData] = useState<ClassFormData>({
        classTitle: '',
        subject: '',
        category: '',
        tuitionFee: 0,
        maxStudents: 1,
        description: '',
        schedules: [{ day: '', time: '' }]
    });

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [showConfirmClose, setShowConfirmClose] = useState(false);
    const [shouldRenderConfirm, setShouldRenderConfirm] = useState(false);
    const [isAnimatingConfirm, setIsAnimatingConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Pre-fill form when classData changes
    useEffect(() => {
        if (classData) {
            setFormData({
                classTitle: classData.classTitle,
                subject: classData.subject || '',
                category: classData.category || '',
                tuitionFee: classData.tuitionFee || 0,
                maxStudents: classData.students.length || 1,
                description: classData.description || '',
                schedules: classData.schedules.length > 0 ? classData.schedules : [{ day: '', time: '' }]
            });
            setIsEditing(false); // Reset to view mode when new class data is loaded
        }
    }, [classData]);

    // Animation effect for confirmation modal
    useEffect(() => {
        if (showConfirmClose) {
            setShouldRenderConfirm(true);
            // Delay để browser có thời gian render DOM trước khi trigger animation
            setTimeout(() => {
                setIsAnimatingConfirm(true);
            }, 10);
        } else {
            setIsAnimatingConfirm(false);
            const timer = setTimeout(() => {
                setShouldRenderConfirm(false);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [showConfirmClose]);

    // Check if any form data has been entered
    const hasFormData = () => {
        return (
            formData.classTitle.trim() !== '' ||
            formData.subject !== '' ||
            formData.category !== '' ||
            formData.tuitionFee !== 0 ||
            formData.maxStudents > 1 ||
            formData.description.trim() !== '' ||
            formData.schedules.some(schedule => schedule.day !== '' || schedule.time !== '')
        );
    };

    // Check if all required fields are filled
    const isFormValid = () => {
        const hasValidTitle = formData.classTitle.trim() !== '';
        const hasValidSubject = formData.subject !== '';
        const hasValidFee = formData.tuitionFee >= 0;
        const hasValidStudents = formData.maxStudents >= 1;
        const hasValidDescription = formData.description.trim() !== '';
        const hasValidSchedule = formData.schedules.some(schedule => schedule.day !== '' && schedule.time !== '');

        return hasValidTitle && hasValidSubject && hasValidFee && hasValidStudents && hasValidDescription && hasValidSchedule;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        // Reset form
        setFormData({
            classTitle: '',
            subject: '',
            category: '',
            tuitionFee: 0,
            maxStudents: 1,
            description: '',
            schedules: [{ day: '', time: '' }]
        });
        setIsEditing(false);
        onClose();
    };

    const handleClose = () => {
        if (isEditing && hasFormData()) {
            setShowConfirmClose(true);
        } else {
            // Reset form when closing
            setFormData({
                classTitle: '',
                subject: '',
                category: '',
                tuitionFee: 0,
                maxStudents: 1,
                description: '',
                schedules: [{ day: '', time: '' }]
            });
            setIsEditing(false);
            onClose();
        }
    };

    const confirmClose = () => {
        setShowConfirmClose(false);
        // Reset form when closing
        setFormData({
            classTitle: '',
            subject: '',
            category: '',
            tuitionFee: 0,
            maxStudents: 1,
            description: '',
            schedules: [{ day: '', time: '' }]
        });
        setIsEditing(false);
        onClose();
    };

    const cancelClose = () => {
        setShowConfirmClose(false);
    };

    const addSchedule = () => {
        setFormData(prev => ({
            ...prev,
            schedules: [...prev.schedules, { day: '', time: '' }]
        }));
    };

    const updateSchedule = (index: number, field: 'day' | 'time', value: string) => {
        setFormData(prev => ({
            ...prev,
            schedules: prev.schedules.map((schedule, i) =>
                i === index ? { ...schedule, [field]: value } : schedule
            )
        }));
    };

    const removeSchedule = (index: number) => {
        if (formData.schedules.length > 1) {
            setFormData(prev => ({
                ...prev,
                schedules: prev.schedules.filter((_, i) => i !== index)
            }));
        }
    };

    return (
        <ModalLayout
            isOpen={isOpen}
            onClose={handleClose}
            maxWidth="2xl"
            showCloseButton={true}
        >
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Class' : 'View Class'}</h2>
                        {isEditing && (
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        // Reset form to original data
                                        if (classData) {
                                            setFormData({
                                                classTitle: classData.classTitle,
                                                subject: classData.subject || '',
                                                category: classData.category || '',
                                                tuitionFee: classData.tuitionFee || 0,
                                                maxStudents: classData.students.length || 1,
                                                description: classData.description || '',
                                                schedules: classData.schedules.length > 0 ? classData.schedules : [{ day: '', time: '' }]
                                            });
                                        }
                                    }}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!isFormValid()}
                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                        isFormValid()
                                            ? 'bg-[#0b6459] text-white hover:bg-[#084c43]'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    Update Class
                                </button>
                            </div>
                        )}
                        {!isEditing && (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="px-3 py-1.5 bg-[#0b6459] text-white rounded hover:bg-[#084c43] mr-6 mt-1"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
                        <div className="md:col-span-7">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Class Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.classTitle}
                                onChange={(e) => setFormData(prev => ({ ...prev, classTitle: e.target.value }))}
                                className="w-full px-3 py-2 bg-[#f7f7f8] border border-transparent rounded-lg focus:outline-none focus:border-[#0b6459] focus:bg-white hover:border-gray-300 hover:bg-white transition-all duration-300 ease-in-out placeholder:text-gray-300"
                                placeholder="Enter class title"
                                required
                            />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max Students <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.maxStudents}
                                onChange={(e) => setFormData(prev => ({ ...prev, maxStudents: parseInt(e.target.value) || 1 }))}
                                className="w-full px-3 py-2 bg-[#f7f7f8] border border-transparent rounded-lg focus:outline-none focus:border-[#0b6459] focus:bg-white hover:border-gray-300 hover:bg-white transition-all duration-300 ease-in-out placeholder:text-gray-300"
                                placeholder="Enter max students"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <CustomDropdown2
                                label="Category"
                                options={["Academic", "Language", "Arts", "Science", "Technology"]}
                                selectedValue={formData.category}
                                placeholder="Select category"
                                onSelect={(value: string) => setFormData(prev => ({ ...prev, category: value }))}
                                dropdownId="category-dropdown"
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                                hasSearch={true}
                                searchPlaceholder="Search categories..."
                            />
                        </div>
                        <div>
                            <CustomDropdown2
                                label={<>Subject <span className="text-red-500">*</span></>}
                                options={["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science"]}
                                selectedValue={formData.subject}
                                placeholder="Select subject"
                                onSelect={(value: string) => setFormData(prev => ({ ...prev, subject: value }))}
                                dropdownId="subject-dropdown"
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                                hasSearch={true}
                                searchPlaceholder="Search subjects..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tuition Fee ($) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.tuitionFee}
                                onChange={(e) => setFormData(prev => ({ ...prev, tuitionFee: parseFloat(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 bg-[#f7f7f8] border border-transparent rounded-lg focus:outline-none focus:border-[#0b6459] focus:bg-white hover:border-gray-300 hover:bg-white transition-all duration-300 ease-in-out placeholder:text-gray-300"
                                placeholder="Enter tuition fee"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Class Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-3 py-2 bg-[#f7f7f8] border border-transparent rounded-lg focus:outline-none focus:border-[#0b6459] focus:bg-white hover:border-gray-300 hover:bg-white transition-all duration-300 ease-in-out h-24 resize-vertical placeholder:text-gray-300"
                            placeholder="Enter class description"
                            required
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Class Schedule <span className="text-red-500">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={addSchedule}
                                className="text-[#0b6459] hover:text-[#0a5a4f] font-medium text-sm flex items-center gap-1"
                            >
                                <span>+</span>
                                Add Schedule
                            </button>
                        </div>
                        <div className="space-y-2">
                            {formData.schedules.map((schedule, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg">
                                    <div className="flex-1">
                                        <CustomDropdown2
                                            options={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}
                                            selectedValue={schedule.day}
                                            placeholder="Select day"
                                            onSelect={(value: string) => updateSchedule(index, 'day', value)}
                                            dropdownId={`day-dropdown-${index}`}
                                            openDropdown={openDropdown}
                                            setOpenDropdown={setOpenDropdown}
                                            hasSearch={false}
                                            position="top"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <CustomDropdown2
                                            options={["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"]}
                                            selectedValue={schedule.time}
                                            placeholder="Select time"
                                            onSelect={(value: string) => updateSchedule(index, 'time', value)}
                                            dropdownId={`time-dropdown-${index}`}
                                            openDropdown={openDropdown}
                                            setOpenDropdown={setOpenDropdown}
                                            hasSearch={true}
                                            searchPlaceholder="Search times..."
                                            position="top"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeSchedule(index)}
                                        disabled={formData.schedules.length === 1}
                                        className={`p-1 ${formData.schedules.length === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-700'}`}
                                        title={formData.schedules.length === 1 ? "Cannot remove last schedule" : "Remove schedule"}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                // Reset form to original data
                                if (classData) {
                                    setFormData({
                                        classTitle: classData.classTitle,
                                        subject: classData.subject || '',
                                        category: classData.category || '',
                                        tuitionFee: classData.tuitionFee || 0,
                                        maxStudents: classData.students.length || 1,
                                        description: classData.description || '',
                                        schedules: classData.schedules.length > 0 ? classData.schedules : [{ day: '', time: '' }]
                                    });
                                }
                            }}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isFormValid()}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                isFormValid()
                                    ? 'bg-[#0b6459] text-white hover:bg-[#084c43]'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Update Class
                        </button>
                    </div>
                </form>
                    ) : (
                        // View Mode UI
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                            <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-600 mb-1">Class Title</h4>
                                <p className="text-lg font-semibold text-gray-800">{formData.classTitle || 'N/A'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-600 mb-1">Subject</h4>
                                    <p className="text-gray-800">{formData.subject || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-600 mb-1">Category</h4>
                                    <p className="text-gray-800">{formData.category || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-600 mb-1">Max Students</h4>
                                    <p className="text-gray-800">{formData.maxStudents}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-600 mb-1">Tuition Fee</h4>
                                    <p className="text-green-600 font-medium">${formData.tuitionFee.toFixed(2)}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-600 mb-1">Description</h4>
                                <p className="text-gray-800 bg-gray-50 p-3 rounded whitespace-pre-wrap">{formData.description || 'No description'}</p>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-600 mb-2">Schedule</h4>
                                <div className="space-y-1">
                                    {formData.schedules.filter(s => s.day && s.time).map((schedule, index) => (
                                        <div key={index} className="text-sm text-gray-800">
                                            {schedule.day} - {schedule.time}
                                        </div>
                                    ))}
                                    {formData.schedules.filter(s => s.day && s.time).length === 0 && (
                                        <p className="text-gray-500 text-sm">No schedule set</p>
                                    )}
                                </div>
                            </div>

                            {/* Class Creation Time */}
                            <div className="pt-4 border-t border-gray-200">
                                <h4 className="text-sm font-medium text-gray-600 mb-2">Class Information</h4>
                                <div className="text-sm text-gray-800">
                                    <span className="font-medium">Created:</span> {classData?.startDate || 'N/A'}
                                </div>
                            </div>

                            {/* Enrolled Students */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-600 mb-2">Enrolled Students ({classData?.students?.length || 0})</h4>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {classData?.students && classData.students.length > 0 ? (
                                        classData.students.map((student, index) => (
                                            <div key={index} className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded">
                                                <img
                                                    src={student.avatar}
                                                    alt={student.name}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <span className="text-sm text-gray-800">{student.name}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm">No students enrolled yet</p>
                                    )}
                                </div>
                            </div>

                            {/* Start Class Button */}
                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    Start Class
                                </button>
                            </div>
                        </div>
                        </div>
                    )}
                </div>

            {/* Confirmation Modal */}
            {shouldRenderConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Background overlay */}
                    <div
                        className={`fixed inset-0 bg-black transition-opacity duration-200 ${isAnimatingConfirm ? 'opacity-50' : 'opacity-0'}`}
                    />

                    {/* Modal content */}
                    <div
                        className={`bg-white rounded-lg p-6 max-w-md w-full relative z-10 transition-all duration-200 ease-out ${isAnimatingConfirm ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Discard Changes?</h3>
                        <p className="text-gray-600 mb-6">
                            You have unsaved changes. Are you sure you want to close without saving?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={cancelClose}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmClose}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Discard Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ModalLayout>
    );
};

export default EditClassModal;