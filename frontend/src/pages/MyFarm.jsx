import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Tractor, Plus, MapPin, Droplets, DollarSign, Layers } from 'lucide-react';

export default function MyFarm() {
  const [farms, setFarms] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    farmName: '',
    totalArea: '2.0',
    location: 'Guntur, Andhra Pradesh',
    soilType: 'Red Loamy',
    soilPh: '6.8',
    waterAvailability: 'MEDIUM',
    irrigationType: 'Drip Irrigation',
    annualBudget: '100000'
  });

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const res = await api.get('/farms');
      if (res.data.success) {
        setFarms(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching farms:', err);
    }
  };

  const handleCreateFarm = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/farms', formData);
      if (res.data.success) {
        setShowAdd(false);
        fetchFarms();
      }
    } catch (err) {
      console.error('Error creating farm:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Farms & Plot Analysis</h1>
          <p className="text-xs text-gray-500">Manage farm parameters, soil pH, water availability, and plot allocations.</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center space-x-2 rounded-xl bg-agri-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-agri-700 transition shadow-sm self-start"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Farm</span>
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleCreateFarm} className="rounded-2xl bg-white border border-agri-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-base">Register New Farm</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Farm Name</label>
              <input
                type="text"
                required
                value={formData.farmName}
                onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                placeholder="e.g. Green Acres"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Total Area (Acres)</label>
              <input
                type="number"
                step="0.5"
                required
                value={formData.totalArea}
                onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Water Availability</label>
              <select
                value={formData.waterAvailability}
                onChange={(e) => setFormData({ ...formData, waterAvailability: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none"
              >
                <option value="VERY_LOW">Very Low</option>
                <option value="LOW">Low Water / Rainfed</option>
                <option value="MEDIUM">Moderate Water / Drip</option>
                <option value="HIGH">Abundant Water / Canal</option>
                <option value="VERY_HIGH">Very High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Annual Budget (₹)</label>
              <input
                type="number"
                value={formData.annualBudget}
                onChange={(e) => setFormData({ ...formData, annualBudget: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-agri-600 px-5 py-2 text-xs font-bold text-white hover:bg-agri-700 shadow-sm"
            >
              Save Farm
            </button>
          </div>
        </form>
      )}

      {/* Farms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {farms.map((farm) => (
          <div key={farm.id} className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-agri-100 text-agri-700">
                  <Tractor className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{farm.farm_name}</h3>
                  <p className="text-xs text-gray-500 flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-agri-600" />
                    <span>{farm.location}</span>
                  </p>
                </div>
              </div>
              <span className="text-sm font-extrabold text-agri-700 bg-agri-50 px-3 py-1 rounded-full border border-agri-200">
                {farm.total_area} Acres
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 text-xs">
              <div className="bg-gray-50 p-2.5 rounded-xl">
                <span className="text-gray-500 block">Soil Type</span>
                <span className="font-bold text-gray-900">{farm.soil_type || 'Red Loamy'}</span>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl">
                <span className="text-gray-500 block">Water Regime</span>
                <span className="font-bold text-blue-600">{farm.water_availability}</span>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl">
                <span className="text-gray-500 block">Annual Budget</span>
                <span className="font-bold text-emerald-600">₹{farm.annual_budget?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Plot Breakdown */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-2 flex items-center space-x-1">
                <Layers className="h-3.5 w-3.5" />
                <span>Farm Plots ({farm.plots?.length || 0})</span>
              </h4>
              <div className="space-y-2">
                {farm.plots?.map((plot) => (
                  <div key={plot.id} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-3 text-xs">
                    <div>
                      <span className="font-bold text-gray-900">{plot.plot_name}</span>
                      <span className="text-gray-500 ml-2">({plot.area} Acres)</span>
                    </div>
                    <span className="font-semibold text-agri-700 bg-agri-50 px-2 py-0.5 rounded-full">
                      Crop: {plot.current_crop || 'Fallow'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
