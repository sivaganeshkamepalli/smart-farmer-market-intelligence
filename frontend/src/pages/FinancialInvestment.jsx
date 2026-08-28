import React, { useState } from 'react';
import api from '../services/api';
import { DollarSign, TrendingUp, BarChart2, Calculator } from 'lucide-react';

export default function FinancialInvestment() {
  const [landAcres, setLandAcres] = useState('2.0');
  const [selectedCropId, setSelectedCropId] = useState('1');
  const [economics, setEconomics] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e?.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/investment/calculate', {
        productId: parseInt(selectedCropId, 10),
        landAcres: parseFloat(landAcres)
      });
      if (res.data.success) {
        setEconomics(res.data.data);
      }
    } catch (err) {
      console.error('Error calculating investment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Investment & ROI Calculator</h1>
        <p className="text-xs text-gray-500">Calculate initial capital investment, seasonal maintenance costs, expected gross revenue, and multi-year cash flow projections.</p>
      </div>

      <form onSubmit={handleCalculate} className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-base flex items-center space-x-2">
          <Calculator className="h-5 w-5 text-agri-600" />
          <span>Farm Capital Calculator</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Select Crop</label>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none bg-white"
            >
              <option value="1">Tomato (Hybrid Arka Rakshak)</option>
              <option value="2">Badam (Almond Nonpareil)</option>
              <option value="3">Guava (Taiwan Pink)</option>
              <option value="4">Pomegranate (Bhagwa)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Land Size (Acres)</label>
            <input
              type="number"
              step="0.5"
              value={landAcres}
              onChange={(e) => setLandAcres(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-agri-600 px-5 py-2 text-xs font-bold text-white hover:bg-agri-700 shadow-sm transition"
            >
              Calculate Financial Return
            </button>
          </div>
        </div>
      </form>

      {/* Financial Results Display */}
      {economics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white p-5 border border-gray-200 shadow-sm">
              <span className="text-xs font-bold text-gray-400 uppercase">Total Capital Required</span>
              <div className="text-2xl font-extrabold text-gray-900 mt-1">₹{economics.financialSummary.totalCost?.toLocaleString('en-IN')}</div>
              <span className="text-xs text-gray-500">Initial: ₹{economics.financialSummary.initialInvestment?.toLocaleString('en-IN')}</span>
            </div>

            <div className="rounded-2xl bg-white p-5 border border-gray-200 shadow-sm">
              <span className="text-xs font-bold text-gray-400 uppercase">Expected Gross Revenue</span>
              <div className="text-2xl font-extrabold text-agri-700 mt-1">₹{economics.financialSummary.expectedGrossRevenue?.toLocaleString('en-IN')}</div>
              <span className="text-xs text-gray-500">Yield: ~{economics.financialSummary.expectedYield} {economics.financialSummary.yieldUnit}</span>
            </div>

            <div className="rounded-2xl bg-white p-5 border border-gray-200 shadow-sm">
              <span className="text-xs font-bold text-gray-400 uppercase">Estimated Net Profit & ROI</span>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">₹{economics.financialSummary.expectedNetProfit?.toLocaleString('en-IN')}</div>
              <span className="text-xs font-bold text-emerald-600">+{economics.financialSummary.roiPercentage}% Net Return</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
