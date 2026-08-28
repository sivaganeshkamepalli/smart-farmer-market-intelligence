import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Save, MapPin, Globe } from 'lucide-react';

export default function Profile() {
  const { profile, fetchCurrentUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || 'Ramesh Kumar',
    preferredLanguage: profile?.preferred_language || 'English',
    state: profile?.state || 'Andhra Pradesh',
    district: profile?.district || 'Guntur',
    village: profile?.village || 'Tenali'
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/farmer/profile', formData);
      if (res.data.success) {
        setSaved(true);
        await fetchCurrentUser();
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Farmer Profile Settings</h1>
        <p className="text-xs text-gray-500">Configure your personal preferences, preferred language, and regional farm location.</p>
      </div>

      {saved && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800">
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Language</label>
          <select
            value={formData.preferredLanguage}
            onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none bg-white"
          >
            <option value="English">English</option>
            <option value="Telugu">Telugu</option>
            <option value="Hindi">Hindi</option>
            <option value="Tamil">Tamil</option>
            <option value="Kannada">Kannada</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">District</label>
            <input
              type="text"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Village</label>
            <input
              type="text"
              value={formData.village}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center space-x-1.5 rounded-xl bg-agri-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-agri-700 transition shadow-sm"
          >
            <Save className="h-4 w-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
