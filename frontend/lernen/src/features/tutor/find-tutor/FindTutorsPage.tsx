import React, { useState, useCallback } from "react";
import type { TutorSearchFilter as IFilters, PaginatedResponse } from "../../../types/api";
import Layout from "../../../components/ui/Layout";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import TutorSearchFilters from "./components/TutorSearchFilters";
import TutorList from "./components/TutorList";
import Pagination from "../../../components/ui/Pagination";
import SearchNotFound from "./components/SearchNotFound";
import TipsSidebar from "./components/TipsSidebar";
import { tutorService } from "../../../services/tutorService";
import Loading from "../../../components/ui/Loading";
import BookingModal from "./components/BookingModal";
import type { Tutor } from "../../../types/tutor";
import { useTranslation } from "react-i18next";
import TutorRedirect from "../../../components/guards/TutorRedirect";
import { useAuth } from "../../../context/AuthContext";

const FindTutorsPage: React.FC = () => {
    const { t } = useTranslation();
    const { state } = useAuth();
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginatedResponse<Tutor> | null>(null);
    const [currentFilters, setCurrentFilters] = useState<IFilters>({});
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);

    const handleOpenBookingModal = (tutor: Tutor) => {
        setSelectedTutor(tutor);
        setIsBookingModalOpen(true);
    };

    const handleCloseBookingModal = () => {
        setIsBookingModalOpen(false);
        setSelectedTutor(null);
    };

    // Handle filter changes from TutorSearchFilters component
    const handleFilterChange = useCallback(async (filters: IFilters, page: number = 1) => {
        setLoading(true);
        setError(null);

        const searchFilters: IFilters = {
            ...filters,
            page,
            size: 10,
        };

        setCurrentFilters(searchFilters);

        const MAX_RETRIES = 3;
        let lastError: any = null;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                const response = await tutorService.searchTutors(searchFilters, state.user?.id);
                if (response.success) {
                    setTutors(response.data.content);
                    setFilteredTutors(response.data.content);
                    setPagination(response.data);
                    setLoading(false);
                    return; // Success - exit function
                } else {
                    lastError = response.message;
                }
            } catch (err) {
                lastError = err;
                console.warn(`Search attempt ${attempt}/${MAX_RETRIES} failed:`, err);

                // Wait before retrying (exponential backoff: 1s, 2s, 4s)
                if (attempt < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
                }
            }
        }

        // All retries failed
        console.error("All search attempts failed:", lastError);
        setError(t("findTutors.errorMessages.failedToSearchTutors"));
        setTutors([]);
        setPagination(null);
        setLoading(false);
    }, [t, state.user?.id]);

    // Handle page change
    const handlePageChange = useCallback(
        (page: number) => {
            handleFilterChange(currentFilters, page);
        },
        [handleFilterChange, currentFilters]
    );

    const handleSearch = (keyword: string) => {
        // Call API with keyword filter
        handleFilterChange({ ...currentFilters, keyword: keyword.trim() || undefined }, 1);
    };

    return (
        <TutorRedirect>
            <Layout>
                <div className="container max-w-7xl mx-auto px-4 py-8">
                    <Breadcrumb
                        paths={[
                            { name: t("header.home"), path: "/" },
                            { name: t("header.findTutors"), path: "/find-tutors" },
                        ]}
                    />
                    <div className="mb-6">
                        <h1 className="text-4xl font-bold text-gray-800 mt-2">
                            {t("findTutors.pageTitle")}
                        </h1>
                        <p className="mt-2 text-gray-600 max-w-4xl">
                            {t("findTutors.pageDescription")}
                        </p>
                    </div>

                    <TutorSearchFilters onFilterChange={handleFilterChange} onSearch={handleSearch} />

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
                        <div className="lg:col-span-3">
                            {loading ? (
                                <Loading />
                            ) : error ? (
                                <SearchNotFound
                                    title={t("findTutors.connectionError")}
                                    message={t("findTutors.connectionErrorMessage")}
                                />
                            ) : tutors.length > 0 ? (
                                <>
                                    <TutorList tutors={filteredTutors} onBookTrial={handleOpenBookingModal} />
                                    {pagination && (
                                        <Pagination
                                            currentPage={pagination.number + 1}
                                            totalPages={pagination.totalPages}
                                            totalItems={pagination.totalElements}
                                            itemsPerPage={pagination.size}
                                            onPageChange={handlePageChange}
                                        />
                                    )}
                                </>
                            ) : (
                                <SearchNotFound />
                            )}
                        </div>
                        <div>
                            <TipsSidebar />
                        </div>
                    </div>
                </div>

                {selectedTutor && (
                    <BookingModal isOpen={isBookingModalOpen} onClose={handleCloseBookingModal} tutor={selectedTutor} />
                )}
            </Layout>
        </TutorRedirect>
    );
};

export default FindTutorsPage;
