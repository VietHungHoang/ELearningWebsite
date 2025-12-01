import React from 'react';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import IntroducePanelLogin from '../../../components/auth/IntroducePanelLogin';
import AuthLayout from '../components/AuthLayout';

const ForgotPasswordPage: React.FC = () => {
  return (
    <AuthLayout>
      <main className="w-full max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden animate-fade-in-horizontal">
        <IntroducePanelLogin />
        <ForgotPasswordForm />
      </main>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;