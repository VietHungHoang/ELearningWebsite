import React, { useState, useMemo, useEffect } from 'react';
import { HiSearch } from 'react-icons/hi';
import { FiEye } from 'react-icons/fi';
import { useBreadcrumb } from '../../context/BreadcrumbContext';
import CustomDropdown from '../../../../components/ui/CustomDropdown';
import Pagination from '../../../../components/ui/Pagination';
import BillDetailModal from './components/BillDetailModal';
import { useTranslation } from 'react-i18next';
import bookingService from '../../../../services/bookingService';

// Purchase data type
export interface PurchaseData {
    id: string;
    courseTitle: string;
    type: 'ON_ONE_ONE' | 'GROUP';
    amount: number;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
    purchaseDate: string;
    paymentMethod?: string;
    invoiceNumber?: string;
    // Additional bill details
    studentName?: string;
    studentEmail?: string;
    tutorName?: string;
    tutorEmail?: string;
    sessionsPurchased?: number;
    pricePerSession?: number;
    discount?: number;
    discountAmount?: number;
    subtotal?: number;
    tax?: number;
    totalAmount?: number;
    transactionId?: string;
    paymentDate?: string;
    notes?: string;
    schedule?: Array<{ date: string; time: string }>;
}

type FilterTab = 'All Status' | 'Pending' | 'Completed' | 'Cancelled' | 'Refunded';

// Map FilterTab to BookingStatus values that backend accepts
const getStatusForApi = (tab: FilterTab): string | undefined => {
    switch (tab) {
        case 'Pending': return 'PENDING';
        case 'Completed': return 'COMPLETED';
        case 'Cancelled': return 'CANCELLED';
        case 'Refunded': return 'CONFIRMED'; // Map Refunded to CONFIRMED for now
        default: return undefined;
    }
};

