import React, { useState } from 'react';
import { FiUserPlus, FiTrash2, FiMessageCircle, FiSearch, FiAlertTriangle } from 'react-icons/fi';
import Avatar from 'react-avatar';
import ModalLayout from '../../../../../../components/ui/ModalLayout';
import Toast from '../../../../../../components/ui/Toast';
import { classService, type ClassData } from '../../../../../../services/classService';
import { useAuth } from '../../../../../../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface StudentsTabProps {
    classData: ClassData;
    onUpdate?: () => void; // Callback to refresh class data after removal
}

const StudentsTab: React.FC<StudentsTabProps> = ({ classData, onUpdate }) => {
    const { state } = useAuth();
    const { t } = useTranslation();
    const isStudent = state.user?.role === 'student';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Delete confirmation modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<{ id: string; name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Toast state
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Get i18n keys based on role
    const i18nKey = isStudent ? 'student' : 'tutor';

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setSearchTerm('');
    };

    // Open delete confirmation modal
    const openDeleteModal = (studentId: string, studentName: string) => {
        setStudentToDelete({ id: studentId, name: studentName });
        setIsDeleteModalOpen(true);
    };

    // Close delete confirmation modal
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setStudentToDelete(null);
    };

    // Handle remove student from class
    const handleRemoveStudent = async () => {
        if (!studentToDelete || !classData.id) return;

        setIsDeleting(true);
        try {
            const response = await classService.removeStudentFromClass(classData.id, studentToDelete.id);
            if (response.success) {
                setToast({
                    message: t('dashboard.tutor.myClass.detail.studentsTab.tutor.removeSuccess', {
                        name: studentToDelete.name
                    }) || `Đã xóa ${studentToDelete.name} khỏi lớp`,
                    type: 'success'
                });
                closeDeleteModal();
                // Refresh class data
                if (onUpdate) {
                    onUpdate();
                }
            } else {
                setToast({
                    message: response.message || t('dashboard.tutor.myClass.detail.studentsTab.tutor.removeError') || 'Không thể xóa học viên',
                    type: 'error'
                });
            }
        } catch (error: any) {
            console.error('Failed to remove student:', error);
            setToast({
                message: error.response?.data?.message || t('dashboard.tutor.myClass.detail.studentsTab.tutor.removeError') || 'Không thể xóa học viên',
                type: 'error'
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Toast notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {t(`dashboard.tutor.myClass.detail.studentsTab.${i18nKey}.title`, { count: classData.students.length })}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {t(`dashboard.tutor.myClass.detail.studentsTab.${i18nKey}.description`)}
                    </p>
                </div>
                {!isStudent && (
                    <button
                        onClick={openModal}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#094d44] transition-colors text-sm font-semibold"
                    >
                        <FiUserPlus className="w-4 h-4" />
                        {t('dashboard.tutor.myClass.detail.studentsTab.tutor.addStudent')}
                    </button>
                )}
            </div>

            {/* Students List */}
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                {classData.students.length === 0 ? (
                    <div className="p-8 text-center">
                        <FiUserPlus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-gray-900 font-medium mb-2">
                            {t(`dashboard.tutor.myClass.detail.studentsTab.${i18nKey}.noStudents`)}
                        </h4>
                        <p className="text-gray-600 text-sm">
                            {t(`dashboard.tutor.myClass.detail.studentsTab.${i18nKey}.noStudentsDescription`)}
                        </p>
                    </div>
                ) : (
                    classData.students.map((student: any) => {
                        // Đảm bảo luôn có tên hợp lệ
                        const studentName = student.name || student.fullName || `Student ${student.id}`;

                        // Component to handle avatar with fallback
                        const StudentAvatar: React.FC<{ avatar: string; name: string }> = ({ avatar, name }) => {
                            const [imgError, setImgError] = useState(false);

                            if (avatar && !imgError) {
                                return (
                                    <img
                                        src={avatar}
                                        alt={name}
                                        className="w-10 h-10 rounded-full object-cover"
                                        onError={() => setImgError(true)}
                                    />
                                );
                            }

                            return (
                                <Avatar
                                    name={name}
                                    size="40"
                                    round={true}
                                    className="flex-shrink-0"
                                />
                            );
                        };

                        return (
                            <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <StudentAvatar avatar={student.avatar || ''} name={studentName} />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {studentName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title={t(`dashboard.tutor.myClass.detail.studentsTab.${i18nKey}.sendMessage`)}>
                                            <FiMessageCircle className="w-4 h-4" />
                                        </button>
                                        {!isStudent && (
                                            <button
                                                onClick={() => openDeleteModal(student.id, studentName)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title={t('dashboard.tutor.myClass.detail.studentsTab.tutor.deleteStudent')}
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Add Student Modal */}
            <ModalLayout
                isOpen={isModalOpen}
                onClose={closeModal}
                maxWidth="md"
                showCloseButton={true}
            >
                <div className="p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                        {t('dashboard.tutor.myClass.detail.studentsTab.tutor.addStudentModal.title')}
                    </h3>

                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder={t('dashboard.tutor.myClass.detail.studentsTab.tutor.addStudentModal.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white rounded-lg pl-10 pr-4 py-2.5 text-sm border border-gray-200 hover:shadow-sm focus:outline-none focus:border-[#0b6459] transition-colors duration-300 w-full"
                        />
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {/* Mock search results - you can replace with actual search logic */}
                        {searchTerm && (
                            <div className="text-center py-8 text-gray-500">
                                <FiSearch className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p>{t('dashboard.tutor.myClass.detail.studentsTab.tutor.addStudentModal.searchFeature')}</p>
                                <p className="text-sm">{t('dashboard.tutor.myClass.detail.studentsTab.tutor.addStudentModal.searchingFor', { term: searchTerm })}</p>
                            </div>
                        )}
                        {!searchTerm && (
                            <div className="text-center py-8 text-gray-500">
                                <FiUserPlus className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p>{t('dashboard.tutor.myClass.detail.studentsTab.tutor.addStudentModal.enterToSearch')}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={closeModal}
                            className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm"
                        >
                            {t('dashboard.tutor.myClass.detail.studentsTab.tutor.addStudentModal.cancel')}
                        </button>
                        <button className="flex-1 px-4 py-2.5 bg-[#0b6459] text-white rounded-lg hover:bg-[#094d44] transition-colors font-semibold text-sm">
                            {t('dashboard.tutor.myClass.detail.studentsTab.tutor.addStudentModal.addSelected')}
                        </button>
                    </div>
                </div>
            </ModalLayout>

            {/* Delete Confirmation Modal */}
            <ModalLayout
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                maxWidth="sm"
                showCloseButton={true}
            >
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-100 rounded-full">
                            <FiAlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {t('dashboard.tutor.myClass.detail.studentsTab.tutor.deleteConfirm.title') || 'Xác nhận xóa học viên'}
                        </h3>
                    </div>

                    <p className="text-gray-600 mb-6">
                        {t('dashboard.tutor.myClass.detail.studentsTab.tutor.deleteConfirm.message', { name: studentToDelete?.name })
                            || `Bạn có chắc chắn muốn xóa ${studentToDelete?.name} khỏi lớp học này không?`}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={closeDeleteModal}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm disabled:opacity-50"
                        >
                            {t('dashboard.tutor.myClass.detail.studentsTab.tutor.deleteConfirm.cancel') || 'Hủy'}
                        </button>
                        <button
                            onClick={handleRemoveStudent}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isDeleting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    {t('dashboard.tutor.myClass.detail.studentsTab.tutor.deleteConfirm.deleting') || 'Đang xóa...'}
                                </>
                            ) : (
                                t('dashboard.tutor.myClass.detail.studentsTab.tutor.deleteConfirm.confirm') || 'Xóa học viên'
                            )}
                        </button>
                    </div>
                </div>
            </ModalLayout>
        </div>
    );
};

export default StudentsTab;
