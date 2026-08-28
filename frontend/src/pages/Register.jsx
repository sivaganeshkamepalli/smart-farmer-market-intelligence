import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Loader2 } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    state: '',
    district: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await register(formData);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-agri-600 text-white shadow-md mx-auto mb-3">
            <Sprout className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Register Farmer Account</h1>
          <p className="text-xs text-gray-500 mt-1">Smart Farmer Market Intelligence Platform</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 text-xs p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Ramesh Kumar"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter 10-digit mobile number"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address (Optional)</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@domain.com"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter secure password"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="State"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">District</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder="District"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-agri-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-agri-600 py-3 text-xs font-bold text-white shadow-md hover:bg-agri-700 transition mt-2 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Register Account</span>}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-agri-700 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
