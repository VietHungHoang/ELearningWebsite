import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from "../components/LoginForm.tsx";
import AuthLayout from "../components/AuthLayout.tsx";
import IntroducePanel from '../../../components/auth/IntroducePanel.tsx';
import { useAuth } from '../../../context/AuthContext.tsx';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, state } = useAuth();

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