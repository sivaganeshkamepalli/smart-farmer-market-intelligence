import React from 'react';
import { PieChart, Calendar, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

export default function DemandTrends() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Demand Trends & Festival Event Calendar</h1>
        <p className="text-xs text-gray-500">Track seasonal consumption surges, religious festival demand windows, and export procurement calendars.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Festival Demand Calendar */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-agri-800 font-bold text-base border-b border-gray-100 pb-3">
            <Calendar className="h-5 w-5 text-agri-600" />
            <h2>Upcoming Demand Events Calendar</h2>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 text-sm">Ayyappa & Winter Festive Season</span>
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">+45% Demand</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Historically increases wholesale demand for Tomatoes, Vegetables, Milk, Flowers, and Sugar across South India.
              </p>
              <div className="flex items-center space-x-1 text-[11px] text-amber-900 font-semibold pt-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Historical Evidence: 30% price increase in 4 of last 5 years.</span>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 text-sm">Diwali & Post-Monsoon Season</span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">+60% Demand</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                High demand for Badam, Nuts, Sweets ingredients, Flowers, and Fruits.
              </p>
            </div>
          </div>
        </div>

        {/* Stable Demand vs Seasonal Opportunities */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-gray-900 font-bold text-base border-b border-gray-100 pb-3">
            <PieChart className="h-5 w-5 text-agri-600" />
            <h2>Demand Classification Categories</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <span className="font-bold text-gray-900 text-sm block mb-1">CONSTANT DEMAND CROPS</span>
              <p className="text-gray-600">Staple grains (Rice, Wheat), daily cooking vegetables (Onion, Potato), and pulses with non-cyclical steady consumption.</p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <span className="font-bold text-gray-900 text-sm block mb-1">LONG-TERM ESTATE CROPS</span>
              <p className="text-gray-600">Tree crops (Badam, Guava, Pomegranate) providing compounding asset growth and multi-year harvest revenue.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
