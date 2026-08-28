import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import {
  Sprout,
  TrendingUp,
  Droplets,
  MapPin,
  MessageSquare,
  ShieldAlert,
  ArrowUpRight,
  Sun,
  PlusCircle,
  Calendar
} from 'lucide-react';

export default function Dashboard() {
  const { user, profile, farms } = useAuth();
  const navigate = useNavigate();
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const prodRes = await api.get('/products?limit=6');
      if (prodRes.data.success) {
        setTopProducts(prodRes.data.data);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  };

  const activeFarm = farms && farms.length > 0 ? farms[0] : null;
  const userName = profile?.full_name || user?.email || user?.phone || 'Farmer';
  const locationText = profile?.district && profile?.state ? `${profile.district}, ${profile.state}` : profile?.state || 'Not provided';
  const landText = activeFarm?.total_area ? `${activeFarm.total_area} Acres` : 'Not provided';
  const waterText = activeFarm?.water_availability || 'Not provided';
  const soilText = activeFarm?.soil_type || 'Not provided';

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-agri-800 via-agri-700 to-emerald-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block rounded-full bg-agri-600/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-agri-100 mb-3 border border-agri-400/30">
            Welcome, {userName}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Smart Farmer Decision Support Dashboard
          </h1>
          <p className="text-sm text-agri-100/90 leading-relaxed mb-6">
            Farm Size: <strong className="text-white">{landText}</strong> | Location: <strong className="text-white">{locationText}</strong> | Water: <strong className="text-white">{waterText}</strong>
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/ask-ai')}
              className="flex items-center space-x-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-agri-900 shadow-md hover:bg-agri-50 transition"
            >
              <MessageSquare className="h-4 w-4 text-agri-600" />
              <span>Ask AI What to Cultivate</span>
            </button>
            <Link
              to="/my-farm"
              className="flex items-center space-x-2 rounded-xl bg-agri-600/40 px-4 py-2.5 text-sm font-bold text-white hover:bg-agri-600/60 transition border border-white/20"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{activeFarm ? 'Manage Farm' : 'Set Up Farm'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Farm Land</span>
            <Sprout className="h-5 w-5 text-agri-600" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">{landText}</div>
          {activeFarm ? (
            <span className="text-xs text-gray-500">{soilText}</span>
          ) : (
            <Link to="/my-farm" className="text-xs font-bold text-agri-700 hover:underline flex items-center space-x-1 mt-1">
              <span>+ Add farm details</span>
            </Link>
          )}
        </div>

        <div className="rounded-2xl bg-white p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Water Availability</span>
            <Droplets className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">{waterText}</div>
          {activeFarm ? (
            <span className="text-xs text-emerald-600 font-semibold">Configured</span>
          ) : (
            <Link to="/my-farm" className="text-xs font-bold text-agri-700 hover:underline flex items-center space-x-1 mt-1">
              <span>+ Set water regime</span>
            </Link>
          )}
        </div>

        <div className="rounded-2xl bg-white p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Market Intelligence</span>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">500+ Crops</div>
          <span className="text-xs text-emerald-600 font-semibold">10-Yr Historical Prices</span>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location</span>
            <MapPin className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-lg font-extrabold text-gray-900 truncate">{locationText}</div>
          {profile?.state ? (
            <span className="text-xs text-gray-500">Configured location</span>
          ) : (
            <Link to="/profile" className="text-xs font-bold text-agri-700 hover:underline flex items-center space-x-1 mt-1">
              <span>+ Set farm location</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Recommendations Shortcut & Trending Crops */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Shortcut Card */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-agri-100/60 p-6 border border-agri-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">ChatGPT for Farmers Assistant</h3>
              <p className="text-xs text-gray-600 max-w-md">
                Get personalized crop recommendations with 3 risk options (Low Risk, Balanced, High Potential) based on 10-year market prices and climate suitability.
              </p>
            </div>
            <button
              onClick={() => navigate('/ask-ai')}
              className="flex items-center space-x-1.5 rounded-xl bg-agri-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-agri-700 transition shadow-sm"
            >
              <span>Ask Now</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          {/* Featured Crops List */}
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-base">Popular Crops & Agronomics</h3>
              <Link to="/crops" className="text-xs font-bold text-agri-700 hover:underline">
                Explore All 500+ Crops →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/crops/${p.id}`)}
                  className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5 hover:border-agri-300 hover:bg-agri-50/40 cursor-pointer transition"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-gray-900 text-sm">{p.name}</h4>
                    <span className="text-[10px] font-bold text-agri-800 bg-agri-100 px-2 py-0.5 rounded-full">
                      {p.category_name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{p.scientific_name}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-600 font-medium">
                    <span>Water: {p.water_level || 'MEDIUM'}</span>
                    <span className="text-agri-700 font-bold">Yield: ~{p.yield_average || 12} {p.yield_unit || 'tons'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Market Trends & Upcoming Events */}
        <div className="space-y-6">
          {/* Upcoming Demand Events */}
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-2 text-agri-800 font-bold text-base mb-3">
              <Calendar className="h-5 w-5 text-agri-600" />
              <h3>Upcoming Seasonal Demand Events</h3>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-amber-900">Ayyappa & Winter Festive Season</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">+45% Demand</span>
                </div>
                <p className="text-xs text-amber-800">
                  Peak demand surge for Vegetables, Milk, Flowers, and Fruits across South India.
                </p>
              </div>

              <div className="rounded-xl bg-blue-50/70 border border-blue-200 p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-blue-900">Export Hub Buying Window</span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">+30% Price Premium</span>
                </div>
                <p className="text-xs text-blue-800">
                  Verified exporters buying Grade-A Pomegranate, Tomato, and Red Chilli for UAE dispatch.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Risk Indicator */}
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-2 text-gray-900 font-bold text-base mb-3">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              <h3>Regional Market Risk Alert</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Oversupply risk is currently <strong className="text-emerald-700">LOW</strong> for Tree Crops (Badam, Guava) and <strong className="text-amber-700">MEDIUM</strong> for short-term Vegetables. Consider multi-crop diversification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
