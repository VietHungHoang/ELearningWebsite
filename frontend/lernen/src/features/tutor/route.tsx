import FindTutorsPage from './find-tutor/FindTutorsPage';
import TutorDetailPage from './tutor-detail/TutorDetailPage';

export default [
  { path: '/find-tutors', element: <FindTutorsPage /> },
  {path: '/tutors/:tutorId', element: <TutorDetailPage /> }
];