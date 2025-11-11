import React from 'react';
import OtpVerificationForm from '../components/OtpVerificationForm';
import IntroducePanel from '../../../components/auth/IntroducePanel';

const OtpVerificationPage: React.FC = () => {
  return (
    <main className="w-full max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden animate-fade-in-horizontal">
      <IntroducePanel />
      <OtpVerificationForm />
    </main>
  );
};

export default OtpVerificationPage;