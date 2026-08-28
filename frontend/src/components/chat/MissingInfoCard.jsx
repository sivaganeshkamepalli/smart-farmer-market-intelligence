import React, { useState } from 'react';
import { HelpCircle, RefreshCw } from 'lucide-react';

export default function MissingInfoCard({ missingInfo, onRecalculate }) {
  const [formData, setFormData] = useState({
    landArea: '2.0',
    waterLevel: 'MEDIUM',
    location: 'Andhra Pradesh'
  });

  if (!missingInfo || missingInfo.length === 0) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const prompt = `I have ${formData.landArea} acres land with ${formData.waterLevel} water availability in ${formData.location}. What should I cultivate?`;
    onRecalculate(prompt);
  };

  return (
    <div className="my-3 rounded-2xl bg-amber-50/80 border border-amber-200 p-4 shadow-sm">
      <div className="flex items-center space-x-2 text-amber-900 mb-2">
        <HelpCircle className="h-5 w-5 text-amber-600" />
        <h4 className="font-bold text-sm">Provide Additional Details for Higher Precision</h4>
      </div>
      <p className="text-xs text-amber-800 mb-3">
        Providing your farm parameters allows the recommendation engine to calculate water, climate, and soil compatibility accurately.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Land Size (Acres)</label>
          <input
            type="number"
            step="0.5"
            value={formData.landArea}
            onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-agri-600 focus:outline-none bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Water Availability</label>
          <select
            value={formData.waterLevel}
            onChange={(e) => setFormData({ ...formData, waterLevel: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-agri-600 focus:outline-none bg-white"
          >
            <option value="LOW">Low Water / Rainfed</option>
            <option value="MEDIUM">Moderate Water / Drip</option>
            <option value="HIGH">Abundant Water / Canal</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Farm Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-agri-600 focus:outline-none bg-white"
          />
        </div>

        <div className="sm:col-span-3 flex justify-end mt-1">
          <button
            type="submit"
            className="flex items-center space-x-1.5 rounded-xl bg-agri-600 px-4 py-2 text-xs font-bold text-white hover:bg-agri-700 transition shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Recalculate Recommendation</span>
          </button>
        </div>
      </form>
    </div>
  );
}
