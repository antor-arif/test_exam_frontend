import React, { useState } from 'react';
import { useForgotPasswordMutation } from '../../api/authApi';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const result = await forgotPassword({ email }).unwrap();
      setMessage(result.message || 'If your email exists in our system, you will receive an OTP.');
      setOtpSent(true);
    } catch (err: any) {
      setError(err.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>
      
      {otpSent ? (
        <div className="text-center">
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
            <p className="font-semibold">OTP Sent!</p>
            <p>{message}</p>
          </div>
          <p className="mb-4">Please check your email for the OTP code to reset your password.</p>
          <Link 
            to="/reset-password" 
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Continue to Reset Password
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {error && (
            <div className="p-2 bg-red-100 text-red-600 rounded">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {isLoading ? 'Sending...' : 'Send OTP Code'}
          </button>
          
          <div className="text-center mt-4">
            <Link to="/login" className="text-blue-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
