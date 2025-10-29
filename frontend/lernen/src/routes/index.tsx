import { createBrowserRouter } from 'react-router-dom';
import authRoutes from '../features/auth/routes';
import homeRoutes from '../features/home/routes';
import cartRoutes from '../features/cart/routes';
import courseRoutes from '../features/course/routes';
import instructorRoutes from '../features/instructor/routes';

const router = createBrowserRouter([
  ...authRoutes,
  ...homeRoutes,
  ...cartRoutes,
  ...courseRoutes,
  ...instructorRoutes,
]);

export default router;
