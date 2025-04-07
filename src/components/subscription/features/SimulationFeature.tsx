import React from 'react';

interface SimulationFeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function SimulationFeature({ title, description, icon }: SimulationFeatureProps) {
  return (
    <div className="text-center">
      <div className="inline-block p-3 bg-gray-800 rounded-lg mb-4">
        <div className="text-green-400 w-6 h-6">
          {icon}
        </div>
      </div>
      <h3 className="text-white font-medium mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}