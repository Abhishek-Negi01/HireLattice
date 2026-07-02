import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loader from '../components/Loader/Loader';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isSignedIn, isLoaded, role } = useAuth();

  if (!isLoaded) {
    return <Loader text="Verifying authentication session..." fullscreen />;
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