// --- MAIN COMPONENT ---
const PurchasesPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [purchases, setPurchases] = useState<PurchaseData[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<FilterTab>('All Status');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isBillModalOpen, setIsBillModalOpen] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState<PurchaseData | null>(null);
    const itemsPerPage = 10;
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            { label: 'Dashboard', path: '/dashboard' },
            { label: t('dashboard.student.purchases.title') }
        ]);
    }, [setBreadcrumb, t]);

    // Fetch purchases from booking service API
    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                setLoading(true);
                setError(null);

                // Call booking service API to get booking history
                // Backend uses 0-indexed pagination, so subtract 1 from currentPage
                const response = await bookingService.getBookingHistory({
                    page: currentPage - 1,
                    limit: itemsPerPage,
                    status: getStatusForApi(activeTab)
                });

                if (response.success && response.data) {
                    // Map API response to PurchaseData format
                    const mappedPurchases: PurchaseData[] = response.data.content.map((item: any) => ({
                        id: item.id,
                        courseTitle: item.className || item.classTitle || 'Session Purchase',
                        type: item.classType === 'ONE_ON_ONE' || item.classType === 'ON_ONE_ONE' ? 'ON_ONE_ONE' : 'GROUP',
                        amount: item.amount || 0,
                        status: (item.status || 'PENDING').toUpperCase() as PurchaseData['status'],
                        purchaseDate: item.createdAt || new Date().toISOString(),
                        paymentMethod: item.paymentProvider || '',
                        invoiceNumber: item.providerTransactionId || item.transactionId || item.id,
                        tutorName: item.tutorName || '',
                        sessionsPurchased: item.sessionsPurchased || 0,
                        pricePerSession: item.pricePerSession || 0,
                        discount: item.discount || 0,
                        totalAmount: item.amount || 0,
                        transactionId: item.transactionId || item.id,
                        paymentDate: item.createdAt || '',
                        notes: item.notes || ''
                    }));

                    setPurchases(mappedPurchases);
                    setTotalElements(response.data.totalElements || mappedPurchases.length);
                } else {
                    setPurchases([]);
                    setTotalElements(0);
                }
            } catch (err) {
                console.error('Error fetching purchases:', err);
                setError('Failed to fetch purchases');
                setPurchases([]);
                setTotalElements(0);
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, [currentPage, activeTab]);

    const handleViewDetails = (purchase: PurchaseData) => {
        setSelectedPurchase(purchase);
        setIsBillModalOpen(true);
    };

    const handlePay = (purchaseId: string) => {
        // TODO: Implement payment logic
        console.log('Pay for purchase:', purchaseId);
        // Close modal after payment
        setIsBillModalOpen(false);
        setSelectedPurchase(null);
    };

    const filteredPurchases = useMemo(() => {
        let statusFilter: PurchaseData['status'] | null = null;
        if (activeTab === 'Pending') {
            statusFilter = 'PENDING';
        } else if (activeTab === 'Completed') {
            statusFilter = 'COMPLETED';
        } else if (activeTab === 'Cancelled') {
            statusFilter = 'CANCELLED';
        } else if (activeTab === 'Refunded') {
            statusFilter = 'REFUNDED';
        }

        return purchases
            .filter(p => !statusFilter || p.status === statusFilter)
            .filter(p =>
                p.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [purchases, activeTab, searchTerm]);

    // Format currency
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString(
            i18n.language === 'vi' ? 'vi-VN' : 'en-US',
            {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }
        );
    };

    return (
        <div className="p-4">
            {/* Page Header */}
            <div className="mb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">{t('dashboard.student.purchases.title')}</h1>
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
                        placeholder={t('dashboard.student.purchases.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white rounded-lg pl-10 pr-4 py-2.5 text-sm border border-gray-200 focus:outline-none hover:shadow-md transition-all duration-300 ease-in-out placeholder:text-gray-400"
                    />
                </div>
                <div className="w-40">
                    <CustomDropdown
                        options={[
                            t('dashboard.student.purchases.filterOptions.allStatus'),
                            t('dashboard.student.purchases.filterOptions.pending'),
                            t('dashboard.student.purchases.filterOptions.completed'),
                            t('dashboard.student.purchases.filterOptions.cancelled'),
                            t('dashboard.student.purchases.filterOptions.refunded')
                        ]}
                        selectedValue={
                            activeTab === 'All Status' ? t('dashboard.student.purchases.filterOptions.allStatus') :
                                activeTab === 'Pending' ? t('dashboard.student.purchases.filterOptions.pending') :
                                    activeTab === 'Completed' ? t('dashboard.student.purchases.filterOptions.completed') :
                                        activeTab === 'Cancelled' ? t('dashboard.student.purchases.filterOptions.cancelled') :
                                            t('dashboard.student.purchases.filterOptions.refunded')
                        }
                        placeholder={t('dashboard.student.purchases.selectStatus')}
                        onSelect={(value: string) => {
                            const reverseMap: { [key: string]: FilterTab } = {
                                [t('dashboard.student.purchases.filterOptions.allStatus')]: 'All Status',
                                [t('dashboard.student.purchases.filterOptions.pending')]: 'Pending',
                                [t('dashboard.student.purchases.filterOptions.completed')]: 'Completed',
                                [t('dashboard.student.purchases.filterOptions.cancelled')]: 'Cancelled',
                                [t('dashboard.student.purchases.filterOptions.refunded')]: 'Refunded'
                            };
                            setActiveTab(reverseMap[value] || 'All Status');
                        }}
                        dropdownId="status-filter"
                        openDropdown={openDropdown}
                        setOpenDropdown={setOpenDropdown}
                        maxVisibleItems={5}
                    />
                </div>
            </div>

            <div className="mt-8 bg-white rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0b6459] mx-auto"></div>
                        <p className="text-gray-500 mt-4">{t('dashboard.student.purchases.loading')}</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <h3 className="text-lg font-bold text-red-600">{t('dashboard.student.purchases.errorTitle')}</h3>
                        <p className="text-gray-500 mt-2">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition-colors"
                        >
                            {t('dashboard.student.purchases.tryAgain')}
                        </button>
                    </div>
                ) : filteredPurchases.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-semibold">
                                <tr>
                                    <th className="p-4 text-center">#</th>
                                    <th className="p-4 text-center">{t('dashboard.student.purchases.tableHeaders.courseTitle')}</th>
                                    <th className="p-4 text-center">{t('dashboard.student.purchases.tableHeaders.type')}</th>
                                    <th className="p-4 text-center">{t('dashboard.student.purchases.tableHeaders.amount')}</th>
                                    <th className="p-4 text-center">{t('dashboard.student.purchases.tableHeaders.status')}</th>
                                    <th className="p-4 text-center">{t('dashboard.student.purchases.tableHeaders.purchaseDate')}</th>
                                    <th className="p-4 text-center">{t('dashboard.student.purchases.tableHeaders.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredPurchases.map((purchase, index) => (
                                    <tr key={purchase.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-center">
                                            <p className="text-sm font-semibold text-gray-600">{index + 1}</p>
                                        </td>
                                        <td className="p-4">
                                            <div className="max-w-xs">
                                                <p className="font-semibold text-gray-800 truncate" title={purchase.courseTitle}>
                                                    {purchase.courseTitle}
                                                </p>
                                                {purchase.invoiceNumber && (
                                                    <p className="text-xs text-gray-500 mt-1">{purchase.invoiceNumber}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${purchase.type === 'ON_ONE_ONE'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                {purchase.type === 'ON_ONE_ONE'
                                                    ? t('dashboard.student.purchases.classTypes.oneOnOne')
                                                    : t('dashboard.student.purchases.classTypes.group')
                                                }
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-sm font-semibold text-gray-800">
                                                {formatCurrency(purchase.amount)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-white border border-gray-300 text-gray-800">
                                                <span className={`w-1.5 h-1.5 rounded-full ${purchase.status === 'COMPLETED'
                                                    ? 'bg-green-600'
                                                    : purchase.status === 'PENDING'
                                                        ? 'bg-yellow-600'
                                                        : purchase.status === 'CANCELLED'
                                                            ? 'bg-red-600'
                                                            : 'bg-gray-600'
                                                    }`}></span>
                                                {purchase.status === 'COMPLETED'
                                                    ? t('dashboard.student.purchases.statusLabels.completed')
                                                    : purchase.status === 'PENDING'
                                                        ? t('dashboard.student.purchases.statusLabels.pending')
                                                        : purchase.status === 'CANCELLED'
                                                            ? t('dashboard.student.purchases.statusLabels.cancelled')
                                                            : t('dashboard.student.purchases.statusLabels.refunded')
                                                }
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-sm text-gray-600">
                                                {formatDate(purchase.purchaseDate)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() => handleViewDetails(purchase)}
                                                    className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                                    title={t('dashboard.student.purchases.actions.view')}
                                                >
                                                    <FiEye className="w-4 h-4" />
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
                        <h3 className="text-lg font-bold text-gray-800">{t('dashboard.student.purchases.noPurchasesFound')}</h3>
                        <p className="text-gray-500 mt-2">{t('dashboard.student.purchases.noPurchasesDescription')}</p>
                    </div>
                )}
            </div>

            {!loading && !error && totalElements > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalElements / itemsPerPage)}
                    totalItems={totalElements}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* Bill Detail Modal */}
            <BillDetailModal
                isOpen={isBillModalOpen}
                onClose={() => {
                    setIsBillModalOpen(false);
                    setSelectedPurchase(null);
                }}
                purchase={selectedPurchase}
                onPay={handlePay}
            />
        </div>
    );
};

export default PurchasesPage;

