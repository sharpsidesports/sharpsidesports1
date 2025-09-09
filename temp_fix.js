        const teamsParsed: TeamTable[] = [];
        let currentTeam: TeamTable | null = null;

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          
          // Check if this row starts with "GM" (team header)
          if (row[0] && row[0].trim() === 'GM') {
            if (currentTeam && currentTeam.players.length > 0) teamsParsed.push(currentTeam);
            currentTeam = { teamAndStats: row, players: [] };
            continue;
          }
          
          // Skip empty rows
          if (!row.some(cell => cell && cell.trim())) continue;
          
          if (!currentTeam) continue;
          
          // This is a player row
          let playerRow = [...row];
          while (playerRow.length < currentTeam.teamAndStats.length) playerRow.push('');
          if (playerRow.length > currentTeam.teamAndStats.length) playerRow = playerRow.slice(0, currentTeam.teamAndStats.length);
          currentTeam.players.push(playerRow);
        }
        if (currentTeam && currentTeam.players.length > 0) teamsParsed.push(currentTeam);
        setTeams(teamsParsed);
