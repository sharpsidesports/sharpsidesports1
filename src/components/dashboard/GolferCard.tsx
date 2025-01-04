import React from 'react';
import { Golfer } from '../types/golf';

interface GolferCardProps {
  golfer: Golfer;
}

export default function GolferCard({ golfer }: GolferCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">{golfer.name}</h3>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Rank: {golfer.rank}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Strokes Gained Total:</span>
          <span className="font-semibold">{golfer.strokesGainedTotal.toFixed(2)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <span>Tee: {golfer.strokesGainedTee.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Approach: {golfer.strokesGainedApproach.toFixed(2)}</span>
          </div>
        </div>


        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Simulated Rank:</span>
            <span className="text-lg font-bold text-green-600">
              {Math.round(golfer.simulatedRank)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}