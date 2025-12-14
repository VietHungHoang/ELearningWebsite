import type { RouteObject } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import DashboardPage from '../DashboardPage';

// Tutor pages
import TutorDashboardPage from '../tutor/pages/TutorDashboardPage';
import MyStudentsPage from '../tutor/my-student/MyStudentsPage';
import StudentDetailPage from '../tutor/pages/StudentDetailPage';
import MyCoursesPage from '../tutor/pages/MyCoursesContentTutorPage';
import MyClassPage from '../tutor/pages/MyClassPage';
import ClassDetailPage from '../tutor/pages/ClassDetailPage';
import ScheduleManagementPage from '../tutor/pages/ScheduleManagementPage';
import PayoutsPage from '../tutor/pages/PayoutsPage';
import DealsAndCouponsPage from '../tutor/pages/DealsAndCouponsPage';
import RequestsPage from '../tutor/requests/RequestsPage';
import InboxPage from '../tutor/pages/InboxPage';
import CreateCoursePage from '../tutor/pages/CreateCoursePage';
import ApiDocumentationPage from '../tutor/pages/ApiDocumentationPage';
import PersonalDetailsPage from '../tutor/personal-detail/PersonalDetailsPage';
import TutorMyQuizzesPage from '../tutor/pages/TutorMyQuizzesPage';

// Student pages
import MyBookingsPage from '../student/pages/MyBookingsPage';
import StudentMyClassPage from '../student/pages/MyClassPage';
import MyQuizzesPage from '../student/pages/MyQuizzesPage';

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
        element: <TutorMyQuizzesPage />,
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
        ],
      },
    ],
  },
];

export default dashboardRoutes;
