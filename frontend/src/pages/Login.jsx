import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Smartphone, Mail, Lock, LogIn, Loader2 } from 'lucide-react';

export default function Login() {
  const { login, sendOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState('otp'); // 'otp' or 'email'
  
  // OTP state
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [devOtpHint, setDevOtpHint] = useState('');

  // Email state
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await sendOTP(phone);
      if (res.success) {
        setOtpSent(true);
        if (res.message?.includes('Dev Verification OTP:')) {
          const match = res.message.match(/Dev Verification OTP:\s*(\d+)/);
          if (match) setDevOtpHint(match[1]);
        }
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await verifyOTP(phone, otp);
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

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await login(emailOrPhone, password);
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
          <h1 className="text-2xl font-bold text-gray-900">Farmer Authentication</h1>
          <p className="text-xs text-gray-500 mt-1">Smart Farmer Market Intelligence Platform</p>
        </div>

        {/* Method Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl mb-6">
          <button
            onClick={() => { setMethod('otp'); setError(''); }}
            className={`py-2 text-xs font-bold rounded-lg transition ${method === 'otp' ? 'bg-white text-agri-700 shadow-sm' : 'text-gray-500'}`}
          >
            Mobile OTP Login
          </button>
          <button
            onClick={() => { setMethod('email'); setError(''); }}
            className={`py-2 text-xs font-bold rounded-lg transition ${method === 'email' ? 'bg-white text-agri-700 shadow-sm' : 'text-gray-500'}`}
          >
            Email + Password
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 text-xs p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {method === 'otp' ? (
          !otpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full rounded-xl border border-gray-300 pl-10 pr-3 py-2.5 text-xs focus:border-agri-600 focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-agri-600 py-3 text-xs font-bold text-white shadow-md hover:bg-agri-700 transition disabled:opacity-50"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Send OTP Code</span>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  required
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-xs focus:border-agri-600 focus:outline-none text-center font-bold text-base tracking-widest"
                />
                {devOtpHint && (
                  <p className="text-[11px] font-semibold text-amber-700 mt-1 text-center bg-amber-50 py-1 px-2 rounded-lg border border-amber-200">
                    Dev Verification OTP: <strong>{devOtpHint}</strong>
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-agri-600 py-3 text-xs font-bold text-white shadow-md hover:bg-agri-700 transition disabled:opacity-50"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Verify & Continue</span>}
              </button>
            </form>
          )
        ) : (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email or Mobile</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="Enter email address or mobile"
                  className="w-full rounded-xl border border-gray-300 pl-10 pr-3 py-2.5 text-xs focus:border-agri-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-gray-300 pl-10 pr-3 py-2.5 text-xs focus:border-agri-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-agri-600 py-3 text-xs font-bold text-white shadow-md hover:bg-agri-700 transition disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Sign In</span>}
            </button>
          </form>
        )}

        {/* Google Login Option */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setError('Google OAuth is configured for production. Please use Mobile OTP or Email Registration.')}
            className="w-full flex items-center justify-center space-x-2 rounded-xl border border-gray-300 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-agri-700 hover:underline">
            Register Farmer Account
          </Link>
        </p>
      </div>
    </div>
  );
}
