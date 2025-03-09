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
import Subscription from './pages/Subscription';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-green-50">
          <Header />
          <Navigation />
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute allowPreview>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/matchups" 
                element={
                  <ProtectedRoute allowPreview>
                    <MatchupTool />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/three-ball" 
                element={
                  <ProtectedRoute allowPreview>
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
                  <ProtectedRoute allowPreview>
                    <CourseFitTool />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ai-caddie" 
                element={
                  <ProtectedRoute requiredSubscription="pro" allowPreview>
                    <AICaddie />
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