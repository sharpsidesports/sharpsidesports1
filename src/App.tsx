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

// Separate component for handling the landing page redirect
function LandingRedirect() {
  const { user } = useAuthContext();
  return user ? <Navigate to="/dashboard" replace /> : <LandingPage />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen">
          <Header />
          <Navigation />
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/strokes-gained" element={<StrokesGainedStats />} />
              <Route path="/account" element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              } />
              
              {/* Landing Page - Default for non-authenticated users */}
              <Route path="/" element={<LandingRedirect />} />

              {/* Free Tier Routes - With Preview */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiredSubscription="free" allowPreview>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Pro Tier Routes - With Preview */}
              <Route 
                path="/matchups" 
                element={
                  <ProtectedRoute requiredSubscription="pro" allowPreview>
                    <MatchupTool />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/three-ball" 
                element={
                  <ProtectedRoute requiredSubscription="pro" allowPreview>
                    <ThreeBallTool />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/fantasy" 
                element={
                  <ProtectedRoute requiredSubscription="pro" allowPreview>
                    <FantasyOptimizer />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/course-fit" 
                element={
                  <ProtectedRoute requiredSubscription="pro" allowPreview>
                    <CourseFitTool />
                  </ProtectedRoute>
                } 
              />

              {/* Enterprise Tier Routes - With Preview */}
              <Route 
                path="/ai-caddie" 
                element={
                  <ProtectedRoute requiredSubscription="enterprise" allowPreview>
                    <AICaddie />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/expert-insights" 
                element={
                  <ProtectedRoute requiredSubscription="enterprise" allowPreview>
                    <ExpertInsights />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;