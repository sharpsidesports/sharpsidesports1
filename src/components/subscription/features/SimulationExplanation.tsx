import React from 'react';
import { Activity, RefreshCw, Wind } from 'lucide-react';
import SimulationFeature from './SimulationFeature';

const features = [
  {
    icon: <Activity />,
    title: "1,000 Round Simulations",
    description: "Our one-of-a-kind algorithm simulates 1,000 rounds to give you the most accurate predictions possible"
  },
  {
    icon: <RefreshCw />,
    title: "Real-Time Updates",
    description: "Whenever something changes, new simulations are run automatically to keep predictions current"
  },
  {
    icon: <Wind />,
    title: "Comprehensive Factors",
    description: "We factor in every situation, course layout and weather condition possible for complete analysis"
  }
];

export default function SimulationExplanation() {
  return (
    <div className="bg-gray-900 p-8 rounded-lg my-16">
      <h2 className="text-xl font-semibold text-green-400 mb-8">POWERED BY ADVANCED SIMULATIONS</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <SimulationFeature
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
}