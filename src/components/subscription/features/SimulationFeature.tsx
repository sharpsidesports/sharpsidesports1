import React from 'react';
import { Activity } from 'lucide-react';

interface SimulationFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function SimulationFeature({ icon, title, description }: SimulationFeatureProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="h-8 w-8 text-green-400 mb-4">
        {icon}
      </div>
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}