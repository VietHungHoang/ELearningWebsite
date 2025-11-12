import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import OtpVerificationPage from '../pages/OtpVerificationPage';
import CreateNewPasswordPage from '../pages/CreateNewPasswordPage';

export default [
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/otp', element: <OtpVerificationPage /> },
  { path: '/create-new-password', element: <CreateNewPasswordPage /> },
];
