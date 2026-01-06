import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch } from 'react-icons/hi';
import { FiEye, FiMessageSquare } from 'react-icons/fi';
import { useBreadcrumb } from '../../context/BreadcrumbContext';
import CustomDropdown from '../../../../components/ui/CustomDropdown';
import Pagination from '../../../../components/ui/Pagination';
import { useTranslation } from 'react-i18next';
import { classService } from '../../../../services/classService';
import { useAuth } from '../../../../context/AuthContext';
import type { ClassTable, EnrollmentStatus } from '../../../../types/class';
import { convertUtcTimeToLocal } from '../../../../utils/scheduleHelpers';

type FilterTab = 'All Status' | 'Ongoing' | 'Completed';

// --- MAIN COMPONENT ---
const MyClassPage: React.FC = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { state } = useAuth();
    const [classes, setClasses] = useState<ClassTable[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<FilterTab>('All Status');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const itemsPerPage = 10;
    const { setBreadcrumb } = useBreadcrumb();

    // Helper function to check if title is null or "null" string
    const isTitleNull = (title: string | null | undefined): boolean => {
        return !title || title === 'null' || title.trim() === '';
    };

    // Helper function to get enrollment status for current student
    const getEnrollmentStatus = (classData: ClassTable): EnrollmentStatus | null => {
        if (!state.user?.id) return null;
        const currentStudent = classData.students.find(s => s.id === state.user?.id);
        return currentStudent?.enrollmentStatus || null;
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


    useEffect(() => {
        setBreadcrumb([
            { label: 'Dashboard', path: '/dashboard' },
            { label: t('dashboard.student.myClass.title') }
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

                const response = await classService.getClassesForStudent(filters);

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
            // Navigate to view-only page (reuse ClassInfoPage with view mode)
            navigate(`/dashboard/my-class/${classData.id}/view`, { 
                state: { classData, isViewMode: true, isStudentView: true } 
            });
        } else {
            // Navigate to detail page with tabs (Schedule, Students, Quizzes, Materials)
            navigate(`/dashboard/my-class/${classData.id}`, { 
                state: { classData } 
            });
        }
    };

    const filteredClasses = useMemo(() => {
        let enrollmentStatusFilter: EnrollmentStatus | null = null;
        if (activeTab === 'Ongoing') {
            enrollmentStatusFilter = 'ON_GOING';
        } else if (activeTab === 'Completed') {
            enrollmentStatusFilter = 'COMPLETED';
        }

        return classes
            .filter(c => {
                if (!enrollmentStatusFilter) return true;
                const enrollmentStatus = getEnrollmentStatus(c);
                return enrollmentStatus === enrollmentStatusFilter;
            })
            .filter(c => {
                const titleMatch = !isTitleNull(c.title) && c.title && c.title.toLowerCase().includes(searchTerm.toLowerCase());
                const studentMatch = c.students.some(s => s.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
                const tutorMatch = c.tutor?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
                return titleMatch || studentMatch || tutorMatch;
            });
    }, [classes, activeTab, searchTerm, state.user?.id]);

    return (
        <div className="p-4">
            {/* Page Header */}
            <div className="mb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">{t('dashboard.student.myClass.title')}</h1>
                    </div>
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
                        placeholder={t('dashboard.student.myClass.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white rounded-lg pl-10 pr-4 py-2.5 text-sm border border-gray-200 focus:outline-none hover:shadow-md transition-all duration-300 ease-in-out placeholder:text-gray-400"
                    />
                </div>
                <div className="w-32">
                    <CustomDropdown
                        options={[
                            t('dashboard.student.myClass.filterOptions.allStatus'),
                            t('dashboard.student.myClass.filterOptions.ongoing'),
                            t('dashboard.student.myClass.filterOptions.completed')
                        ]}
                        selectedValue={
                            activeTab === 'All Status' ? t('dashboard.student.myClass.filterOptions.allStatus') :
                            activeTab === 'Ongoing' ? t('dashboard.student.myClass.filterOptions.ongoing') :
                            t('dashboard.student.myClass.filterOptions.completed')
                        }
                        placeholder={t('dashboard.student.myClass.selectStatus')}
                        onSelect={(value: string) => {
                            const reverseMap: { [key: string]: FilterTab } = {
                                [t('dashboard.student.myClass.filterOptions.allStatus')]: 'All Status',
                                [t('dashboard.student.myClass.filterOptions.ongoing')]: 'Ongoing',
                                [t('dashboard.student.myClass.filterOptions.completed')]: 'Completed'
                            };
                            setActiveTab(reverseMap[value] || 'All Status');
                        }}
                        dropdownId="status-filter"
                        openDropdown={openDropdown}
                        setOpenDropdown={setOpenDropdown}
                        maxVisibleItems={3}
                    />
                </div>
            </div>

            <div className="mt-8 bg-white rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0b6459] mx-auto"></div>
                        <p className="text-gray-500 mt-4">{t('dashboard.student.myClass.loading')}</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <h3 className="text-lg font-bold text-red-600">{t('dashboard.student.myClass.errorTitle')}</h3>
                        <p className="text-gray-500 mt-2">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition-colors"
                        >
                            {t('dashboard.student.myClass.tryAgain')}
                        </button>
                    </div>
                ) : filteredClasses.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-semibold">
                                <tr>
                                    <th className="p-4 text-center">#</th>
                                    <th className="p-4 text-center">
                                        {filteredClasses.some(c => isTitleNull(c.title)) && state.user?.role === 'student'
                                            ? (t('dashboard.student.myClass.tableHeaders.tutorName') || 'Tên tutor')
                                            : t('dashboard.student.myClass.tableHeaders.classTitle')}
                                    </th>
                                    <th className="p-4 text-center">{t('dashboard.student.myClass.tableHeaders.type')}</th>
                                    <th className="p-4 text-center">{t('dashboard.student.myClass.tableHeaders.startDate')}</th>
                                    <th className="p-4 text-center">{t('dashboard.student.myClass.tableHeaders.schedule')}</th>
                                    <th className="p-4 text-center">{t('dashboard.student.myClass.tableHeaders.progress')}</th>
                                    <th className="p-4 text-center">{t('dashboard.student.myClass.tableHeaders.status')}</th>
                                    <th className="p-4 text-center">{t('dashboard.student.myClass.tableHeaders.actions')}</th>
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
                                                <p className="font-semibold text-gray-800 truncate" title={!isTitleNull(classData.title) ? (classData.title || '') : (classData.tutor?.fullName || '')}>
                                                    {!isTitleNull(classData.title) 
                                                        ? (classData.title || '') 
                                                        : (state.user?.role === 'student' ? classData.tutor?.fullName || '-' : '-')}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                classData.type === 'ONE_ON_ONE'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-purple-100 text-purple-800'
                                            }`}>
                                                {classData.type === 'ONE_ON_ONE' 
                                                    ? t('dashboard.student.myClass.classTypes.oneOnOne') 
                                                    : t('dashboard.student.myClass.classTypes.group')
                                                }
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-sm text-gray-600">
                                                {new Date(classData.startDate).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US')}
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
                                                        {t('dashboard.student.myClass.scheduleMore', { count: classData.schedules.length - 2 })}
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
                                            {(() => {
                                                const enrollmentStatus = getEnrollmentStatus(classData);
                                                let statusLabel = '';
                                                let statusColor = 'bg-yellow-600';
                                                
                                                if (enrollmentStatus === 'JOINED') {
                                                    statusLabel = t('dashboard.student.myClass.statusLabels.enrolled');
                                                    statusColor = 'bg-blue-600';
                                                } else if (enrollmentStatus === 'PENDING_PAYMENT') {
                                                    statusLabel = t('dashboard.student.myClass.statusLabels.pendingPayment');
                                                    statusColor = 'bg-yellow-600';
                                                } else if (enrollmentStatus === 'ON_GOING') {
                                                    statusLabel = t('dashboard.student.myClass.statusLabels.ongoing');
                                                    statusColor = 'bg-green-600';
                                                } else if (enrollmentStatus === 'COMPLETED') {
                                                    statusLabel = t('dashboard.student.myClass.statusLabels.completed');
                                                    statusColor = 'bg-gray-600';
                                                } else {
                                                    statusLabel = t('dashboard.student.myClass.statusLabels.enrolled');
                                                    statusColor = 'bg-yellow-600';
                                                }
                                                
                                                return (
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-white border border-gray-300 text-gray-800">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${statusColor}`}></span>
                                                        {statusLabel}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-0.5">
                                                <button
                                                    onClick={() => handleViewDetails(classData)}
                                                    className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                                    title="View details"
                                                >
                                                    <FiEye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        // TODO: Implement chat functionality
                                                        console.log('Chat with class:', classData.id);
                                                    }}
                                                    className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                                    title="Chat"
                                                >
                                                    <FiMessageSquare className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h3 className="text-lg font-bold text-gray-800">{t('dashboard.student.myClass.noClassesFound')}</h3>
                        <p className="text-gray-500 mt-2">{t('dashboard.student.myClass.noClassesDescription')}</p>
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

        </div>
    );
};

// Export types for use in child components
export type ClassData = ClassTable;
export type Schedule = import('../../../../types/class').ClassSchedule;

export default MyClassPage;
