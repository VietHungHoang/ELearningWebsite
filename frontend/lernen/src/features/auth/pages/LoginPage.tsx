import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginForm from "../components/LoginForm.tsx";
import AuthLayout from "../components/AuthLayout.tsx";
import { loginAsync } from '../store/authSlice';
import type { AppDispatch } from '../../../lib/store';
import IntroducePanel from '../../../components/auth/IntroducePanel.tsx';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = (email: string, password: string) => {
    dispatch(loginAsync({ email, password }));
    navigate('/');
  };

  return (
    <AuthLayout>
      <main className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden">
        <IntroducePanel />
        <LoginForm handleLogin={handleLogin} />
      </main>
    </AuthLayout>
  );
};

export default LoginPage;