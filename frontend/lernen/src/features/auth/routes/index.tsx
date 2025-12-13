import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import TutorSignUpPage from '../pages/TutorSignUpPage';
import StudentSignUpPage from '../pages/StudentSignUpPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import OtpVerificationPage from '../pages/OtpVerificationPage';
import CreateNewPasswordPage from '../pages/CreateNewPasswordPage';
import TutorOnboardingPage from '../pages/TutorOnboardingPage';

export default [
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/tutor-signup', element: <TutorSignUpPage /> },
  { path: '/student-signup', element: <StudentSignUpPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/otp', element: <OtpVerificationPage /> },
  { path: '/create-new-password', element: <CreateNewPasswordPage /> },
  { path: '/onboarding/tutor', element: <TutorOnboardingPage /> },
];
