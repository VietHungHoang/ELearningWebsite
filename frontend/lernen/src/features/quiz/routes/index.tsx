import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { CreateQuizPage } from '../create-quiz/create-quiz';

const quizRoutes: RouteObject[] = [
    {
        path: '/quiz/create',
        element: <CreateQuizPage />,
    },
    // Redirect old routes to new dashboard routes
    {
        path: '/quiz/take',
        element: <Navigate to="/dashboard/my-quizzes/take" replace />,
    },
    {
        path: '/quiz/result',
        element: <Navigate to="/dashboard/my-quizzes/result" replace />,
    },
];

export default quizRoutes;