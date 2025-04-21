// This file is part of the Fantasy Subscription project.

interface SuccessCardProps {
  title: string;
  amount: string;
  date: string;
  tournament: string;
}

export default function SuccessCard({ title, amount, date, tournament }: SuccessCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 text-center">
      <h3 className="text-green-400 font-semibold text-lg mb-2">{title}</h3>
      <div className="text-white text-2xl font-bold mb-2">{amount}</div>
      <div className="text-gray-400 text-sm">{tournament}</div>
      <div className="text-gray-500 text-xs mt-1">{date}</div>
    </div>
  );
}