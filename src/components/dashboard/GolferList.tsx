import React, { useState } from 'react';
import { useGolfStore } from '../../store/useGolfStore';
import { Golfer } from '../../types/golf';
import GolferProfileModal from './GolferProfileModal';

export default function GolferList() {
  const { golfers } = useGolfStore();
  const [selectedGolfer, setSelectedGolfer] = useState<Golfer | null>(null);

  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">Golfer List
        {golfers.map((golfer) => (
          <div 
            key={golfer.id} 
            className="bg-white p-4 rounded-lg shadow border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedGolfer(golfer)}
          >
            <div className="flex items-center mb-2">
              <div className="flex-shrink-0 h-10 w-10">
                <img 
                  className="h-10 w-10 rounded-full object-cover object-center" 
                  src={golfer.imageUrl} 
                  alt={golfer.name}
                />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">{golfer.name}</h3>
                <span className="text-sm text-gray-600">Rank: {golfer.rank}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Strokes Gained Total:</span>
                <span className="font-medium">{golfer.strokesGainedTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Simulated Rank:</span>
                <span className="font-medium text-green-600">
                  {Math.round(golfer.simulatedRank)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedGolfer && (
        <GolferProfileModal
          golfer={selectedGolfer}
          onClose={() => setSelectedGolfer(null)}
        />
      )}
    </>
  );
}