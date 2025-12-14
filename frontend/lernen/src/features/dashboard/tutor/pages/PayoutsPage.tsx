import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { HiCurrencyDollar, HiCheckCircle, HiCreditCard, HiOfficeBuilding, HiPlus, HiDownload, HiCalendar, HiEye } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import Toast from '../../../../components/ui/Toast';
import AddPayoutMethodModal from '../components/AddPayoutMethodModal';
import WithdrawModal from '../components/WithdrawModal';
import PayoutStatusBadge from '../components/PayoutStatusBadge';
import Pagination from '../../../../components/ui/Pagination';
import TransactionDetailModal from '../components/TransactionDetailModal';
import Breadcrumb from '../../components/Breadcrumb';
import { payoutService } from '../../../../services/payoutService';
import { classService } from '../../../../services/classService';
import type { PayoutMethod, PayoutHistoryItem, PayoutSummary, PayoutStatus, RecentEarning } from '../../../../types/api';
import { useAuth } from '../../../../context/AuthContext';

// Payout data will be fetched from API

const PayoutsPage = () => {
    const { state } = useAuth();
    const navigate = useNavigate();

    // Data states
    const [summary, setSummary] = useState<PayoutSummary>(() => {
        // Tính nextPayoutDate: ngày 15 của tháng hiện tại hoặc tháng sau
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const currentDay = now.getDate();
        
        let payoutYear = currentYear;
        let payoutMonth = currentMonth;
        
        // Nếu đã qua ngày 15, chuyển sang tháng sau
        if (currentDay > 15) {
            payoutMonth = currentMonth + 1;
            if (payoutMonth > 11) {
                payoutMonth = 0;
                payoutYear = currentYear + 1;
            }
        }
        
        const nextPayoutDate = `${payoutYear}-${String(payoutMonth + 1).padStart(2, '0')}-15`;
        
        return {
            availableBalance: 0,
            pendingBalance: 0,
            withdrawalCount: 0,
            maxWithdrawals: 5,        // Fix cứng giới hạn rút tối đa
            minimumThreshold: 10,     // Fix cứng ngưỡng rút tối thiểu
            commissionRate: 15,       // Fix cứng phí hoa hồng
            nextPayoutDate: nextPayoutDate, // Tính tự động dựa trên ngày hiện tại
            totalEarned: 0,
            currentPaymentMethod: undefined
        };
    });
    const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]); // Khởi tạo rỗng, chỉ load khi cần
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
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddMethodModalOpen, setIsAddMethodModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
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

                const tutorId = state.user.id;

                const summaryResponse = await classService.getPayoutSummary(tutorId);
                console.log('Summary response:', summaryResponse);
                if (summaryResponse.success) {
                    // Chỉ update các trường không fix cứng, giữ nguyên minimumThreshold, commissionRate, maxWithdrawals và nextPayoutDate
                    setSummary(prev => ({
                        ...prev,
                        availableBalance: summaryResponse.data.availableBalance,
                        pendingBalance: summaryResponse.data.pendingBalance,
                        withdrawalCount: summaryResponse.data.withdrawalCount,
                        // maxWithdrawals: giữ nguyên 5 (fix cứng)
                        // minimumThreshold: giữ nguyên 10 (fix cứng)
                        // commissionRate: giữ nguyên 15 (fix cứng)
                        // nextPayoutDate: giữ nguyên giá trị tính toán (fix cứng)
                        totalEarned: summaryResponse.data.totalEarned,
                        currentPaymentMethod: summaryResponse.data.currentPaymentMethod
                    }));
                    if (summaryResponse.data.currentPaymentMethod) {
                        setSelectedMethodId(summaryResponse.data.currentPaymentMethod.id);
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
                const tutorId = state.user.id;

                const earningsResponse = await classService.getRecentEarnings(tutorId, {
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
                const tutorId = state.user.id;

                const historyResponse = await classService.getPayoutHistory(tutorId, {
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

    // Fetch payout methods CHỈ khi user click "View All Methods" hoặc "Withdraw"
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

        // CHỈ fetch khi user mở withdraw modal hoặc payment methods modal
        if (isWithdrawModalOpen || isPaymentMethodsModalOpen) {
            fetchPayoutMethods();
        }
    }, [state.user?.id, isWithdrawModalOpen, isPaymentMethodsModalOpen, payoutMethods.length, selectedMethodId]);

    // Filter and Pagination Logic
    // For Transaction History, we use the full mock data for pagination calculation
    // since API returns paginated results but we need to show all filtered results
    const allHistoryData = history.filter(item => {
        const matchesStatus = statusFilter === 'All' ? true : item.status === statusFilter;
        const matchesSearch = searchTerm === '' ||
            item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.method.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.amount.toString().includes(searchTerm);
        return matchesStatus && matchesSearch;
    });

    const totalPages = Math.ceil(allHistoryData.length / itemsPerPage);
    const currentHistory = allHistoryData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Recent earnings are now handled by API with server-side filtering and pagination

    // Pagination for earnings
    // Handled by earningsPagination state

    const canWithdraw = summary.availableBalance >= summary.minimumThreshold && summary.withdrawalCount < summary.maxWithdrawals;

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

    const handleWithdraw = async (amount: number) => {
        if (!state.user?.id || !selectedMethodId || !summary) return;

        if (summary.withdrawalCount >= summary.maxWithdrawals) {
            setToast({ message: 'Monthly limit reached!', type: 'error' });
            return;
        }
        if (amount < summary.minimumThreshold) {
            setToast({ message: `Minimum withdrawal is $${summary.minimumThreshold}!`, type: 'error' });
            return;
        }
        if (amount > summary.availableBalance) {
            setToast({ message: 'Insufficient balance!', type: 'error' });
            return;
        }

        try {
            const response = await payoutService.withdrawFunds(state.user.id, {
                amount,
                methodId: selectedMethodId
            });

            if (response.success) {
                // Tìm payment method từ summary.currentPaymentMethod hoặc payoutMethods
                const usedMethod = summary.currentPaymentMethod?.id === selectedMethodId 
                    ? summary.currentPaymentMethod 
                    : payoutMethods.find(m => m.id === selectedMethodId);

                const newTransaction: PayoutHistoryItem = {
                    id: response.data.transactionId,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    amount: amount,
                    method: usedMethod || { id: selectedMethodId, type: 'PayPal', identifier: 'Unknown' },
                    status: 'Processing'
                };

                setHistory([newTransaction, ...history]);
                setSummary(prev => ({
                    ...prev,
                    availableBalance: prev.availableBalance - amount,
                    withdrawalCount: prev.withdrawalCount + 1
                }));

                setToast({ message: `Withdrawal of $${amount} initiated successfully!`, type: 'success' });
                setIsWithdrawModalOpen(false);
            } else {
                setToast({ message: response.message || 'Failed to withdraw funds', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'Failed to withdraw funds', type: 'error' });
            console.error('Error withdrawing funds:', err);
        }
    };

    const handleViewDetails = (transaction: PayoutHistoryItem) => {
        setSelectedTransaction(transaction);
        setIsTransactionDetailOpen(true);
    };

    return (
        <div className="">
            <div className="">
                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        { label: 'Dashboard', onClick: () => navigate('/dashboard') },
                        { label: 'Payouts', isActive: true }
                    ]}
                    className="mb-6"
                />

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0b6459] mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading payout data...</p>
                    </div>
                ) : (
                <>
                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Available Balance Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500">Available Balance</p>
                                <h3 className="text-3xl font-bold text-gray-800 mt-1">${summary.availableBalance.toLocaleString()}</h3>
                                <p className="text-xs text-gray-500 mt-1">Ready to withdraw</p>
                            </div>
                            <div className="bg-[#0b6459]/10 p-2 rounded-lg">
                                <HiCurrencyDollar className="w-6 h-6 text-[#0b6459]" />
                            </div>
                        </div>
                        <div className="mt-1 pt-2 border-t border-gray-100">
                            <button
                                onClick={() => canWithdraw ? setIsWithdrawModalOpen(true) : null}
                                disabled={!canWithdraw}
                                className={`w-full py-2 px-3 rounded-lg font-semibold text-sm transition-all ${canWithdraw
                                    ? 'bg-[#0b6459] text-white hover:bg-[#084c43]'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {canWithdraw ? 'Withdraw Now' : 'Cannot Withdraw'}
                            </button>
                            {!canWithdraw && (
                                <p className="text-xs text-gray-500 text-center mt-1">
                                    {summary.availableBalance < summary.minimumThreshold
                                        ? `Need $${(summary.minimumThreshold - summary.availableBalance).toFixed(2)} more`
                                        : 'Monthly limit reached'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Pending Balance Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500">Pending Balance</p>
                                <h3 className="text-3xl font-bold text-gray-800 mt-1">${summary.pendingBalance.toFixed(2)}</h3>
                                <p className="text-xs text-gray-500 mt-1">Processing transactions</p>
                            </div>
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <HiCalendar className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                        <div className="mt-1 pt-2 border-t border-gray-100">
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold">Next payout:</span> {summary.nextPayoutDate}
                            </p>
                        </div>
                    </div>

                    {/* Total Earned Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500">Total Earned</p>
                                <h3 className="text-3xl font-bold text-gray-800 mt-1">${summary.totalEarned.toLocaleString()}</h3>
                                <p className="text-xs text-gray-500 mt-1">All-time earnings</p>
                            </div>
                            <div className="bg-green-100 p-2 rounded-lg">
                                <HiCheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-1 pt-2 border-t border-gray-100">
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold">Platform fee:</span> {summary.commissionRate}%
                            </p>
                        </div>
                    </div>

                    {/* Current Payment Method Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500">Current Payment Method</p>
                                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                                    {summary.currentPaymentMethod?.type || 'None'}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    {summary.currentPaymentMethod?.identifier || 'No payment method selected'}
                                </p>
                            </div>
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <HiCreditCard className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-1 pt-2 border-t border-gray-100">
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setIsPaymentMethodsModalOpen(true)}
                                    className="py-2 pl-3 font-semibold text-sm text-blue-600 hover:text-blue-700 underline transition-colors"
                                >
                                    View All Methods
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

{/* Transaction History */}
                <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 md:mb-0">Transaction History</h3>
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Search Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={activeTab === 'earnings' ? "Search not available for earnings" : "Search transactions..."}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    disabled={activeTab === 'earnings'}
                                    className={`pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b6459] w-64 ${
                                        activeTab === 'earnings' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
                                    }`}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Status Filter */}
                            <select
                                value={activeTab === 'earnings' ? earningsFilter : statusFilter}
                                onChange={(e) => {
                                    if (activeTab === 'earnings') {
                                        setEarningsFilter(e.target.value as 'All' | '1-on-1' | 'Group');
                                        setEarningsCurrentPage(1); // Reset to first page when filter changes
                                    } else {
                                        setStatusFilter(e.target.value as PayoutStatus | 'All');
                                        setCurrentPage(1);
                                    }
                                }}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b6459]"
                            >
                                {activeTab === 'earnings' ? (
                                    <>
                                        <option value="All">All Types</option>
                                        <option value="1-on-1">1-on-1</option>
                                        <option value="Group">Group</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="All">All Status</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Failed">Failed</option>
                                    </>
                                )}
                            </select>
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <HiDownload className="w-4 h-4" />
                                Export
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
                            className={`px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                                activeTab === 'earnings'
                                    ? 'text-[#0b6459]'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Recent Earnings
                        </button>
                        <button
                            ref={historyTabRef}
                            onClick={() => {
                                setActiveTab('history');
                                setCurrentPage(1);
                            }}
                            className={`px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                                activeTab === 'history'
                                    ? 'text-[#0b6459]'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Transaction History
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
                                                        <p className="text-sm text-gray-600">{item.type}</p>
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
                                    {activeTab === 'earnings' ? 'No Recent Earnings' : 'No Transaction History'}
                                </h3>
                                <p className="text-gray-500">
                                    {activeTab === 'earnings'
                                        ? 'You haven\'t earned any money yet. Start teaching to see your earnings here.'
                                        : 'No transactions found. Your payout history will appear here once you make withdrawals.'
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
            {isWithdrawModalOpen && summary && (
                <WithdrawModal
                    isOpen={isWithdrawModalOpen}
                    onClose={() => setIsWithdrawModalOpen(false)}
                    onConfirm={handleWithdraw}
                    balance={summary.availableBalance}
                />
            )}
            {isTransactionDetailOpen && selectedTransaction && summary && (
                <TransactionDetailModal
                    transaction={selectedTransaction}
                    commissionRate={summary.commissionRate}
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
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                            selectedMethodId === method.id
                                            ? 'border-[#0b6459] bg-green-50 shadow-md'
                                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                        }`}
                                    >
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center justify-between">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                    selectedMethodId === method.id ? 'bg-[#0b6459] text-white' : 'bg-gray-100 text-gray-600'
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
