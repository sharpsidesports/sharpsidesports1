# dev/fetch_player_profile.py
import requests
import logging
import json
import os

# Configure logging
logging.basicConfig(level=logging.INFO)

url = "https://orchestrator.pgatour.com/graphql"
headers = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Microsoft Edge\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "x-amz-user-agent": "aws-amplify/3.0.7",
    "x-api-key": "da2-gsrx5bibzbb4njvhl7t37wqyl4",
    "x-pgat-platform": "web"
}

# Query strings
player_profile_stats_years_query = """
query PlayerProfileStatsYears($playerId: ID!) {
  playerProfileStatsYears(playerId: $playerId) {
    year
    season
    tours
  }
}
"""

profile_stats_full_v2_query = """
query ProfileStatsFullV2($playerId: ID!, $year: Int) {
  playerProfileStatsFullV2(playerId: $playerId, year: $year) {
    messages {
      message
    }
    playerProfileStatsFull {
      tour
      season
      displaySeason
      categories {
        category
        displayTitle
      }
      topStats {
        rank
        value
        statId
        title
        category
        aboveOrBelow
        fieldAverage
      }
      overview {
        rank
        value
        title
        statId
        category
        aboveOrBelow
        rankDeviation
        fieldAverage
      }
      stats {
        statId
        rank
        value
        title
        category
        aboveOrBelow
        fieldAverage
        supportingStat {
          description
          value
        }
        supportingValue {
          description
          value
        }
      }
    }
  }
}
"""

# Function to fetch available years for a player
def fetch_available_years(player_id):
    body = {
        "operationName": "PlayerProfileStatsYears",
        "variables": {"playerId": player_id},
        "query": player_profile_stats_years_query
    }

    try:
        response = requests.post(url, headers=headers, json=body)
        response.raise_for_status()
        data = response.json()
        years = [entry['year'] for entry in data.get('data', {}).get('playerProfileStatsYears', [])]
        return years
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching available years: {e}")
        return []

# Function to fetch player profile stats for a specific year
def fetch_player_profile_stats_full(player_id, year, all_stats):
    body = {
        "operationName": "ProfileStatsFullV2",
        "variables": {"playerId": player_id, "year": year},
        "query": profile_stats_full_v2_query
    }

    try:
        response = requests.post(url, headers=headers, json=body)
        response.raise_for_status()
        data = response.json()
        
        # Extract stats and add the year to each record
        player_profile_stats_full = data.get('data', {}).get('playerProfileStatsFullV2', {}).get('playerProfileStatsFull', [])
        for profile in player_profile_stats_full:
            for stat in profile.get('stats', []):
                stat['year'] = year
                all_stats.append(stat)
        
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching player profile stats for {year}: {e}")

# Read player data from JSON file
def read_players_data(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

# Main function to fetch and save stats for all players
def main():
    players_data = read_players_data('dev/pga/data/pga_players.json')
    data_dir = 'dev/pga/data/player_stats'
    os.makedirs(data_dir, exist_ok=True)

    for player in players_data:
        player_id = player['id']
        player_name = f"{player['firstName']}_{player['lastName']}"
        available_years = fetch_available_years(player_id)

        all_stats = []
        for year in available_years:
            fetch_player_profile_stats_full(player_id, year, all_stats)

        # Save all stats to a JSON file named with the player's name and ID
        with open(f'{data_dir}/player_stats_{player_name}_{player_id}.json', 'w') as f:
            json.dump(all_stats, f, indent=4)

        logging.info(f"Player Profile Stats for {player_name} (ID: {player_id}) saved to player_stats_{player_name}_{player_id}.json")

if __name__ == "__main__":
    main()