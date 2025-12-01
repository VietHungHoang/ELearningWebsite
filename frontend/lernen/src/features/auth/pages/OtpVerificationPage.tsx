import React from 'react';
import OtpVerificationForm from '../components/OtpVerificationForm';
import IntroducePanelLogin from '../../../components/auth/IntroducePanelLogin';
import AuthLayout from '../components/AuthLayout';

const OtpVerificationPage: React.FC = () => {
  return (
    <AuthLayout>
      <main className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden animate-fade-in-horizontal">
        <IntroducePanelLogin />
        <OtpVerificationForm />
      </main>
    </AuthLayout>
  );
};

export default OtpVerificationPage;