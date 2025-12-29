import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '../../../services/authService';
import Toast from '../../../components/ui/Toast';

const OtpVerificationForm: React.FC = () => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Auto-verify when all 6 digits are entered
  const verifyOtp = useCallback(async (enteredOtp: string) => {
    if (enteredOtp.length !== 6) {
      setToastMessage(t('auth.otpVerification.invalidOtp'));
      return;
    }

    setLoading(true);
    setToastMessage(null);

    try {
      const signupDataStr = localStorage.getItem('signupVerification');
      if (!signupDataStr) {
        setToastMessage(t('auth.otpVerification.noSession'));
        return;
      }

      const signupData = JSON.parse(signupDataStr);
      const { email } = signupData;
      await authService.verifyOtp({ email, otp: enteredOtp });

      // Update verification status
      signupData.verified = true;
      localStorage.setItem('signupVerification', JSON.stringify(signupData));

      // Navigate to create new password
      navigate(`/create-new-password?email=${email}&role=${signupData.role}`);
    } catch (err) {
      setToastMessage(err instanceof Error ? err.message : t('auth.otpVerification.verificationFailed'));
    } finally {
      setLoading(false);
    }
  }, [navigate, t]);

  // Auto-verify when OTP is complete
  useEffect(() => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 6 && otp.every(digit => digit !== '')) {
      verifyOtp(enteredOtp);
    }
  }, [otp, verifyOtp]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData('text');
    if (paste.length === 6 && /^\d+$/.test(paste)) {
      const newOtp = paste.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      e.preventDefault();
    }
  };

  return (
    <>
      {/* Toast notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="error"
          onClose={() => setToastMessage(null)}
        />
      )}
      <div className="bg-[#F8F7F4] p-10 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full text-center">
          <h2 className="text-xl font-bold text-[#0b6459]">{t('auth.otpVerification.title')}</h2>
          <p className="text-gray-600 mt-2">{t('auth.otpVerification.description')}</p>

          <div className="mt-6">
            <div className="flex justify-center space-x-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  className="w-11 h-13 text-center text-2xl font-semibold bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b6459] focus:border-transparent transition"
                  type="text"
                  name="otp"
                  maxLength={1}
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={loading}
                />
              ))}
            </div>

            {/* Loading indicator */}
            {loading && (
              <p className="mt-4 text-sm text-[#0b6459] flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('auth.otpVerification.verifying')}
              </p>
            )}
          </div>

          <p className="mt-6 text-sm text-gray-600">
            {t('auth.otpVerification.didntReceiveCode')}{' '}
            <a href="#" className="font-medium text-[#0b6459] hover:text-[#084c43]">
              {t('auth.otpVerification.resend')}
            </a>
          </p>

          <p className="mt-6 text-center text-sm text-gray-600">
            <Link to="/login" className="font-medium text-[#0b6459] hover:text-[#084c43] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('auth.otpVerification.backToLogin')}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default OtpVerificationForm;