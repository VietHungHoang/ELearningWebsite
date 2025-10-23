import React, { useState } from 'react';
import {EyeOffIcon} from "../../../icon/EyeOffIcon.tsx";
import {EyeIcon} from "../../../icon/EyeIcon.tsx";
import {GoogleIcon} from "../../../icon/GoogleIcon.tsx";
import type {AuthPage} from "../../../App.tsx";


interface LoginFormProps {
  navigateTo: (page: AuthPage) => void;
  handleLogin: (email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ navigateTo, handleLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div className="bg-[#F8F7F4] p-10 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full">
        <h2 className="text-xl font-bold text-[#0b6459]">Welcome back!</h2>
        <p className="text-gray-600 mt-2">We're glad to have you back.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" className="text-sm font-medium text-gray-700">
              Email address <span className="text-red-500">*</span>
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0b6459] focus:border-[#0b6459] sm:text-sm"
              placeholder="Email address"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0b6459] focus:border-[#0b6459] sm:text-sm"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#0b6459] focus:ring-[#0b6459] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember Me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('forgotPassword'); }} className="font-medium text-[#0b6459] hover:text-[#084c43]">
                Forgot Password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#0b6459] hover:bg-[#084c43] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b6459] transition-colors"
            >
              Login
            </button>
          </div>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          Don't have an Account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('signup'); }} className="font-medium text-[#0b6459] hover:text-[#084c43]">
            Sign up
          </a>
        </p>

        <div className="mt-5 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        
        <div className="mt-5">
           <button
              type="button"
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b6459] transition-colors"
            >
              <GoogleIcon />
              <span className="ml-3">Sign in with Google</span>
            </button>
        </div>

      </div>
    </div>
  );
};

export default LoginForm;