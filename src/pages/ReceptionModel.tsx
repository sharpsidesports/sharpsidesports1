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
      "2025 Target Share/Post.",
      "2025 Post. Targets",
      "Proj. Catch %",
      "Opp Man %",
      "Opp Zone %",
      "Proj. Rec",
    ],
    players: [
      ["De'Von Achane", "7.09", "7.09", "19.72%", "31.70%", "20", "78.05%", "19.00%", "81.00%", "5.53"],
      ["Tyreek Hill", "9.71", "9.71", "26.95%", "61.90%", "39", "61.17%", "19.00%", "81.00%", "5.93"],
      ["Jaylen Waddle", "7.23", "7.23", "20.10%", "61.90%", "39", "60.48%", "19.00%", "81.00%", "4.37"],
    ],
  },
  {
    teamName: "Bills",
    headers: [
      "Player",
      "AVG. TGTS/GM",
      "Proj. Targets",
      "Proj. Team Target Share",
      "2025 Target Share/Post.",
      "2025 Post. Targets",
      "Proj. Catch %",
      "Opp Man %",
      "Opp Zone %",
      "Proj. Rec",
    ],
    players: [
      ["Keon Coleman", "7.53", "7.53", "25.13%", "58.60%", "58.60%", "58.16%", "29.00%", "71.00%", "4.37"],
      ["Khalil Shakir", "7.46", "7.46", "24.89%", "58.60%", "58.60%", "70.55%", "29.00%", "71.00%", "5.26"],
      ["Josh Palmer", "5.26", "5.26", "17.52%", "58.60%", "58.60%", "58.33%", "29.00%", "71.00%", "3.06"],
    ],
  },
];
export default function ReceptionModel() {
  const [showVIP, setShowVIP] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  // Find the index of the 'Proj. Rec' column (may differ for Eagles)
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
