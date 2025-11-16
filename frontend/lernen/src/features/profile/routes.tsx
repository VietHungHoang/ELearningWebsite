import type { RouteObject } from 'react-router-dom';
import ProfileSettingsPage from './pages/ProfileSettingsPage';

const profileRoutes: RouteObject[] = [
  {
    path: '/profile/:view?',
    element: <ProfileSettingsPage />,
  },
];

export default profileRoutes;