import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiPlus } from 'react-icons/hi';
import { FiEye, FiMessageSquare, FiEdit, FiTrash } from 'react-icons/fi';
import BirdLoading from '../../../../components/ui/BirdLoading';
import ConfirmModal from '../../../../components/ui/ConfirmModal';
import Toast from '../../../../components/ui/Toast';
import { useBreadcrumb } from '../../context/BreadcrumbContext';
import CreateClassModal, { type ClassFormData } from './components/CreateClassModal';
import EditClassModal, { type ClassData } from './components/EditClassModal';

export type { ClassData };
export type Schedule = import('../../../../types/class').ClassSchedule;
import CustomDropdownDashboard from '../../../../components/ui/CustomDropdownDashboard';
import Pagination from '../../../../components/ui/Pagination';
import { useTranslation } from 'react-i18next';
import { classService } from '../../../../services/classService';
import type { ClassTable, ClassStatus } from '../../../../types/class';
import { convertUtcTimeToLocal } from '../../../../utils/scheduleHelpers';

type FilterTab = 'All Status' | 'Ongoing' | 'Opening' | 'Completed';

// --- MAIN COMPONENT ---
const MyClassPage: React.FC = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [classes, setClasses] = useState<ClassTable[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<FilterTab>('All Status');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [classToEdit, setClassToEdit] = useState<ClassData | null>(null);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [classToDelete, setClassToDelete] = useState<ClassTable | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const itemsPerPage = 10;
    const { setBreadcrumb } = useBreadcrumb();

    // Helper function to check if title is null or "null" string
    const isTitleNull = (title: string | null | undefined): boolean => {
        return !title || title === 'null' || title.trim() === '';
    };

    // Helper function to convert day of week number to name
    const getDayName = (dayOfWeek: number): string => {
        const isVietnamese = i18n.language === 'vi';

        if (isVietnamese) {
            // Vietnamese: Thứ 2, Thứ 3, etc.
            const vietnameseDays = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
            return vietnameseDays[dayOfWeek - 1] || 'Unknown';
        } else {
            // English: Mon, Tue, etc. (short form)
            const englishDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            return englishDays[dayOfWeek - 1] || 'Unknown';
        }
    };

    // Helper function to format schedule display based on language
    const formatScheduleDisplay = (dayOfWeek: number, time: string): string => {
        const isVietnamese = i18n.language === 'vi';
        const dayName = getDayName(dayOfWeek);
        // Convert UTC time to local timezone
        const localTime = convertUtcTimeToLocal(time);

        if (isVietnamese) {
            // Vietnamese: "19:00 Thứ 2"
            return `${localTime} ${dayName}`;
        } else {
            // English: "Mon 19:00"
            return `${dayName} ${localTime}`;
        }
    };

    // Helper function to format date
    const formatDate = (dateString?: string): string => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            const isVietnamese = i18n.language === 'vi';

            if (isVietnamese) {
                return date.toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            } else {
                return date.toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            }
        } catch (error) {
            return dateString;
        }
    };


    useEffect(() => {
        setBreadcrumb([
            { label: 'Dashboard', path: '/dashboard' },
            { label: t('dashboard.tutor.myClass.title') }
        ]);
    }, [setBreadcrumb, t]);

    // Fetch classes data
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                setLoading(true);
                setError(null);

                const filters = {
                    page: currentPage,
                    size: itemsPerPage
                };

                const response = await classService.getClassesForTutor(filters);

                if (response.success) {
                    setClasses(response.data.content);
                    setTotalElements(response.data.totalElements);
                } else {
                    setError(response.message || 'Failed to fetch classes');
                }
            } catch (err) {
                setError('Failed to fetch classes');
                console.error('Error fetching classes:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, [currentPage]);

    const handleViewDetails = (classData: ClassTable) => {
        // Check class status: if OPENING, navigate to view-only page
        // Otherwise, navigate to full detail page with tabs
        if (classData.status === 'OPENING') {
            // Navigate to view-only page (ClassInfoPage with view mode)
            navigate(`/dashboard/my-class/${classData.id}/view`, {
                state: { classData, isViewMode: true }
            });
        } else {
            // Navigate to detail page with tabs (Schedule, Students, Quizzes, Materials)
            navigate(`/dashboard/my-class/${classData.id}`, {
                state: { classData }
            });
        }
    };

    const handleEditClass = (classData: ClassTable) => {
        // Navigate to class info/edit page
        navigate(`/dashboard/my-class/${classData.id}/edit`, {
            state: { classData }
        });
    };

    const handleEditSubmit = (formData: ClassFormData) => {
        if (classToEdit) {
            // TODO: Implement edit class API call
            console.log('Editing class:', classToEdit.id, 'with data:', formData);
            // For now, just close the modal
            setIsEditModalOpen(false);
            setClassToEdit(null);
        }
    };

    // Refetch classes after operations
    const refetchClasses = async () => {
        try {
            setLoading(true);
            const filters = {
                page: currentPage,
                size: itemsPerPage
            };
            const response = await classService.getClassesForTutor(filters);
            if (response.success) {
                setClasses(response.data.content);
                setTotalElements(response.data.totalElements);
            }
        } catch (err) {
            console.error('Error refetching classes:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (classData: ClassTable) => {
        setClassToDelete(classData);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!classToDelete) return;

        try {
            setIsDeleting(true);
            await classService.deleteClass(classToDelete.id);
            setToast({
                message: t('dashboard.tutor.myClass.deleteSuccess', { classTitle: classToDelete.title }),
                type: 'success'
            });
            setIsDeleteModalOpen(false);
            setClassToDelete(null);
            // Refetch classes to update the list
            await refetchClasses();
        } catch (error) {
            console.error('Failed to delete class:', error);
            setToast({
                message: t('dashboard.tutor.myClass.deleteError'),
                type: 'error'
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
        setClassToDelete(null);
    };

    const handleCreateClass = (classData: ClassFormData, paginatedData?: import('../../../../types/api').PaginatedResponse<ClassTable>) => {
        console.log('Creating class:', classData);
        // If paginated data is provided, update the state directly without refetching
        if (paginatedData) {
            setClasses(paginatedData.content);
            setTotalElements(paginatedData.totalElements);
            setCurrentPage(1); // Reset to first page to see the newly created class
        }
    };

    const filteredClasses = useMemo(() => {
        let statusFilter: ClassStatus | null = null;
        if (activeTab === 'Ongoing') {
            statusFilter = 'ONGOING';
        } else if (activeTab === 'Completed') {
            statusFilter = 'COMPLETED';
        } else if (activeTab === 'Opening') {
            statusFilter = 'OPENING';
        }

        return classes
            .filter(c => !statusFilter || c.status === statusFilter)
            .filter(c => {
                const titleMatch = !isTitleNull(c.title) && c.title && c.title.toLowerCase().includes(searchTerm.toLowerCase());
                const studentMatch = c.students.some(s => s.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
                return titleMatch || studentMatch;
            });
    }, [classes, activeTab, searchTerm]);

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="mb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">{t('dashboard.tutor.myClass.title')}</h1>
                    </div>
                    <button
                        className="px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition-colors font-medium text-sm flex items-center gap-2"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <HiPlus className="w-4 h-4" />
                        {t('dashboard.tutor.myClass.createClass')}
                    </button>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-4">
                <div className="relative w-full max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiSearch className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder={t('dashboard.tutor.myClass.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white rounded-lg pl-10 pr-4 py-2.5 text-sm border border-gray-200 focus:outline-none hover:shadow-md transition-all duration-300 ease-in-out placeholder:text-gray-400"
                    />
                </div>
                <div className="w-32">
                    <CustomDropdownDashboard
                        options={[
                            t('dashboard.tutor.myClass.filterOptions.allStatus'),
                            t('dashboard.tutor.myClass.filterOptions.ongoing'),
                            t('dashboard.tutor.myClass.filterOptions.opening'),
                            t('dashboard.tutor.myClass.filterOptions.completed')
                        ]}
                        selectedValue={
                            activeTab === 'All Status' ? t('dashboard.tutor.myClass.filterOptions.allStatus') :
                                activeTab === 'Ongoing' ? t('dashboard.tutor.myClass.filterOptions.ongoing') :
                                    activeTab === 'Opening' ? t('dashboard.tutor.myClass.filterOptions.opening') :
                                        t('dashboard.tutor.myClass.filterOptions.completed')
                        }
                        placeholder={t('dashboard.tutor.myClass.selectStatus')}
                        onSelect={(value: string) => {
                            const reverseMap: { [key: string]: FilterTab } = {
                                [t('dashboard.tutor.myClass.filterOptions.allStatus')]: 'All Status',
                                [t('dashboard.tutor.myClass.filterOptions.ongoing')]: 'Ongoing',
                                [t('dashboard.tutor.myClass.filterOptions.opening')]: 'Opening',
                                [t('dashboard.tutor.myClass.filterOptions.completed')]: 'Completed'
                            };
                            setActiveTab(reverseMap[value] || 'All Status');
                        }}
                        dropdownId="status-filter"
                        openDropdown={openDropdown}
                        setOpenDropdown={setOpenDropdown}
                        maxVisibleItems={4}
                    />
                </div>
            </div>

            <div className="mt-8 bg-white rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="py-16">
                        <BirdLoading
                            title={t('dashboard.tutor.myClass.loading')}
                            size="md"
                        />
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <h3 className="text-lg font-bold text-red-600">{t('dashboard.tutor.myClass.errorTitle')}</h3>
                        <p className="text-gray-500 mt-2">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition-colors"
                        >
                            {t('dashboard.tutor.myClass.tryAgain')}
                        </button>
                    </div>
                ) : filteredClasses.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-semibold">
                                <tr>
                                    <th className="p-4 text-center">#</th>
                                    <th className="p-4 text-center">
                                        {t('dashboard.tutor.myClass.tableHeaders.classTitle')}
                                    </th>
                                    <th className="p-4 text-center">{t('dashboard.tutor.myClass.tableHeaders.type')}</th>
                                    <th className="p-4 text-center">{t('dashboard.tutor.myClass.tableHeaders.students')}</th>
                                    <th className="p-4 text-center">{t('dashboard.tutor.myClass.tableHeaders.schedule')}</th>
                                    <th className="p-4 text-center">{t('dashboard.tutor.myClass.tableHeaders.progress')}</th>
                                    <th className="p-4 text-center">{t('dashboard.tutor.myClass.tableHeaders.status')}</th>
                                    <th className="p-4 text-center">{t('dashboard.tutor.myClass.tableHeaders.createdAt')}</th>
                                    <th className="p-4 text-center">{t('dashboard.tutor.myClass.tableHeaders.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredClasses.map((classData, index) => (
                                    <tr key={classData.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-center">
                                            <p className="text-sm font-semibold text-gray-600">{index + 1}</p>
                                        </td>
                                        <td className="p-4">
                                            <div className="max-w-xs">
                                                <p className="font-semibold text-gray-800 truncate" title={classData.type === 'ONE_ON_ONE' && classData.students.length > 0 ? classData.students[0].fullName : (classData.title || '')}>
                                                    {classData.type === 'ONE_ON_ONE' && classData.students.length > 0
                                                        ? classData.students[0].fullName
                                                        : (!isTitleNull(classData.title) ? classData.title : '-')}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${classData.type === 'ONE_ON_ONE'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                {classData.type === 'ONE_ON_ONE'
                                                    ? t('dashboard.tutor.myClass.classTypes.oneOnOne')
                                                    : t('dashboard.tutor.myClass.classTypes.group')
                                                }
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-sm text-gray-600">
                                                {classData.students.length} {classData.students.length === 1
                                                    ? t('dashboard.tutor.myClass.studentCount.singular')
                                                    : t('dashboard.tutor.myClass.studentCount.plural')
                                                }
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="text-sm text-gray-600">
                                                {classData.schedules.slice(0, 2).map((schedule, idx) => (
                                                    <div key={idx}>
                                                        {formatScheduleDisplay(schedule.dayOfWeek, schedule.time)}
                                                    </div>
                                                ))}
                                                {classData.schedules.length > 2 && (
                                                    <div className="text-xs text-gray-400">
                                                        {t('dashboard.tutor.myClass.scheduleMore', { count: classData.schedules.length - 2 })}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="text-sm">
                                                <span className="text-gray-800">{classData.completedSessions}</span>
                                                <span className="text-gray-400"> / {classData.totalSessions}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                <div
                                                    className="bg-[#0b6459] h-2 rounded-full"
                                                    style={{ width: `${(classData.completedSessions / classData.totalSessions) * 100}%` }}
                                                ></div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-white border border-gray-300 text-gray-800">
                                                <span className={`w-1.5 h-1.5 rounded-full ${classData.status === 'IN_PROGRESS'
                                                    ? 'bg-green-600'
                                                    : classData.status === 'ONGOING'
                                                        ? 'bg-green-600'
                                                        : classData.status === 'COMPLETED'
                                                            ? 'bg-gray-600'
                                                            : 'bg-yellow-600'
                                                    }`}></span>
                                                {classData.status === 'IN_PROGRESS'
                                                    ? t('dashboard.tutor.myClass.statusLabels.inProgress')
                                                    : classData.status === 'ONGOING'
                                                        ? t('dashboard.tutor.myClass.statusLabels.ongoing')
                                                        : classData.status === 'COMPLETED'
                                                            ? t('dashboard.tutor.myClass.statusLabels.completed')
                                                            : t('dashboard.tutor.myClass.statusLabels.opening')
                                                }
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-sm text-gray-600">
                                                {formatDate(classData.createdAt)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-0.5">
                                                {classData.status === 'OPENING' ? (
                                                    <button
                                                        onClick={() => handleEditClass(classData)}
                                                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                                        title="Edit class"
                                                    >
                                                        <FiEdit className="w-3.5 h-3.5" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleViewDetails(classData)}
                                                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                                        title="View details"
                                                    >
                                                        <FiEye className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                                {/* Ẩn nút nhắn tin nếu lớp đang chờ và chưa có học sinh */}
                                                {!(classData.status === 'OPENING' && classData.students.length === 0) && (
                                                    <button
                                                        onClick={() => {
                                                            // TODO: Implement chat functionality
                                                            console.log('Chat with class:', classData.id);
                                                        }}
                                                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                                        title="Chat"
                                                    >
                                                        <FiMessageSquare className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                                {classData.status === 'OPENING' && (
                                                    <button
                                                        onClick={() => handleDeleteClick(classData)}
                                                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                                        title={t('dashboard.tutor.myClass.deleteClass')}
                                                    >
                                                        <FiTrash className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h3 className="text-lg font-bold text-gray-800">{t('dashboard.tutor.myClass.noClassesFound')}</h3>
                        <p className="text-gray-500 mt-2">{t('dashboard.tutor.myClass.noClassesDescription')}</p>
                    </div>
                )}
            </div>

            {!loading && !error && totalElements > 0 && (
                <>
                    {(() => {
                        console.log('Pagination debug:', { loading, error, totalElements, currentPage, totalPages: Math.ceil(totalElements / itemsPerPage) });
                        return null;
                    })()}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(totalElements / itemsPerPage)}
                        totalItems={totalElements}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}

            {/* Create Class Modal */}
            <CreateClassModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateClass}
            />

            {/* Edit Class Modal */}
            <EditClassModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleEditSubmit}
                classData={classToEdit}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title={t('dashboard.tutor.myClass.deleteModalTitle')}
                message={t('dashboard.tutor.myClass.confirmDelete', { classTitle: classToDelete?.title || '' })}
                confirmText={isDeleting ? t('dashboard.tutor.myClass.deleting') : t('dashboard.tutor.myClass.deleteConfirm')}
                cancelText={t('dashboard.tutor.myClass.deleteCancel')}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                confirmButtonColor="red"
            />

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default MyClassPage;
