import type { RouteObject } from 'react-router-dom';
import QuizTakingPage from '../pages/QuizTakingPage';
import QuizResultPage from '../pages/QuizResultPage';
import { CreateQuizPage } from '../create-quiz/create-quiz';

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
        element: <CreateQuizPage />,
    },
];

export default quizRoutes;