import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoginForm from "../components/LoginForm.tsx";
import AuthLayout from "../components/AuthLayout.tsx";
import IntroducePanel from '../../../components/auth/IntroducePanel.tsx';
import { useAuth } from '../../../context/AuthContext.tsx';
import authService from '../../../services/authService';
import { useEffect, useRef } from 'react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, state } = useAuth();
  const hasCalledCallback = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code && !hasCalledCallback.current) {
      hasCalledCallback.current = true;
      // Handle Google OAuth callback
      const handleGoogleCallback = async () => {
        try {
          const tokens = await authService.googleLogin({
            code,
            redirectUri: window.location.origin + '/login'
          });
          // Store tokens (you might want to use a more secure method)
          localStorage.setItem('accessToken', tokens.accessToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);
          // Navigate to home or dashboard
          navigate('/');
        } catch (error) {
          console.error('Google login failed:', error);
          hasCalledCallback.current = false;
          // Handle error, maybe show message
        }
      };
      handleGoogleCallback();
    }
  }, [searchParams, navigate]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password });
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <AuthLayout>
      <main className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden">
        <IntroducePanel />
        <LoginForm handleLogin={handleLogin} isLoading={state.status === 'loading'} />
      </main>
    </AuthLayout>
  );
};

export default LoginPage;