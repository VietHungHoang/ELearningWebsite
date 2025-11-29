import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IntroducePanel from '../../../components/auth/IntroducePanel';
import AuthLayout from '../components/AuthLayout';
import SignUpForm from '../components/SignUpForm';
import authService from '../../../services/authService';
import type { StartSignUpRequest } from '../../../types/api';

const TutorSignUpPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignUp = async (data: StartSignUpRequest) => {
    setLoading(true);
    setError(null);
    try {
      // Always set role as 'tutor' for this page
      const tutorData = { ...data, role: 'tutor' as const };
      await authService.signUpInitiate(tutorData);
      
      // Store signup data for OTP verification
      localStorage.setItem('signupVerification', JSON.stringify({
        email: tutorData.email,
        role: 'tutor',
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
        <IntroducePanel />
        <SignUpForm onSubmit={handleSignUp} loading={loading} role="tutor" error={error} />
      </main>
    </AuthLayout>
  );
};

export default TutorSignUpPage;
