import React, { useState } from 'react';

const VIP_PASSWORD = 'vip2024'; // Change this to your desired password

const teams = [
  {
    teamName: 'Seahawks',
    headers: [
      'Player',
      'AVG. TGTS/GM',
      'Proj. Targets',
      'Proj. Team Target Share',
      '2024 Target Share/Post.',
      '2024 Post. Targets',
      'Proj. Catch %',
      'Opp Man %',
      'Opp Zone %',
      'Proj. Rec',
    ],
    players: [
      ['DK Metcalf', '8.8', '8.35', '24.57%', '64.80%', '234', '61.25%', '23%', '77%', '5.11'],
      ['Jaxon Smith-Njigba', '8.6', '8.54', '25.12%', '64.80%', '234', '69.47%', '23%', '77%', '5.93'],
      ['Trey McBride', '7.3', '7.73', '24.95%', '30.30%', '82', '71.10%', '32%', '68%', '5.49'],
      ['Marvin Harrison Jr', '6', '5.33', '17.20%', '51.70%', '140', '64.89%', '32%', '68%', '3.45'],
    ],
  },
  {
    teamName: 'Texans',
    headers: [
      'Player',
      'AVG. TGTS/GM',
      'Proj. Targets',
      'Proj. Team Target Share',
      '2024 Target Share/Post.',
      '2024 Post. Targets',
      'Proj. Catch %',
      'Opp Man %',
      'Opp Zone %',
      'Proj. Rec',
    ],
    players: [
      ['Nico Collins', '8.7', '8.54', '27.55%', '62.90%', '227', '70.63%', '23%', '77%', '6.03'],
      ['Tank Dell', '6.3', '6.51', '21.02%', '62.90%', '227', '68.14%', '23%', '77%', '4.43'],
      ['Joe Mixon', '3.5', '3.17', '10.23%', '16.90%', '61', '87.25%', '23%', '77%', '2.76'],
      ['Dalton Schultz', '5', '4.26', '13.77%', '20.20%', '73', '72.49%', '23%', '77%', '3.08'],
      ['Calvin Ridley', '7.4', '7.04', '23.49%', '56.30%', '180', '61.04%', '26%', '74%', '4.29'],
    ],
  },
  {
    teamName: 'Packers',
    headers: [
      'Player',
      'AVG. TGTS/GM',
      'Proj. Targets',
      'Proj. Team Target Share',
      '2024 Target Share/Post.',
      '2024 Post. Targets',
      'Proj. Catch %',
      'Opp Man %',
      'Opp Zone %',
      'Proj. Rec',
    ],
    players: [
      ['Jayden Reed', '4.9', '5.82', '18.21%', '64.90%', '187', '70.12%', '28%', '72%', '4.08'],
      ['Christian Watson', '3.4', '4.76', '14.89%', '64.9', '187', '71.75%', '28%', '72%', '3.76'],
    ],
  },
  {
    teamName: 'Eagles',
    headers: [
      'Player',
      'AVG. TGTS/GM',
      'Proj. Targets',
      'Proj. Team Target Share',
      '2024 Target Share per Post.',
      '2024 Post. Targets',
      'Proj. Catch %',
      'Opp Man %',
      'Opp Zone %',
      'Proj. Rec',
    ],
    players: [
      ['AJ Brown', '7', '7.13', '27.45%', '59.90%', '148', '69.75%', '26%', '74%', '4.97'],
      ['Dallas Goedart', '5.3', '4.76', '18.33%', '23.90%', '59', '72.88%', '26%', '74%', '3.46'],
      ['Puka Nacua', '8', '8.56', '25.18%', '73.90%', '252', '70.12%', '25%', '75%', '6.01'],
      ['Cooper Kupp', '11', '9.2', '27.07%', '73.90%', '252', '70.32%', '25%', '75%', '6.47'],
    ],
  },
];

export default function WRRedzoneStats() {
  const [showVIP, setShowVIP] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  // Find the index of the 'Proj. Rec' column (may differ for Eagles)
  const getProjRecIndex = (headers: string[]): number => {
    return headers.findIndex((h: string) => h.toLowerCase().includes('proj. rec'));
  };

  const handleVIPClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPrompt(true);
    setPwInput('');
    setPwError('');
  };

  const handleVIPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwInput === VIP_PASSWORD) {
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
                          if (j === projRecIdx && !showVIP) {
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