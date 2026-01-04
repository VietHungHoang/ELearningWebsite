import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../../../components/ui/Layout";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import TutorDetailsTabs from "./components/TutorDetailsTabs";
import AboutMeSection from "./components/AboutMeSection";
import BookASession from "./components/BookASession";
import StudentReviews from "./components/StudentReviews";
import SimilarTutors from "./components/SimilarTutors";
import ResumeHighlights from "./components/ResumeHighlights";
import TutorProfileHeader from "./components/TutorProfileHeader";
import { tutorService } from "../../../services/tutorService";
import { useAuth } from "../../../context/AuthContext";
import { classService } from "../../../services/classService";
import GroupClassSection from "./components/GroupClassSection";
import type { GroupClass } from "../../../types/tutor";

const TutorDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { tutorId } = useParams<{ tutorId: string }>();
    const { state } = useAuth();

    const [introduction, setIntroduction] = useState<string>("");
    const [tutorData, setTutorData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasTrialSession, setHasTrialSession] = useState(false);
    const [groupClasses, setGroupClasses] = useState<GroupClass[]>([]);
    const [groupClassesError, setGroupClassesError] = useState<string | null>(null);

    // Fetch tutor data
    useEffect(() => {
        const fetchTutorData = async () => {
            if (!tutorId) return;

            try {
                setLoading(true);
                setError(null);
                const response = await tutorService.getTutor(tutorId, state.user?.id);
                setTutorData(response.data);

                // Check if user has trial session with this tutor
                if (state.user?.id) {
                    try {
                        const trialResponse = await classService.getTrialSessionRequest(tutorId, state.user.id);
                        setHasTrialSession(trialResponse.data !== null);
                    } catch (trialError) {
                        console.error("Failed to check trial session:", trialError);
                        setHasTrialSession(false);
                    }
                } else {
                    setHasTrialSession(false);
                }

                if (response.data.introduction) {
                    setIntroduction(response.data.introduction);
                }
            } catch (err) {
                console.error("Failed to fetch tutor data:", err);
                setError("Failed to load tutor information");
            } finally {
                setLoading(false);
            }
        };

        fetchTutorData();
    }, [tutorId, state.user?.id]);

    // Fetch group classes data
    useEffect(() => {
        const fetchGroupClasses = async () => {
            if (!tutorId) return;

            try {
                setGroupClassesError(null);
                const response = await classService.getGroupClassesForTutor(tutorId);
                if (response.success) {
                    setGroupClasses(response.data || []);
                } else {
                    setGroupClassesError(response.message || 'Failed to fetch group classes');
                    setGroupClasses([]);
                }
            } catch (err) {
                console.error('Error fetching group classes:', err);
                setGroupClassesError('Failed to fetch group classes');
                setGroupClasses([]);
            }
        };

        fetchGroupClasses();
    }, [tutorId]);

    const handleNavigateToApp = (page: string, data?: any) => {
        if (page === 'checkout' && data) {
            navigate(`/${page}`, {
                state: data
            });
        } else {
            navigate(`/${page}`);
        }
    };

    useEffect(() => {
        if (!tutorId) {
            navigate("/not-found");
        }
    }, [tutorId, navigate]);

    return (
        <Layout pageColor="#FAf8F5">
            <main className="mx-auto py-8">
                <div className="max-w-7xl mx-auto">
                    <Breadcrumb
                        paths={[
                            { name: "Home", path: "/" },
                            { name: "Find Tutors", path: "/find-tutors" },
                            { name: "Tutor Profile", path: `/tutors/${tutorId}` },
                        ]}
                    />
                </div>
                <div className="mt-6 max-w-7xl mx-auto">
                    <TutorProfileHeader tutor={tutorData} hasTrialSession={hasTrialSession} />
                </div>

                <div className="max-w-7xl mx-auto mt-10">
                    <TutorDetailsTabs groupClassesCount={groupClasses.length} reviewsCount={tutorData?.reviews?.length || 0} />
                </div>

                <div id="introduction" className="max-w-7xl mx-auto pt-1 px-8">
                    <AboutMeSection introduction={introduction} />
                </div>

                <div id="availability" className=" mx-auto py-10 min-h-[700px] bg-white">
                    <div className="max-w-7xl mx-auto px-8">
                        <BookASession
                            tutorId={tutorId!}
                            tutorData={tutorData}
                            navigateToApp={handleNavigateToApp}
                        />
                    </div>
                </div>

                <div className="container max-w-7xl mx-auto px-8 py-8">
                    {groupClasses.length > 0 && !groupClassesError && (
                        <div id="group-class" className="pt-16 -mt-16">
                            <GroupClassSection groupClasses={groupClasses} tutor={tutorData} />
                        </div>
                    )}
                    <div id="resume-highlights" className="pt-16 -mt-16">
                        <ResumeHighlights tutor={tutorData} />
                    </div>
                    <div id="reviews" className="pt-16 -mt-16">
                        <StudentReviews
                            reviews={tutorData?.reviews || []}
                            tutorId={tutorId!}
                            hasTrialSession={hasTrialSession}
                        />
                    </div>

                    <hr className="my-12 border-t border-gray-200" />

                    <div id="similar-tutors">
                        <SimilarTutors />
                    </div>
                </div>
            </main>
        </Layout>
    );
};

export default TutorDetailPage;
