import { createBrowserRouter } from 'react-router-dom';
import authRoutes from '../features/auth/routes';
import appRoutes from '../features/app/routes';
import homeRoutes from '../features/home/routes';
import cartRoutes from '../features/cart/routes';
import tutorRoutes from '../features/tutor/routes';

const router = createBrowserRouter([
  ...authRoutes,
  ...appRoutes,
  ...homeRoutes,
  ...cartRoutes,
  ...tutorRoutes,
]);

export default router;
