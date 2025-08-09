import React, { useState } from 'react';
import { useRegisterMutation } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [register, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ name, email, password }).unwrap();
      
      localStorage.setItem('otpEmail', email);
      
      navigate('/verify-otp', { state: { email } });
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
      <p className="text-center text-gray-600 mb-4">
        After registration, you will need to verify your email with an OTP code.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full border border-gray-300 p-2 rounded"
        />
        {error && (
          <p className="text-red-500 text-sm">
            {(error as any)?.data?.message || 'Registration failed'}
          </p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account? {" "}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-blue-600 hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Register;
