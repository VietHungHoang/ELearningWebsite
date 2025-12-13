import FindTutorsPage from '../pages/FindTutorsPage';
import TutorDetailPage from '../pages/TutorDetailPage';

export default [
  { path: '/find-tutors', element: <FindTutorsPage /> },
  {path: '/tutor/:tutorId', element: <TutorDetailPage /> }
];