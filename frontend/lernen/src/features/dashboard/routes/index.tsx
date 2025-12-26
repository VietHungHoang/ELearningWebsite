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
import MyQuizzesPage from '../../quiz/TutorMyQuizzesPage';
import { CreateQuizPage } from '../../quiz/create-quiz/create-quiz';
import QuizStatsPage from '../../quiz/pages/QuizStatsPage';
import QuizResultPage from '../../quiz/pages/QuizResultPage';
import QuizTakingPage from '../../quiz/pages/QuizTakingPage';
import WhiteboardPage from '../whiteboard/WhiteboardPage';
import ReviewsPage from '../tutor/reviews/ReviewsPage';

// Student pages
import MyBookingsPage from '../student/my-session/MyBookingsPage';
import StudentMyClassPage from '../student/my-class/MyClassPage';

// Conditional components
const ConditionalMyClassPage = () => {
  const { state } = useAuth();
  return state.user?.role === 'student' ? <StudentMyClassPage /> : <MyClassPage />;
};

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
        path: 'quizzes/:quizId/stats',
        element: <QuizStatsPage />,
      },
      {
        path: 'quizzes/result',
        element: <QuizResultPage />,
      },
      {
        path: 'my-quizzes/result',
        element: <QuizResultPage />,
      },
      {
        path: 'quizzes/take',
        element: <QuizTakingPage />,
      },
      {
        path: 'my-quizzes/take',
        element: <QuizTakingPage />,
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
      // Shared routes
      {
        path: 'profile-settings',
        children: [
          {
            path: 'personal-details',
            element: <PersonalDetailsPage />,
          },
          {
            path: 'resume-highlights',
            element: <ResumeHighlightsPage />,
          },
          {
            path: 'account-settings',
            element: <AccountSettingsPage />,
          },
          {
            path: 'subjects-i-can-teach',
            element: <SubjectICanTeachPage />,
          },
        ],
      },
    ],
  },
];

export default dashboardRoutes;
