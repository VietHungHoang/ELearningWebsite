import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CourseListPage from './pages/CourseListPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import StudentEnrolledCoursesPage from './pages/StudentEnrolledCoursesPage';
import StudentProfilePage from './pages/StudentProfilePage';
import StudentWishlistPage from './pages/StudentWishlistPage';
import StudentReviewsPage from './pages/StudentReviewsPage';
import StudentMyQuizAttemptsPage from './pages/StudentMyQuizAttemptsPage';
import StudentOrderHistoryPage from './pages/StudentOrderHistoryPage';
import StudentSettingsPage from './pages/StudentSettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="/course-details" element={<CourseDetailsPage />} />
        <Route path="/student-enrolled-courses" element={<StudentEnrolledCoursesPage />} />
        <Route path="/student-profile" element={<StudentProfilePage />} />
        <Route path="/student-wishlist" element={<StudentWishlistPage />} />
        <Route path="/student-reviews" element={<StudentReviewsPage />} />
        <Route path="/student-my-quiz-attempts" element={<StudentMyQuizAttemptsPage />} />
        <Route path="/student-order-history" element={<StudentOrderHistoryPage />} />
        <Route path="/student-settings" element={<StudentSettingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;