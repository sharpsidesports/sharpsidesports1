import { FantasySuccess } from '../../../types/testimonials';

interface SuccessCardProps {
  success: FantasySuccess;
}

export default function SuccessCard({ success }: SuccessCardProps) {
  return (
    <div className="mt-4 bg-gray-700 rounded-lg p-3 text-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-green-400 font-medium">{success.tournamentName}</span>
        <span className="text-gray-300">{success.entryFee} Entry</span>
      </div>
      <div className="text-gray-400 mb-2">
        Field Size: {success.fieldSize}
      </div>
      <div className="flex flex-wrap gap-2">
        {success.lineup.map((player, index) => (
          <span 
            key={index}
            className="bg-gray-600 text-white px-2 py-1 rounded text-xs"
          >
            {player}
          </span>
        ))}
      </div>
    </div>
  );
}