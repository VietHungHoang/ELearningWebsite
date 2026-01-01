import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { HiCurrencyDollar, HiCheckCircle, HiCreditCard, HiOfficeBuilding, HiPlus, HiDownload, HiCalendar, HiEye } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import Toast from '../../../../components/ui/Toast';
import BirdLoading from '../../../../components/ui/BirdLoading';
import DateRangePicker from '../../../../components/ui/DateRangePicker';
import CustomDropdown from '../../../../components/ui/CustomDropdown';
import AddPayoutMethodModal from '../components/AddPayoutMethodModal';
import PayoutStatusBadge from '../components/PayoutStatusBadge';
import Pagination from '../../../../components/ui/Pagination';
import TransactionDetailModal from '../components/TransactionDetailModal';
import { payoutService } from '../../../../services/payoutService';
import { classService } from '../../../../services/classService';
import type { PayoutMethod, PayoutHistoryItem, PayoutStatus, RecentEarning, PayoutStats } from '../../../../types/api';
import { useAuth } from '../../../../context/AuthContext';
import { useBreadcrumb } from '../../context/BreadcrumbContext';
import { useCurrency } from '../../../../context/CurrencyContext';
import { formatCurrency, convertCurrency } from '../../../../utils/currencyHelper';

// Payout data will be fetched from API

