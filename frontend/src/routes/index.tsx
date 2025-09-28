import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import { RoleBasedRedirect } from '../components'
import HomePage from '../pages/HomePage'
import { 
  CourseListPage, 
  CourseSearchPage, 
  CourseDetailPage, 
  LessonPage 
} from '../pages/course'
import CourseBundlesPage from '../pages/course/CourseBundlesPage'
import { 
  PremiumFeaturesPage, 
  FindTutorPage
} from '../pages/dashboard'
import TutorSubscriptionPage from '../pages/dashboard/TutorSubscriptionPage'
import { LoginPage, RegisterPage } from '../pages/auth'
import { StudentBookingsPage } from '../pages/student'
import StudentCoursesPage from '../pages/student/StudentCoursesPage'
import StudentCertificatesPage from '../pages/student/StudentCertificatesPage'
import CoursePlayerPage from '../pages/student/CoursePlayerPage'
import ProfileSettingsPage from '../pages/student/ProfileSettingsPage'
import CheckoutPage from '../pages/checkout/CheckoutPage'
import { 
  TutorDashboardPage,
  TutorProfilePage,
  TutorBookingsPage,
  TutorCoursesPage,
  TutorBundlesPage,
  TutorAssignmentsPage,
  TutorCommunityPage,
  TutorQuizzesPage,
  TutorInboxPage,
  TutorDealsPage,
  TutorPayoutsPage,
  TutorInvoicesPage,
  TutorDisputesPage
} from '../pages/tutor'
import { TutorLayout } from '../components/layout'
import { tutorUserControls, tutorMainSidebarItems, tutorAdditionalSidebarItems } from '../utils/tutorConfig'
import { AccessForbiddenPage, NotFoundPage } from '../pages/error'
import CertificateDebugPage from '../pages/debug/CertificateDebugPage'

