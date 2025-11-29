import type { RouteObject } from 'react-router-dom';
import DashboardPage from '../DashboardPage';
import TutorDashboardPage from '../tutor/pages/TutorDashboardPage';
import MyStudentsPage from '../tutor/pages/MyStudentsPage';
import StudentDetailPage from '../tutor/pages/StudentDetailPage';
import MyCoursesPage from '../tutor/pages/MyCoursesContentTutorPage';
import MyClassPage from '../tutor/pages/MyClassPage';
import ClassDetailPage from '../tutor/pages/ClassDetailPage';
import ScheduleManagementPage from '../tutor/pages/ScheduleManagementPage';
import PayoutsPage from '../tutor/pages/PayoutsPage';
import DealsAndCouponsPage from '../tutor/pages/DealsAndCouponsPage';
import RequestsPage from '../tutor/pages/RequestsPage';
import InboxPage from '../tutor/pages/InboxPage';
import CreateCoursePage from '../tutor/pages/CreateCoursePage';
import ApiDocumentationPage from '../tutor/pages/ApiDocumentationPage';
import PersonalDetailsPage from '../tutor/pages/PersonalDetailsPage';

const dashboardRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <DashboardPage />,
    children: [
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
        element: <MyClassPage />,
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
