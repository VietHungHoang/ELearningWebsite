import { createBrowserRouter } from 'react-router-dom';
import authRoutes from '../features/auth/routes';
import homeRoutes from '../features/home/routes';
import cartRoutes from '../features/cart/routes';
import courseRoutes from '../features/course/routes';

import instructorRoutes from '../features/instructor/routes';
import apiDocsRoutes from '../features/api-docs/routes';
import profileRoutes from '../features/profile/routes';
import checkoutRoutes from '../features/checkout/routes';
import becomeTutorRoutes from '../features/become-a-tutor/route';
import dashboardRoutes from '../features/dashboard/routes';
import quizRoutes from '../features/quiz/routes';
import tutorRoutes from '../features/tutor/route';
import NotFoundPage from '../features/app/pages/NotFoundPage';
import SystemErrorPage from '../features/app/pages/SystemErrorPage';

const router = createBrowserRouter([
  ...authRoutes,
  ...homeRoutes,
  ...cartRoutes,
  ...tutorRoutes,
  ...courseRoutes,
  ...instructorRoutes,
  ...apiDocsRoutes,
  ...profileRoutes,
  ...checkoutRoutes,
  ...becomeTutorRoutes,
  ...dashboardRoutes,
  ...quizRoutes,
  {
    path: '/error',
    element: <SystemErrorPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
