import React, { useState } from 'react';
import { useLoginMutation } from '../../api/authApi';
import { useAppDispatch } from '../../hooks/index';
import { setCredentials } from './authSlice';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', { email, password });
      const userData = await login({ email, password }).unwrap();
      console.log('Login successful, user data:', userData);
      
      localStorage.setItem('accessToken', userData.accessToken);
      localStorage.setItem('refreshToken', userData.refreshToken);
      
      dispatch(
        setCredentials({
          user: userData.user,
          accessToken: userData.accessToken,
          refreshToken: userData.refreshToken,
        })
      );
      
      console.log('Credentials set, navigating to home');
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          className="w-full border border-gray-300 p-2 rounded"
        />
        {error && (
          <p className="text-red-500 text-sm">
            {(error as any)?.data?.message || 'Login failed'}
          </p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account? {" "}
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="text-blue-600 hover:underline"
        >
          Register
        </button>
      </p>
      <div className="mt-6 text-center">
        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default Login;