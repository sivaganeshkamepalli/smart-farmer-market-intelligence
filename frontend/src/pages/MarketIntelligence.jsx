import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, BarChart2, DollarSign, Filter } from 'lucide-react';

export default function MarketIntelligence() {
  const [prices, setPrices] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('1'); // Default Tomato
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      fetchMarketPrices(selectedProduct);
    }
  }, [selectedProduct]);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?limit=30');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Error loading products:', err);
    }
  };

  const fetchMarketPrices = async (prodId) => {
    try {
      setLoading(true);
      const res = await api.get(`/market/prices?productId=${prodId}`);
      if (res.data.success) {
        setPrices(res.data.data);
      }
    } catch (err) {
      console.error('Error loading market prices:', err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = prices.map(p => ({
    date: p.date,
    averagePrice: parseFloat(p.average_price),
    minPrice: parseFloat(p.minimum_price),
    maxPrice: parseFloat(p.maximum_price),
    market: p.market_name
  })).reverse();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Market Intelligence & 10-Year Price Trends</h1>
          <p className="text-xs text-gray-500">Analyze historical wholesale price patterns, seasonality, and price change causality factors.</p>
        </div>

        {/* Product Selector */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="rounded-xl border border-gray-300 px-3 py-2 text-xs font-semibold focus:border-agri-600 focus:outline-none bg-white shadow-sm"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Historical Line Chart */}
      <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-agri-600" />
            <h3 className="font-bold text-gray-900 text-base">Wholesale Market Price Movement (Rs / Quintal)</h3>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Verified Agmarknet History
          </span>
        </div>

        <div className="h-72 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value, name) => [`₹${value} / quintal`, name === 'averagePrice' ? 'Average Price' : name]}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Line type="monotone" dataKey="averagePrice" stroke="#16a34a" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="minPrice" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" />
                <Line type="monotone" dataKey="maxPrice" stroke="#d97706" strokeWidth={1.5} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-full text-xs text-gray-400">Loading chart data...</div>
          )}
        </div>
      </div>

      {/* Historical Price Data Table */}
      <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm overflow-hidden">
        <h3 className="font-bold text-gray-900 text-base mb-3">Recent Wholesale Yard Arrival Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Wholesale Market</th>
                <th className="p-3">Min Price (₹)</th>
                <th className="p-3">Max Price (₹)</th>
                <th className="p-3">Avg Price (₹)</th>
                <th className="p-3">Arrival Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {prices.slice(0, 10).map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/60">
                  <td className="p-3 font-semibold text-gray-900">{row.date}</td>
                  <td className="p-3 text-gray-600">{row.market_name}</td>
                  <td className="p-3 text-gray-500">₹{row.minimum_price}</td>
                  <td className="p-3 text-amber-700 font-semibold">₹{row.maximum_price}</td>
                  <td className="p-3 text-agri-700 font-extrabold">₹{row.average_price}</td>
                  <td className="p-3 text-gray-600">{row.quantity_arrived} quintals</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
