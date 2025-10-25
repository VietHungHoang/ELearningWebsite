import { createBrowserRouter } from 'react-router-dom';
import authRoutes from '../features/auth/routes';
import appRoutes from '../features/app/routes';
import homeRoutes from '../features/home/routes';
import cartRoutes from '../features/cart/routes';

const router = createBrowserRouter([
  ...authRoutes,
  ...appRoutes,
  ...homeRoutes,
  ...cartRoutes,
]);

export default router;
