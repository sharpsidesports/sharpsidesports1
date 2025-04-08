import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import MatchupTool from './pages/MatchupTool';
import ThreeBallTool from './pages/ThreeBallTool';
import FantasyOptimizer from './pages/FantasyOptimizer';
import AICaddie from './pages/AICaddie';
import CourseFitTool from './pages/CourseFitTool';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import Subscription from './pages/Subscription';
import ExpertInsights from './pages/ExpertInsights';
import StrokesGainedStats from './pages/StrokesGainedStats';
import LandingPage from './pages/LandingPage';
import { useAuthContext } from './context/AuthContext';
import Account from './pages/Account';
import CheckoutSuccess from './pages/CheckoutSuccess';

// Separate component for handling the landing page redirect
function LandingRedirect() {
  const { user } = useAuthContext();
  return user ? <Navigate to="/dashboard" replace /> : <LandingPage />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Navigation />
          <main className="max-w-7xl mx-auto py-4 sm:py-6 px-2 sm:px-4 md:px-6 lg:px-8">
            <div className="w-full overflow-x-hidden">
              <Routes>
                {/* Public Routes */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                
                {/* Account Management - Protected but available to all tiers */}
                <Route path="/account" element={
                  <ProtectedRoute requiredSubscription="free" showPreview={false}>
                    <Account />
                  </ProtectedRoute>
                } />
                
                {/* Landing Page - Default for non-authenticated users */}
                <Route path="/" element={<LandingRedirect />} />

                {/* Free Tier Routes - Available to all users */}
                <Route 
                  path="/stats" 
                  element={
                    <ProtectedRoute requiredSubscription="free" showPreview={true}>
                      <StrokesGainedStats />
                    </ProtectedRoute>
                  } 
                />

                {/* Basic Tier Routes - With Preview */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute requiredSubscription="basic" showPreview={true}>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/matchups" 
                  element={
                    <ProtectedRoute requiredSubscription="basic" showPreview={true}>
                      <MatchupTool />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/three-ball" 
                  element={
                    <ProtectedRoute requiredSubscription="basic" showPreview={true}>
                      <ThreeBallTool />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/fantasy" 
                  element={
                    <ProtectedRoute requiredSubscription="basic" showPreview={true}>
                      <FantasyOptimizer />
                    </ProtectedRoute>
                  } 
                />

                {/* Pro Tier Routes - With Preview */}
                <Route 
                  path="/course-fit" 
                  element={
                    <ProtectedRoute requiredSubscription="pro" showPreview={true}>
                      <CourseFitTool />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/ai-caddie" 
                  element={
                    <ProtectedRoute requiredSubscription="pro" showPreview={true}>
                      <AICaddie />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/expert-insights" 
                  element={
                    <ProtectedRoute requiredSubscription="pro" showPreview={true}>
                      <ExpertInsights />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </div>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;