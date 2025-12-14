import type { RouteObject } from 'react-router-dom';
import QuizTakingPage from '../pages/QuizTakingPage';
import QuizResultPage from '../pages/QuizResultPage';
import CreateQuizContent from '../components/CreateQuizContent';

const quizRoutes: RouteObject[] = [
    {
        path: '/quiz/take',
        element: <QuizTakingPage />,
    },
    {
        path: '/quiz/result',
        element: <QuizResultPage />,
    },
    {
        path: '/quiz/create',
        element: <CreateQuizContent />,
    },
];

export default quizRoutes;