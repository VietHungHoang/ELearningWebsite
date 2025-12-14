import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { tutorService } from "../../../services/tutorService";
import { useAuth } from "../../../context/AuthContext";
import Layout from "../../../components/ui/Layout";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import TutorProfileHeader from "./components/TutorProfileHeader";
import TutorDetailsTabs from "./components/TutorDetailsTabs";
import AboutMeSection from "./components/AboutMeSection";
import BookASession from "./components/BookASession";
import StudentReviews from "./components/StudentReviews";
import SimilarTutors from "./components/SimilarTutors";
import ResumeHighlights from "./components/ResumeHighlights";
import BookSessionModal from "./components/BookSessionModal";
import BookTrialModal from "./components/BookTrialModal";
import GroupClassSection from "./components/GroupClassSection";

const TutorDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { tutorId } = useParams<{ tutorId: string }>();
    const { state, isInitialized } = useAuth();
    const [tutor, setTutor] = useState<TutorDetail | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
    const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
    const [loading, setLoading] = useState(true)

    const [bookedTrialSlots, setBookedTrialSlots] = useState<string[]>([]);

    const handleTrialBookingSuccess = () => {
        // Update tutor state to reflect that trial session is no longer available
        setTutor(prev => prev ? { ...prev, hasTrialSession: false } : null);
        // Add booked time to pending slots
        setBookedTrialSlots(prev => [...prev, selectedTimes[0]]);
    };

    useEffect(() => {
        // Wait for auth to be initialized before fetching tutor detail
        if (tutorId && isInitialized) {
            const fetchTutorDetail = async () => {
                try {
                    const response = await tutorService.getTutorDetail(tutorId, state.user?.id);
                    setTutor(response.data);
                    console.log("Tutor detail fetched:", response.data);
                } catch (error) {
                    console.error("Failed to fetch tutor detail:", error);
                    navigate("/not-found");
                } finally {
                    setLoading(false);
                }
            };
            fetchTutorDetail();
        }
    }, [tutorId, navigate, state.user?.id, isInitialized]);

    if (loading || !tutor) {
        return (
            <Layout pageColor="#FAf8F5">
                <main className="mx-auto py-8">
                    <div className="max-w-7xl mx-auto text-center">
                        <p>Loading...</p>
                    </div>
                </main>
            </Layout>
        );
    }
    return (
        <Layout pageColor="#FAf8F5">
            <main className="mx-auto py-8">
                <div className="max-w-7xl mx-auto">
                    <Breadcrumb
                        paths={[
                            { name: "Home", path: "/" },
                            { name: "Find Tutors", path: "/find-tutors" },
                            { name: tutor.fullName, path: `/tutors/${tutor.id}` },
                        ]}
                    />
                </div>
                <div className="mt-6 max-w-7xl mx-auto">
                    <TutorProfileHeader tutor={tutor} />
                </div>

                <div className="max-w-7xl mx-auto mt-10">
                    <TutorDetailsTabs tutor={tutor} />
                </div>

                <div id="introduction" className="max-w-7xl mx-auto pt-1 px-8">
                    <AboutMeSection tutor={tutor} />
                </div>

                <div id="availability" className=" mx-auto py-10 min-h-[700px] bg-white">
                    <div className="max-w-7xl mx-auto px-8">
                        <BookASession
                            onOpenModal={() => setIsModalOpen(true)}
                            onOpenTrialModal={() => setIsTrialModalOpen(true)}
                            tutor={tutor}
                            selectedTimes={selectedTimes}
                            onTimesSelect={setSelectedTimes}
                            bookedTrialSlots={bookedTrialSlots}
                        />
                    </div>
                </div>

                <div className="container max-w-7xl mx-auto px-8 py-8">
                    <div id="group-class" className="pt-16 -mt-16">
                        <GroupClassSection />
                    </div>
                    <div id="resume-highlights" className="pt-16 -mt-16">
                        <ResumeHighlights tutor={tutor} />
                    </div>
                    <div id="reviews" className="pt-16 -mt-16">
                        <StudentReviews tutor={tutor} />
                    </div>

                    <hr className="my-12 border-t border-gray-200" />

                    <div id="similar-tutors">
                        <SimilarTutors />
                    </div>
                </div>
            </main>
            <BookSessionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tutor={{ name: tutor.fullName, avatar: tutor.avatarUrl, currentSessionFee: tutor.currentSessionFee }}
                navigateToApp={(page) => navigate(`/${page}`)}
            />
            <BookTrialModal
                isOpen={isTrialModalOpen}
                onClose={() => setIsTrialModalOpen(false)}
                tutor={tutor}
                selectedTimes={selectedTimes}
                onSuccess={handleTrialBookingSuccess}
            />
        </Layout>
    );
};

export default TutorDetailPage;
