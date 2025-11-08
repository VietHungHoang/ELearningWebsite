import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IntroducePanel from '../../../components/auth/IntroducePanel';
import AuthLayout from '../components/AuthLayout';
import SignUpForm from '../components/SignUpForm';
import authService from '../../../services/authService';

const SignUpPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignUp = async (data: { email: string; password: string; fullName: string }) => {
    setLoading(true);
    setError(null);
    try {
      await authService.signup(data);
      // Navigate to login page after successful signup
      navigate('/login');
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
        <SignUpForm onSubmit={handleSignUp} loading={loading} />
        {error && (
          <div className="col-span-full mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </main>
    </AuthLayout>
  );
};

export default SignUpPage;