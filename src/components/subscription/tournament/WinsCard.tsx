// This component displays a card with tournament winnings information.

interface WinsCardProps {
  tournament: string;
  date: string;
  winnings: string;
  picks: string[];
}

export default function WinsCard({ tournament, date, winnings, picks }: WinsCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-green-400 font-semibold text-lg mb-2">{tournament}</h3>
      <div className="text-white text-2xl font-bold mb-2">{winnings}</div>
      <div className="text-gray-400 text-sm mb-4">{date}</div>
      <div className="space-y-1">
        {picks.map((pick, index) => (
          <div 
            key={index}
            className="bg-gray-700 text-gray-300 text-sm py-1 px-2 rounded"
          >
            {pick}
          </div>
        ))}
      </div>
    </div>
  );
}