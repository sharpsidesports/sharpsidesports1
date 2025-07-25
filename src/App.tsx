import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import ProtectedRoute from './components/auth/ProtectedRoute.js';
import Header from './components/Header.js';
import Navigation from './components/Navigation.js';
import Footer from './components/Footer.js';
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
import JohnDeereClassicArticle from './pages/articles/john-deere-classic.js';
import JohnDeereClassicBettingMegaPreview from './pages/articles/john-deere-classic-betting-picks.js';
import ReceptionModel from './pages/ReceptionModel.js';
import WRTargetProjections from './pages/cfb/WRTargetProjections.js';
import WRRedzoneStats from './pages/redzone/WR.js';
import TERedzoneStats from './pages/redzone/TE.js';
import RBRedzoneStats from './pages/redzone/RB.js';
import NFLTeamOffenseStatsPage from './pages/nfl/Offense.js';
import NFLTeamDefenseStatsPage from './pages/nfl/Defense.js';
import PassAttemptsPerGame from './pages/nfl/PassAttemptsPerGame.js';
import YardsPerPlay from './pages/nfl/YardsPerPlay.js';
import PointsPerGame from './pages/nfl/PointsPerGame.js';
import YardsPerGame from './pages/nfl/YardsPerGame.js';
import RushingAttemptsPerGame from './pages/nfl/RushingAttemptsPerGame.js';
import RushingYardsPerGame from './pages/nfl/RushingYardsPerGame.js';
import CompletionsPerGame from './pages/nfl/CompletionsPerGame.js';
import YardsPerPassAttempt from './pages/nfl/YardsPerPassAttempt.js';
import YardsPerCompletion from './pages/nfl/YardsPerCompletion.js';
import PassingYardsPerGame from './pages/nfl/PassingYardsPerGame.js';
import DefensePointsPerGame from './pages/nfl/DefensePointsPerGame.js';
import DefenseYardsPerGame from './pages/nfl/DefenseYardsPerGame.js';
import DefenseYardsPerPlay from './pages/nfl/DefenseYardsPerPlay.js';
import DefenseRushingAttemptsPerGame from './pages/nfl/DefenseRushingAttemptsPerGame.js';
import DefenseRushingYardsPerGame from './pages/nfl/DefenseRushingYardsPerGame.js';
import DefensePassAttemptsPerGame from './pages/nfl/DefensePassAttemptsPerGame.js';
import DefenseCompletionsPerGame from './pages/nfl/DefenseCompletionsPerGame.js';
import DefensePassingYardsPerGame from './pages/nfl/DefensePassingYardsPerGame.js';
import DefenseYardsPerPassAttempt from './pages/nfl/DefenseYardsPerPassAttempt.js';
import DefenseYardsPerCompletion from './pages/nfl/DefenseYardsPerCompletion.js';
import QBProjections from './pages/fantasy/QBProjections.js';
import WRProjections from './pages/fantasy/WRProjections.js';
import FantasyProjectionsLanding from './pages/nfl/fantasy-projections.js';
import RedzoneStatsLanding from './pages/nfl/redzone-stats.js';
import TeamStatsLanding from './pages/nfl/team-stats.js';
import CBBTeamRatings from './pages/cbb/team-ratings.js';
import CBBPlayerRatings from './pages/cbb/player-ratings.js';
import CBBLineupRatings from './pages/cbb/lineup-ratings.js';
import CBBPickAndRoll from './pages/cbb/pick-and-roll.js';
import CBBSpotUpShooting from './pages/cbb/spot-up-shooting.js';
import CBBSpotUpDefense from './pages/cbb/spot-up-defense.js';
import CBBPickAndRollDefense from './pages/cbb/pick-and-roll-defense.js';
import SubscriptionManagement from './pages/SubscriptionManagement.js';
import TermsOfService from './pages/TermsOfService.js';

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
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <Navigation />
          <main className="relative max-w-7xl mx-auto py-4 sm:py-6 px-2 sm:px-4 md:px-6 lg:px-8 flex-grow">
            <div className="w-full overflow-x-hidden">
              <Routes>
                {/* Public Routes */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/subscription/success" element={<CheckoutSuccess />} />
                <Route path="/subscription-management" element={<SubscriptionManagement />} />
                <Route path="/terms" element={<TermsOfService />} />
                
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
                {/* Redzone WR Route */}
                <Route path="/redzone/wr" element={<WRRedzoneStats />} />
                {/* Redzone TE Route */}
                <Route path="/redzone/te" element={<TERedzoneStats />} />
                {/* Redzone RB Route */}
                <Route path="/redzone/rb" element={<RBRedzoneStats />} />
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
                <Route path="/fantasy/qb-projections" element={<QBProjections />} />
                <Route path="/fantasy/wr-projections" element={<WRProjections />} />

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
                <Route 
                  path="/articles/john-deere-classic" 
                  element={<JohnDeereClassicArticle />} 
                />
                <Route 
                  path="/articles/john-deere-classic-betting-picks" 
                  element={<JohnDeereClassicBettingMegaPreview />} 
                />
                <Route path="/reception-model" element={<ReceptionModel />} />
                <Route path="/cfb/wr-target-projections" element={<WRTargetProjections />} />
                <Route path="/nfl/offense" element={<NFLTeamOffenseStatsPage />} />
                <Route path="/nfl/defense" element={<NFLTeamDefenseStatsPage />} />
                <Route path="/nfl/pass-attempts-per-game" element={<PassAttemptsPerGame />} />
                <Route path="/nfl/yards-per-play" element={<YardsPerPlay />} />
                <Route path="/nfl/points-per-game" element={<PointsPerGame />} />
                <Route path="/nfl/yards-per-game" element={<YardsPerGame />} />
                <Route path="/nfl/rushing-attempts-per-game" element={<RushingAttemptsPerGame />} />
                <Route path="/nfl/rushing-yards-per-game" element={<RushingYardsPerGame />} />
                <Route path="/nfl/completions-per-game" element={<CompletionsPerGame />} />
                <Route path="/nfl/yards-per-pass-attempt" element={<YardsPerPassAttempt />} />
                <Route path="/nfl/yards-per-completion" element={<YardsPerCompletion />} />
                <Route path="/nfl/passing-yards-per-game" element={<PassingYardsPerGame />} />
                <Route path="/nfl/fantasy-projections" element={<FantasyProjectionsLanding />} />
                <Route path="/nfl/redzone-stats" element={<RedzoneStatsLanding />} />
                <Route path="/nfl/team-stats" element={<TeamStatsLanding />} />
                <Route path="/cbb/team-ratings" element={<CBBTeamRatings />} />
                <Route path="/cbb/player-ratings" element={<CBBPlayerRatings />} />
                <Route path="/cbb/lineup-ratings" element={<CBBLineupRatings />} />
                <Route path="/cbb/pick-and-roll" element={<CBBPickAndRoll />} />
                <Route path="/cbb/spot-up-shooting" element={<CBBSpotUpShooting />} />
                <Route path="/cbb/spot-up-defense" element={<CBBSpotUpDefense />} />
                <Route path="/cbb/pick-and-roll-defense" element={<CBBPickAndRollDefense />} />
                <Route path="/nfl/defense/points-per-game" element={<DefensePointsPerGame />} />
                <Route path="/nfl/defense/yards-per-game" element={<DefenseYardsPerGame />} />
                <Route path="/nfl/defense/yards-per-play" element={<DefenseYardsPerPlay />} />
                <Route path="/nfl/defense/rushing-attempts-per-game" element={<DefenseRushingAttemptsPerGame />} />
                <Route path="/nfl/defense/rushing-yards-per-game" element={<DefenseRushingYardsPerGame />} />
                <Route path="/nfl/defense/pass-attempts-per-game" element={<DefensePassAttemptsPerGame />} />
                <Route path="/nfl/defense/completions-per-game" element={<DefenseCompletionsPerGame />} />
                <Route path="/nfl/defense/passing-yards-per-game" element={<DefensePassingYardsPerGame />} />
                <Route path="/nfl/defense/yards-per-pass-attempt" element={<DefenseYardsPerPassAttempt />} />
                <Route path="/nfl/defense/yards-per-completion" element={<DefenseYardsPerCompletion />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;