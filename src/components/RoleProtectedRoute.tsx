import React, { JSX } from 'react';
import { useAppSelector } from '../hooks';
import { Navigate } from 'react-router-dom';

interface Props {
  children: JSX.Element;
  allowedRoles: string[];
}

const RoleProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const userRole = user?.role;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
