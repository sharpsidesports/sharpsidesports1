import React, { useState } from 'react';

const VIP_PASSWORDS = ['cfbweek1', 'brodie25', 'ssports25', 'chris25', 'josh25']; // Array of valid VIP passwords

const teams = [
  {
    teamName: "Cowboys",
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
      ["CeeDee Lamb", "13", "10.19", "30.89%", "63.60%", "21", "68.42%", "34.00%", "66.00%", "6.97"],
      ["George Picken", "4", "7.96", "24.15%", "63.60%", "21", "63.60%", "34.00%", "66.00%", "5.06"],
      ["Jake Ferguson", "6", "7.29", "22.10%", "24.20%", "8", "73.15%", "34.00%", "66.00%", "5.33"],
    ],
  },
  {
    teamName: "Giants",
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
      ["Malik Nabers", "12", "9.14", "30.47%", "65.60%", "21", "69.80%", "5.00%", "95.00%", "6.37"],
      ["Wan'Dale Robinson", "8", "7.43", "24.77%", "65.60%", "21", "71.32%", "5.00%", "95.00%", "5.29"],
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
      "2025 Post. Targets",
      "Proj. Catch %",
      "Opp Man %",
      "Opp Zone %",
      "Proj. Rec",
    ],
    players: [
      ["Puka Nakua", "11", "9.63", "30.12%", "75.00%", "21", "71.58%", "11.00%", "89.00%", "6.89"],
      ["Davante Adams", "9", "8.31", "25.55%", "75.00%", "21", "64.83%", "11.00%", "89.00%", "5.38"],
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
      ["Calvin Ridley", "8", "8.8", "27.94%", "65.00%", "19", "62.11%", "35.00%", "65.00%", "5.46"],
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
      ["Ja'mar Chase", "5", "11.29", "30.12%", "39.10%", "9", "63.77%", "14.00%", "76.00%", "7.19"],
      ["Tee Higgins", "4", "8.91", "23.95%", "39.10%", "9", "64.01%", "14.00%", "76.00%", "5.7"],
      ["Chase Brown", "3", "4.22", "11.27%", "21.70%", "5", "88.95%", "14.00%", "76.00%", "3.75"],
    ],
  },
  {
    teamName: "Jaguars",
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
      ["Brian Thomas Jr", "7", "9.94", "28.41%", "65.50%", "19", "62.83%", "0.37%", "63.00%", "9.94"],
      ["Travis Hunter", "8", "8.69", "24.83%", "65.50%", "19", "67.20%", "37.00%", "63.00%", "5.83"],
    ],
  },
  {
    teamName: "Seahawks",
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
      ["Jaxon Smith-Njigba", "13", "9.23", "31.86%", "72.70%", "16", "70.85%", "28.00%", "72.00%", "6.53"],
      ["Cooper Kupp", "3", "6.53", "22.55%", "72.70%", "16", "66.77%", "28.00%", "72.00%", "4.36"],
    ],
  },
  {
    teamName: "Steelers",
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
      ["DK Metcalf", "7", "8.69", "27.16%", "48.30%", "14", "62.14%", "16.00%", "74.00%", "5.39"],
      ["Jonnu Smith", "6", "7.68", "24.03%", "31.00%", "9", "69.50%", "16.00%", "74.00%", "5.33"],
      ["Jaylen Warren", "2", "2.79", "8.74%", "20.70%", "6", "76.85%", "16.00%", "74.00%", "2.14"],
    ],
  },
  {
    teamName: "Lions",
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
      ["Amon-Ra St. Brown", "6", "9.21", "27.10%", "36.8%", "14", "70.84%", "51.00%", "49.00%", "6.52"],
      ["Jahmyr Gibbs", "10", "5.62", "16.55%", "39.50%", "15", "81.78%", "51.00%", "49.00%", "4.59"],
      ["Jameson Williams", "5", "7.17", "21.09%", "39.50%", "15", "59.61%", "51.00%", "49.00%", "4.27"],
    ],
  },
  {
    teamName: "Bears",
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
      ["DJ Moore", "5", "7.96", "23.77%", "64.70%", "22", "61.05%", "53.00%", "47.00%", "4.85"],
      ["Rome Odunze", "9", "9.03", "28.69%", "64.70%", "22", "67.81%", "53.00%", "47.00%", "6.12"],
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
      ["Jerry Jeudy", "8", "9.62", "24.36%", "42.90%", "18", "58.67%", "41.00%", "59.00%", "5.64"],
      ["David Njoku", "6", "8.75", "22.16%", "39.10%", "15", "61.00%", "41.00%", "59.00%", "5.33"],
      ["Harold Fannin Jr", "9", "9.36", "23.71%", "39.10%", "15", "62.23%", "41.00%", "59.00%", "5.84"],
    ],
  },
  {
    teamName: "Ravens",
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
      ["Zay Flowers", "9", "8.63", "31.05%", "78.90%", "15", "68.11%", "29.00%", "71.00%", "5.87"],
      ["Rashod Bateman", "4", "4.99", "17.53%", "78.90%", "15", "57.97%", "29.00%", "71.00%", "2.89"],
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