const PayoutsPage = () => {
    const { t } = useTranslation();
    const { state } = useAuth();
    const { setBreadcrumb } = useBreadcrumb();
    const { selectedCurrency } = useCurrency();

    // Data states
    const [stats, setStats] = useState<PayoutStats>(() => ({
        availableBalance: 0,
        pendingBalance: 0,
        totalEarned: 0,
        currentPaymentMethod: undefined
    }));
    const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
    const [history, setHistory] = useState<PayoutHistoryItem[]>([]);
    const [recentEarnings, setRecentEarnings] = useState<RecentEarning[]>([]);
    const [earningsPagination, setEarningsPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 5
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // UI states
    const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<PayoutStatus | 'All'>('All');
    const [earningsFilter, setEarningsFilter] = useState<'All' | '1-on-1' | 'Group'>('All');
    const [startDate, setStartDate] = useState<Date>(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30); // 30 ngày trước
        return date;
    });
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isAddMethodModalOpen, setIsAddMethodModalOpen] = useState(false);
    const [isPaymentMethodsModalOpen, setIsPaymentMethodsModalOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [earningsCurrentPage, setEarningsCurrentPage] = useState(1);
    const [selectedTransaction, setSelectedTransaction] = useState<PayoutHistoryItem | null>(null);
    const [isTransactionDetailOpen, setIsTransactionDetailOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'earnings' | 'history'>('earnings');

    // Refs for tab buttons and underline animation
    const earningsTabRef = useRef<HTMLButtonElement>(null);
    const historyTabRef = useRef<HTMLButtonElement>(null);
    const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

    const itemsPerPage = 5;
    const earningsItemsPerPage = 5;

    // Helper function to translate session type
    const translateSessionType = (type: string): string => {
        if (type === '1-on-1') {
            return t('payouts.oneOnOne');
        } else if (type === 'Group') {
            return t('payouts.group');
        }
        return type;
    };

    // Set breadcrumb
    useEffect(() => {
        setBreadcrumb([
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Payouts' }
        ]);
    }, [setBreadcrumb]);

    // Update underline position when activeTab changes
    useEffect(() => {
        const activeRef = activeTab === 'earnings' ? earningsTabRef.current : historyTabRef.current;
        if (activeRef) {
            const rect = activeRef.getBoundingClientRect();
            const containerRect = activeRef.parentElement?.getBoundingClientRect();
            if (containerRect) {
                setUnderlineStyle({
                    left: rect.left - containerRect.left,
                    width: rect.width
                });
            }
        }
    }, [activeTab]);

    // Set initial underline position on mount and when loading completes
    useLayoutEffect(() => {
        if (loading) return; // Wait until loading is done

        // Small delay to ensure refs are set
        setTimeout(() => {
            const activeRef = activeTab === 'earnings' ? earningsTabRef.current : historyTabRef.current;
            if (activeRef) {
                const rect = activeRef.getBoundingClientRect();
                const containerRect = activeRef.parentElement?.getBoundingClientRect();
                if (containerRect) {
                    setUnderlineStyle({
                        left: rect.left - containerRect.left,
                        width: rect.width
                    });
                }
            }
        }, 10);
    }, [activeTab, loading]);

    useEffect(() => {
        const fetchSummary = async () => {
            if (!state.user?.id) return;

            try {
                setLoading(true);
                setError(null);

                const statsResponse = await classService.getPayoutStats();
                console.log('Stats response:', statsResponse);
                if (statsResponse.success) {
                    setStats(statsResponse.data);
                    if (statsResponse.data.currentPaymentMethod) {
                        setSelectedMethodId(statsResponse.data.currentPaymentMethod.id);
                    }
                }
            } catch (err) {
                setError('Failed to fetch payout data');
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [state.user?.id]);

    useEffect(() => {
        const fetchRecentEarnings = async () => {
            if (!state.user?.id || activeTab !== 'earnings') return;

            try {
                const earningsResponse = await classService.getRecentEarnings({
                    page: earningsCurrentPage,
                    size: earningsItemsPerPage,
                    type: earningsFilter !== 'All' ? earningsFilter : undefined
                });
                console.log('Earnings response:', earningsResponse);
                if (earningsResponse.success) {
                    setRecentEarnings(earningsResponse.data.content);
                    setEarningsPagination({
                        currentPage: earningsResponse.data.pageable.pageNumber + 1,
                        totalPages: earningsResponse.data.totalPages,
                        totalItems: earningsResponse.data.totalElements,
                        itemsPerPage: earningsResponse.data.size
                    });
                } else {
                    console.error('Failed to fetch recent earnings:', earningsResponse.message);
                    setRecentEarnings([]);
                    setEarningsPagination({
                        currentPage: earningsCurrentPage,
                        totalPages: 1,
                        totalItems: 0,
                        itemsPerPage: earningsItemsPerPage
                    });
                }

            } catch (err) {
                console.error('Error fetching recent earnings:', err);
                setRecentEarnings([]);
            }
        };

        fetchRecentEarnings();
    }, [state.user?.id, activeTab, earningsCurrentPage, earningsFilter]);

    useEffect(() => {
        const fetchTransactionHistory = async () => {
            if (!state.user?.id || activeTab !== 'history') return;

            try {
                const historyResponse = await classService.getPayoutHistory({
                    page: currentPage,
                    limit: itemsPerPage
                });
                if (historyResponse.success) {
                    setHistory(historyResponse.data.content);
                }

            } catch (err) {
                console.error('Error fetching transaction history:', err);
                // Keep history empty if API fails
                setHistory([]);
            }
        };

        fetchTransactionHistory();
    }, [state.user?.id, activeTab, currentPage]);

    // Fetch payout methods CHỈ khi user click "View All Methods"
    useEffect(() => {
        const fetchPayoutMethods = async () => {
            if (!state.user?.id) return;
            if (payoutMethods.length > 0) return; // Đã có data rồi thì không cần fetch lại

            try {
                const tutorId = state.user.id;
                const methodsResponse = await payoutService.getPayoutMethods(tutorId);
                if (methodsResponse.success) {
                    setPayoutMethods(methodsResponse.data);
                    // Nếu chưa có selectedMethodId (chưa có trong summary), chọn method đầu tiên
                    if (!selectedMethodId && methodsResponse.data.length > 0) {
                        setSelectedMethodId(methodsResponse.data[0].id);
                    }
                }
            } catch (err) {
                console.error('Error fetching payout methods:', err);
            }
        };

        // CHỈ fetch khi user mở payment methods modal
        if (isPaymentMethodsModalOpen) {
            fetchPayoutMethods();
        }
    }, [state.user?.id, isPaymentMethodsModalOpen, payoutMethods.length, selectedMethodId]);

    // Filter and Pagination Logic
    // For Transaction History, we use the full mock data for pagination calculation
    // since API returns paginated results but we need to show all filtered results
    const allHistoryData = history.filter(item => {
        const matchesStatus = statusFilter === 'All' ? true : item.status === statusFilter;
        const itemDate = new Date(item.date);
        const matchesDateRange = itemDate >= startDate && itemDate <= endDate;
        return matchesStatus && matchesDateRange;
    });

    const totalPages = Math.ceil(allHistoryData.length / itemsPerPage);
    const currentHistory = allHistoryData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Recent earnings are now handled by API with server-side filtering and pagination

    // Pagination for earnings
    // Handled by earningsPagination state

    const handleAddMethod = async (newMethodData: Omit<PayoutMethod, 'id'>) => {
        if (!state.user?.id) return;

        try {
            const response = await payoutService.addPayoutMethod(state.user.id, newMethodData);
            if (response.success) {
                setPayoutMethods([...payoutMethods, response.data]);
                setSelectedMethodId(response.data.id);
                setIsAddMethodModalOpen(false);
                setToast({ message: `${newMethodData.type} added successfully!`, type: 'success' });
            } else {
                setToast({ message: response.message || 'Failed to add payout method', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'Failed to add payout method', type: 'error' });
            console.error('Error adding payout method:', err);
        }
    };

    const handleViewDetails = (transaction: PayoutHistoryItem) => {
        setSelectedTransaction(transaction);
        setIsTransactionDetailOpen(true);
    };

    return (
        <div className="">
            <div className="p-4">
                {/* Page Title */}
                <div className="mb-3">
                    <h1 className="text-lg font-bold text-gray-800">
                        {t('payouts.title')}
                    </h1>
                </div>

                {loading ? (
                    <div className="py-20">
                        <BirdLoading
                            title={t('payouts.loading')}
                            size="md"
                        />
                    </div>
                ) : (
                    <>
                        {/* Stats Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {/* Available Balance Card */}
                            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-[#0b6459]">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800">{formatCurrency(convertCurrency(stats.availableBalance, 'VND', selectedCurrency), selectedCurrency)}</h3>
                                        <p className="text-sm font-medium text-gray-500 mt-1">{t('payouts.availableBalance')}</p>
                                    </div>
                                    <div className="bg-[#0b6459]/10 p-3 rounded-lg">
                                        <HiCurrencyDollar className="w-5 h-5 text-[#0b6459]" />
                                    </div>
                                </div>
                            </div>

                            {/* Pending Balance Card */}
                            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-orange-600">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800">{formatCurrency(convertCurrency(stats.pendingBalance, 'VND', selectedCurrency), selectedCurrency)}</h3>
                                        <p className="text-sm font-medium text-gray-500 mt-1">{t('payouts.pendingBalance')}</p>
                                    </div>
                                    <div className="bg-orange-100 p-3 rounded-lg">
                                        <HiCalendar className="w-5 h-5 text-orange-600" />
                                    </div>
                                </div>
                            </div>

                            {/* Total Earned Card */}
                            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-green-600">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800">{formatCurrency(convertCurrency(stats.totalEarned, 'VND', selectedCurrency), selectedCurrency)}</h3>
                                        <p className="text-sm font-medium text-gray-500 mt-1">{t('payouts.totalEarned')}</p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-lg">
                                        <HiCheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                </div>
                            </div>

                            {/* Current Payment Method Card */}
                            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-blue-600">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800">
                                            {stats.currentPaymentMethod?.type || 'None'}
                                        </h3>
                                        <p className="text-sm font-medium text-gray-500 mt-1">
                                            {stats.currentPaymentMethod?.identifier || t('payouts.noPaymentMethod')}
                                        </p>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-lg">
                                        <HiCreditCard className="w-5 h-5 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transaction History */}
                        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 md:mb-0">{t('payouts.transactionHistory')}</h3>
                                <div className="flex flex-wrap items-center gap-3">
                                    {/* Date Range Picker */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsDateRangePickerOpen(true)}
                                            className="bg-white rounded-lg border border-gray-200 shadow-sm px-3 py-2 h-[40px] text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none flex items-center gap-2"
                                        >
                                            <HiCalendar className="w-4 h-4 text-gray-400" />
                                            {t('payouts.dateRange', {
                                                startDate: startDate.toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' }),
                                                endDate: endDate.toLocaleDateString(i18n.language, { month: 'short', day: 'numeric', year: 'numeric' })
                                            })}
                                        </button>
                                        <DateRangePicker
                                            startDate={startDate}
                                            endDate={endDate}
                                            onStartDateSelect={setStartDate}
                                            onEndDateSelect={setEndDate}
                                            isOpen={isDateRangePickerOpen}
                                            onClose={() => setIsDateRangePickerOpen(false)}
                                        />
                                    </div>

                                    {/* Status Filter */}
                                    <div className="w-32">
                                        <CustomDropdown
                                            options={activeTab === 'earnings'
                                                ? [t('payouts.allTypes'), t('payouts.oneOnOne'), t('payouts.group')]
                                                : [t('payouts.allStatus'), t('payouts.statusLabels.completed'), t('payouts.statusLabels.processing'), t('payouts.statusLabels.failed')]
                                            }
                                            selectedValue={activeTab === 'earnings'
                                                ? (earningsFilter === 'All'
                                                    ? t('payouts.allTypes')
                                                    : earningsFilter === '1-on-1'
                                                        ? t('payouts.oneOnOne')
                                                        : t('payouts.group'))
                                                : (statusFilter === 'All'
                                                    ? t('payouts.allStatus')
                                                    : statusFilter === 'Completed'
                                                        ? t('payouts.statusLabels.completed')
                                                        : statusFilter === 'Processing'
                                                            ? t('payouts.statusLabels.processing')
                                                            : t('payouts.statusLabels.failed'))
                                            }
                                            placeholder={activeTab === 'earnings' ? t('payouts.allTypes') : t('payouts.allStatus')}
                                            onSelect={(value) => {
                                                if (activeTab === 'earnings') {
                                                    let filterValue: 'All' | '1-on-1' | 'Group' = 'All';
                                                    if (value === t('payouts.allTypes')) {
                                                        filterValue = 'All';
                                                    } else if (value === t('payouts.oneOnOne')) {
                                                        filterValue = '1-on-1';
                                                    } else if (value === t('payouts.group')) {
                                                        filterValue = 'Group';
                                                    }
                                                    setEarningsFilter(filterValue);
                                                    setEarningsCurrentPage(1); // Reset to first page when filter changes
                                                } else {
                                                    let filterValue: PayoutStatus | 'All' = 'All';
                                                    if (value === t('payouts.allStatus')) {
                                                        filterValue = 'All';
                                                    } else if (value === t('payouts.statusLabels.completed')) {
                                                        filterValue = 'Completed';
                                                    } else if (value === t('payouts.statusLabels.processing')) {
                                                        filterValue = 'Processing';
                                                    } else if (value === t('payouts.statusLabels.failed')) {
                                                        filterValue = 'Failed';
                                                    }
                                                    setStatusFilter(filterValue);
                                                    setCurrentPage(1);
                                                }
                                            }}
                                            dropdownId="status-filter"
                                            openDropdown={openDropdown}
                                            setOpenDropdown={setOpenDropdown}
                                        />
                                    </div>
                                    <button className="bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-2 h-[40px] text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none flex items-center gap-2">
                                        <HiDownload className="w-4 h-4" />
                                        {t('payouts.export')}
                                    </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="relative flex border-b border-gray-200 mb-6">
                                <button
                                    ref={earningsTabRef}
                                    onClick={() => {
                                        setActiveTab('earnings');
                                        setEarningsCurrentPage(1);
                                    }}
                                    className={`px-4 py-3 text-sm font-medium transition-colors duration-200 ${activeTab === 'earnings'
                                            ? 'text-[#0b6459]'
                                            : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    {t('payouts.recentEarnings')}
                                </button>
                                <button
                                    ref={historyTabRef}
                                    onClick={() => {
                                        setActiveTab('history');
                                        setCurrentPage(1);
                                    }}
                                    className={`px-4 py-3 text-sm font-medium transition-colors duration-200 ${activeTab === 'history'
                                            ? 'text-[#0b6459]'
                                            : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    {t('payouts.transactionHistory')}
                                </button>
                                {/* Animated Underline */}
                                <div
                                    className="absolute bottom-0 h-0.5 bg-[#0b6459] transition-all duration-300 ease-in-out"
                                    style={{
                                        left: `${underlineStyle.left}px`,
                                        width: `${underlineStyle.width}px`
                                    }}
                                />
                            </div>

                            {/* Table or Empty State */}
                            {(activeTab === 'earnings' ? recentEarnings.length > 0 : currentHistory.length > 0) ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 text-gray-600 font-semibold">
                                                <tr>
                                                    {activeTab === 'earnings' ? (
                                                        <>
                                                            <th className="p-4 text-center">ID</th>
                                                            <th className="p-4 text-center">Course/Service</th>
                                                            <th className="p-4 text-center">Type</th>
                                                            <th className="p-4 text-center">Date</th>
                                                            <th className="p-4 text-center">Amount</th>
                                                            <th className="p-4 text-center">Actions</th>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <th className="p-4 text-center">Transaction ID</th>
                                                            <th className="p-4 text-center">Date</th>
                                                            <th className="p-4 text-center">Amount</th>
                                                            <th className="p-4 text-center">Method</th>
                                                            <th className="p-4 text-center">Status</th>
                                                            <th className="p-4 text-center">Actions</th>
                                                        </>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {activeTab === 'earnings' ? (
                                                    /* Recent Earnings Data */
                                                    recentEarnings.map((item) => (
                                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="p-4 text-center">
                                                                <p className="text-sm font-medium text-gray-800">{item.id}</p>
                                                            </td>
                                                            <td className="p-4 text-center">
                                                                <p className="text-sm font-medium text-gray-800">{item.course}</p>
                                                            </td>
                                                            <td className="p-4 text-center">
                                                                <p className="text-sm text-gray-600">{translateSessionType(item.type)}</p>
                                                            </td>
                                                            <td className="p-4 text-center">
                                                                <p className="text-sm text-gray-600">{item.date}</p>
                                                            </td>
                                                            <td className="p-4 text-center">
                                                                <p className="text-sm font-semibold text-gray-800">+${item.amount.toFixed(2)}</p>
                                                            </td>
                                                            <td className="p-4 text-center">
                                                                <button
                                                                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-[#0b6459] transition-colors"
                                                                    title="View Details"
                                                                >
                                                                    <HiEye className="w-5 h-5" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    /* Transaction History Data */
                                                    currentHistory.map(item => (
                                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="p-4 text-center">
                                                                <p className="text-sm font-medium text-gray-800">{item.id}</p>
                                                            </td>
                                                            <td className="p-4 text-center">
                                                                <p className="text-sm text-gray-600">{item.date}</p>
                                                            </td>
                                                            <td className="p-4 text-center">
                                                                <p className="text-sm font-semibold text-gray-800">${item.amount.toFixed(2)}</p>
                                                            </td>
                                                            <td className="p-4 text-center">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                                        {item.method.type === 'PayPal' ? <HiCreditCard className="w-4 h-4 text-gray-600" /> : <HiOfficeBuilding className="w-4 h-4 text-gray-600" />}
                                                                    </div>
                                                                    <span className="text-sm text-gray-600">{item.method.type}</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-center">
                                                                <PayoutStatusBadge status={item.status} />
                                                            </td>
                                                            <td className="p-4 text-center">
                                                                <button
                                                                    onClick={() => handleViewDetails(item)}
                                                                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-[#0b6459] transition-colors"
                                                                    title="View Details"
                                                                >
                                                                    <HiEye className="w-5 h-5" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination - show for both tabs when needed */}
                                    {activeTab === 'history' && totalPages > 1 && (
                                        <div className="mt-6">
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                totalItems={allHistoryData.length}
                                                itemsPerPage={itemsPerPage}
                                                onPageChange={setCurrentPage}
                                            />
                                        </div>
                                    )}
                                    {activeTab === 'earnings' && earningsPagination.totalPages > 1 && (
                                        <div className="mt-6">
                                            <Pagination
                                                currentPage={earningsPagination.currentPage}
                                                totalPages={earningsPagination.totalPages}
                                                totalItems={earningsPagination.totalItems}
                                                itemsPerPage={earningsPagination.itemsPerPage}
                                                onPageChange={setEarningsCurrentPage}
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex items-center justify-center py-20">
                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                            <HiCurrencyDollar className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                            {activeTab === 'earnings' ? t('payouts.noEarnings') : t('payouts.noTransactions')}
                                        </h3>
                                        <p className="text-gray-500">
                                            {activeTab === 'earnings'
                                                ? t('payouts.noEarningsDescription')
                                                : t('payouts.noTransactionsDescription')
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Modals */}
                {isAddMethodModalOpen && (
                    <AddPayoutMethodModal
                        isOpen={isAddMethodModalOpen}
                        onClose={() => setIsAddMethodModalOpen(false)}
                        onSave={handleAddMethod}
                    />
                )}
                {isTransactionDetailOpen && selectedTransaction && (
                    <TransactionDetailModal
                        transaction={selectedTransaction}
                        commissionRate={15} // Default commission rate
                        onClose={() => setIsTransactionDetailOpen(false)}
                    />
                )}

                {/* Payment Methods Modal */}
                {isPaymentMethodsModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800">Payment Methods</h3>
                                <button
                                    onClick={() => setIsPaymentMethodsModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm text-gray-600">Manage your payment methods</p>
                                    <button
                                        onClick={() => {
                                            setIsPaymentMethodsModalOpen(false);
                                            setIsAddMethodModalOpen(true);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 text-sm border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-[#0b6459] hover:text-[#0b6459] hover:bg-green-50 transition-all font-medium"
                                    >
                                        <HiPlus className="w-4 h-4" />
                                        Add New
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                                    {payoutMethods.map(method => (
                                        <div
                                            key={method.id}
                                            onClick={() => setSelectedMethodId(method.id)}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedMethodId === method.id
                                                    ? 'border-[#0b6459] bg-green-50 shadow-md'
                                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                                }`}
                                        >
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center justify-between">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedMethodId === method.id ? 'bg-[#0b6459] text-white' : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {method.type === 'PayPal' ? <HiCreditCard className="w-6 h-6" /> : <HiOfficeBuilding className="w-6 h-6" />}
                                                    </div>
                                                    {selectedMethodId === method.id && (
                                                        <HiCheckCircle className="w-6 h-6 text-[#0b6459]" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800 text-base mb-1">{method.type}</p>
                                                    <p className="text-sm text-gray-500 mb-2">{method.identifier}</p>
                                                    <div className="pt-2 border-t border-gray-200">
                                                        <p className="text-xs text-gray-400">
                                                            {method.type === 'PayPal' ? 'Email verified' : 'Bank account'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {payoutMethods.length === 0 && (
                                    <div className="text-center py-8">
                                        <HiCreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No payment methods added yet</p>
                                        <button
                                            onClick={() => {
                                                setIsPaymentMethodsModalOpen(false);
                                                setIsAddMethodModalOpen(true);
                                            }}
                                            className="mt-4 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition-colors"
                                        >
                                            Add Your First Method
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Toast */}
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default PayoutsPage;
