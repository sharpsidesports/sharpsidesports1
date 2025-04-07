import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
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
import { useAuth } from './hooks/useAuth';

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen">
          <Header />
          <Navigation />
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/subscription" element={<Subscription />} />
              
              {/* Landing Page - Default for non-authenticated users */}
              <Route 
                path="/" 
                element={
                  user ? <Navigate to="/dashboard" replace /> : <LandingPage />
                } 
              />

              {/* Dashboard - With preview for non-authenticated users */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiredSubscription="free" allowPreview>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Free Tier */}
              <Route 
                path="/strokes-gained" 
                element={
                  <ProtectedRoute allowPreview>
                    <StrokesGainedStats />
                  </ProtectedRoute>
                } 
              />

              {/* Pro Tier (previously Basic) */}
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

              {/* Enterprise Tier (previously Pro) */}
              <Route 
                path="/ai-caddie" 
                element={
                  <ProtectedRoute requiredSubscription="enterprise" allowPreview>
                    <AICaddie />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/course-fit" 
                element={
                  <ProtectedRoute requiredSubscription="enterprise" allowPreview>
                    <CourseFitTool />
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

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;