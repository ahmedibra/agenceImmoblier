import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HostRoute = () => {
  const { isAuthenticated, isHost, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }
  
  return (isAuthenticated && (isHost || isAdmin)) ? 
    <Outlet /> : 
    <Navigate to="/dashboard" />;
};

export default HostRoute;