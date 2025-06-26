import PricingPlans from '../components/subscription/PricingPlans.js';
import AICaddiePerformance from '../components/subscription/AICaddiePerformance.js';
import SimulationExplanation from '../components/subscription/features/SimulationExplanation.js';
import Testimonials from '../components/subscription/Testimonials.js';
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
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <h1 className="text-6xl font-bold tracking-tight mb-6">
            YOU WILL <span className="text-sharpside-green">WIN</span> WITH US
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Premier golf analytics and DFS tools to help you beat the book.
          </p>
        </div>

        <div id="plans" className="mt-4 scroll-mt-24">
          <PricingPlans ref={plansRef} />
        </div>

        <SimulationExplanation />

        <div className="mt-16">
          <AICaddiePerformance />
          <Testimonials />
        </div>
      </div>
    </div>
  );
}