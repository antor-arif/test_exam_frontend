import React from 'react';
import { useLogout } from '../hooks/useLogout';


export const LogoutLink: React.FC = () => {
  const logout = useLogout();
  
  return (
    <button 
      onClick={logout}
      className="text-blue-600 hover:underline"
    >
      Logout
    </button>
  );
};

export const LogoutButton: React.FC = () => {
  const logout = useLogout();
  
  return (
    <button 
      onClick={logout}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
};

export const performLogout = async (navigate: any, dispatch: any) => {
  const { clearCredentials } = await import('../features/auth/authSlice');
  const { clearAuthData } = await import('../utils/authUtils');
  
  dispatch(clearCredentials());
  clearAuthData();
  navigate('/login');
};
