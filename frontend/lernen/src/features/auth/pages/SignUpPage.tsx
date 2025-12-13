import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import IntroducePanelLogin from '../../../components/auth/IntroducePanelLogin';
import AuthLayout from '../components/AuthLayout';
import SignUpForm from '../components/SignUpForm';
import authService from '../../../services/authService';
import type { StartSignUpRequest, UserRole } from '../../../types/api';

const SignUpPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') as UserRole || 'student';

  const handleSignUp = async (data: StartSignUpRequest) => {
    setLoading(true);
    setError(null);
    try {
      await authService.signUpInitiate(data);
      // Store signup data for OTP verification
      localStorage.setItem('signupVerification', JSON.stringify({
        email: data.email,
        role: data.role,
        initiated: true
      }));
      // Navigate to OTP verification page after successful signup
      navigate('/otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <main className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden animate-fade-in-horizontal">
        <IntroducePanelLogin />
        <SignUpForm onSubmit={handleSignUp} loading={loading} role={role} error={error} />
      </main>
    </AuthLayout>
  );
};

export default SignUpPage;