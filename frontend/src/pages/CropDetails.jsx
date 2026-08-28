import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Sprout, Droplets, Sun, Shield, DollarSign, MessageSquare, ArrowLeft, CheckCircle } from 'lucide-react';

export default function CropDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      if (res.data.success) {
        setProduct(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching product details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center h-64 text-sm text-gray-500 font-medium">
        Loading agricultural profile & market history...
      </div>
    );
  }

  // Format historical prices for Recharts line graph
  const priceChartData = (product.recentPrices || []).map((p) => ({
    date: p.date,
    price: parseFloat(p.average_price),
    market: p.market_name
  })).reverse();

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/crops')}
        className="flex items-center space-x-1.5 text-xs font-bold text-gray-600 hover:text-agri-700 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Crop Explorer</span>
      </button>

      {/* Header Banner */}
      <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-agri-800 bg-agri-100 px-3 py-1 rounded-full">
              {product.category_name}
            </span>
            <span className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
              Water: {product.water?.water_level || 'MEDIUM'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{product.name}</h1>
          <p className="text-sm font-medium text-gray-500 italic">{product.scientific_name}</p>
        </div>

        <button
          onClick={() => navigate('/ask-ai')}
          className="flex items-center space-x-2 rounded-xl bg-agri-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-agri-700 transition self-start md:self-auto"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Analyse {product.name} with AI</span>
        </button>
      </div>

      {/* Agronomic Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-4 border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Growth Type</span>
          <span className="text-base font-extrabold text-gray-900">{product.growth?.growth_type || 'ABOVE_GROUND'}</span>
          <span className="text-xs text-gray-500 block mt-1">Harvest in ~{product.growth?.first_harvest_days || 60} days</span>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Soil Requirements</span>
          <span className="text-base font-extrabold text-gray-900">{product.soil?.soil_type || 'Red Loamy'}</span>
          <span className="text-xs text-gray-500 block mt-1">pH Range: {product.soil?.min_ph || 6.0} - {product.soil?.max_ph || 7.5}</span>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Climate Range</span>
          <span className="text-base font-extrabold text-gray-900">{product.climate?.optimal_temperature_min || 20}°C - {product.climate?.optimal_temperature_max || 35}°C</span>
          <span className="text-xs text-gray-500 block mt-1">Rainfall: {product.climate?.rainfall_min || 400}mm+</span>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Average Yield</span>
          <span className="text-base font-extrabold text-agri-700">{product.yieldData?.[0]?.yield_average || 12} Tons</span>
          <span className="text-xs text-gray-500 block mt-1">Per Acre Cultivation</span>
        </div>
      </div>

      {/* Historical Market Prices Chart */}
      <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Historical Wholesale Market Prices (Rs / Quintal)</h3>
            <p className="text-xs text-gray-500">Monthly price movement across primary wholesale produce yards.</p>
          </div>
          <span className="text-xs font-bold text-agri-700 bg-agri-50 px-3 py-1 rounded-full border border-agri-200">
            Market Intelligence Data
          </span>
        </div>

        <div className="h-64 w-full">
          {priceChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [`₹${value} / quintal`, 'Average Price']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Line type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-full text-xs text-gray-400">No historical price data loaded.</div>
          )}
        </div>
      </div>

      {/* Multi-year Economics Grid (If Tree Crop) */}
      {product.longTermEconomics?.length > 0 && (
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-900 text-base">Multi-Year Financial Projections (Tree Economics)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {product.longTermEconomics.map((yr) => (
              <div key={yr.year_number} className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs">
                <span className="font-bold text-gray-900 block mb-1">Year {yr.year_number}</span>
                <div className="space-y-1">
                  <div className="flex justify-between text-gray-500">
                    <span>Invest:</span>
                    <span className="font-semibold text-gray-800">₹{yr.investment?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Yield:</span>
                    <span className="font-semibold text-agri-700">{yr.expected_yield} Tons</span>
                  </div>
                  <div className="flex justify-between text-gray-500 pt-1 border-t border-gray-200">
                    <span>Profit:</span>
                    <span className={`font-bold ${yr.expected_profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      ₹{yr.expected_profit?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technologies & Product Uses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-900 text-base">Compatible Cultivation Technologies</h3>
          <div className="space-y-2">
            {product.technologies?.map((tech) => (
              <div key={tech.id} className="flex items-center justify-between bg-agri-50/50 border border-agri-200 rounded-xl p-3 text-xs">
                <div>
                  <span className="font-bold text-gray-900">{tech.technology_name}</span>
                  <p className="text-gray-600">{tech.expected_benefit}</p>
                </div>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  +{tech.water_saving_percentage}% Water Saving
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-900 text-base">Product Commercial Uses</h3>
          <div className="space-y-2">
            {product.uses?.map((use) => (
              <div key={use.id} className="flex items-center space-x-2 bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs">
                <CheckCircle className="h-4 w-4 text-agri-600 flex-shrink-0" />
                <div>
                  <span className="font-bold text-gray-900">{use.use_category}: </span>
                  <span className="text-gray-600">{use.use_description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
