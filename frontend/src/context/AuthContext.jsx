import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.data.user);
        setProfile(res.data.data.profile);
        setFarms(res.data.data.farms || []);
      } else {
        setUser(null);
        setProfile(null);
        setFarms([]);
        localStorage.removeItem('farmer_token');
      }
    } catch (err) {
      setUser(null);
      setProfile(null);
      setFarms([]);
      localStorage.removeItem('farmer_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (emailOrPhone, password) => {
    const res = await api.post('/auth/login', { emailOrPhone, password });
    if (res.data.success && res.data.data?.token) {
      localStorage.setItem('farmer_token', res.data.data.token);
      await fetchCurrentUser();
    }
    return res.data;
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data.success && res.data.data?.token) {
      localStorage.setItem('farmer_token', res.data.data.token);
      await fetchCurrentUser();
    }
    return res.data;
  };

  const sendOTP = async (phone) => {
    const res = await api.post('/auth/send-otp', { phone });
    return res.data;
  };

  const verifyOTP = async (phone, otp) => {
    const res = await api.post('/auth/verify-otp', { phone, otp });
    if (res.data.success && res.data.data?.token) {
      localStorage.setItem('farmer_token', res.data.data.token);
      await fetchCurrentUser();
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore network errors during logout
    }
    localStorage.removeItem('farmer_token');
    setUser(null);
    setProfile(null);
    setFarms([]);
  };

  return (
    <AuthContext.Provider value={{ user, profile, farms, loading, login, register, sendOTP, verifyOTP, logout, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
