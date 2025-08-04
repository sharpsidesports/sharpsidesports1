import PricingPlans from '../components/subscription/PricingPlans.js';
import AICaddiePerformance from '../components/subscription/AICaddiePerformance.js';
import Testimonials from '../components/subscription/Testimonials.js';
import NFLRecords from '../components/subscription/NFLRecords.js';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function Subscription() {
  const location = useLocation();
  const plansRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (location.hash === '#plans' && plansRef.current) {
      setTimeout(() => {
        plansRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location.hash]);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            YOU WILL <span className="text-sharpside-green">WIN</span> WITH US
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Premier handicapping, and tools service dedicated to helping you gain an edge and beat the book.
          </p>
        </div>

        <NFLRecords />

        <div id="plans" className="mt-4 scroll-mt-24">
          <PricingPlans ref={plansRef} />
        </div>

        {/* How It Works Section */}
        <div className="mt-12 bg-white p-6 rounded-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">How It Works</h3>
            <p className="text-gray-600 text-base">Simple steps to get started with your winning picks</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Plan</h4>
                <p className="text-gray-600 text-sm">Choose your subscription plan and sign up with your email.</p>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Get Winning Picks</h4>
                <p className="text-gray-600 text-sm">Get winning picks and projections sent directly to your inbox.</p>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Access Everything</h4>
                <p className="text-gray-600 text-sm">Or log in with your password to access everything on the site.</p>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Backed by Data</h4>
                <p className="text-gray-600 text-sm">Backed by data models and years of betting experience.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <AICaddiePerformance />
          <Testimonials />
        </div>
      </div>
    </div>
  );
}