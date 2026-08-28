import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sprout, User, LogOut, MessageSquare, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { user, profile, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center space-x-3">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-agri-600 text-white shadow-md shadow-agri-600/30">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900 leading-none block">SMART FARMER</span>
            <span className="text-xs font-semibold text-agri-700 tracking-wider uppercase">Market Intelligence</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {profile?.state && (
          <div className="hidden md:flex items-center space-x-1 text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
            <MapPin className="h-3.5 w-3.5 text-agri-600" />
            <span>{profile.district || profile.state}, {profile.state}</span>
          </div>
        )}

        <Link
          to="/ask-ai"
          className="flex items-center space-x-2 rounded-lg bg-agri-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-agri-700 transition"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Ask AI Assistant</span>
        </Link>

        {user ? (
          <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
            <Link to="/profile" className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-agri-700">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-agri-100 text-agri-800 font-bold">
                {profile?.full_name?.charAt(0) || 'F'}
              </div>
              <span className="hidden sm:inline-block">{profile?.full_name || 'Farmer Ramesh'}</span>
            </Link>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-gray-500 hover:text-red-600 transition"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <Link to="/login" className="text-sm font-semibold text-agri-700 hover:underline">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
