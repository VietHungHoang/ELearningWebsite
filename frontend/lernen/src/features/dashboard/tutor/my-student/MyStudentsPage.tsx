import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiChat, HiEye, HiSearch } from 'react-icons/hi';
import BirdLoading from '../../../../components/ui/BirdLoading';
import EnrollmentTypeBadge from '../components/EnrollmentTypeBadge';
import StudentStatusBadge from '../components/StudentStatusBadge';
import Pagination from '../../../../components/ui/Pagination';
import { type StudentFilters, studentService } from '../../../../services/studentService';
import type { Student, StudentListItem } from '../../../../types/api';
import { useAuth } from '../../../../context/AuthContext';
import CustomDropdown from '../../../../components/ui/CustomDropdown';
import { useBreadcrumb } from '../../context/BreadcrumbContext';
import { useTranslation } from 'react-i18next';

export type StudentEnrollmentType = '1-on-1' | 'Group' | 'Trial';
export type StudentStatus = 'Ongoing' | 'Completed';
type FilterTab = 'All Students' | 'Ongoing' | 'Completed';
type EnrollmentFilter = 'All Types' | '1-on-1' | 'Group' | 'Trial';

const MyStudentsPage: React.FC = () => {
    const { state } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [students, setStudents] = useState<StudentListItem[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<FilterTab>('All Students');
    const [searchTerm, setSearchTerm] = useState('');
    const [enrollmentFilter, setEnrollmentFilter] = useState<EnrollmentFilter>('All Types');
    const [currentPage, setCurrentPage] = useState(1);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const itemsPerPage = 10;
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            { label: t('dashboard.header.breadcrumb.dashboard'), path: '/dashboard' },
            { label: t('dashboard.tutor.myStudents.title') }
        ]);
    }, [setBreadcrumb, t]);

    // Fetch students data
    useEffect(() => {
        const fetchStudents = async () => {
            if (!state.user?.id) return;

            try {
                setLoading(true);
                setError(null);

                const filters: StudentFilters = {
                    page: currentPage,
                    size: itemsPerPage
                };

                const tutorId = state.user.id;
                const response = await studentService.getStudentsByTutorId(tutorId, filters);

                if (response.success) {
                    setStudents(response.data.content);
                    setTotalElements(response.data.totalElements);
                } else {
                    setError(response.message || 'Failed to fetch students');
                }
            } catch (err) {
                setError('Failed to fetch students');
                console.error('Error fetching students:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [state.user?.id, currentPage]);

    const handleMessageStudent = (student: Student) => {
        console.log('Message student:', student);
        // TODO: Implement messaging functionality
    };

    const filteredStudents = useMemo(() => {
        return students
            .filter(student => {
                if (activeTab === 'All Students') return true;
                return student.status === activeTab;
            })
            .filter(student => {
                if (enrollmentFilter === 'All Types') return true;
                return student.enrollmentTypes.includes(enrollmentFilter as StudentEnrollmentType);
            })
            .filter(student =>
                student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [students, activeTab, searchTerm, enrollmentFilter]);

    // Calculate tab counts
    const tabCounts = useMemo(() => {
        return {
            'All Students': students.length,
            'Ongoing': students.filter(s => s.status === 'Ongoing').length,
            'Completed': students.filter(s => s.status === 'Completed').length,
        };
    }, [students]);

    const tabLabels: Record<FilterTab, string> = {
        'All Students': t('dashboard.tutor.myStudents.tabs.all'),
        'Ongoing': t('dashboard.tutor.myStudents.tabs.ongoing'),
        'Completed': t('dashboard.tutor.myStudents.tabs.completed')
    };

    const TabButton: React.FC<{ value: FilterTab }> = ({ value }) => {
        const count = tabCounts[value];
        const isActive = activeTab === value;

        return (
            <button
                onClick={() => setActiveTab(value)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${isActive ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:bg-white/50'
                    }`}
            >
                {tabLabels[value]}
                {count > 0 && ` (${count})`}
            </button>
        );
    };

    const enrollmentOptions = useMemo(() => ([
        { value: 'All Types' as EnrollmentFilter, label: t('dashboard.tutor.myStudents.filters.allTypes') },
        { value: '1-on-1' as EnrollmentFilter, label: t('dashboard.tutor.myStudents.filters.oneOnOne') },
        { value: 'Group' as EnrollmentFilter, label: t('dashboard.tutor.myStudents.filters.group') },
        { value: 'Trial' as EnrollmentFilter, label: t('dashboard.tutor.myStudents.filters.trial') },
    ]), [t]);

    const selectedEnrollmentLabel = enrollmentOptions.find(opt => opt.value === enrollmentFilter)?.label ?? '';

    return (
        <div className="mx-auto p-4">
            {/* Page Title */}
            <div className="mb-3">
                <h1 className="text-lg font-bold text-gray-800">
                    {t('dashboard.tutor.myStudents.title')}
                </h1>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="bg-gray-100 p-1 rounded-xl inline-flex items-center flex-wrap gap-1">
                    <TabButton value="All Students" />
                    <TabButton value="Ongoing" />
                    <TabButton value="Completed" />
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-48">
                        <CustomDropdown
                            options={enrollmentOptions.map(opt => opt.label)}
                            selectedValue={selectedEnrollmentLabel}
                            placeholder={t('dashboard.tutor.myStudents.filters.allTypes')}
                            onSelect={(value: string) => {
                                const matched = enrollmentOptions.find(opt => opt.label === value);
                                if (matched) setEnrollmentFilter(matched.value);
                            }}
                            dropdownId="enrollmentFilter"
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                        />
                    </div>
                    <div className="relative w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <HiSearch className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder={t('dashboard.tutor.myStudents.filters.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white rounded-lg pl-10 pr-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0b6459]"
                        />
                    </div>
                </div>
            </div>

            {/* Students Table */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="py-16">
                        <BirdLoading
                            title={t('dashboard.tutor.myStudents.loading')}
                            size="md"
                        />
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <h3 className="text-lg font-bold text-red-600">{t('dashboard.tutor.myStudents.errorTitle')}</h3>
                        <p className="text-gray-500 mt-2">{t('dashboard.tutor.myStudents.errorDescription')}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition-colors"
                        >
                            {t('dashboard.tutor.myStudents.tryAgain')}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-600 font-semibold">
                                    <tr>
                                        <th className="p-4 text-center">{t('dashboard.tutor.myStudents.tableHeaders.index')}</th>
                                        <th className="p-4 text-center">{t('dashboard.tutor.myStudents.tableHeaders.studentName')}</th>
                                        <th className="p-4 text-center">{t('dashboard.tutor.myStudents.tableHeaders.type')}</th>
                                        <th className="p-4 text-center">{t('dashboard.tutor.myStudents.tableHeaders.class')}</th>
                                        <th className="p-4 text-center">{t('dashboard.tutor.myStudents.tableHeaders.registeredDate')}</th>
                                        <th className="p-4 text-center">{t('dashboard.tutor.myStudents.tableHeaders.status')}</th>
                                        <th className="p-4 text-center">{t('dashboard.tutor.myStudents.tableHeaders.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredStudents.map((student, index) => (
                                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                            {/* STT */}
                                            <td className="p-4 text-center">
                                                <p className="text-sm font-semibold text-gray-600">{index + 1}</p>
                                            </td>

                                            {/* Student Name (no avatar) */}
                                            <td className="p-4 text-center">
                                                <p className="font-semibold text-gray-800">{student.fullName}</p>
                                            </td>

                                            {/* Type (enrollment badges only) */}
                                            <td className="p-4 text-center">
                                                <div className="flex gap-1 justify-center min-w-[140px]">
                                                    {student.enrollmentTypes.map(type => (
                                                        <EnrollmentTypeBadge key={type} type={type} />
                                                    ))}
                                                </div>
                                            </td>

                                            {/* Class - Placeholder for now */}
                                            <td className="p-4 text-center">
                                                <p className="text-sm text-gray-800 font-medium">{t('dashboard.tutor.myStudents.classPlaceholder')}</p>
                                            </td>

                                            {/* Registered Date */}
                                            <td className="p-4 text-center">
                                                <p className="text-sm text-gray-600">{student.registeredDate}</p>
                                            </td>

                                            {/* Status */}
                                            <td className="p-4 text-center">
                                                <StudentStatusBadge status={student.status} />
                                            </td>

                                            {/* Actions */}
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-0.5">
                                                    <button
                                                        onClick={() => handleMessageStudent(student)}
                                                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                                        title={t('dashboard.tutor.myStudents.actions.message')}
                                                    >
                                                        <HiChat className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/dashboard/my-students/${student.id}`)}
                                                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                                        title={t('dashboard.tutor.myStudents.actions.view')}
                                                    >
                                                        <HiEye className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredStudents.length === 0 && (
                            <div className="text-center py-16">
                                <h3 className="text-lg font-bold text-gray-800">{t('dashboard.tutor.myStudents.noStudentsTitle')}</h3>
                                <p className="text-gray-500 mt-2">{t('dashboard.tutor.myStudents.noStudentsDescription')}</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {filteredStudents.length > 0 && !loading && !error && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalElements / itemsPerPage)}
                    totalItems={totalElements}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
};

export default MyStudentsPage;
