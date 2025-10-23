import { createBrowserRouter } from 'react-router-dom';
import authRoutes from '../features/auth/routes';
import appRoutes from '../features/app/routes';

const router = createBrowserRouter([
  ...authRoutes,
  ...appRoutes,
]);

export default router;
