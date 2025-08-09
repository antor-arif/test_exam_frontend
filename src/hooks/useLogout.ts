import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCredentials } from '../features/auth/authSlice';
import { clearAuthData } from '../utils/authUtils';

export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(clearCredentials());
    clearAuthData();
    navigate('/login');
  };

  return logout;
};
