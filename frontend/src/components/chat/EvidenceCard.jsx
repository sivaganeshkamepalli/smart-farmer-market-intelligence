import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export default function EvidenceCard({ option }) {
  const [open, setOpen] = useState(false);

  if (!option) return null;

  return (
    <div className="mt-2 rounded-xl border border-gray-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
      >
        <div className="flex items-center space-x-1.5 text-agri-700">
          <FileText className="h-4 w-4" />
          <span>View Supporting Market & Climate Data Evidence</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
      </button>

      {open && (
        <div className="p-3.5 border-t border-gray-100 bg-gray-50/50 space-y-2 text-xs">
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-agri-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-gray-900">Historical Price Resilience:</span>
              <p className="text-gray-600">Stable 10-year monthly market prices with low seasonal crash probability.</p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-agri-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-gray-900">Water Regime Suitability:</span>
              <p className="text-gray-600">Calculated drip irrigation efficiency match for farm water availability.</p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-gray-900">Identified Market Risk:</span>
              <p className="text-gray-600">Monitor regional cultivation plans to prevent oversupply during peak harvest weeks.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
