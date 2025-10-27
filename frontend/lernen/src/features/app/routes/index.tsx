import CourseDetailPage from '../pages/CourseDetailPage';
import InstructorDetailPage from '../pages/InstructorDetailPage';

export default [
  { path: '/course-detail/:id', element: <CourseDetailPage /> },
  { path: '/instructor-detail/:id', element: <InstructorDetailPage /> },
];

