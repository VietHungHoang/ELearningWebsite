import type { RouteObject } from 'react-router-dom';
import { CreateQuizPage } from '../create-quiz/create-quiz';
import QuizTakingPage from '../pages/QuizTakingPage';
import QuizResultPage from '../pages/QuizResultPage';

const quizRoutes: RouteObject[] = [
    {
        path: '/quiz/create',
        element: <CreateQuizPage />,
    },
    {
        path: '/quiz/take/:quizId',
        element: <QuizTakingPage />,
    },
    {
        path: '/quiz/result/:attemptId',
        element: <QuizResultPage />,
    },
];

export default quizRoutes;