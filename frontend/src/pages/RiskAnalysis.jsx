import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react';

export default function RiskAnalysis() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">8-Dimension Risk Analysis Engine</h1>
        <p className="text-xs text-gray-500">Multi-factor composite risk scoring combining climate, 10-year price volatility, regional oversupply, and policy shifts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 text-sm">Climate Risk Dimension</h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">LOW RISK (35%)</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Evaluated against regional rainfall trends, monsoon forecast, and farm drip irrigation setup.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 text-sm">Price Volatility Risk</h3>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">MEDIUM (48%)</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Calculated from 10-year historical monthly wholesale price standard deviation and peak harvest crashes.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 text-sm">Regional Supply Risk</h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">LOW RISK (32%)</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Estimated from aggregated regional cultivation plans to prevent market saturation and oversupply.
          </p>
        </div>
      </div>
    </div>
  );
}
