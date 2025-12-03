import React, { useState } from 'react';

const VIP_PASSWORDS = ['cfbweek1', 'brodie25', 'ssports25', 'chris25', 'josh25']; // Array of valid VIP passwords

const teams = [
  {
    teamName: "Dolphins",
    headers: [
      "Player",
      "AVG. TGTS/GM",
      "Proj. Targets",
      "Proj. Team Target Share",
      "Proj. Catch %",
      "Opp Man %",
      "Opp Zone %",
      "Proj. Rec",
    ],
    players: [
      ["De'Von Achane", "6.3", "6.73", "21.05%", "80.17%", "39%", "61%", "5.39"],
      ["Jaylen Waddle", "6.3", "7.28", "22.77%", "68.10%", "39%", "61%", "4.95"],
      ["Malik Washington", "4.8", "5.59", "17.49%", "71.24%", "39%", "61%", "3.98"],
    ],
  },
  {
    teamName: "Ravens",
    headers: [
      "Player",
      "AVG. TGTS/GM",
      "Proj. Targets",
      "Proj. Team Target Share",
      "Proj. Catch %",
      "Opp Man %",
      "Opp Zone %",
      "Proj. Rec",
    ],
    players: [
      ["Zay Flowers", "7.9", "7.96", "28.45%", "73.98%", "27%", "73%", "5.88"],
      ["Mark Andrews", "4.3", "4.88", "17.43%", "75.57%", "27%", "73%", "3.68"],
      ["Rashod Bateman", "3.6", "3.97", "14.20%", "63.48%", "27%", "73%", "2.52"],
    ],
  },
];

export default function ReceptionModel() {
  const [showVIP, setShowVIP] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  // Find the index of the 'Proj. Rec' column
  const getProjRecIndex = (headers: string[]): number => {
    return headers.findIndex((h: string) => h.toLowerCase().includes('proj. rec'));
  };

  // Find the index of the 'Proj. Targets' column
  const getProjTargetsIndex = (headers: string[]): number => {
    return headers.findIndex((h: string) => h.toLowerCase().includes('proj. targets'));
  };

  const handleVIPClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPrompt(true);
    setPwInput('');
    setPwError('');
  };

  const handleVIPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (VIP_PASSWORDS.includes(pwInput)) {
      setShowVIP(true);
      setShowPrompt(false);
      setPwInput('');
      setPwError('');
    } else {
      setPwError('Incorrect password');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reception Model</h1>
      <div className="space-y-8">
        {teams.map((team, idx) => {
          const projRecIdx = getProjRecIndex(team.headers);
          const projTargetsIdx = getProjTargetsIndex(team.headers);
          const midRow = Math.floor(team.players.length / 2);
          return (
            <div key={idx} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b bg-sharpside-green/10">
                <h2 className="text-xl font-semibold text-sharpside-green">{team.teamName}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {team.headers.map((col, i) => (
                        <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {team.players.map((row, idx2) => (
                      <tr key={idx2} className={idx2 % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {row.map((cell, j) => {
                          if ((j === projRecIdx || j === projTargetsIdx) && !showVIP) {
                            // Show blurred numbers with button overlay
                            return (
                              <td
                                key={j}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 relative"
                                style={{ position: 'relative' }}
                              >
                                {/* Show the actual number but blurred */}
                                <span className="blur-sm">{cell}</span>
                                {/* Blur overlay */}
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-0"></div>
                                {/* Button overlay - only show on middle row */}
                                {idx2 === midRow && (
                                  <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <button
                                      className="px-3 py-2 text-xs bg-green-600 text-white rounded hover:bg-green-700 shadow"
                                      onClick={handleVIPClick}
                                      type="button"
                                    >
                                      <div className="text-center">
                                        <div>enter vip</div>
                                        <div>password</div>
                                        <div>to view</div>
                                      </div>
                                    </button>
                                  </div>
                                )}
                              </td>
                            );
                          } else {
                            return (
                              <td
                                key={j}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                              >
                                {cell}
                              </td>
                            );
                          }
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
      {showPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form
            onSubmit={handleVIPSubmit}
            className="bg-white p-6 rounded shadow-lg flex flex-col items-center"
          >
            <label className="mb-2 font-semibold">Enter VIP Password</label>
            <input
              type="password"
              value={pwInput}
              onChange={e => setPwInput(e.target.value)}
              className="border px-3 py-2 rounded mb-2"
              autoFocus
            />
            {pwError && <div className="text-red-500 text-xs mb-2">{pwError}</div>}
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Submit
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowPrompt(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}