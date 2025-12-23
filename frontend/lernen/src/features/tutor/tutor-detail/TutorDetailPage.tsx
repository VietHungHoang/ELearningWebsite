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
import GroupClassSection from "./components/GroupClassSection";
import TutorProfileHeader from "./components/TutorProfileHeader";

const TutorDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { tutorId } = useParams<{ tutorId: string }>();

    const [introduction, setIntroduction] = useState<string>("");
    const [tutorData, setTutorData] = useState<any>(null);

    const handleTutorData = (tutor: any) => {
        console.log("Tutor introduction:", tutor);
        setTutorData(tutor);
        if (tutor.introduction) {
            setIntroduction(tutor.introduction);
        }
    };

    const handleNavigateToApp = (page: string, data?: any) => {
        if (page === 'checkout' && data) {
            // Navigate to checkout with booking data and tutor data
            navigate(`/${page}`, { 
                state: data // Pass the entire data object which contains bookingData and tutor
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
                    <TutorProfileHeader tutorId={tutorId!} onTutorData={handleTutorData} />
                </div>

                <div className="max-w-7xl mx-auto mt-10">
                    <TutorDetailsTabs groupClassesCount={5} reviewsCount={10} />
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

                {/* <div className="container max-w-7xl mx-auto px-8 py-8">
                    <div id="group-class" className="pt-16 -mt-16">
                        <GroupClassSection tutorId={tutorId!} />
                    </div>
                    <div id="resume-highlights" className="pt-16 -mt-16">
                        <ResumeHighlights tutorId={tutorId!} />
                    </div>
                    <div id="reviews" className="pt-16 -mt-16">
                        <StudentReviews tutorId={tutorId!} />
                    </div>

                    <hr className="my-12 border-t border-gray-200" />

                    <div id="similar-tutors">
                        <SimilarTutors />
                    </div>
                </div> */}
            </main>
        </Layout>
    );
};

export default TutorDetailPage;
