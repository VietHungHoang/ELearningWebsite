import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import authService from '../../../services/authService';


interface LoginFormProps {
  handleLogin: (email: string, password: string) => void;
  isLoading?: boolean;
  role: 'student' | 'tutor';
}

const LoginForm: React.FC<LoginFormProps> = ({ handleLogin, isLoading = false, role }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Auto-fill email and password for student after account creation
  useEffect(() => {
    const studentLoginData = localStorage.getItem('studentLoginData');
    if (studentLoginData) {
      try {
        const parsed = JSON.parse(studentLoginData);
        setEmail(parsed.email || '');
        setPassword(parsed.password || '');
        // Clear the data after using it
        localStorage.removeItem('studentLoginData');
      } catch (err) {
        console.error('Failed to parse student login data:', err);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      handleLogin(email, password);
    }
  };

  return (
    <div className="bg-[#F8F7F4] p-10 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full">
        <h2 className="text-2xl font-bold text-[#0b6459]">{t('auth.login.welcomeBack')}</h2>
        <p className="text-gray-600 mt-2">{t('auth.login.gladToHaveYouBack')}</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" className="text-sm font-medium text-gray-700">
              {t('auth.login.emailAddress')} <span className="text-red-500">*</span>
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0b6459] focus:border-[#0b6459] sm:text-sm disabled:opacity-50"
              placeholder={t('auth.login.emailPlaceholder')}
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              {t('auth.login.password')} <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0b6459] focus:border-[#0b6459] sm:text-sm disabled:opacity-50"
              placeholder={t('auth.login.passwordPlaceholder')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showPassword ? <FiEyeOff className='h-5 w-5' /> : <FiEye className='h-5 w-5' />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="remember-me" className="flex items-center cursor-pointer select-none group">
              <div className="relative">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="peer sr-only"
                />
                <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded-sm transition-colors duration-200 group-hover:border-gray-400 peer-focus:ring-2 peer-focus:ring-offset-1 peer-focus:ring-[#0b6459]/50 peer-checked:bg-[#0b6459] peer-checked:border-[#0b6459]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 4L3.5 6L8.5 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <span className="ml-2 block text-sm text-gray-900">
                {t('auth.login.rememberMe')}
              </span>
            </label>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-[#0b6459] hover:text-[#084c43]">
                {t('auth.login.forgotPassword')}
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#0b6459] hover:bg-[#084c43] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b6459] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('auth.login.loggingIn') : t('auth.login.login')}
            </button>
          </div>
        </form>

        <p className="mt-3 text-center text-sm text-gray-600">
          {t('auth.login.dontHaveAccount')}
        </p>
        <p className="mt-1 text-center text-sm">
          <Link to="/signup?role=student" className="font-medium text-[#0b6459] hover:text-[#084c43] underline">
            {t('auth.login.signUpAsStudent')}
          </Link>
          {' '}{t('auth.login.or')}{' '}
          <Link to="/signup?role=tutor" className="font-medium text-[#0b6459] hover:text-[#084c43] underline">
            {t('auth.login.signUpAsTutor')}
          </Link>
        </p>

        <div className="mt-5 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">{t('auth.login.orSeparator')}</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={async () => {
              try {
                const authUrl = await authService.getGoogleAuthUrl(
                  window.location.origin + `/login?role=${role}`
                );
                window.location.href = authUrl;
              } catch (error) {
                console.error('Failed to get Google auth URL:', error);
              }
            }}
            className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b6459] transition-colors cursor-pointer"
          >
            <FcGoogle />
            <span className="ml-3">{t('auth.login.signInWithGoogle')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginForm;