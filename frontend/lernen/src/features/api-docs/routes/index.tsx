import type { RouteObject } from 'react-router-dom';
import ApiDocsPage from '../pages/ApiDocsPage';

const apiDocsRoutes: RouteObject[] = [
  {
    path: '/more',
    element: <ApiDocsPage />,
  },
];

export default apiDocsRoutes;