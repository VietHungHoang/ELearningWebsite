import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import IntroducePanel from "../../../components/ui/IntroducePanel.tsx";
import LoginForm from "../components/LoginForm.tsx";
import AuthLayout from "../components/AuthLayout.tsx";
import { loginAsync } from '../store/authSlice';
import type {AuthPage} from "../../../App.tsx";
import type { AppDispatch } from '../../../lib/store';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = (email: string, password: string) => {
    dispatch(loginAsync({ email, password }));
    navigate('/');
  };

  const navigateTo = (page: AuthPage) => {
    navigate('/' + page);
  };

  return (
    <AuthLayout>
      <main className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden">
        <IntroducePanel />
        <LoginForm navigateTo={navigateTo} handleLogin={handleLogin} />
      </main>
    </AuthLayout>
  );
};

export default LoginPage;