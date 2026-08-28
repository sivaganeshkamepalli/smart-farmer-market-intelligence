import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import AskAI from './pages/AskAI';
import MyFarm from './pages/MyFarm';
import CropExplorer from './pages/CropExplorer';
import CropDetails from './pages/CropDetails';
import MarketIntelligence from './pages/MarketIntelligence';
import DemandTrends from './pages/DemandTrends';
import ClimateInsights from './pages/ClimateInsights';
import FinancialInvestment from './pages/FinancialInvestment';
import RiskAnalysis from './pages/RiskAnalysis';
import FarmPlanner from './pages/FarmPlanner';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Application Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/ask-ai" element={<AskAI />} />
                    <Route path="/my-farm" element={<MyFarm />} />
                    <Route path="/crops" element={<CropExplorer />} />
                    <Route path="/crops/:id" element={<CropDetails />} />
                    <Route path="/market" element={<MarketIntelligence />} />
                    <Route path="/demand" element={<DemandTrends />} />
                    <Route path="/climate" element={<ClimateInsights />} />
                    <Route path="/investment" element={<FinancialInvestment />} />
                    <Route path="/risks" element={<RiskAnalysis />} />
                    <Route path="/farm-plan" element={<FarmPlanner />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
