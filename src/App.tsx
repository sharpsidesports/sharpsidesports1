import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import ProtectedRoute from './components/auth/ProtectedRoute.js';
import Header from './components/Header.js';
import Navigation from './components/Navigation.js';
import Dashboard from './pages/Dashboard.js';
import MatchupTool from './pages/MatchupTool.js';
import ThreeBallTool from './pages/ThreeBallTool.js';
import FantasyOptimizer from './pages/FantasyOptimizer.js';
import AICaddie from './pages/AICaddie.js';
import CourseFitTool from './pages/CourseFitTool.js';
import Auth from './pages/Auth.js';
import AuthCallback from './pages/AuthCallback.js';
import Subscription from './pages/Subscription.js';
import ExpertInsights from './pages/ExpertInsights.js';
import StrokesGainedStats from './pages/StrokesGainedStats.js';
import LandingPage from './pages/LandingPage.js';
import { useAuthContext } from './context/AuthContext.js';
import Account from './pages/Account.js';
import CheckoutSuccess from './pages/CheckoutSuccess.js';
import StatsModel from './pages/statsmodel.js';
import { useEffect } from 'react';
import { trackPageView } from './utils/metaPixel.js';
import DetroitGCArticle from './pages/articles/detroit-gc.js';

// Component to track page views on route changes
function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on initial load and route changes
    trackPageView();
  }, [location.pathname]);

  return null;
}

// Separate component for handling the landing page redirect
function LandingRedirect() {
  const { user } = useAuthContext();
  return user ? <Navigate to="/dashboard" replace /> : <LandingPage />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PageViewTracker />
        {/* <div className="min-h-screen bg-blue-50"> */}
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
                <Route path="/subscription/success" element={<CheckoutSuccess />} />
                
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
                <Route 
                  path="/stats-model" 
                  element={<StatsModel />} 
                />
                <Route 
                  path="/articles/detroit-gc" 
                  element={<DetroitGCArticle />} 
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