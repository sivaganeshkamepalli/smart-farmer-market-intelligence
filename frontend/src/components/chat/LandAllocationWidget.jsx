import React from 'react';
import { PieChart, Shield, TrendingUp, Calendar } from 'lucide-react';

export default function LandAllocationWidget({ allocation }) {
  if (!allocation || !allocation.allocation) return null;

  return (
    <div className="my-3 rounded-2xl bg-white border border-agri-200 p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <PieChart className="h-5 w-5 text-agri-600" />
          <h4 className="font-bold text-gray-900 text-sm">Recommended Dynamic Land Split ({allocation.totalArea} Acres)</h4>
        </div>
        <span className="text-xs font-semibold text-agri-700 bg-agri-50 px-2.5 py-1 rounded-full border border-agri-200">
          Smart Diversification
        </span>
      </div>

      {/* Progress Bar Split */}
      <div className="h-4 w-full bg-gray-100 rounded-full flex overflow-hidden mb-4 shadow-inner">
        {allocation.allocation.map((item, idx) => {
          const bg = idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-agri-600' : 'bg-blue-500';
          return (
            <div
              key={item.category}
              style={{ width: `${item.percentage}%` }}
              className={`${bg} transition-all duration-500`}
              title={`${item.categoryLabel}: ${item.acres} Acres (${item.percentage}%)`}
            />
          );
        })}
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {allocation.allocation.map((item, idx) => {
          const isLong = item.category === 'LONG_TERM';
          const isConst = item.category === 'CONSTANT_DEMAND';
          const badgeBg = isLong ? 'bg-amber-50 text-amber-800 border-amber-200' : isConst ? 'bg-agri-50 text-agri-800 border-agri-200' : 'bg-blue-50 text-blue-800 border-blue-200';
          const Icon = isLong ? Shield : isConst ? TrendingUp : Calendar;

          return (
            <div key={item.category} className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1.5">
                  <Icon className="h-4 w-4 text-gray-700" />
                  <span className="font-bold text-xs text-gray-900">{item.categoryLabel.split(' ')[0]}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${badgeBg}`}>
                  {item.acres} Acres ({item.percentage}%)
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mt-1">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
