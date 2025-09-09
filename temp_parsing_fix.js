        const teamsParsed: TeamTable[] = [];
        let currentTeam: TeamTable | null = null;
        let expectingHeaders = false;

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          
          // Check if this row contains a team header (starts with #)
          const hashIdx = row.findIndex(cell => cell && cell.includes('#'));
          if (hashIdx !== -1) {
            // Save previous team if it exists
            if (currentTeam && currentTeam.players.length > 0) teamsParsed.push(currentTeam);
            
            // Start new team
            currentTeam = { teamAndStats: row, players: [] };
            expectingHeaders = true; // Next row should be column headers
            continue;
          }
          
          // Skip empty rows
          if (!row.some(cell => cell && cell.trim())) continue;
          
          if (!currentTeam) continue;
          
          // If we're expecting headers, this row contains the column headers
          if (expectingHeaders) {
            currentTeam.teamAndStats = row; // Replace team name with column headers
            expectingHeaders = false;
            continue;
          }
          
          // This is a player row
          let playerRow = [...row];
          while (playerRow.length < currentTeam.teamAndStats.length) playerRow.push('');
          if (playerRow.length > currentTeam.teamAndStats.length) playerRow = playerRow.slice(0, currentTeam.teamAndStats.length);
          currentTeam.players.push(playerRow);
        }
        if (currentTeam && currentTeam.players.length > 0) teamsParsed.push(currentTeam);
        setTeams(teamsParsed);
