import type { RouteObject } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import DashboardPage from '../DashboardPage';

// Tutor pages
import TutorDashboardPage from '../tutor/tutor-dashboard/TutorDashboardPage';
import MyStudentsPage from '../tutor/my-student/MyStudentsPage';
import StudentDetailPage from '../tutor/pages/StudentDetailPage';
import MyCoursesPage from '../tutor/pages/MyCoursesContentTutorPage';
import MyClassPage from '../tutor/my-class/MyClassPage';
import ClassDetailPage from '../tutor/components/class-detail/ClassDetailPage';
import ClassInfoPage from '../tutor/my-class/components/ClassInfoPage';
import ScheduleManagementPage from '../tutor/schedule/ScheduleManagementPage';
import PayoutsPage from '../tutor/payout/PayoutsPage';
import DealsAndCouponsPage from '../tutor/pages/DealsAndCouponsPage';
import RequestsPage from '../tutor/requests/RequestsPage';
import InboxPage from '../inbox/InboxPage';
import CreateCoursePage from '../tutor/pages/CreateCoursePage';
import ApiDocumentationPage from '../tutor/pages/ApiDocumentationPage';
import PersonalDetailsPage from '../tutor/personal-detail/PersonalDetailsPage';
import ResumeHighlightsPage from '../tutor/personal-detail/ResumeHighlightsPage';
import AccountSettingsPage from '../tutor/personal-detail/AccountSettingsPage';
import SubjectICanTeachPage from '../tutor/personal-detail/SubjectICanTeachPage';
import { ProfileSettingsProvider } from '../tutor/personal-detail/context/ProfileSettingsContext';
import MyQuizzesPage from '../../quiz/TutorMyQuizzesPage';
import { CreateQuizPage } from '../../quiz/create-quiz/create-quiz';
import QuizStatsPage from '../../quiz/pages/QuizStatsPage';
import WhiteboardPage from '../whiteboard/WhiteboardPage';
import ReviewsPage from '../tutor/reviews/ReviewsPage';

// Student pages
import MyBookingsPage from '../student/my-session/MyBookingsPage';
import StudentMyClassPage from '../student/my-class/MyClassPage';
import PurchasesPage from '../student/purchases/PurchasesPage';

// Conditional components
const ConditionalMyClassPage = () => {
  const { state } = useAuth();
  return state.user?.role === 'student' ? <StudentMyClassPage /> : <MyClassPage />;
};

// Wrapper component for profile settings with provider
const ProfileSettingsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProfileSettingsProvider>
    {children}
  </ProfileSettingsProvider>
);

const dashboardRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <DashboardPage />,
    children: [
      // Tutor routes
      {
        index: true,
        element: <TutorDashboardPage />,
      },
      {
        path: 'my-students',
        element: <MyStudentsPage />,
      },
      {
        path: 'my-students/:studentId',
        element: <StudentDetailPage />,
      },
      {
        path: 'my-courses',
        element: <MyCoursesPage />,
      },
      {
        path: 'my-class',
        element: <ConditionalMyClassPage />,
      },
      {
        path: 'my-class/:classId',
        element: <ClassDetailPage />,
      },
      {
        path: 'my-class/:classId/edit',
        element: <ClassInfoPage />,
      },
      {
        path: 'schedule',
        element: <ScheduleManagementPage />,
      },
      {
        path: 'payouts',
        element: <PayoutsPage />,
      },
      {
        path: 'deals-coupons',
        element: <DealsAndCouponsPage />,
      },
      {
        path: 'quizzes',
        element: <MyQuizzesPage />,
      },
      {
        path: 'quizzes/create',
        element: <CreateQuizPage />,
      },
      {
        path: 'quizzes/:quizId/edit',
        element: <CreateQuizPage />,
      },
      {
        path: 'quizzes/:quizId/stats',
        element: <QuizStatsPage />,
      },
      {
        path: 'requests',
        element: <RequestsPage />,
      },
      {
        path: 'inbox',
        element: <InboxPage />,
      },
      {
        path: 'create-course',
        element: <CreateCoursePage />,
      },
      {
        path: 'api-docs',
        element: <ApiDocumentationPage />,
      },
      {
        path: 'api',
        element: <ApiDocumentationPage />,
      },
      {
        path: 'whiteboard',
        element: <WhiteboardPage />,
      },
      {
        path: 'reviews',
        element: <ReviewsPage />,
      },
      // Student routes
      {
        path: 'my-bookings',
        element: <MyBookingsPage />,
      },
      {
        path: 'my-quizzes',
        element: <MyQuizzesPage />,
      },
      {
        path: 'purchases',
        element: <PurchasesPage />,
      },
      {
        path: 'messages',
        element: <InboxPage />,
      },
      // Shared routes - Profile settings with shared context
      {
        path: 'profile-settings',
        children: [
          {
            path: 'personal-details',
            element: <ProfileSettingsWrapper><PersonalDetailsPage /></ProfileSettingsWrapper>,
          },
          {
            path: 'resume-highlights',
            element: <ProfileSettingsWrapper><ResumeHighlightsPage /></ProfileSettingsWrapper>,
          },
          {
            path: 'account-settings',
            element: <ProfileSettingsWrapper><AccountSettingsPage /></ProfileSettingsWrapper>,
          },
          {
            path: 'subjects-i-can-teach',
            element: <ProfileSettingsWrapper><SubjectICanTeachPage /></ProfileSettingsWrapper>,
          },
        ],
      },
    ],
  },
];

export default dashboardRoutes;