const AppRoutes = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="find-tutors" element={<FindTutorPage />} />
        <Route path="premium" element={<PremiumFeaturesPage />} />
        <Route path="student-subscriptions" element={<PremiumFeaturesPage />} />
        <Route path="tutor-subscriptions" element={<TutorSubscriptionPage />} />
        <Route path="tutor/:id" element={<TutorProfilePage />} />
        <Route path="courses" element={<CourseListPage />} />
        <Route path="search-courses" element={<CourseSearchPage />} />
        <Route path="course-bundles" element={<CourseBundlesPage />} />
        <Route path="courses/:id" element={<CourseDetailPage />} />
        <Route path="courses/:id/player" element={<CoursePlayerPage />} />
        <Route path="courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <RoleBasedRedirect allowedRoles={['student']}>
            <Outlet />
          </RoleBasedRedirect>
        }
      >
        <Route path="bookings" element={<StudentBookingsPage />} />
        <Route path="course-list" element={<StudentCoursesPage />} />
        <Route path="profile" element={<Navigate to="/student/profile/personal-details" replace />} />
        <Route path="profile/personal-details" element={<ProfileSettingsPage />} />
        <Route path="profile/account-settings" element={<ProfileSettingsPage />} />
        <Route path="profile/identification" element={<ProfileSettingsPage />} />
        <Route path="course-player/:slug" element={<CoursePlayerPage />} />
        <Route path="assignments" element={<div>Student Assignments</div>} />
        <Route path="certificates" element={<StudentCertificatesPage />} />
        <Route path="favourites" element={<div>Student Favourites</div>} />
        <Route path="billing-detail" element={<div>Billing Details</div>} />
        <Route path="invoices" element={<div>Student Invoices</div>} />
        <Route path="disputes" element={<div>Student Disputes</div>} />
      </Route>

      {/* Tutor Routes */}
      <Route
        path="/tutor"
        element={
          <RoleBasedRedirect allowedRoles={['instructor']}>
            <TutorLayout
              walletBalance={2450.75}
              onWithdraw={() => console.log('Withdraw clicked')}
              onSignOut={() => console.log('Sign out clicked')}
              searchPlaceholder="Search students, courses..."
              searchValue=""
              onSearchChange={(value) => console.log('Search:', value)}
              searchShortcut="⌘K"
              userControls={tutorUserControls}
              mainItems={tutorMainSidebarItems}
              additionalItems={tutorAdditionalSidebarItems}
            />
          </RoleBasedRedirect>
        }
      >
        <Route index element={<Navigate to="/tutor/dashboard" replace />} />
        <Route path="dashboard" element={<TutorDashboardPage />} />
        <Route path="profile" element={<TutorProfilePage />} />
        <Route path="bookings" element={<TutorBookingsPage />} />
        <Route path="courses" element={<TutorCoursesPage />} />
        <Route path="bundles" element={<TutorBundlesPage />} />
        <Route path="assignments" element={<TutorAssignmentsPage />} />
        <Route path="community" element={<TutorCommunityPage />} />
        <Route path="quizzes" element={<TutorQuizzesPage />} />
        <Route path="inbox" element={<TutorInboxPage />} />
        <Route path="deals" element={<TutorDealsPage />} />
        <Route path="payouts" element={<TutorPayoutsPage />} />
        <Route path="invoices" element={<TutorInvoicesPage />} />
        <Route path="disputes" element={<TutorDisputesPage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <RoleBasedRedirect allowedRoles={['admin']}>
            <MainLayout />
          </RoleBasedRedirect>
        }
      >
        <Route path="insights" element={<div>Admin Insights</div>} />
        <Route path="manage-menus" element={<div>Manage Menus</div>} />
        <Route path="option-builder" element={<div>Option Builder</div>} />
        <Route path="pages" element={<div>Admin Pages</div>} />
        <Route path="email-settings" element={<div>Email Settings</div>} />
        <Route path="notification-settings" element={<div>Notification Settings</div>} />
        <Route path="taxonomies/languages" element={<div>Languages</div>} />
        <Route path="taxonomies/subjects" element={<div>Subjects</div>} />
        <Route path="taxonomies/subject-groups" element={<div>Subject Groups</div>} />
        <Route path="language-translator" element={<div>Language Translator</div>} />
        <Route path="packages" element={<div>Packages</div>} />
        <Route path="packages/installed" element={<div>Installed Packages</div>} />
        <Route path="upgrade" element={<div>Upgrade</div>} />
        <Route path="manage-admin-users" element={<div>Manage Admin Users</div>} />
        <Route path="users" element={<div>Users</div>} />
        <Route path="identity-verification" element={<div>Identity Verification</div>} />
        <Route path="reviews" element={<div>Reviews</div>} />
        <Route path="invoices" element={<div>Admin Invoices</div>} />
        <Route path="bookings" element={<div>Admin Bookings</div>} />
        <Route path="withdraw-requests" element={<div>Withdraw Requests</div>} />
        <Route path="commission-settings" element={<div>Commission Settings</div>} />
        <Route path="payment-methods" element={<div>Payment Methods</div>} />
        <Route path="subscriptions" element={<div>Subscriptions</div>} />
        <Route path="subscriptions/purchased" element={<div>Purchased Subscriptions</div>} />
        <Route path="blogs/create" element={<div>Create Blog</div>} />
        <Route path="all-blogs" element={<div>All Blogs</div>} />
        <Route path="blog-categories" element={<div>Blog Categories</div>} />
        <Route path="courses" element={<div>Admin Courses</div>} />
        <Route path="categories" element={<div>Admin Categories</div>} />
        <Route path="course-enrollments" element={<div>Course Enrollments</div>} />
        <Route path="commission-setting" element={<div>Commission Setting</div>} />
        <Route path="disputes" element={<div>Admin Disputes</div>} />
      </Route>

      {/* Common Routes accessible by all authenticated users */}
      <Route
        path="/course-list"
        element={
          isAuthenticated ? (
            <MainLayout />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      >
        <Route index element={<CourseListPage />} />
      </Route>
      <Route
        path="/find-tutors"
        element={
          isAuthenticated ? (
            <MainLayout />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      >
        <Route index element={<FindTutorPage />} />
      </Route>
      <Route
        path="/search-courses"
        element={
          isAuthenticated ? (
            <MainLayout />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      >
        <Route index element={<CourseSearchPage />} />
      </Route>
      <Route
        path="/messenger"
        element={
          isAuthenticated ? (
            <MainLayout />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      >
        <Route index element={<div>Messenger</div>} />
      </Route>
      <Route
        path="/forums"
        element={
          isAuthenticated ? (
            <MainLayout />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      >
        <Route index element={<div>Forums</div>} />
      </Route>
      <Route
        path="/courses"
        element={
          isAuthenticated ? (
            <MainLayout />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      >
        <Route index element={<CourseListPage />} />
      </Route>
      <Route
        path="/create-course"
        element={
          <RoleBasedRedirect allowedRoles={['instructor']}>
            <MainLayout />
          </RoleBasedRedirect>
        }
      >
        <Route index element={<div>Create Course</div>} />
      </Route>
      <Route
        path="/manage-course-bundles"
        element={
          <RoleBasedRedirect allowedRoles={['instructor']}>
            <MainLayout />
          </RoleBasedRedirect>
        }
      >
        <Route index element={<div>Manage Course Bundles</div>} />
      </Route>
      <Route
        path="/create-course-bundle"
        element={
          <RoleBasedRedirect allowedRoles={['instructor']}>
            <MainLayout />
          </RoleBasedRedirect>
        }
      >
        <Route index element={<div>Create Course Bundle</div>} />
      </Route>
      <Route
        path="/assignments"
        element={
          isAuthenticated ? (
            <MainLayout />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      >
        <Route index element={<div>Assignments</div>} />
      </Route>
      <Route
        path="/assignments/create"
        element={
          <RoleBasedRedirect allowedRoles={['instructor']}>
            <MainLayout />
          </RoleBasedRedirect>
        }
      >
        <Route index element={<div>Create Assignment</div>} />
      </Route>
      <Route
        path="/quizzes"
        element={
          isAuthenticated ? (
            <MainLayout />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      >
        <Route index element={<div>Quizzes</div>} />
      </Route>
      <Route
        path="/coupon-list"
        element={
          <RoleBasedRedirect allowedRoles={['instructor']}>
            <MainLayout />
          </RoleBasedRedirect>
        }
      >
        <Route index element={<div>Coupon List</div>} />
      </Route>
      <Route
        path="/certificate-list"
        element={
          <RoleBasedRedirect allowedRoles={['instructor']}>
            <MainLayout />
          </RoleBasedRedirect>
        }
      >
        <Route index element={<div>Certificate List</div>} />
      </Route>
      <Route
        path="/categories"
        element={
          isAuthenticated ? (
            <MainLayout />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      >
        <Route index element={<div>Categories</div>} />
      </Route>
      <Route
        path="/badges/badge-list"
        element={
          isAuthenticated ? (
            <MainLayout />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      >
        <Route index element={<div>Badge List</div>} />
      </Route>
      <Route
        path="/login-history"
        element={
          isAuthenticated ? (
            <MainLayout />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      >
        <Route index element={<div>Login History</div>} />
      </Route>
      <Route
        path="/ip-restriction"
        element={
          isAuthenticated ? (
            <MainLayout />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      >
        <Route index element={<div>IP Restriction</div>} />
      </Route>

      {/* Access Forbidden Route */}
      <Route path="/403" element={<AccessForbiddenPage />} />
      
      {/* Not Found Route */}
      <Route path="/404" element={<NotFoundPage />} />
      
      {/* Test Routes - Remove in production */}
      <Route path="/test-403" element={<AccessForbiddenPage />} />
      <Route path="/test-404" element={<NotFoundPage />} />
      <Route path="/debug/certificate" element={<CertificateDebugPage />} />

      {/* Legacy Dashboard Route - Redirect based on role */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Navigate to="/student/bookings" replace />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
