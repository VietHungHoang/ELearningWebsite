import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import HomePage from '../pages/HomePage'
import CourseListPage from '../pages/CourseListPage'
import CourseSearchPage from '../pages/CourseSearchPage'
import CourseDetailPage from '../pages/CourseDetailPage'
import LessonPage from '../pages/LessonPage'
import FindTutorPage from '../pages/FindTutorPage'
import TutorProfilePage from '../pages/TutorProfilePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ProfilePage from '../pages/ProfilePage'
import DashboardPage from '../pages/DashboardPage'

const AppRoutes = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="find-tutors" element={<FindTutorPage />} />
        <Route path="tutor/:id" element={<TutorProfilePage />} />
        <Route path="courses" element={<CourseListPage />} />
        <Route path="search-courses" element={<CourseSearchPage />} />
        <Route path="courses/:id" element={<CourseDetailPage />} />
        <Route path="courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={isAuthenticated ? <MainLayout /> : <Navigate to="/auth/login" replace />}
      >
        <Route index element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
