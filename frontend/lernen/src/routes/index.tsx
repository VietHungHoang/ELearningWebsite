import { createBrowserRouter } from 'react-router-dom';
import authRoutes from '../features/auth/routes';
import homeRoutes from '../features/home/routes';
import cartRoutes from '../features/cart/routes';
<<<<<<< HEAD
import tutorRoutes from '../features/tutor/routes';
=======
import courseRoutes from '../features/course/routes';
import instructorRoutes from '../features/instructor/routes';
>>>>>>> a691ed1f7e409c02119473b77f37bfff3b328ec8

const router = createBrowserRouter([
  ...authRoutes,
  ...homeRoutes,
  ...cartRoutes,
<<<<<<< HEAD
  ...tutorRoutes,
=======
  ...courseRoutes,
  ...instructorRoutes,
>>>>>>> a691ed1f7e409c02119473b77f37bfff3b328ec8
]);

export default router;
