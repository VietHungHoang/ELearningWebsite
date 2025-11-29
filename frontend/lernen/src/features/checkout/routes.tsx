import type { RouteObject } from 'react-router-dom';
import CheckoutPage from './pages/CheckoutPage';

const checkoutRoutes: RouteObject[] = [
  {
    path: '/checkout',
    element: <CheckoutPage />,
  },
];

export default checkoutRoutes;