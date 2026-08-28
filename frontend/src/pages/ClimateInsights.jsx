import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CloudSun, Droplets, Sun, AlertTriangle } from 'lucide-react';

export default function ClimateInsights() {
  const [climateHistory, setClimateHistory] = useState([]);
  const [forecasts, setForecasts] = useState([]);

  useEffect(() => {
    fetchClimate();
  }, []);

  const fetchClimate = async () => {
    try {
      const hRes = await api.get('/climate/history');
      if (hRes.data.success) setClimateHistory(hRes.data.data);

      const fRes = await api.get('/climate/forecast');
      if (fRes.data.success) setForecasts(fRes.data.data);
    } catch (err) {
      console.error('Error fetching climate data:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Climate & Water Intelligence</h1>
        <p className="text-xs text-gray-500">Compare regional rainfall patterns, temperature anomalies, and drought/flood risk against crop tolerance thresholds.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Rainfall Pattern</span>
            <Droplets className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">850 mm / yr</div>
          <span className="text-xs text-emerald-600 font-semibold">Normal Monsoon Forecast</span>
        </div>

        <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Avg Temperature</span>
            <Sun className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">28.5 °C</div>
          <span className="text-xs text-gray-500">Optimal Range: 20°C - 35°C</span>
        </div>

        <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Drought / Flood Risk</span>
            <AlertTriangle className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">LOW RISK</div>
          <span className="text-xs text-gray-500">Drip suitability: 95%</span>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 text-base mb-3">Regional Meteorological Forecast</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {forecasts.slice(0, 6).map((f) => (
            <div key={f.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <span className="font-bold text-gray-900 block mb-1">{f.forecast_date}</span>
              <div className="space-y-1 text-gray-600">
                <div className="flex justify-between">
                  <span>Rainfall:</span>
                  <span className="font-semibold text-blue-600">{f.rainfall_forecast} mm</span>
                </div>
                <div className="flex justify-between">
                  <span>Temp:</span>
                  <span className="font-semibold text-gray-800">{f.temperature_min}°C - {f.temperature_max}°C</span>
                </div>
                <div className="flex justify-between">
                  <span>Flood Risk:</span>
                  <span className="font-bold text-emerald-600">{f.flood_risk}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
