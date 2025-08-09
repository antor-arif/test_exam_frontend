import React from 'react';
import { useLogoutMutation } from '../../api/authApi';
import { useLogout } from '../../hooks/useLogout';

const LogoutButton: React.FC = () => {
  const [logoutApi] = useLogoutMutation();
  const logout = useLogout();

  const handleLogout = async () => {
    try {

      await logoutApi().unwrap();
    } catch (error) {
      console.log('Logout API error, clearing credentials anyway');
    }
    
    logout();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-red-600 hover:text-red-800 transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
