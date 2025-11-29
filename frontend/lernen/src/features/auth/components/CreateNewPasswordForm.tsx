import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import authService from '../../../services/authService';

interface CreateNewPasswordFormProps {
  mode?: 'signup' | 'reset';
}

const CreateNewPasswordForm: React.FC<CreateNewPasswordFormProps> = ({ mode = 'signup' }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email');
  const role = searchParams.get('role') || 'student';

  useEffect(() => {
    if (!email) {
      navigate('/signup');
      return;
    }

    const signupDataStr = localStorage.getItem('signupVerification');
    if (!signupDataStr) {
      navigate('/signup');
      return;
    }

    const signupData = JSON.parse(signupDataStr);
    if (!signupData.verified) {
      navigate('/signup');
    }
  }, [email, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const accountData = await authService.createAccount({ email: email!, password: formData.password, role });

      // Redirect based on role
      if (role === 'tutor') {
        // Store tutor account data for onboarding step 1
        localStorage.setItem('tutorAccountData', JSON.stringify({
          id: accountData.id,
          email: accountData.email,
          name: accountData.name,
        }));
        
        // Clean up signup verification data
        localStorage.removeItem('signupVerification');
        
        // Tutors go to onboarding flow, start at step 1
        navigate('/onboarding/tutor?step=1');
      } else {
        // Store student credentials for auto-fill login
        localStorage.setItem('studentLoginData', JSON.stringify({
          email: accountData.email,
          password: formData.password,
        }));
        
        // Clean up signup verification data
        localStorage.removeItem('signupVerification');
        
        // Students go directly to login
        navigate('/login');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8F7F4] p-10 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full">
        <h2 className="text-xl font-bold text-[#0b6459]">
          {mode === 'reset' ? 'Reset Password' : 'Create New Password'}
        </h2>
        <p className="text-gray-600 mt-2">
          {mode === 'reset'
            ? 'Enter your new password below.'
            : 'Your new password must be different from previous used passwords.'}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0b6459] focus:border-[#0b6459] sm:text-sm"
              placeholder="New Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>

          <div className="relative">
            <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0b6459] focus:border-[#0b6459] sm:text-sm"
              placeholder="Confirm New Password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#0b6459] hover:bg-[#084c43] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b6459] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : mode === 'reset' ? 'Reset Password' : 'Create Password'}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          <Link to="/login" className="font-medium text-[#0b6459] hover:text-[#084c43] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default CreateNewPasswordForm;