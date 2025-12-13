import { useState, useEffect, useRef } from 'react';
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
import type { PayoutMethod, PayoutHistoryItem, PayoutSummary, PayoutStatus, RecentEarning } from '../../../../types/api';
import { useAuth } from '../../../../context/AuthContext';

// Mock Data
const mockMethods: PayoutMethod[] = [
    { id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', type: 'PayPal', identifier: 'john.doe@example.com' },
    { id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q', type: 'Bank', identifier: '**** 4567' },
    { id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r', type: 'PayPal', identifier: 'sarah.smith@gmail.com' },
    { id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s', type: 'Bank', identifier: '**** 8901' }
];

const mockHistory: PayoutHistoryItem[] = [
    { id: 'TXN20251122', date: 'Nov 22, 2025', amount: 1250.75, method: mockMethods[0], status: 'Completed' },
    { id: 'TXN20251115', date: 'Nov 15, 2025', amount: 980.50, method: mockMethods[1], status: 'Completed' },
    { id: 'TXN20251108', date: 'Nov 08, 2025', amount: 1450.25, method: mockMethods[0], status: 'Completed' },
    { id: 'TXN20251101', date: 'Nov 01, 2025', amount: 750.00, method: mockMethods[2], status: 'Processing' },
    { id: 'TXN20251025', date: 'Oct 25, 2025', amount: 2100.00, method: mockMethods[1], status: 'Completed' },
    { id: 'TXN20251018', date: 'Oct 18, 2025', amount: 890.75, method: mockMethods[0], status: 'Completed' },
    { id: 'TXN20251011', date: 'Oct 11, 2025', amount: 1650.50, method: mockMethods[3], status: 'Failed' },
    { id: 'TXN20251004', date: 'Oct 04, 2025', amount: 1200.00, method: mockMethods[1], status: 'Completed' },
    { id: 'TXN20250927', date: 'Sep 27, 2025', amount: 950.25, method: mockMethods[0], status: 'Processing' },
    { id: 'TXN20250920', date: 'Sep 20, 2025', amount: 1800.00, method: mockMethods[2], status: 'Completed' },
    { id: 'TXN20250913', date: 'Sep 13, 2025', amount: 1100.50, method: mockMethods[1], status: 'Completed' },
    { id: 'TXN20250906', date: 'Sep 06, 2025', amount: 1350.75, method: mockMethods[0], status: 'Failed' },
    { id: 'TXN20250830', date: 'Aug 30, 2025', amount: 950.00, method: mockMethods[3], status: 'Completed' },
    { id: 'TXN20250823', date: 'Aug 23, 2025', amount: 1400.25, method: mockMethods[1], status: 'Processing' },
    { id: 'TXN20250816', date: 'Aug 16, 2025', amount: 1150.50, method: mockMethods[0], status: 'Completed' },
];

const initialSummary: PayoutSummary = {
    availableBalance: 1250.75,
    pendingBalance: 750.00,
    withdrawalCount: 3,
    maxWithdrawals: 5,
    minimumThreshold: 50,
    commissionRate: 12,
    nextPayoutDate: 'Dec 01, 2025',
    totalEarned: 24500.00
};

const PayoutsPage = () => {
    const { state } = useAuth();
    const navigate = useNavigate();

    // Data states
    const [summary, setSummary] = useState<PayoutSummary>(initialSummary);
    const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]); // Khởi tạo rỗng, chỉ load khi cần
    const [history, setHistory] = useState<PayoutHistoryItem[]>(mockHistory);
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

    // Set initial underline position on mount
    useEffect(() => {
        const timer = setTimeout(() => {
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
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Fetch initial data when page loads: API 1 (summary + current payment method) và API 2 (recent earnings)
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!state.user?.id) return;

            try {
                setLoading(true);
                setError(null);

                const tutorId = state.user.id;

                // API 1: Fetch summary cho 4 cards (bao gồm cả current payment method)
                const summaryResponse = await payoutService.getPayoutSummary(tutorId);
                if (summaryResponse.success) {
                    setSummary(summaryResponse.data);
                    // Nếu có current payment method từ API, set selectedMethodId
                    if (summaryResponse.data.currentPaymentMethod) {
                        setSelectedMethodId(summaryResponse.data.currentPaymentMethod.id);
                    }
                }

                // API 2: Fetch recent earnings (tab mặc định)
                const earningsResponse = await payoutService.getRecentEarnings(tutorId, {
                    page: earningsCurrentPage,
                    limit: earningsItemsPerPage,
                    type: earningsFilter !== 'All' ? earningsFilter : undefined
                });
                if (earningsResponse.success) {
                    setRecentEarnings(earningsResponse.data.content);
                    setEarningsPagination({
                        currentPage: earningsResponse.data.pageable.pageNumber + 1, // Convert to 1-based
                        totalPages: earningsResponse.data.totalPages,
                        totalItems: earningsResponse.data.totalElements,
                        itemsPerPage: earningsResponse.data.size
                    });
                } else {
                    // Keep using mock data if API fails
                    setRecentEarnings(mockEarnings);
                    setEarningsPagination({
                        currentPage: earningsCurrentPage,
                        totalPages: Math.ceil(mockEarnings.length / earningsItemsPerPage),
                        totalItems: mockEarnings.length,
                        itemsPerPage: earningsItemsPerPage
                    });
                }

            } catch (err) {
                setError('Failed to fetch payout data');
                console.error('Error fetching payout data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [state.user?.id, earningsCurrentPage, earningsFilter]);

    // API 3: Fetch transaction history chỉ khi user chuyển sang tab "history"
    useEffect(() => {
        const fetchTransactionHistory = async () => {
            if (!state.user?.id || activeTab !== 'history') return;

            try {
                const tutorId = state.user.id;

                const historyResponse = await payoutService.getPayoutHistory(tutorId, {
                    page: currentPage,
                    limit: itemsPerPage
                });
                if (historyResponse.success) {
                    setHistory(historyResponse.data.content);
                } else {
                    // Keep using mock data if API fails
                    setHistory(mockHistory);
                }

            } catch (err) {
                console.error('Error fetching transaction history:', err);
                // Keep using mock data if API fails
                setHistory(mockHistory);
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
    const allHistoryData = mockHistory.filter(item => {
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

    // Mock earnings data for filtering
    const mockEarnings: RecentEarning[] = [
        { id: 'ERN001', course: 'Web Development Bootcamp', type: '1-on-1', date: '22/11/2025', amount: 50.00 },
        { id: 'ERN002', course: 'Advanced React Course', type: 'Group', date: '20/11/2025', amount: 45.00 },
        { id: 'ERN003', course: 'JavaScript Fundamentals', type: '1-on-1', date: '19/11/2025', amount: 38.50 },
        { id: 'ERN004', course: 'Python for Data Science', type: 'Group', date: '18/11/2025', amount: 42.00 },
        { id: 'ERN005', course: 'UI/UX Design Principles', type: '1-on-1', date: '17/11/2025', amount: 55.00 },
        { id: 'ERN006', course: 'Machine Learning Basics', type: 'Group', date: '16/11/2025', amount: 48.00 },
        { id: 'ERN007', course: 'Node.js Backend Development', type: '1-on-1', date: '15/11/2025', amount: 52.00 },
        { id: 'ERN008', course: 'Database Design & Management', type: 'Group', date: '14/11/2025', amount: 40.00 },
        { id: 'ERN009', course: 'Mobile App Development', type: '1-on-1', date: '13/11/2025', amount: 60.00 },
        { id: 'ERN010', course: 'Cloud Computing with AWS', type: 'Group', date: '12/11/2025', amount: 45.00 },
        { id: 'ERN011', course: 'DevOps Essentials', type: '1-on-1', date: '11/11/2025', amount: 58.00 },
        { id: 'ERN012', course: 'Cybersecurity Fundamentals', type: 'Group', date: '10/11/2025', amount: 43.00 },
        { id: 'ERN013', course: 'Full Stack Development', type: '1-on-1', date: '09/11/2025', amount: 65.00 },
        { id: 'ERN014', course: 'Data Structures & Algorithms', type: 'Group', date: '08/11/2025', amount: 47.00 },
        { id: 'ERN015', course: 'API Development with REST', type: '1-on-1', date: '07/11/2025', amount: 53.00 },
        { id: 'ERN016', course: 'Blockchain Technology', type: 'Group', date: '06/11/2025', amount: 49.00 },
        { id: 'ERN017', course: 'iOS App Development', type: '1-on-1', date: '05/11/2025', amount: 62.00 },
        { id: 'ERN018', course: 'Android Development', type: 'Group', date: '04/11/2025', amount: 44.00 },
        { id: 'ERN019', course: 'System Design Interview Prep', type: '1-on-1', date: '03/11/2025', amount: 70.00 },
        { id: 'ERN020', course: 'Agile Project Management', type: 'Group', date: '02/11/2025', amount: 41.00 },
    ];

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
        if (!state.user?.id || !selectedMethodId) return;

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
        <div className="min-h-screen">
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
                ) : error ? (
                    <div className="text-center py-20">
                        <h3 className="text-lg font-bold text-red-600">Error Loading Payout Data</h3>
                        <p className="text-gray-500 mt-2">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition-colors"
                        >
                            Try Again
                        </button>
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

                    {/* Table */}
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
            {isWithdrawModalOpen && (
                <WithdrawModal
                    isOpen={isWithdrawModalOpen}
                    onClose={() => setIsWithdrawModalOpen(false)}
                    onConfirm={handleWithdraw}
                    balance={summary.availableBalance}
                />
            )}
            {isTransactionDetailOpen && selectedTransaction && (
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
