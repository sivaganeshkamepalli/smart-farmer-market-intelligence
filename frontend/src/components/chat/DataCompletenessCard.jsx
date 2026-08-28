import React from 'react';
import { Database, Award } from 'lucide-react';

export default function DataCompletenessCard({ completeness = 85, confidence = 'High' }) {
  const confColor = confidence === 'High' ? 'text-emerald-700 bg-emerald-100' : confidence === 'Moderate' ? 'text-amber-800 bg-amber-100' : 'text-blue-800 bg-blue-100';

  return (
    <div className="flex items-center justify-between my-2 rounded-xl bg-gray-100/80 px-3.5 py-2 text-xs border border-gray-200">
      <div className="flex items-center space-x-2">
        <Database className="h-4 w-4 text-agri-600" />
        <span className="font-semibold text-gray-700">Data Completeness:</span>
        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-agri-600 rounded-full" style={{ width: `${completeness}%` }} />
        </div>
        <span className="font-bold text-gray-900">{completeness}%</span>
      </div>

      <div className="flex items-center space-x-1.5">
        <Award className="h-4 w-4 text-gray-500" />
        <span className="text-gray-600 font-medium">Confidence:</span>
        <span className={`font-bold px-2 py-0.5 rounded-full ${confColor}`}>
          {confidence}
        </span>
      </div>
    </div>
  );
}
