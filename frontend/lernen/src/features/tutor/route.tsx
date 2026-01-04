import FindTutorsPage from './find-tutor/FindTutorsPage';
import TutorDetailPage from './tutor-detail/TutorDetailPage';
import SessionPackagePage from './session-package/SessionPackagePage';

export default [
  { path: '/find-tutors', element: <FindTutorsPage /> },
  { path: '/tutors/:tutorId', element: <TutorDetailPage /> },
  { path: '/tutors/:tutorId/session-package', element: <SessionPackagePage /> }
];