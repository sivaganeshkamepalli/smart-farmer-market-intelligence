import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Tractor,
  Wheat,
  TrendingUp,
  CloudSun,
  DollarSign,
  ShieldAlert,
  PieChart,
  User,
  Settings
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Home Dashboard', icon: LayoutDashboard },
  { path: '/ask-ai', label: 'Ask AI (ChatGPT)', icon: MessageSquare, highlight: true },
  { path: '/my-farm', label: 'My Farm & Plots', icon: Tractor },
  { path: '/crops', label: 'Crop Explorer (500+)', icon: Wheat },
  { path: '/market', label: 'Market Intelligence', icon: TrendingUp },
  { path: '/demand', label: 'Demand Trends', icon: PieChart },
  { path: '/climate', label: 'Climate & Water', icon: CloudSun },
  { path: '/investment', label: 'Financial Investment', icon: DollarSign },
  { path: '/risks', label: 'Risk Analysis', icon: ShieldAlert },
  { path: '/farm-plan', label: 'Land Allocator', icon: Tractor },
  { path: '/profile', label: 'Farmer Profile', icon: User }
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-gray-200 bg-white min-h-[calc(100vh-4rem)] p-4 space-y-1">
      <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-400">
        Navigation
      </div>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                isActive
                  ? 'bg-agri-50 text-agri-700 shadow-sm border border-agri-200'
                  : item.highlight
                  ? 'bg-agri-600 text-white hover:bg-agri-700 shadow-md shadow-agri-600/20'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <Icon className={`h-5 w-5 ${item.highlight ? 'text-white' : ''}`} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </aside>
  );
}
