import React from 'react';
import IntroducePanel from '../../../components/auth/IntroducePanel';
import AuthLayout from '../components/AuthLayout';
import SignUpForm from '../components/SignUpForm';

const SignUpPage: React.FC = () => {
  return (
    <AuthLayout>
      <main className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden animate-fade-in-horizontal">
      <IntroducePanel />
      <SignUpForm />
    </main>
    </AuthLayout>
  );
};

export default SignUpPage;