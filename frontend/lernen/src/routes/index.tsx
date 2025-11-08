import { createBrowserRouter } from 'react-router-dom';
import authRoutes from '../features/auth/routes';
import homeRoutes from '../features/home/routes';
import cartRoutes from '../features/cart/routes';
import tutorRoutes from '../features/tutor/routes';
import courseRoutes from '../features/course/routes';
import instructorRoutes from '../features/instructor/routes';
import apiDocsRoutes from '../features/api-docs/routes';

const router = createBrowserRouter([
  ...authRoutes,
  ...homeRoutes,
  ...cartRoutes,
  ...tutorRoutes,
  ...courseRoutes,
  ...instructorRoutes,
  ...apiDocsRoutes,
]);

export default router;
