import React, { JSX } from 'react';
import { useAppSelector } from '../hooks';
import { Navigate } from 'react-router-dom';
import Login from '../features/auth/Login';

interface PublicRouteProps {
  children: JSX.Element;
}


const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  if (isAuthenticated) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default PublicRoute;
