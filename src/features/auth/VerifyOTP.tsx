import React, { useState } from 'react';
import { useVerifyOtpMutation, useResendOtpMutation } from '../../api/authApi';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [verifyOtp, { isLoading, error }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: resending }] = useResendOtpMutation();
  const navigate = useNavigate();
  const location = useLocation();


  const email = (location.state as any)?.email || localStorage.getItem('otpEmail') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOtp({ email, otp }).unwrap();
      alert('OTP verified! You can now login.');
      localStorage.removeItem('otpEmail');
      navigate('/login');
    } catch {
      
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email }).unwrap();
      alert('OTP resent successfully');
    } catch {
      alert('Failed to resend OTP');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Verify Your Email</h2>
      {email && (
        <p className="text-center text-gray-600 mb-4">
          A verification code has been sent to: <strong>{email}</strong>
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full border border-gray-300 p-2 rounded text-center tracking-widest text-lg"
        />
        {error && (
          <p className="text-red-600 text-sm">
            {(error as any)?.data?.message || 'OTP verification failed'}
          </p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
        <button
          disabled={resending}
          onClick={handleResend}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {resending ? 'Resending...' : 'Resend OTP'}
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
