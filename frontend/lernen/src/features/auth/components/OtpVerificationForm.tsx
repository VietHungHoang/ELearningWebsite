import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const OtpVerificationForm: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    console.log('Verifying OTP:', enteredOtp);
    // Here you would verify the OTP via an API call.
    // On success, navigate to a new password creation page.
    if (enteredOtp.length === 6) {
      navigate('/create-new-password');
    } else {
      alert('Please enter a valid 6-digit OTP.');
    }
  };


  return (
    <div className="bg-[#F8F7F4] p-10 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full text-center">
        <h2 className="text-xl font-bold text-[#0b6459]">Check your email</h2>
        <p className="text-gray-600 mt-2">We've sent a 6-digit code to your email address.</p>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2">
            {otp.map((data, index) => (
              <input
                key={index}
                // Fix: Changed arrow function to use a block body to ensure it returns `void` and satisfies the `ref` prop's type.
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                className="w-12 h-14 text-center text-2xl font-semibold bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b6459] focus:border-transparent transition"
                type="text"
                name="otp"
                maxLength={1}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => e.target.select()}
                onPaste={index === 0 ? handlePaste : undefined}
              />
            ))}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#0b6459] hover:bg-[#084c43] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b6459] transition-colors"
            >
              Verify
            </button>
          </div>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Didn't receive the code?{' '}
          <a href="#" className="font-medium text-[#0b6459] hover:text-[#084c43]">
            Resend
          </a>
        </p>

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

export default OtpVerificationForm;