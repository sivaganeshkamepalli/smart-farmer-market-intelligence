import React from 'react';
import { CheckCircle2, TrendingUp, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';
import EvidenceCard from './EvidenceCard';
import { useNavigate } from 'react-router-dom';

export default function RecommendationCard({ recommendations }) {
  const navigate = useNavigate();
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="my-4 space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center space-x-1.5">
        <span>Personalized Crop Recommendation Options</span>
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((opt) => {
          const isLow = opt.tier === 'LOW_RISK';
          const isBal = opt.tier === 'BALANCED';
          const borderColor = isLow ? 'border-emerald-300 bg-emerald-50/20' : isBal ? 'border-agri-400 bg-white ring-2 ring-agri-600/20' : 'border-amber-300 bg-amber-50/20';
          const badgeColor = isLow ? 'bg-emerald-100 text-emerald-800' : isBal ? 'bg-agri-600 text-white font-bold' : 'bg-amber-100 text-amber-900';
          const Icon = isLow ? ShieldCheck : isBal ? TrendingUp : Zap;

          return (
            <div
              key={opt.tier}
              className={`rounded-2xl border p-4 shadow-sm flex flex-col justify-between transition hover:shadow-md ${borderColor}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] px-2.5 py-1 rounded-full ${badgeColor} flex items-center space-x-1`}>
                    <Icon className="h-3 w-3" />
                    <span>{isLow ? 'LOW RISK' : isBal ? 'BALANCED' : 'HIGH POTENTIAL'}</span>
                  </span>
                  <span className="text-xs font-bold text-gray-500">{opt.allocatedAcres} Acres</span>
                </div>

                <h3 className="font-bold text-gray-900 text-base leading-snug">{opt.crop}</h3>
                <p className="text-xs text-gray-500 font-medium mb-3">{opt.category}</p>

                <div className="bg-white/80 rounded-xl p-2.5 border border-gray-100 mb-3 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Initial Cost:</span>
                    <span className="font-bold text-gray-900">₹{opt.initialInvestment?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expected Net Profit:</span>
                    <span className="font-bold text-agri-700">₹{opt.expectedNetProfit?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">ROI Return:</span>
                    <span className="font-bold text-emerald-600">+{opt.roiPercentage}%</span>
                  </div>
                </div>

                <div className="space-y-1.5 mb-3">
                  {opt.keyReasons?.map((reason, idx) => (
                    <div key={idx} className="flex items-start space-x-1.5 text-xs text-gray-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-agri-600 mt-0.5 flex-shrink-0" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <EvidenceCard option={opt} />
                <button
                  onClick={() => navigate(`/crops/${opt.productId}`)}
                  className="mt-3 w-full flex items-center justify-center space-x-1.5 rounded-xl border border-agri-600 bg-white py-2 text-xs font-bold text-agri-700 hover:bg-agri-50 transition"
                >
                  <span>View Full Agricultural & Market Data</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
