import React from 'react';
import PricingPlans from '../components/subscription/PricingPlans';
import AICaddiePerformance from '../components/subscription/AICaddiePerformance';
import SimulationExplanation from '../components/subscription/features/SimulationExplanation';
import Testimonials from '../components/subscription/Testimonials';

export default function Subscription() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold tracking-tight mb-6">
            YOU WILL <span className="text-sharpside-green">WIN</span> WITH US
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Premier golf analytics and DFS tools to help you beat the book.
          </p>
        </div>

        <div className="mt-12">
          <PricingPlans />
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