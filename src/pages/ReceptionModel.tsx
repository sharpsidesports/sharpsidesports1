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
      ["De'Von Achane", "7", "7.09", "19.72%", "31.70%", "20", "78.05%", "19.00%", "81.00%", "5.53"],
      ["Tyreek Hill", "6.5", "9.71", "26.95%", "61.90%", "39", "61.17%", "19.00%", "81.00%", "5.93"],
      ["Jaylen Waddle", "5.5", "7.23", "20.10%", "61.90%", "39", "60.48%", "19.00%", "81.00%", "4.37"],
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
      ["Keon Coleman", "7", "7.53", "25.13%", "58.60%", "58.60%", "58.16%", "29.00%", "71.00%", "4.37"],
      ["Khalil Shakir", "5.5", "7.46", "24.89%", "58.60%", "58.60%", "70.55%", "29.00%", "71.00%", "5.26"],
      ["Josh Palmer", "6", "5.26", "17.52%", "58.60%", "58.60%", "58.33%", "29.00%", "71.00%", "3.06"],
    ],
  },
  {
    teamName: "Falcons",
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
      ["Drake London", "9.5", "8.93", "29.77%", "58.20%", "37", "62.35%", "6.00%", "94.00%", "5.56"],
      ["Kyle Pitts", "6.5", "5.95", "19.84%", "20.60%", "13", "55.32%", "6.00%", "94.00%", "3.29"],
      ["Bijan Robinson", "6", "4.59", "4.59%", "20.60%", "13", "80.07%", "6.00%", "94.00%", "3.67"],
    ],
  },
  {
    teamName: "Panthers",
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
      ["Tetairoa McMillian", "9.5", "8.21", "24.17%", "62.10%", "54", "68.80%", "25.00%", "75.00%", "5.64"],
      ["Xavier Legette", "7.5", "6.27", "18.45%", "62.10%", "54", "57.13%", "25.00%", "75.00%", "3.58"],
    ],
  },
  {
    teamName: "Rams",
    headers: [
      "Player",
      "AVG. TGTS/GM",
      "Proj. Targets",
      "Proj. Team Target Share",
      "2025 Target Share/Post.",
      "2024 Post. Targets",
      "Proj. Catch %",
      "Opp Man %",
      "Opp Zone %",
      "Proj. Rec",
    ],
    players: [
      ["Puka Nucua", "10", "11.14", "32.78%", "76.70%", "46", "65.20%", "21.00%", "79.00%", "7.26"],
      ["DeVante Adams", "10.5", "8.82", "25.96%", "76.70%", "46", "67.52%", "21.00%", "79.00%", "5.95"],
      ["Tyler Higbee", "4", "4.64", "13.65%", "15.00%", "9", "62.10%", "21.00%", "79.00%", "2.88"],
    ],
  },
  {
    teamName: "Eagles",
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
      ["AJ Brown", "4.5", "7.49", "27.77%", "56.10%", "23", "61.99%", "27.00%", "73.00%", "4.64"],
      ["DeVonta Smith", "4.5", "7.02", "25.10%", "56.10%", "23", "62.19%", "27.00%", "73.00%", "4.36"],
      ["Dallas Goedert", "7", "5.24", "19.42%", "26.80%", "11", "64.83%", "27.00%", "73.00%", "3.39"],
    ],
  },
  {
    teamName: "Colts",
    headers: [
      "Player",
      "AVG. TGTS/GM",
      "Proj. Targets",
      "Proj. Team Target Share",
      "2024 Target Share/Post.",
      "2024 Post. Targets",
      "Proj. Catch %",
      "Opp Man %",
      "Opp Zone %",
      "Proj. Rec",
    ],
    players: [
      ["Michael Pittman", "6.5", "6.63", "22.13%", "61.30%", "38", "65.87%", "26.00%", "74.00%", "4.36"],
      ["Josh Downs", "5.5", "6.31", "21.05%", "61.30%", "38", "62.89%", "26.00%", "74.00%", "3.96"],
      ["Tyler Warren", "8", "7.71", "25.70%", "18.00%", "18", "72.55%", "26.00%", "74.00%", "5.59"],
      ["Jonathan Taylor", "2.5", "3.09", "10.30%", "9.70%", "6", "82.77%", "26.00%", "74.00%", "2.55"],
    ],
  },
  {
    teamName: "Titans",
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
      ["Calvin Ridley", "7", "8.36", "26.13%", "71.40%", "40", "64.72%", "27.00%", "73.00%", "5.41"],
      ["Elic Ayomanor", "6.5", "6.96", "21.75%", "71.40%", "40", "63.45%", "27.00%", "73.00%", "4.41"],
    ],
  },
  {
    teamName: "Bengals",
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
      ["Ja'Marr Chase", "10.5", "9.93", "30.12%", "59.10%", "39", "69.98%", "16.00%", "84.00%", "6.94"],
      ["Tee Higgins", "6", "7.95", "24.11%", "59.10%", "39", "63.90%", "16.00%", "84.00%", "5.08"],
      ["Chase Brown", "3.5", "4.09", "12.03%", "12.10%", "12.1", "85.77%", "16.00%", "84.00%", "3.5"],
    ],
  },
  {
    teamName: "Browns",
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
      ["Jerry Juedy", "8", "8.65", "22.78%", "59.10%", "37", "62.01%", "31.00%", "69.00%", "5.36"],
      ["Harold Fannin Jr", "7", "7.67", "20.19%", "30.10%", "25", "70.02%", "31.00%", "69.00%", "5.37"],
      ["David Njouku", "5.5", "6.6", "17.39%", "30.10%", "25", "59.32%", "31.00%", "69.00%", "3.91"],
    ],
  },
  {
    teamName: "49ers",
    headers: [
      "Player",
      "AVG. TGTS/GM",
      "Proj. Targets",
      "Proj. Team Target Share",
      "2025 Target Share/Post.",
      "2024 Post. Targets",
      "Proj. Catch %",
      "Opp Man %",
      "Opp Zone %",
      "Proj. Rec",
    ],
    players: [
      ["Juan Jennings", "7.5", "8.29", "25.13%", "44.40%", "32", "58.32%", "17.00%", "83.00%", "4.83"],
      ["Ricky Pearsall", "6.5", "7.77", "23.55%", "44.40%", "32", "59.68%", "17.00%", "83.00%", "4.63"],
      ["Christian Mcaffrey", "8.5", "7.49", "22.70%", "31.90%", "23", "77.02%", "17.00%", "83.00%", "5.76"],
    ],
  },
  {
    teamName: "Cardinals",
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
      ["Marvin Harrison Jr", "4.5", "5.95", "19.20%", "58.70%", "37", "62.64%", "22.00%", "78.00%", "3.72"],
      ["Trey McBride", "4.5", "6.52", "21.05%", "20.60%", "22", "71.00%", "22.00%", "78.00%", "4.62"],
    ],
  },
];export default function ReceptionModel() {
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
