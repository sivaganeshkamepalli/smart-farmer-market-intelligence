import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Wheat, TrendingUp, Tractor } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around bg-white border-t border-gray-200 py-2 px-1 lg:hidden shadow-lg">
        <NavLink to="/" end className={({ isActive }) => `flex flex-col items-center text-xs font-semibold ${isActive ? 'text-agri-700' : 'text-gray-500'}`}>
          <LayoutDashboard className="h-5 w-5" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/ask-ai" className={({ isActive }) => `flex flex-col items-center text-xs font-semibold ${isActive ? 'text-agri-700' : 'text-gray-500'}`}>
          <div className="p-1.5 bg-agri-600 text-white rounded-full -mt-4 shadow-lg">
            <MessageSquare className="h-5 w-5" />
          </div>
          <span className="mt-0.5">Ask AI</span>
        </NavLink>
        <NavLink to="/crops" className={({ isActive }) => `flex flex-col items-center text-xs font-semibold ${isActive ? 'text-agri-700' : 'text-gray-500'}`}>
          <Wheat className="h-5 w-5" />
          <span>Crops</span>
        </NavLink>
        <NavLink to="/market" className={({ isActive }) => `flex flex-col items-center text-xs font-semibold ${isActive ? 'text-agri-700' : 'text-gray-500'}`}>
          <TrendingUp className="h-5 w-5" />
          <span>Market</span>
        </NavLink>
        <NavLink to="/my-farm" className={({ isActive }) => `flex flex-col items-center text-xs font-semibold ${isActive ? 'text-agri-700' : 'text-gray-500'}`}>
          <Tractor className="h-5 w-5" />
          <span>My Farm</span>
        </NavLink>
      </nav>
    </div>
  );
}
