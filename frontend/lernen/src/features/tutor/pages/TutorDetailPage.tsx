import React, { useState } from 'react';
import Layout from '../../../components/ui/Layout';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import TutorProfileHeader from '../components/tutor-detail/TutorProfileHeader';
import TutorDetailsTabs from '../components/tutor-detail/TutorDetailsTabs';
import AboutMeSection from '../components/tutor-detail/AboutMeSection';
import BookASession from '../components/tutor-detail/BookASession';
import CoursesSection from '../components/tutor-detail/CoursesSection';
import StudentReviews from '../components/tutor-detail/StudentReviews';
import SimilarTutors from '../components/tutor-detail/SimilarTutors';
import RequestSessionModal from '../components/tutor-detail/RequestSessionModal';
import ResumeHighlights from '../components/tutor-detail/ResumeHighlights';

// More detailed mock data for the detail page
const mockTutor = {
    id: '1',
    name: 'Cynthia Hunter',
    avatarUrl: 'https://picsum.photos/seed/cynthia/96/96',
    isVerified: true,
    specialization: 'Mathematics Tutor',
    nationalityCode: 'US',
    currentSessionFee: 40.00,
    currency: 'USD',
    averageRating: 5.0,
    reviewCount: 1,
    languages: [
        { code: 'EN', level: 'Native' },
        { code: 'ES', level: 'Conversational' }
    ],
    categoryIds: ['math', 'science'],
    teachesInGroups: false,
    maxGroupMembers: 1,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoThumbnailUrl: 'https://picsum.photos/seed/video1/400/500',
    bio: 'Empowering Students with Customized Learning Support',
    studentCount: 74,
    sessionDurationMinutes: 60,
    bookedSessionsCount: 74,
    socials: [
        { id: '1', url: 'https://facebook.com/cynthia', platform: 'facebook' },
        { id: '2', url: 'https://twitter.com/cynthia', platform: 'twitter' },
        { id: '3', url: 'https://linkedin.com/in/cynthia', platform: 'linkedin' },
        { id: '4', url: 'https://instagram.com/cynthia', platform: 'instagram' }
    ],
    subjects: [
        { id: '1', subjectName: 'Mathematics' },
        { id: '2', subjectName: 'Science' },
        { id: '3', subjectName: 'Language Arts' }
    ]
};

const TutorDetailPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <Layout>
      {/* Container for content before full-width section */}
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb paths={[
          { name: 'Home', path: '/' },
          { name: 'Find Tutors', path: '/find-tutors' },
          { name: 'Cynthia Hunter', path: '/tutors/1' }
        ]} />
        <div className="mt-6">
            <TutorProfileHeader tutor={mockTutor} />
        </div>
        
        <div className="mt-10">
            <TutorDetailsTabs />
            
            <div id="introduction" className="pt-4">
                <AboutMeSection />
            </div>
        </div>
      </main>

      {/* Full-width Availability Section */}
      <div id="availability" className="pt-16 -mt-16 bg-white">
        <div className="container mx-auto px-4 py-8">
          <BookASession onOpenModal={() => setIsModalOpen(true)} />
        </div>
      </div>

      {/* Container for content after full-width section */}
      <div className="container mx-auto px-4 py-8">
        <div id="courses" className="pt-16 -mt-16">
            <CoursesSection />
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

      <RequestSessionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Layout>
  );
};

export default TutorDetailPage;
