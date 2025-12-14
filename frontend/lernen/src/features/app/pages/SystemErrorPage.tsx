import React from 'react';
import { Link } from 'react-router-dom';

const SystemErrorPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Something Went Wrong</h2>
        <p className="text-gray-600 mb-8">
          We're sorry, but something went wrong on our end. Please try again later.
        </p>
        <Link
          to="/"
          className="inline-block bg-[#0b6459] text-white px-6 py-3 rounded-lg hover:bg-[#084c43] transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default SystemErrorPage;
