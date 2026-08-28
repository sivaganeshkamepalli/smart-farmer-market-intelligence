import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Sprout } from 'lucide-react';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-700">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-agri-600 text-white shadow-lg mb-4">
          <Sprout className="h-8 w-8 animate-pulse" />
        </div>
        <div className="flex items-center space-x-2 text-sm font-semibold">
          <Loader2 className="h-5 w-5 animate-spin text-agri-600" />
          <span>Verifying Farmer Session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
