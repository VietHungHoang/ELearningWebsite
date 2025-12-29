import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import TutorSignUpPage from '../pages/TutorSignUpPage';
import StudentSignUpPage from '../pages/StudentSignUpPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import OtpVerificationPage from '../pages/OtpVerificationPage';
import CreateNewPasswordPage from '../pages/CreateNewPasswordPage';
import TutorResumeInputPage from '../pages/TutorResumeInputPage';
import TutorOnboardingPage from '../pages/TutorOnboardingPage';
import TutorOnboardingCompletionPage from '../pages/TutorOnboardingCompletionPage';
import OAuthCallbackPage from '../pages/OAuthCallbackPage';

export default [
  { path: '/login', element: <LoginPage /> },
  { path: '/oauth/callback', element: <OAuthCallbackPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/tutor-signup', element: <TutorSignUpPage /> },
  { path: '/student-signup', element: <StudentSignUpPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/otp', element: <OtpVerificationPage /> },
  { path: '/create-new-password', element: <CreateNewPasswordPage /> },
  { path: '/tutor-resume-input', element: <TutorResumeInputPage /> },
  { path: '/onboarding/tutor', element: <TutorOnboardingPage /> },
  { path: '/onboarding-completion', element: <TutorOnboardingCompletionPage /> },
];
