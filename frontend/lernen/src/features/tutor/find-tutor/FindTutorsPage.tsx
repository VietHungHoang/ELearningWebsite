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
import { useAuth } from "../../../context/AuthContext";
import type { Tutor } from "../../../types/tutor";

const FindTutorsPage: React.FC = () => {
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

        try {
            const searchFilters: IFilters = {
                ...filters,
                page,
                size: 10,
            };

            setCurrentFilters(searchFilters);

            const response = await tutorService.searchTutors(searchFilters, state.user?.id);
            if (response.success) {
                setTutors(response.data.content);
                setFilteredTutors(response.data.content);
                setPagination(response.data);
            } else {
                setError(response.message);
                setTutors([]);
                setPagination(null);
            }
        } catch (err) {
            setError("Failed to search tutors");
            console.error("Search error:", err);
            setTutors([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Handle page change
    const handlePageChange = useCallback(
        (page: number) => {
            handleFilterChange(currentFilters, page);
        },
        [handleFilterChange, currentFilters]
    );

    const handleSearch = (keyword: string) => {
        if (!keyword.trim()) {
            setFilteredTutors(tutors);
            return;
        }
        const lowercasedKeyword = keyword.toLowerCase();
        const results = tutors.filter(
            (tutor) =>
                tutor.fullName.toLowerCase().includes(lowercasedKeyword) ||
                tutor.headline.toLowerCase().includes(lowercasedKeyword) ||
                tutor.introduction.toLowerCase().includes(lowercasedKeyword)
        );
        setFilteredTutors(results);
    };

    return (
        <Layout>
            <div className="container max-w-7xl mx-auto px-4 py-8">
                <Breadcrumb
                    paths={[
                        { name: "Home", path: "/" },
                        { name: "Find Tutors", path: "/find-tutors" },
                    ]}
                />
                <div className="mb-6">
                    <h1 className="text-4xl font-bold text-gray-800 mt-2">
                        Discover a skilled online tutor for your studies
                    </h1>
                    <p className="mt-4 text-gray-600 max-w-4xl">
                        Master your studies with personalized online tutoring from expert educators. Our skilled tutors
                        are here to help you build strong foundations and achieve your academic goals.
                    </p>
                </div>

                <TutorSearchFilters onFilterChange={(filters) => handleFilterChange(filters)} onSearch={handleSearch} />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
                    <div className="lg:col-span-3">
                        {loading ? (
                            <Loading />
                        ) : error ? (
                            <SearchNotFound
                                title="Connection Error"
                                message="We're having trouble connecting to our servers. Please check your internet connection and try again."
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
    );
};

export default FindTutorsPage;
