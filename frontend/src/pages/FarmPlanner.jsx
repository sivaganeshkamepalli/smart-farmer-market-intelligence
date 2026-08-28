import React, { useState } from 'react';
import api from '../services/api';
import LandAllocationWidget from '../components/chat/LandAllocationWidget';
import { PieChart, Sliders } from 'lucide-react';

export default function FarmPlanner() {
  const [totalLand, setTotalLand] = useState('2.0');
  const [waterLevel, setWaterLevel] = useState('MEDIUM');
  const [budget, setBudget] = useState('100000');
  const [riskPreference, setRiskPreference] = useState('BALANCED');
  const [allocation, setAllocation] = useState(null);

  const handleCalculate = async (e) => {
    e?.preventDefault();
    try {
      const res = await api.post('/recommendations/land-allocation', {
        totalLand: parseFloat(totalLand),
        waterLevel,
        budget: parseFloat(budget),
        riskPreference
      });
      if (res.data.success) {
        setAllocation(res.data.data);
      }
    } catch (err) {
      console.error('Error calculating land allocation:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dynamic Land Allocation Planner</h1>
        <p className="text-xs text-gray-500">Calculate optimal land division across Long-Term Tree Crops, Constant Demand Staples, and Seasonal Opportunities.</p>
      </div>

      <form onSubmit={handleCalculate} className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-base flex items-center space-x-2">
          <Sliders className="h-5 w-5 text-agri-600" />
          <span>Configure Allocation Parameters</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Total Land Area (Acres)</label>
            <input
              type="number"
              step="0.5"
              value={totalLand}
              onChange={(e) => setTotalLand(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Water Availability</label>
            <select
              value={waterLevel}
              onChange={(e) => setWaterLevel(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none bg-white"
            >
              <option value="LOW">Low Water / Rainfed</option>
              <option value="MEDIUM">Moderate Water / Drip</option>
              <option value="HIGH">High Water / Canal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Annual Budget (₹)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Farmer Risk Profile</label>
            <select
              value={riskPreference}
              onChange={(e) => setRiskPreference(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none bg-white"
            >
              <option value="LOW_RISK">Low Risk (Security First)</option>
              <option value="BALANCED">Balanced (Recommended)</option>
              <option value="HIGH_POTENTIAL">High Potential (Aggressive)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="rounded-xl bg-agri-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-agri-700 shadow-sm transition"
          >
            Compute Dynamic Allocation
          </button>
        </div>
      </form>

      {/* Render Visual Allocation Widget */}
      {allocation && <LandAllocationWidget allocation={allocation} />}
    </div>
  );
}
