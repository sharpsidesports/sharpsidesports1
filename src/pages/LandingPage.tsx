import React from 'react';
import { Link } from 'react-router-dom';
import PerformanceGraph from '../components/subscription/PerformanceGraph';
import VideoShowcase from '../components/landing/VideoShowcase';
import PricingSection from '../components/landing/PricingSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            GAIN AN EDGE WITH SHARPSIDE GOLF
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Make data-driven decisions with professional-grade golf analytics. From course strategy to player performance, we provide the insights you need to gain a competitive advantage.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Get started
          </Link>
        </div>
      </section>

      {/* Video Showcase Section */}
      <section className="bg-white">
        <VideoShowcase />
      </section>

      {/* Performance Graph Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Proven Performance</h2>
            <p className="mt-4 text-lg text-gray-500">
              Track record of success across multiple tournaments and betting formats
            </p>
          </div>
          <div className="mt-8">
            <PerformanceGraph />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 - AI Caddie Success */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <img 
                  src="/images/sarah-profile.png" 
                  alt="Sarah M." 
                  className="h-12 w-12 rounded-full"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">Sarah M.</h4>
                </div>
              </div>
              <p className="text-gray-600">
                "The AI Caddie's course strategy was spot on for Scottie Scheffler at Riviera. The strokes gained approach predictions were incredibly accurate."
              </p>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span>Genesis Invitational • Scottie Scheffler</span>
                <span className="ml-2">+650</span>
              </div>
            </div>

            {/* Testimonial 2 - Fantasy Success */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <img 
                  src="/images/mike-profile.png" 
                  alt="Mike R." 
                  className="h-12 w-12 rounded-full"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">Mike R.</h4>
                </div>
              </div>
              <p className="text-gray-600">
                "The Fantasy Optimizer helped me identify value plays like Eric Cole and Taylor Montgomery. Finished top 100 in DraftKings' millionaire maker!"
              </p>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span>DraftKings • The American Express</span>
                <span className="ml-2">$10K Win</span>
              </div>
            </div>

            {/* Testimonial 3 - Course Fit */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <img 
                  src="/images/james-profile.png" 
                  alt="James K." 
                  className="h-12 w-12 rounded-full"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">James K.</h4>
                </div>
              </div>
              <p className="text-gray-600">
                "The Course Fit tool highlighted Wyndham Clark's perfect match for LA Country Club. His distance and approach game were key factors identified."
              </p>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span>US Open • Wyndham Clark</span>
                <span className="ml-2">+8000</span>
              </div>
            </div>

            {/* Testimonial 4 - Matchup Tool */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <img 
                  src="/images/david-profile.png" 
                  alt="David L." 
                  className="h-12 w-12 rounded-full"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">David L.</h4>
                </div>
              </div>
              <p className="text-gray-600">
                "The head-to-head matchup analysis is incredible. Won 7 straight matchup bets using the detailed strokes gained breakdowns and course history data."
              </p>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span>Weekly Matchups</span>
                <span className="ml-2">70% Win Rate</span>
              </div>
            </div>

            {/* Testimonial 5 - Model Dashboard */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <img 
                  src="/images/rachel-profile.png" 
                  alt="Rachel S." 
                  className="h-12 w-12 rounded-full"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">Rachel S.</h4>
                </div>
              </div>
              <p className="text-gray-600">
                "The Model Dashboard's custom weightings helped me identify Max Homa as a strong play at Riviera. The course history impact tool is a game-changer."
              </p>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span>Genesis Invitational • Max Homa</span>
                <span className="ml-2">+2200</span>
              </div>
            </div>

            {/* Testimonial 6 - Expert Insights */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <img 
                  src="/images/tom-profile.png" 
                  alt="Tom W." 
                  className="h-12 w-12 rounded-full"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">Tom W.</h4>
                </div>
              </div>
              <p className="text-gray-600">
                "The Expert Insights perfectly predicted the importance of short game at Augusta. Helped me back Patrick Cantlay for a top 5 finish."
              </p>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span>Masters • Patrick Cantlay Top 5</span>
                <span className="ml-2">+450</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Closing CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Ready to gain your edge?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of users making data-driven decisions with our professional-grade golf analytics platform.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white"
          >
            Get started now
          </Link>
        </div>
      </section>
    </div>
  );
} 