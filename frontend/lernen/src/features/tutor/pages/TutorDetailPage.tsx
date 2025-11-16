import type { Tutor } from '../../../types/api';
import Layout from '../../../components/ui/Layout';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import TutorProfileHeader from '../components/tutor-detail/TutorProfileHeader';
import TutorDetailsTabs from '../components/tutor-detail/TutorDetailsTabs';
import AboutMeSection from '../components/tutor-detail/AboutMeSection';
import BookASession from '../components/tutor-detail/BookASession';
import CoursesSection from '../components/tutor-detail/CoursesSection';
import StudentReviews from '../components/tutor-detail/StudentReviews';
import SimilarTutors from '../components/tutor-detail/SimilarTutors';
import ResumeHighlights from '../components/tutor-detail/ResumeHighlights';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTutorSchedule } from '../../../services/tutorService';
import { getCoursesByTutorId } from '../../../services/courseService';
import type { Course } from '../../../types/api';
import BookSessionModal from '../components/tutor-detail/BookSessionModal';
import BookTrialModal from '../components/tutor-detail/BookTrialModal';

const TutorDetailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState<Tutor>(location.state.tutor);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (tutor.id) {
      const fetchSchedule = async () => {
        try {
          const scheduleData = await getTutorSchedule(tutor.id);
          const availabilityStrings = scheduleData.map((item: any) => {
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayName = dayNames[item.dayOfWeek];
            const startTime = new Date(`1970-01-01T${item.startTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const endTime = new Date(`1970-01-01T${item.endTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return `${dayName} ${startTime} - ${endTime}`;
          });
          setTutor((prev: Tutor) => ({ ...prev, availability: availabilityStrings }));
        } catch (error) {
          console.error('Failed to fetch tutor schedule:', error);
        }
      };
      fetchSchedule();

      const fetchCourses = async () => {
        try {
          const coursesData = await getCoursesByTutorId(Number(tutor.id));
          setCourses(coursesData);
        } catch (error) {
          console.error('Failed to fetch courses:', error);
        }
      };
      fetchCourses();
    }
  }, [tutor?.id]); return (
    <Layout pageColor='#FAf8F5'>
      {/* Container for content before full-width section */}
      <main className="mx-auto py-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb
            paths={[
              { name: 'Home', path: '/' },
              { name: 'Find Tutors', path: '/find-tutors' },
              { name: tutor.name, path: `/tutors/${tutor.id}` }
            ]} />
        </div>
        <div className="mt-6 max-w-7xl mx-auto">
          <TutorProfileHeader tutor={tutor} />
        </div>

        <div className="max-w-7xl mx-auto mt-10">
          <TutorDetailsTabs />
        </div>

        <div id="introduction" className="max-w-7xl mx-auto pt-1 px-8">
          <AboutMeSection />
        </div>

        <div id="availability" className=" mx-auto py-10 min-h-[700px] bg-white">
          <div className="max-w-7xl mx-auto px-8">
            <BookASession onOpenModal={() => setIsModalOpen(true)} onOpenTrialModal={() => setIsTrialModalOpen(true)} tutor={tutor} />
          </div>
        </div>

        <div className="container max-w-7xl mx-auto px-8 py-8">
          <div id="courses" className="pt-16 -mt-16">
            <CoursesSection courses={courses} tutor={tutor} />
          </div>
          <div id="resume-highlights" className="pt-16 -mt-16">
            <ResumeHighlights />
          </div>
          <div id="reviews" className="pt-16 -mt-16">
            <StudentReviews />
          </div>

          <hr className="my-12 border-t border-gray-200" />

          <div id="similar-tutors">
            <SimilarTutors />
          </div>
        </div>
      </main>
      <BookSessionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} tutor={{ name: tutor.name, avatar: tutor.avatarUrl, price: tutor.currentSessionFee }} navigateToApp={(page) => navigate(`/${page}`)} />
      <BookTrialModal isOpen={isTrialModalOpen} onClose={() => setIsTrialModalOpen(false)} tutor={{ name: tutor.name, avatar: tutor.avatarUrl }} />
    </Layout>
  );
};

export default TutorDetailPage;
