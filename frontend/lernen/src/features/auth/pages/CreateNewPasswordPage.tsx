import React from 'react';
import IntroducePanel from '../../../components/auth/IntroducePanel';
import CreateNewPasswordForm from '../components/CreateNewPasswordForm';

const CreateNewPasswordPage: React.FC = () => {
  return (
    <main className="w-full max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden animate-fade-in-horizontal">
      <IntroducePanel />
      <CreateNewPasswordForm />
    </main>
  );
};

export default CreateNewPasswordPage;