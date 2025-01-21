import json

def get_player_info():
    # Read the JSON file
    with open('dev/pga/data/pga_players.json', 'r') as file:
        players = json.load(file)
    
    # Extract required information
    player_info = [
        {
            "name": player["lastName"] + ", " + player["firstName"],
            "dg_id": player["id"]
        }
        for player in players
        if player["isActive"]
    ]
    
    return player_info

if __name__ == "__main__":
    players = get_player_info()
    print(json.dumps(players, indent=2))