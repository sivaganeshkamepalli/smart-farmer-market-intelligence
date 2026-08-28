import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Wheat, Droplets, ArrowRight } from 'lucide-react';

export default function CropExplorer() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedWater, setSelectedWater] = useState('');
  const [selectedGrowth, setSelectedGrowth] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory, selectedWater, selectedGrowth, pagination.page]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/products/categories');
      if (res.data.success) setCategories(res.data.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search,
        category: selectedCategory,
        waterLevel: selectedWater,
        growthType: selectedGrowth,
        page: pagination.page,
        limit: 24
      });

      const res = await api.get(`/products?${params.toString()}`);
      if (res.data.success) {
        setProducts(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Crop Explorer (500+ Agricultural Products)</h1>
        <p className="text-xs text-gray-500">Search and filter across 14 agricultural categories, water regimes, growth characteristics, and climate suitability.</p>
      </div>

      {/* Filter Controls Bar */}
      <div className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search crop name (e.g. Badam, Tomato)..."
              className="w-full rounded-xl border border-gray-300 pl-9 pr-3 py-2 text-xs focus:border-agri-600 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none bg-white"
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Water Requirement Filter */}
          <div>
            <select
              value={selectedWater}
              onChange={(e) => setSelectedWater(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none bg-white"
            >
              <option value="">All Water Levels</option>
              <option value="VERY_LOW">Very Low</option>
              <option value="LOW">Low Water / Rainfed</option>
              <option value="MEDIUM">Moderate Water / Drip</option>
              <option value="HIGH">High Water</option>
              <option value="VERY_HIGH">Very High / Aquatic</option>
            </select>
          </div>

          {/* Growth Type Filter */}
          <div>
            <select
              value={selectedGrowth}
              onChange={(e) => setSelectedGrowth(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none bg-white"
            >
              <option value="">All Growth Types</option>
              <option value="TREE">Tree Crop</option>
              <option value="ABOVE_GROUND">Above Ground</option>
              <option value="UNDERGROUND">Underground / Root</option>
              <option value="BUSH">Bush / Shrub</option>
              <option value="VINE">Vine / Climber</option>
              <option value="AQUATIC">Aquatic</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/crops/${p.id}`)}
            className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-agri-300 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-agri-800 bg-agri-100 px-2.5 py-0.5 rounded-full">
                  {p.category_name}
                </span>
                <span className="text-xs font-semibold text-gray-400">ID #{p.id}</span>
              </div>

              <h3 className="font-bold text-gray-900 text-base leading-snug">{p.name}</h3>
              <p className="text-xs text-gray-500 italic mb-3">{p.scientific_name}</p>

              <div className="grid grid-cols-2 gap-2 bg-gray-50/80 rounded-xl p-2.5 border border-gray-100 text-xs mb-3">
                <div>
                  <span className="text-gray-400 block">Water Need</span>
                  <span className="font-bold text-blue-600">{p.water_level || 'MEDIUM'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Average Yield</span>
                  <span className="font-bold text-agri-700">~{p.yield_average || 12} {p.yield_unit || 'tons'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs font-bold text-agri-700">
              <span>View Agricultural Profile</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-200 p-4">
        <span className="text-xs text-gray-500 font-medium">
          Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} total products)
        </span>
        <div className="flex space-x-2">
          <button
            disabled={pagination.page <= 1}
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
            className="rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
            className="rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
