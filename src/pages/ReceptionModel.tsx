import React, { useState } from 'react';

const VIP_PASSWORDS = ['cfbweek1', 'brodie25', 'ssports25', 'chris25', 'josh25']; // Array of valid VIP passwords

const teams = [
  {
    teamName: 'Bengals',
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
      ['Ja\'Marr Chase', '-', '11.81', '31.50%', '59.20%', '371', '67.83%', '32%', '68%', '8.01'],
      ['Tee Higgins', '-', '9.49', '25.33%', '59.20%', '371', '62.77%', '32%', '68%', '5.95'],
      ['Mike Gesicki', '-', '4.68', '12.49%', '24.70%', '155', '69.45%', '32%', '68%', '3.25'],
    ],
  },
  {
    teamName: 'Browns',
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
      ['Jerry Jeudy', '-', '10.04', '27.89%', '60.10%', '381', '64.29%', '28%', '72%', '6.45'],
      ['David Njoku', '-', '7.93', '21.74%', '26.20%', '166.00', '', '28%', '72%', ''],
    ],
  },
  {
    teamName: 'Falcons',
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
      ['Drake London', '-', '9.04', '27.41%', '47.80%', '250', '66.45%', '39%', '61%', '6.01'],
      ['Bijan Robinson', '-', '4.71', '14.27%', '15.2%', '85', '83.39%', '39%', '61%', '3.97'],
    ],
  },
  {
    teamName: 'Buccaneers',
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
      ['Mike Evans', '-', '9.48', '27.10%', '59.50%', '335', '63.91%', '28%', '72%', '6.05'],
      ['Emeka Egbuka', '-', '9.41', '26.89%', '59.50%', '335', '65.20%', '28%', '72%', '6.13'],
      ['Cade Otton', '-', '5.71', '16.32%', '19.00%', '107.00', '75.63%', '28%', '72%', '4.31'],
    ],
  },
  {
    teamName: 'Dolphins',
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
      ['Tyreek Hill', '-', '10.46', '30.77%', '50.40%', '286.00', '64.70%', '31%', '69%', '6.76'],
      ['Jaylen Waddle', '-', '8.89', '26.15%', '50.40%', '286', '62.15%', '31%', '69%', '5.52'],
      ['Devon Achane', '-', '5.14', '15.13%', '23.10%', '131', '82.88%', '31%', '69%', '4.26'],
    ],
  },
  {
    teamName: 'Colts',
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
      ['Josh Downs', '-', '6.95', '23.18%', '70.10%', '351', '62.41%', '22%', '78%', '4.33'],
      ['Michael Pittman Jr', '', '7.75', '25.85%', '70.10%', '351', '70.13%', '22%', '78%', '5.43'],
    ],
  },
  {
    teamName: 'Seahawks',
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
      ['Jaxon Smith-Njigba', '', '10.05', '32.44%', '60.60%', '345', '70.25%', '29%', '71%', '7.06'],
      ['Cooper Kupp', '', '6.39', '20.63%', '60.60%', '345', '68.09%', '29%', '71%', '4.35'],
    ],
  },
  {
    teamName: '49ers',
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
      ['Ricky Pearsall', '', '8.18', '26.40%', '60.80%', '312', '65.80%', '33%', '67%', '5.38'],
      ['Jauan Jennings', '', '8.44', '27.25%', '60.80%', '312', '68.23%', '33%', '67%', '5.75'],
      ['Christian McCaffrey', '', '5.79', '18.69%', '21.40%', '110', '83.96%', '33%', '67%', '4.86'],
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